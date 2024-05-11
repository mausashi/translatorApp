import os
import openai
from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

openai.api_key = os.getenv('OPENAI_API_KEY')

styles = [
  {'style': 'Translate the following text into a daily, commonly used phrase: "{text}"', 'explanation': 'This is a daily, commonly used phrase.'},
  {'style': 'Translate the following text into a general, neutral phrase: "{text}"', 'explanation': 'This is a general, neutral phrase.'},
  {'style': 'Translate the following text into a rare, seldom used phrase: "{text}"', 'explanation': 'This is a rare, seldom used phrase.'},
  {'style': 'Translate the following text into a very rare, almost never used phrase: "{text}"', 'explanation': 'This is a very rare, almost never used phrase.'}
]

@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.get_json()
    text = data.get('text_to_translate')
    context = data.get('context')
    source_language = data.get('source_language')
    target_language = data.get('target_language')

    system_message = f"You are a helpful assistant that translates from {source_language} to {target_language}."
    if context == "Conversational":
        system_message += " You are skilled in casual conversation."
    elif context == "Dating":
        system_message += " You are skilled in romantic and dating-related conversation."
    elif context == "Professional":
        system_message += " You are skilled in professional and business-related conversation."
    elif context == "News":
        system_message += " You are skilled in discussing current events and news."
    elif context == "Medical":
        system_message += " You are skilled in medical terminology and health-related conversation."

    translations = []
    previous_translation = None
    for style in styles:  
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": style['style'].format(text=text)}  
                ],
                temperature=0.7  
            )
            translation = response.choices[0].message['content']
            if translation != previous_translation:
                translations.append({
                    'translation': translation,
                    'explanation': style['explanation']
                })
                previous_translation = translation
        except Exception as e:
            print(f"An error occurred: {e}")
            return jsonify({"error": str(e)}), 500

    return jsonify({"translations": translations})

# The 'explain' method below demonstrates how to ask the AI to explain a translation.
# We didn't use this approach in the 'translate' method to avoid doubling the API calls,
# which would increase the cost. 

@app.route('/explain', methods=['POST'])
def explain_text():
    data = request.get_json()
    text = data.get('text_to_translate')
    context = data.get('context')
    source_language = data.get('source_language')
    target_language = data.get('target_language')

    system_message = f"You are a helpful assistant that translates from {source_language} to {target_language}."
    if context == "Conversational":
        system_message += " You are skilled in casual conversation."
    elif context == "Dating":
        system_message += " You are skilled in romantic and dating-related conversation."
    elif context == "Professional":
        system_message += " You are skilled in professional and business-related conversation."
    elif context == "News":
        system_message += " You are skilled in discussing current events and news."
    elif context == "Medical":
        system_message += " You are skilled in medical terminology and health-related conversation."

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": text}
            ],
            temperature=0.7  
        )
        translation = response.choices[0].message['content']

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": f"Can you explain what '{translation}' means in {target_language}?"}
            ],
            temperature=0.7  
        )
        explanation = response.choices[0].message['content']

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': str(e)}), 500

    return jsonify({'translation': translation, 'explanation': explanation})

if __name__ == '__main__':
    app.run(debug=True)
