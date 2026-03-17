import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chatbot.css';

const Chatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! 👋 How can I help you today?', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text = inputMessage) => {
    if (!text.trim()) return;

    const userMessage = { type: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const requestBody = {
        message: text,
        userId: user.id || null,
        sessionId
      };
      
      const response = await fetch('http://localhost:8080/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      
      setTimeout(() => {
        const botMessage = {
          type: 'bot',
          text: data.response || 'Sorry, I could not process that.',
          suggestions: data.suggestions || [],
          action: data.action || null,
          actionLabel: data.actionLabel || null,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 500);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }
  };

  const handleAction = (action) => {
    if (action === 'SHOW_ELIGIBLE_SCHEMES') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'BENEFICIARY') {
        setIsOpen(false);
        navigate('/beneficiary/dashboard', { state: { scrollTo: 'eligible-schemes' } });
      } else {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: 'Please login as a Beneficiary to view eligible schemes.',
          timestamp: new Date()
        }]);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button 
        className={`chat-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        {isOpen ? '✕' : <img src="/logo.png" alt="BeniNect" style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '50%' }} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chat-header">
            <div className="header-info">
            <img src="/logo.png" alt="" className="chatbot-logo" onError={(e) => e.target.style.display='none'} />
              <div>
                <h3>BeniNect Assistant</h3>
                <span className="status">Online</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="close-btn">✕</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                {msg.type === 'bot' && <div className="message-avatar">🤖</div>}
                <div className="message-content">
                  <div className="message-text">{msg.text}</div>
                  {msg.action && (
                    <button
                      className="action-btn"
                      onClick={() => handleAction(msg.action)}
                    >
                      📊 {msg.actionLabel || 'View in Dashboard'}
                    </button>
                  )}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="suggestions">
                      {msg.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          className="suggestion-btn"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  <span className="message-time">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-avatar">🤖</div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
            />
            <button onClick={() => sendMessage()} disabled={!inputMessage.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
