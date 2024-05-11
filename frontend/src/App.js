import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightArrowLeft, faTimes } from '@fortawesome/free-solid-svg-icons'

function App() {
  const [text, setText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');  
  const [targetLanguage, setTargetLanguage] = useState('ja');  
  const [translations, setTranslations] = useState([]);
  const [context, setContext] = useState('Conversational');  

  const contexts = ['Conversational', 'Dating', 'Professional', 'News', 'Medical'];  
  const languages = ['en', 'ja', 'ko', 'zh', 'fr', 'vi', 'de', 'es', 'ru', 'tl'];  
  const languageNames = {
    'en': 'English',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh': 'Chinese',
    'fr': 'French',
    'vi': 'Vietnamese',
    'de': 'German',
    'es': 'Spanish',
    'ru': 'Russian',
    'tl': 'Tagalog',
  };
  const usageLevels = ['Daily', 'General', 'Rare', 'Very Rare']; 
  const usageColors = {
    'Daily': 'green',
    'General': 'yellow',
    'Rare': 'orange',
    'Very Rare': 'red',
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const clearAll = () => {
    setText('');
    setSourceLanguage('en');
    setTargetLanguage('fr');
    setTranslations([]);
  };

  const handleTranslate = async () => {
    const response = await fetch('http://localhost:5000/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text_to_translate: text, source_language: sourceLanguage, target_language: targetLanguage })
    });
    const data = await response.json();
    setTranslations(data.translations); 
  };

  const handleExplain = async () => {
    const response = await fetch('http://localhost:5000/explain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text_to_translate: text,
        context: context,
        source_language: sourceLanguage,
        target_language: targetLanguage
      })
    });
    const data = await response.json();
    setTranslations([data]);  
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  };

  return (
    <div className="bg-gray-900 text-gray-300 flex flex-col items-center justify-center min-h-screen p-10">
      <div className="w-full fixed top-0 left-0 bg-gray-800 shadow-lg flex items-center justify-between p-5">
        <div className="flex items-center space-x-2">
          <img src="/BABY PNG.png" alt="Merlin.AI" className="h-8 w-8" />
          <h1 className="text-2xl font-bold text-gray-300">Merlin.AI</h1>
        </div>
        <button onClick={clearAll} className="bg-gray-700 text-gray-300 rounded px-4 py-2">
          <FontAwesomeIcon icon={faTimes} className="mr-2" />
          Clear All
        </button>
      </div>
      <div className="flex flex-col space-y-5 bg-gray-800 p-10 rounded shadow-lg -mt-20 w-3/4">
        <div className="flex flex-row space-x-5 items-stretch">
          <select value={sourceLanguage} onChange={(e) => setSourceLanguage(e.target.value)} className="border-2 border-gray-700 bg-gray-900 text-gray-300 rounded px-4 py-3 text-lg flex-grow">
            {languages.map((language) => <option key={language} value={language}>{languageNames[language]}</option>)}
          </select>
          <button onClick={swapLanguages} className="bg-gray-700 text-gray-300 rounded px-4 py-3 text-lg flex-shrink-0">
            <FontAwesomeIcon icon={faArrowRightArrowLeft} />
          </button>
          <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)} className="border-2 border-gray-700 bg-gray-900 text-gray-300 rounded px-4 py-3 text-lg flex-grow">
            {languages.map((language) => <option key={language} value={language}>{languageNames[language]}</option>)}
          </select>
        </div>
        <select value={context} onChange={(e) => setContext(e.target.value)} className="border-2 border-gray-700 bg-gray-900 text-gray-300 rounded px-4 py-3 text-lg w-full mt-2">
          {contexts.map((context) => <option key={context} value={context}>{context}</option>)}
        </select>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to translate"
          className="border-2 border-gray-700 bg-gray-900 text-gray-300 rounded px-4 py-3 text-lg w-full mt-2"
        />
        <div className="flex space-x-2">
          <button onClick={handleTranslate} className="bg-gray-400 text-gray-900 rounded px-4 py-3 text-lg flex-1 hover:bg-gray-300">Translate</button>
          <button onClick={handleExplain} className="bg-gray-600 text-gray-300 rounded px-4 py-3 text-lg flex-3 hover:bg-gray-500">Explain</button>
        </div>
        <div className="w-full border-2 border-gray-700 rounded p-4 mt-5 bg-gray-900 text-gray-300">
          {translations.map((translation, index) => (
            <div key={index}>
              <p style={{ color: usageColors[usageLevels[index]] }}>{usageLevels[index]}</p>
              <p>{translation.translation}</p>
              <p style={{ fontSize: '0.8em', fontStyle: 'italic', color: 'gray' }}>{translation.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default App;