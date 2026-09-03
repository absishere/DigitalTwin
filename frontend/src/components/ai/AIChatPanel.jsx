import { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import useUIStore from '../../state/uiStore';
import { sendMessage, getSuggestedQuestions } from '../../services/aiService';
import styles from './AIChatPanel.module.css';

export default function AIChatPanel() {
  const { isAIChatOpen, closeAIChat } = useUIStore();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm MarineVerse AI. How can I help you with MV OCEAN STAR's voyage?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggested, setSuggested] = useState(getSuggestedQuestions());
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isAIChatOpen) {
      setSuggested(getSuggestedQuestions());
    }
  }, [isAIChatOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    
    const userMessage = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const response = await sendMessage(trimmed);
      setMessages(prev => [...prev, response]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggested = (question) => {
    handleSend(question);
  };

  if (!isAIChatOpen) return null;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Sparkles size={18} className={styles.icon} />
          <h3 className={styles.title}>MarineVerse AI</h3>
        </div>
        <button className={styles.closeBtn} onClick={closeAIChat} aria-label="Close AI chat">
          <X size={18} />
        </button>
      </div>
      
      <div className={styles.messages}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`${styles.message} ${msg.role === 'user' ? styles.user : styles.assistant}`}>
            <div className={styles.bubble}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className={`${styles.message} ${styles.assistant}`}>
            <div className={styles.bubble}>
              <span className={styles.typing}>Analyzing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {suggested.length > 0 && messages.length <= 2 && (
        <div className={styles.suggestions}>
          {suggested.map((q, idx) => (
            <button key={idx} className={styles.suggestion} onClick={() => handleSuggested(q)}>
              {q}
            </button>
          ))}
        </div>
      )}
      
      <form className={styles.inputRow} onSubmit={(e) => { e.preventDefault(); handleSend(input); }}>
        <input
          type="text"
          className={styles.input}
          placeholder="Ask about your voyage..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          aria-label="Chat message"
        />
        <button type="submit" className={styles.sendBtn} disabled={loading || !input.trim()} aria-label="Send message">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
