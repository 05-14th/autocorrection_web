from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
from deepmultilingualpunctuation import PunctuationModel
import torch, textwrap, re
from spellchecker import SpellChecker

app = Flask(__name__)

CORS(app)

# Detect device (Use GPU if available, else use CPU)
device = 0 if torch.cuda.is_available() else -1

# Load optimized models
grammar_correction_model = pipeline("text2text-generation", model="vennify/t5-base-grammar-correction", device=device)
grammar_correction_model_ = pipeline("text2text-generation", model="hassaanik/grammar-correction-model", device=device)
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

    corrected_spelling = []
    for word in initial_spelling:
        corrected_word = spell.correction(word)
        corrected_spelling.append(corrected_word if corrected_word else word)

    for i, misspelled in enumerate(initial_spelling):
        if misspelled in chunks:  
            chunks[chunks.index(misspelled)] = corrected_spelling[i]
    
    spelling_phase = " ".join(chunks)
    punctuation_phase = model.restore_punctuation(spelling_phase)
    grammar_chunks = textwrap.wrap(punctuation_phase, width=100, break_long_words=False)
    corrected_chunks = []
    
    for chunk in grammar_chunks:
        grammar_result = grammar_correction_model(chunk, max_length=500, num_beams=3)[0]['generated_text']
        corrected_chunks.append(grammar_result)

    #corrected_chunks.pop()

    return " ".join(corrected_chunks)

@app.route('/correct_grammar', methods=['POST'])
def process_text():
    try:
        text_data = request.json
        input_text = text_data.get('text', '')
        current_text = text_data.get('current', '')
        text_to_exclude = re.split(r'(?<=[.!?])\s+', current_text)
        result = current_text

        sentences = re.split(r'(?<=[.!?])\s+', input_text)

        for sentence in sentences:
            if correct_text(sentence) in text_to_exclude:
                sentences.pop(sentences.index(sentence))
        
        result += correct_text(sentences[0])

        return jsonify({"corrected": result})
    
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=8080, use_reloader=True, threaded=True)
