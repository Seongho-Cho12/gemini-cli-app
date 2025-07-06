
import React, { useState, useEffect } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    window.electronAPI.onReply((reply) => {
      setMessages((prevMessages) => [...prevMessages, { text: reply, sender: 'gemini' }]);
    });
  }, []);

  const handleSend = () => {
    console.log('handleSend called'); // 디버깅 로그 추가
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      window.electronAPI.sendCommand(input);
      setInput('');
    }
  };

  return (
    <div className="App">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
