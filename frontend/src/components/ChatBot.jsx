import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader, Minimize2 } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';

const SUGGESTED_QUESTIONS = [
  "Which crop is best for black soil in Nashik?",
  "How to treat tomato late blight?",
  "Best fertilizer for sugarcane in Kolhapur?",
  "When to irrigate wheat crop?",
  "How to identify Alphonso mango disease?",
];

export default function ChatBot() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '🌾 Namaste! I am KrishiBot, your AI Farming Assistant.\n\nI can help you with crop selection, disease treatment, fertilizers, irrigation, and Maharashtra-specific farming advice.\n\nAsk me anything!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Get context from localStorage
  const getContext = () => {
    try {
      const inputId = localStorage.getItem('inputId');
      return inputId ? { inputId } : null;
    } catch { return null; }
  };

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    setInput('');
    const userMsg = { role: 'user', content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          history: newMessages.slice(-10).map(m => ({ role: m.role, content: m.content })),
          context: getContext()
        })
      });
      const data = await res.json();
      const botMsg = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, botMsg]);
      if (!open) setUnread(u => u + 1);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Connection error. Please ensure the backend is running.'
      }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => { setOpen(o => !o); setMinimized(false); }}
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          width: '62px', height: '62px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #6b8e23, #5a8f3a)',
          border: '3px solid rgba(255, 248, 240, 0.2)',
          cursor: 'pointer', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 24px rgba(107, 142, 35, 0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        title="Chat with KrishiBot"
      >
        {open ? <X size={26} color="#fff" /> : <MessageCircle size={26} color="#fff" />}
        {!open && unread > 0 && (
          <span style={{
            position: 'absolute', top: '-4px', right: '-4px',
            background: '#c44536', color: '#fff', borderRadius: '50%',
            width: '22px', height: '22px', fontSize: '0.75rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, border: '2px solid #1a1410'
          }}>{unread}</span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '100px', right: '24px',
          width: '400px',
          height: minimized ? '60px' : '540px',
          background: 'rgba(42, 35, 28, 0.96)',
          backdropFilter: 'blur(24px)',
          border: '2px solid rgba(139, 105, 68, 0.4)',
          borderRadius: '24px',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          overflow: 'hidden',
          transition: 'height 0.3s ease',
        }}>

          {/* Header */}
          <div style={{
            padding: '16px 18px',
            background: 'linear-gradient(135deg, rgba(107, 142, 35, 0.25), rgba(90, 143, 58, 0.15))',
            borderBottom: minimized ? 'none' : '2px solid rgba(139, 105, 68, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #6b8e23, #5a8f3a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                border: '2px solid rgba(255, 248, 240, 0.2)',
              }}>
                <Bot size={22} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#f5f1e8' }}>{t('chatTitle')}</div>
                <div style={{ fontSize: '0.75rem', color: '#d4a574', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6b8e23', display: 'inline-block' }} />
                  {t('chatSubtitle')}
                </div>
              </div>
            </div>
            <button
              onClick={() => setMinimized(m => !m)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c4b5a0', padding: '6px' }}
            >
              <Minimize2 size={18} />
            </button>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div style={{
                flex: 1, overflowY: 'auto', padding: '12px 14px',
                display: 'flex', flexDirection: 'column', gap: '10px',
              }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-end', gap: '8px',
                  }}>
                    {/* Avatar */}
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, #d4a574, #8b6914)'
                        : 'linear-gradient(135deg, #6b8e23, #5a8f3a)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid rgba(255, 248, 240, 0.15)',
                    }}>
                      {msg.role === 'user'
                        ? <User size={15} color="#fff" />
                        : <Bot size={15} color="#fff" />}
                    </div>
                    {/* Bubble */}
                    <div style={{
                      maxWidth: '78%',
                      padding: '12px 15px',
                      borderRadius: msg.role === 'user' ? '18px 6px 18px 18px' : '6px 18px 18px 18px',
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, #d4a574, #8b6914)'
                        : 'rgba(255, 248, 240, 0.1)',
                      border: msg.role === 'user' ? '2px solid rgba(255, 248, 240, 0.1)' : '2px solid rgba(139, 105, 68, 0.3)',
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                      color: '#f5f1e8',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6b8e23, #5a8f3a)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      border: '2px solid rgba(255, 248, 240, 0.15)',
                    }}>
                      <Bot size={15} color="#fff" />
                    </div>
                    <div style={{
                      padding: '12px 16px', borderRadius: '6px 18px 18px 18px',
                      background: 'rgba(255, 248, 240, 0.1)',
                      border: '2px solid rgba(139, 105, 68, 0.3)',
                      display: 'flex', gap: '5px', alignItems: 'center',
                    }}>
                      {[0,1,2].map(i => (
                        <span key={i} style={{
                          width: '7px', height: '7px', borderRadius: '50%',
                          background: '#6b8e23',
                          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Suggested questions (only when 1 message) */}
              {messages.length === 1 && (
                <div style={{ padding: '0 14px 10px', display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button key={i} onClick={() => sendMessage(q)} style={{
                      background: 'rgba(107, 142, 35, 0.15)',
                      border: '2px solid rgba(107, 142, 35, 0.3)',
                      color: '#d4a574', borderRadius: '14px',
                      padding: '6px 12px', fontSize: '0.78rem',
                      cursor: 'pointer', transition: 'all 0.2s',
                      fontWeight: 500,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(107, 142, 35, 0.25)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(107, 142, 35, 0.15)'}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div style={{
                padding: '12px 14px',
                borderTop: '2px solid rgba(139, 105, 68, 0.3)',
                display: 'flex', gap: '10px', alignItems: 'flex-end',
                flexShrink: 0,
              }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('chatPlaceholder')}
                  rows={1}
                  style={{
                    flex: 1, background: 'rgba(255, 248, 240, 0.08)',
                    border: '2px solid rgba(139, 105, 68, 0.3)',
                    borderRadius: '14px', padding: '10px 14px',
                    color: '#f5f1e8', fontSize: '0.9rem',
                    fontFamily: 'inherit', resize: 'none',
                    outline: 'none', lineHeight: '1.5',
                    maxHeight: '90px', overflowY: 'auto',
                  }}
                  onFocus={e => e.target.style.borderColor = '#6b8e23'}
                  onBlur={e => e.target.style.borderColor = 'rgba(139, 105, 68, 0.3)'}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  style={{
                    width: '42px', height: '42px', borderRadius: '50%',
                    background: input.trim() && !loading
                      ? 'linear-gradient(135deg, #6b8e23, #5a8f3a)'
                      : 'rgba(255, 248, 240, 0.1)',
                    border: '2px solid ' + (input.trim() && !loading ? 'rgba(255, 248, 240, 0.2)' : 'rgba(139, 105, 68, 0.2)'),
                    cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'all 0.2s',
                  }}
                >
                  {loading
                    ? <Loader size={18} color="#c4b5a0" style={{ animation: 'spin 1s linear infinite' }} />
                    : <Send size={18} color={input.trim() ? '#fff' : '#c4b5a0'} />}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}
