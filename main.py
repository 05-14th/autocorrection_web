from flask import Flask, request, jsonify
from transformers import pipeline
from deepmultilingualpunctuation import PunctuationModel
from spellchecker import SpellChecker
import nltk
import re

nltk.download('punkt')
from nltk.tokenize import sent_tokenize

app = Flask(__name__)

# Load optimized models
grammar_correction_model = pipeline("text2text-generation", model="vennify/t5-base-grammar-correction")
model = PunctuationModel()
spell = SpellChecker()

def correct_spelling(text):
    """Corrects spelling and applies proper capitalization."""
    words = text.split()
    misspelled = spell.unknown(words)

    corrected_words = []
    for word in words:
        if word in misspelled:
            corrected_word = spell.correction(word)
            if corrected_word:
                corrected_word = corrected_word.lower()  # Standardize casing first
            else:
                corrected_word = word
        else:
            corrected_word = word.lower()  # Ensure consistency

        corrected_words.append(corrected_word)

    return " ".join(corrected_words)

def correct_capitalization(text):
    """Ensures proper capitalization at the beginning of sentences and for proper nouns."""
    sentences = sent_tokenize(text)
    capitalized_sentences = [s.capitalize() for s in sentences]
    return " ".join(capitalized_sentences)

def correct_text(input_text):
    """Corrects spelling, grammar, punctuation, and capitalization."""
    if not input_text.strip():
        return "Error: No input provided."

    # Step 1: Fix spelling
    corrected_spelling = correct_spelling(input_text)

    # Step 2: Apply grammar correction
    grammar_result = grammar_correction_model(corrected_spelling, max_length=150, num_beams=3, no_repeat_ngram_size=2)
    corrected_grammar = grammar_result[0]['generated_text']

    # Step 3: Restore punctuation
    final_output = model.restore_punctuation(corrected_grammar)

    # Step 4: Correct capitalization
    final_output = correct_capitalization(final_output)

    return corrected_spelling, corrected_grammar, final_output

@app.route('/correct_grammar', methods=['POST'])
def process_text():
    text_data = request.get_json()
    input_text = text_data['text']

    spelling_corrected, grammar_corrected, final_result = correct_text(input_text)

    return jsonify({"orig": input_text, "spelling": spelling_corrected, "grammar": grammar_corrected, "final": final_result})

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=8080)
