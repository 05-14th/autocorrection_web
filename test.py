import concurrent.futures
from transformers import pipeline
from deepmultilingualpunctuation import PunctuationModel
import textwrap

# Load models once (global variables for efficiency)
grammar_correction_model = pipeline("text2text-generation", model="hassaanik/grammar-correction-model")
fix_spelling = pipeline("text2text-generation", model="oliverguhr/spelling-correction-english-base")
model = PunctuationModel()

def split_into_chunks(text, chunk_size=150):
    """Splits text into chunks for better processing speed and efficiency."""
    return textwrap.wrap(text, width=chunk_size)

def process_chunk(chunk):
    """Processes a single chunk (spelling correction, grammar, punctuation)."""
    try:
        # Fix spelling
        spelling_result = fix_spelling(chunk, max_length=150)[0]['generated_text']

        # Fix grammar
        grammar_result = grammar_correction_model(spelling_result, max_length=200, num_beams=5, no_repeat_ngram_size=2)[0]['generated_text']

        # Restore punctuation
        return model.restore_punctuation(grammar_result)

    except Exception as e:
        print(f"Error processing chunk: {chunk}\nError: {e}")
        return chunk  # Return original chunk in case of failure

def correct_text(input_text):
    """Corrects spelling, grammar, and punctuation efficiently using multi-threading."""
    if not input_text.strip():
        return "Error: No input provided."

    chunks = split_into_chunks(input_text, chunk_size=150)  # Break into chunks

    # Use multi-threading to process chunks in parallel
    with concurrent.futures.ThreadPoolExecutor() as executor:
        corrected_chunks = list(executor.map(process_chunk, chunks))

    return " ".join(corrected_chunks)  # Join chunks back into full text

# Example usage
input_text = input("Enter text: ")
corrected_text = correct_text(input_text)

print("\nCorrected Output:\n", corrected_text)
