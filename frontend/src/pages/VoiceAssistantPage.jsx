import React, { useState } from 'react';
import { ArrowLeft, Volume2, CheckCircle, AlertCircle, Trash2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VoiceAssistantPage() {
  const navigate = useNavigate();
  const [conversation, setConversation] = useState([]);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const utteranceRef = React.useRef(null);

  // Load conversations from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem('voiceConversations');
    if (stored) {
      try {
        const conversations = JSON.parse(stored);
        setConversation(conversations);
      } catch (e) {
        console.error('Error loading conversations:', e);
      }
    }
  }, []);

  // Keep speech synthesis alive (Chrome workaround)
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Function to speak answer
  const speakAnswer = (text, index, lang = 'en-US') => {
    if (!window.speechSynthesis) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // If already speaking this item, stop
    if (speakingIndex === index) {
      setSpeakingIndex(null);
      utteranceRef.current = null;
      return;
    }

    console.log('Speaking text:', text);
    console.log('Text length:', text.length);
    console.log('Language:', lang);

    // Create utterance with the full text
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85; // Slightly slower for better clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      console.log('Speech started');
      setSpeakingIndex(index);
    };
    
    utterance.onend = () => {
      console.log('Speech ended');
      setSpeakingIndex(null);
      utteranceRef.current = null;
    };
    
    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      setSpeakingIndex(null);
      utteranceRef.current = null;
    };

    utterance.onpause = () => {
      console.log('Speech paused - resuming...');
      window.speechSynthesis.resume();
    };

    utterance.onresume = () => {
      console.log('Speech resumed');
    };

    // Store reference
    utteranceRef.current = utterance;

    // Speak the utterance
    window.speechSynthesis.speak(utterance);
  };

  // Function to delete conversation
  const deleteConversation = (index) => {
    const updated = conversation.filter((_, i) => i !== index);
    setConversation(updated);
    localStorage.setItem('voiceConversations', JSON.stringify(updated));
    
    // Stop speaking if this item was being spoken
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
    }
  };

  // Map language codes to speech synthesis language codes
  const getVoiceLang = (detectedLang) => {
    const langMap = {
      'English': 'en-US',
      'Hindi': 'hi-IN',
      'Marathi': 'mr-IN',
      'Punjabi': 'pa-IN',
      'Tamil': 'ta-IN',
      'Telugu': 'te-IN',
      'Bengali': 'bn-IN',
      'Gujarati': 'gu-IN',
      'Kannada': 'kn-IN',
      'Malayalam': 'ml-IN',
    };
    return langMap[detectedLang] || 'en-US';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1410 0%, #2a231c 100%)',
      padding: '24px',
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: '24px',
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'rgba(255, 248, 240, 0.1)',
            border: '2px solid rgba(139, 105, 68, 0.3)',
            borderRadius: '12px',
            padding: '12px 20px',
            color: '#d4a574',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.95rem',
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 248, 240, 0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 248, 240, 0.1)'}
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#f5f1e8',
          marginTop: '24px',
          marginBottom: '8px',
        }}>
          🤖 AI Voice Assistant
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#d4a574',
          marginBottom: '24px',
        }}>
          Ask any farming question in your language and get a detailed action plan
        </p>
      </div>

      {/* Conversation History */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {conversation.length === 0 ? (
          <div style={{
            background: 'rgba(42, 35, 28, 0.6)',
            border: '2px solid rgba(139, 105, 68, 0.3)',
            borderRadius: '16px',
            padding: '48px',
            textAlign: 'center',
          }}>
            <Volume2 size={64} color="#6b8e23" style={{ margin: '0 auto 24px' }} />
            <h2 style={{ color: '#f5f1e8', fontSize: '1.5rem', marginBottom: '12px' }}>
              No conversations yet
            </h2>
            <p style={{ color: '#d4a574', fontSize: '1rem', lineHeight: '1.6' }}>
              Click the microphone button at the bottom-left corner to start asking questions.
              <br />
              Your questions and detailed action plans will appear here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {conversation.map((item, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(42, 35, 28, 0.8)',
                  border: '2px solid rgba(139, 105, 68, 0.4)',
                  borderRadius: '16px',
                  padding: '24px',
                  animation: 'slideUp 0.3s ease-out',
                }}
              >
                {/* Question */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '12px',
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #d4a574, #8b6914)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                    }}>
                      🗣️
                    </div>
                    <span style={{
                      color: '#d4a574',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}>
                      Your Question ({item.language})
                    </span>
                  </div>
                  <p style={{
                    color: '#f5f1e8',
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                    marginLeft: '42px',
                  }}>
                    {item.question}
                  </p>
                </div>

                {/* Answer */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '12px',
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6b8e23, #5a8f3a)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                    }}>
                      🤖
                    </div>
                    <span style={{
                      color: '#b8e994',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}>
                      AI Answer
                    </span>
                  </div>
                  <p style={{
                    color: '#f5f1e8',
                    fontSize: '1rem',
                    lineHeight: '1.8',
                    marginLeft: '42px',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {item.answer}
                  </p>
                </div>

                {/* Action Plan */}
                {item.plan && item.plan.length > 0 && (
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '16px',
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #8b6914, #d4a574)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                      }}>
                        📋
                      </div>
                      <span style={{
                        color: '#d4a574',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                      }}>
                        {item.planTitle || 'Action Plan'}
                      </span>
                    </div>
                    <div style={{ marginLeft: '42px' }}>
                      {item.plan.map((step, stepIndex) => (
                        <div
                          key={stepIndex}
                          style={{
                            display: 'flex',
                            gap: '12px',
                            marginBottom: '16px',
                            alignItems: 'flex-start',
                          }}
                        >
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'rgba(107, 142, 35, 0.2)',
                            border: '2px solid rgba(107, 142, 35, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#b8e994',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            flexShrink: 0,
                          }}>
                            {stepIndex + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{
                              color: '#f5f1e8',
                              fontSize: '1rem',
                              fontWeight: 600,
                              marginBottom: '6px',
                            }}>
                              {step.title}
                            </h4>
                            <p style={{
                              color: '#c4b5a0',
                              fontSize: '0.9rem',
                              lineHeight: '1.6',
                            }}>
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamp and Actions */}
                <div style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(139, 105, 68, 0.2)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div style={{
                    color: '#8b7355',
                    fontSize: '0.8rem',
                  }}>
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                  
                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {/* Speaker Button */}
                    <button
                      onClick={() => speakAnswer(item.answer, index, getVoiceLang(item.language))}
                      style={{
                        background: speakingIndex === index
                          ? 'linear-gradient(135deg, #6b8e23, #5a8f3a)'
                          : 'rgba(107, 142, 35, 0.15)',
                        border: '2px solid rgba(107, 142, 35, 0.4)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: speakingIndex === index ? '#fff' : '#b8e994',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        if (speakingIndex !== index) {
                          e.currentTarget.style.background = 'rgba(107, 142, 35, 0.25)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (speakingIndex !== index) {
                          e.currentTarget.style.background = 'rgba(107, 142, 35, 0.15)';
                        }
                      }}
                      title={speakingIndex === index ? 'Stop speaking' : 'Listen to answer'}
                    >
                      {speakingIndex === index ? (
                        <>
                          <VolumeX size={16} />
                          Stop
                        </>
                      ) : (
                        <>
                          <Volume2 size={16} />
                          Listen
                        </>
                      )}
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this conversation?')) {
                          deleteConversation(index);
                        }
                      }}
                      style={{
                        background: 'rgba(196, 69, 54, 0.15)',
                        border: '2px solid rgba(196, 69, 54, 0.4)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#ffb4a8',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(196, 69, 54, 0.25)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(196, 69, 54, 0.15)'}
                      title="Delete this conversation"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
