# Translator App

Translator App is a Flask-based web application that uses OpenAI's GPT-3 model to translate text into different styles and contexts. It also provides explanations for the translations.

## Features

- Translate text into different styles and contexts
- Get explanations for translations
- RESTful API endpoints for translation and explanation

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/mausashi/translatorApp.git

2. Navigate to the backend directory and install the required Python packages. You can find the list of required packages in the `requirements.txt` file:
    ```bash
    cd backend
    pip install -r requirements.txt
    
3. Set your OpenAI API key as an environment variable:
     ```
    setx OPENAI_API_KEY "your-api-key"
4. Run the Flask application (Backend) :
    ```bash
    flask run
5. In a new terminal window, navigate to the frontend directory and install the required Node.js packages. You can find the list of required packages in the package.json file:
     ```bash
    cd frontend
    npm install
6. Start the frontend:
   ```bash
   npm start

Remember to replace "your-api-key" with your actual OpenAI API key, and backend and frontend with the actual paths to your backend and frontend directories if they're not backend and frontend. After running these commands, your application should start and be accessible in your web browser.
