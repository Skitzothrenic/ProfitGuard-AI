// src/App.js
import React from 'react';
import './styles.css'; // Import the CSS file for styling
import ChatBox from './components/ChatBox'; // Import the ChatBox component

// Assuming you already have components and functionality set up like SoundUploader, KeywordActionBinder, etc.

function App() {
  return (
    <div className="App">
      <h1>Pantheon Ultimate Parser</h1>

      <div className="keyword-actions">
        {/* Render other components here */}
        {/* Example: KeywordActionBinder or other UI elements */}
      </div>

      <div className="content">
        {/* Render the ChatBox */}
        <ChatBox />
      </div>
    </div>
  );
}

export default App;
