from transformers import pipeline
from transformers import pipeline
import difflib

# Load the Grammar Correction T5 Model from Hugging Face
grammar_correction_model = pipeline(task="text2text-generation", model="hassaanik/grammar-correction-model")
fix_spelling = pipeline("text2text-generation",model="oliverguhr/spelling-correction-english-base")

# Input text with grammatical errors
input_text = input("Words: ")

# Get corrected output
result = grammar_correction_model(str(fix_spelling(input_text,max_length=2048)), max_length=200, num_beams=5, no_repeat_ngram_size=2)
corrected_text = result[0]['generated_text']

# Identify incorrect parts
def find_errors(original, corrected):
    original_words = original.split()
    corrected_words = corrected.split()
    
    diff = difflib.ndiff(original_words, corrected_words)
    incorrect_parts = [word for word in original_words if f"- {word}" in diff]

    return incorrect_parts

incorrect_parts = find_errors(input_text, corrected_text)

# Print the incorrect parts and the corrected output
print("Incorrect parts:", incorrect_parts)
print("Corrected Output:", corrected_text)
