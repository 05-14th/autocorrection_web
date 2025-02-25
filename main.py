from transformers import pipeline
from deepmultilingualpunctuation import PunctuationModel
from flask import Flask, render_template, request, flash, redirect, jsonify, session
from bson.objectid import ObjectId
from flask_cors import CORS
import difflib

app = Flask(__name__)

# Load the necessary models
grammar_correction_model = pipeline(task="text2text-generation", model="hassaanik/grammar-correction-model")
fix_spelling = pipeline("text2text-generation", model="oliverguhr/spelling-correction-english-base")
model = PunctuationModel()

def correct_text(input_text):
    """Corrects spelling, grammar, and punctuation."""
    if not input_text.strip():
        return "Error: No input provided."

    # Fix spelling first
    spelling_result = fix_spelling(input_text, max_length=2048)
    corrected_spelling = spelling_result[0]['generated_text']

    # Fix grammar
    grammar_result = grammar_correction_model(corrected_spelling, max_length=500, num_beams=5, no_repeat_ngram_size=2)
    corrected_grammar = grammar_result[0]['generated_text']

    # Restore punctuation
    final_output = model.restore_punctuation(corrected_grammar)

    return corrected_spelling, corrected_grammar, final_output

def find_errors(original, corrected):
    """Finds differences between the original and corrected text."""
    diff = list(difflib.ndiff(original.split(), corrected.split()))
    
    incorrect_words = []
    for i, d in enumerate(diff):
        if d.startswith("- "):  # Indicates deletion
            incorrect_words.append(d[2:])  # Extract word
    
    return incorrect_words

@app.route('/correct_grammar', methods=['POST'])
def process_text():
    text_data = request.get_json()
    input_text  = text_data['text']

    # Process correction
    spelling_corrected, grammar_corrected, final_result = correct_text(input_text)

    # Find incorrect parts
    incorrect_parts = find_errors(input_text, grammar_corrected)

    return {"orig": input_text, "spelling": spelling_corrected, "grammar": grammar_corrected, "final": final_result, "incorrect": incorrect_parts}


if __name__ == '__main__':
    app.run(host="127.0.0.1",port="8080")
# Output results
#print("\nOriginal Input:  ", input_text)
#print("Fixed Spelling:  ", spelling_corrected)
#print("Fixed Grammar:   ", grammar_corrected)
#print("Final Output:    ", final_result)
#print("Incorrect Words: ", incorrect_parts)
