// frontend/src/widget.js
import React from 'react';
import ReactDOM from 'react-dom';
import ChatWidget from './components/ChatWidget'; // Import komponenty

// Funkce pro vložení widgetu do stránky
function injectChatWidget(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (container) {
    ReactDOM.render(
      <ChatWidget {...options} />,
      container
    );
  }
}

// Exponování funkce pro použití na jiných stránkách
window.ChatBot = { injectChatWidget };
