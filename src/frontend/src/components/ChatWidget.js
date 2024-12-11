// frontend/src/components/ChatWidget.js
import React, { useState } from 'react';
import axios from 'axios';

const ChatWidget = ({ color = 'blue', title = 'Chatbot' }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    try {
      const response = await axios.post('http://localhost:5000/api/chat/send', {
        messages: [{ role: "user", content: input }],
      });

      // Přidání uživatelské zprávy a odpovědi
      setMessages([...messages, { role: "user", content: input }, { role: "assistant", content: response.data.message }]);
      setInput(""); // Vymazání vstupu
    } catch (error) {
      console.error("Chyba při posílání zprávy:", error);
    }
  };

  return (
    <div style={{
      maxWidth: '600px', 
      margin: '0 auto', 
      border: `2px solid ${color}`, 
      borderRadius: '10px', 
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
      backgroundColor: '#fff'
    }}>
      <div style={{
        height: '400px', 
        overflowY: 'scroll', 
        border: '1px solid #ccc', 
        marginBottom: '20px', 
        padding: '15px', 
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            textAlign: msg.role === "user" ? 'right' : 'left',
            marginBottom: '10px'
          }}>
            <p style={{
              display: 'inline-block', 
              backgroundColor: msg.role === "user" ? '#d4f7ff' : '#e9e9e9', 
              borderRadius: '15px', 
              padding: '10px', 
              maxWidth: '80%', 
              wordWrap: 'break-word',
              fontSize: '14px'
            }}>
              {msg.content}
            </p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            width: '100%', 
            padding: '10px', 
            borderRadius: '8px', 
            border: '1px solid #ccc', 
            marginRight: '10px', 
            fontSize: '14px'
          }}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '10px 15px', 
            borderRadius: '8px', 
            backgroundColor: color, 
            color: '#fff', 
            border: 'none', 
            fontSize: '14px', 
            cursor: 'pointer'
          }}
        >
          {title}
        </button>
      </div>
    </div>
  );
  
};

export default ChatWidget;
