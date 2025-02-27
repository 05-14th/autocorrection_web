from flask import Flask, request, jsonify
from transformers import pipeline
from deepmultilingualpunctuation import PunctuationModel
import torch
import textwrap
from spellchecker import SpellChecker

app = Flask(__name__)

# Detect device (Use GPU if available, else use CPU)
device = 0 if torch.cuda.is_available() else -1

# Load optimized models
grammar_correction_model = pipeline("text2text-generation", model="hassaanik/grammar-correction-model", device=device)
model = PunctuationModel()
spell = SpellChecker()


def split_into_chunks(text, chunk_size=1):
    words = text.split()
    chunks = [' '.join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]
    return chunks

def correct_text(input_text):
    if not input_text.strip():
        return "Error: No input provided."

    chunks = split_into_chunks(input_text)
    initial_spelling = spell.unknown(chunks)

    incorrect_spelling = []
    for words in initial_spelling:
        incorrect_spelling.append(words)

    corrected_spelling = []
    for sentence in initial_spelling:
        corrected_spelling.append(spell.correction(sentence))

    for misspelled in incorrect_spelling:
        chunks[chunks.index(misspelled)] = corrected_spelling[incorrect_spelling.index(misspelled)]

    spelling_phase = " ".join(chunks)
    punctuation_phase = model.restore_punctuation(spelling_phase)
    grammar_chunks = punctuation_phase.strip().split(".")
    corrected_chunks = []
    
    for chunk in grammar_chunks:
        grammar_result = grammar_correction_model(chunk, max_length=500, num_beams=3)[0]['generated_text']
        corrected_chunks.append(grammar_result)

    corrected_chunks.pop()

    return " ".join(corrected_chunks)

@app.route('/correct_grammar', methods=['POST'])
def process_text():
    try:
        text_data = request.json
        input_text = text_data.get('text', '')

        # Process correction
        final_result = correct_text(input_text)

        return jsonify({"original": input_text, "corrected": final_result})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=8080, use_reloader=True, threaded=True)
