import React, { useState } from 'react';
import useApi from '../hooks/useApi';

const sendMessageApi = async (message) => {
  const response = await fetch('http://localhost:8000/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: message }),
  });
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  return response.json();
};

const Search = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { callApi: sendMessage, loading, error } = useApi(sendMessageApi);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const newMessage = { role: 'user', content: input };
    setMessages([...messages, newMessage]);

    try {
      const data = await sendMessage(input);
      const botMessage = { role: 'bot', content: `hello ${data.response}` };
      setMessages([...messages, newMessage, botMessage]);
      setInput('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Search Files</h1>
      <div className="chat-box">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <div className="input-group mt-3">
        <input
          type="text"
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="btn btn-primary" onClick={handleSendMessage} disabled={loading}>
          Send
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
};

export default Search;