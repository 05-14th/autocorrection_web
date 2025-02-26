from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import concurrent.futures
import difflib
from transformers import pipeline
from deepmultilingualpunctuation import PunctuationModel
import textwrap
import uvicorn

app = FastAPI()

# Load models globally (efficient)
grammar_correction_model = pipeline("text2text-generation", model="hassaanik/grammar-correction-model")
fix_spelling = pipeline("text2text-generation", model="oliverguhr/spelling-correction-english-base")
model = PunctuationModel()

class TextRequest(BaseModel):
    text: str

def split_into_chunks(text, chunk_size=150):
    """Splits text into smaller chunks to prevent truncation."""
    return textwrap.wrap(text, width=chunk_size)

def process_chunk(chunk):
    """Processes a single chunk (spelling correction, grammar, punctuation)."""
    try:
        # Fix spelling
        spelling_result = fix_spelling(chunk, max_length=100)[0]['generated_text']

        # Fix grammar
        grammar_result = grammar_correction_model(spelling_result, max_length=150, num_beams=5, no_repeat_ngram_size=2)[0]['generated_text']

        # Restore punctuation
        final_output = model.restore_punctuation(grammar_result)

        return spelling_result, grammar_result, final_output

    except Exception as e:
        print(f"Error processing chunk: {chunk}\nError: {e}")
        return chunk, chunk, chunk  # Return original chunk in case of failure

def correct_text(input_text):
    """Corrects spelling, grammar, and punctuation using multi-threading."""
    if not input_text.strip():
        return "Error: No input provided."

    chunks = split_into_chunks(input_text, chunk_size=100)

    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = list(executor.map(process_chunk, chunks))

    spelling_corrected, grammar_corrected, final_output = zip(*results)

    return " ".join(spelling_corrected), " ".join(grammar_corrected), " ".join(final_output)

def find_errors(original, corrected):
    """Finds differences between original and corrected text."""
    diff = list(difflib.ndiff(original.split(), corrected.split()))
    incorrect_words = [d[2:] for d in diff if d.startswith("- ")]  # Extract incorrect words
    return incorrect_words

@app.post("/correct_grammar")
async def process_text(request: TextRequest):
    """API Endpoint to correct grammar, spelling, and punctuation."""
    try:
        input_text = request.text

        # Process text correction
        spelling_corrected, grammar_corrected, final_result = correct_text(input_text)

        # Find incorrect words
        incorrect_parts = find_errors(input_text, grammar_corrected)

        return {
            "original": input_text,
            "spelling_corrected": spelling_corrected,
            "grammar_corrected": grammar_corrected,
            "final_output": final_result,
            "incorrect_words": incorrect_parts
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8080)
