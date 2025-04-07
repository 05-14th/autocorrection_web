from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
from deepmultilingualpunctuation import PunctuationModel
import torch, asyncio, re
from symspellpy import SymSpell
import pkg_resources

# Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Device detection
device = 0 if torch.cuda.is_available() else -1

# Load models
grammar_correction_model = pipeline("text2text-generation", model="vennify/t5-base-grammar-correction", device=device)
punctuation_model = PunctuationModel()

# Load SymSpell for fast spell correction
sym_spell = SymSpell()
dictionary_path = pkg_resources.resource_filename("symspellpy", "frequency_dictionary_en_82_765.txt")
sym_spell.load_dictionary(dictionary_path, term_index=0, count_index=1)

# Function to split text into manageable chunks
def split_text(text, chunk_size=100):
    words = text.split()
    return [' '.join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]

# Async function for spelling correction
def correct_spelling(text):
    words = text.split()
    corrected_words = [sym_spell.lookup(word, verbosity=0, max_edit_distance=2) for word in words]
    return ' '.join([c[0].term if c else word for c, word in zip(corrected_words, words)])

# Function to collect punctuation differences with positions and nearby words
def collect_punctuation_changes(original, corrected):
    diffs = []
    orig_chars = list(original)
    corr_chars = list(corrected)

    min_len = min(len(orig_chars), len(corr_chars))

    for i in range(min_len):
        if orig_chars[i] != corr_chars[i] and orig_chars[i] in ".!?,;:":
            # Capture the words near the punctuation
            before_word = original[:i].strip().split()[-1] if i > 0 else ""
            after_word = original[i + 1:].strip().split()[0] if i + 1 < len(original) else ""

            diffs.append({
                "position": i,
                "original": orig_chars[i],
                "corrected": corr_chars[i],
                "before_word": before_word,
                "after_word": after_word
            })

    return diffs

# Async function for grammar correction
async def correct_text(text: str):
    if not text.strip():
        return "Error: No input provided.", []

    # Step 1: Spelling correction
    spelling_corrected = correct_spelling(text)

    # Step 2: Punctuation restoration
    punctuation_corrected = punctuation_model.restore_punctuation(spelling_corrected)

    # Collect punctuation changes
    punctuation_changes = collect_punctuation_changes(text, punctuation_corrected)

    # Step 3: Grammar correction
    chunks = split_text(punctuation_corrected, chunk_size=150)
    tasks = [asyncio.to_thread(grammar_correction_model, chunk, max_length=500, num_beams=1) for chunk in chunks]
    corrected_chunks = await asyncio.gather(*tasks)

    final_text = " ".join(res[0]['generated_text'] for res in corrected_chunks if res)

    return final_text, punctuation_changes

# Request model
class TextRequest(BaseModel):
    text: str
    current: str

@app.post('/correct_grammar')
async def process_text(text_data: TextRequest):
    try:
        input_text = text_data.text
        current_text = text_data.current
        text_to_exclude = set(re.split(r'(?<=[.!?])\s+', current_text))

        sentences = re.split(r'(?<=[.!?])\s+', input_text)
        corrected_results = await asyncio.gather(*(correct_text(sentence) for sentence in sentences))

        corrected_sentences = [res[0] for res in corrected_results]
        punctuation_changes = [res[1] for res in corrected_results]
        final_changes = [pc for pc in punctuation_changes if pc]

        result = current_text + " " + " ".join(filter(lambda s: s and s not in text_to_exclude, corrected_sentences))

        return {
            "corrected": result,
            "punctuation_changes": final_changes
        }

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080, reload=True)
