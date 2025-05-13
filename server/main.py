from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
from deepmultilingualpunctuation import PunctuationModel
import torch, asyncio, re
from symspellpy import SymSpell
import pkg_resources
from typing import List, Dict
import nltk
nltk.download('punkt')
from nltk.tokenize import sent_tokenize
import difflib

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
dictionary_path = pkg_resources.resource_filename("symspellpy", "unigram_freq.csv")
sym_spell.load_dictionary(dictionary_path, term_index=0, count_index=1)

def restore_punctuation(text: str):
    sentences = sent_tokenize(text)
    return " ".join([punctuation_model.restore_punctuation(s) for s in sentences])

# Function to split text into manageable chunks
def split_text(text, chunk_size=100):
    words = text.split()
    return [' '.join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]

# Async function for spelling correction
def correct_spelling(text):
    words = text.split()
    corrected_words = [sym_spell.lookup(word, verbosity=0, max_edit_distance=2) for word in words]
    return ' '.join([c[0].term if c else word for c, word in zip(corrected_words, words)])

def find_punctuation_differences(original: str, corrected: str, offset: int = 0) -> List[Dict]:
    diffs = []
    punctuation = set(".,!?;:'\"-()[]{}…")

    matcher = difflib.SequenceMatcher(None, original, corrected)
    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag in ("replace", "insert", "delete"):
            orig_segment = original[i1:i2]
            corr_segment = corrected[j1:j2]

            for k, (o, c) in enumerate(zip(orig_segment.ljust(len(corr_segment)), corr_segment.ljust(len(orig_segment)))):
                if (o in punctuation or c in punctuation) and o != c:
                    diffs.append({
                        "position": i1 + k + offset,
                        "original": o if o in punctuation else "",
                        "corrected": c if c in punctuation else "",
                        "context": f"...{original[max(0,i1-10):min(len(original),i2+10)]} → {corrected[max(0,j1-10):min(len(corrected),j2+10)]}..."
                    })
    return diffs

def normalize_punctuation(text: str) -> str:
    # Remove duplicate punctuation
    text = re.sub(r'([.,!?;:])\1+', r'\1', text)
    # Fix spacing
    text = re.sub(r'\s+([.,!?;:])', r'\1', text)
    text = re.sub(r'([.,!?;:])(?=\w)', r'\1 ', text)
    return text.strip()

# Async function for grammar correction
async def correct_text(text: str):
    if not text.strip():
        return "Error: No input provided.", []

    # Step 1: Spelling correction
    spelling_corrected = correct_spelling(text)

    # Step 2: Punctuation restoration
    punctuation_corrected = restore_punctuation(spelling_corrected)

    # Step 3: Grammar correction
    chunks = split_text(punctuation_corrected, chunk_size=150)
    tasks = [asyncio.to_thread(grammar_correction_model, chunk, max_length=500, num_beams=1) for chunk in chunks]
    corrected_chunks = await asyncio.gather(*tasks)
    final_text = normalize_punctuation(" ".join(res[0]['generated_text'] for res in corrected_chunks if res))

    # Get punctuation changes by comparing original to final text
    punctuation_changes = find_punctuation_differences(text, final_text)
    
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
        
        # Track cumulative position offset
        cumulative_offset = len(current_text) + 1 if current_text else 0
        all_punctuation_changes = []
        corrected_sentences = []
        
        for sentence in sentences:
            corrected, changes = await correct_text(sentence)
            if corrected and corrected not in text_to_exclude:
                # Update punctuation positions with the current offset
                for change in changes:
                    change["position"] += cumulative_offset
                all_punctuation_changes.extend(changes)
                
                corrected_sentences.append(corrected)
                # Update the offset for next sentence
                cumulative_offset += len(corrected) + 1

        result = current_text + " " + " ".join(corrected_sentences) if current_text else " ".join(corrected_sentences)

        # Remove duplicate changes at the same position
        unique_changes = []
        seen_positions = set()
        for change in sorted(all_punctuation_changes, key=lambda x: x["position"]):
            if change["position"] not in seen_positions:
                unique_changes.append(change)
                seen_positions.add(change["position"])

        return {
            "corrected": result,
            "punctuation_changes": unique_changes
        }

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080, reload=True)