import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader, Languages } from 'lucide-react';

const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'hi-IN', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'मराठी', flag: '🇮🇳' },
];

export default function VoiceAssistant({ onCommand, context = {}, onChatResponse }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState(() => {
    // Load saved language from localStorage
    const saved = localStorage.getItem('voiceAssistantLanguage');
    return saved || 'en-US';
  });
  const [showLanguages, setShowLanguages] = useState(false);
  const [error, setError] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || !window.speechSynthesis) {
      setIsSupported(false);
      setError('Voice features not supported. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      // Initialize speech recognition
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Keep listening until manually stopped
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError('');
        setTranscript('');
      };

      recognition.onresult = (event) => {
        // Collect all results to build complete transcript
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript;
        }
        setTranscript(fullTranscript);
        console.log('Current transcript:', fullTranscript);
      };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      // Handle different error types
      if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.');
      } else if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setError('Microphone access denied. Please allow microphone access in browser settings.');
      } else if (event.error === 'network') {
        // Network error - Chrome's speech service requires internet
        // Check if it's actually a connectivity issue or just Chrome's requirement
        fetch('https://www.google.com/favicon.ico', { mode: 'no-cors' })
          .then(() => {
            // Internet is working, it's just Chrome's speech service issue
            setError('Voice recognition service unavailable. Please try again or check your internet connection.');
          })
          .catch(() => {
            // Actually no internet
            setError('Internet connection required for voice recognition. Please check your connection and try again.');
          });
      } else if (event.error === 'aborted') {
        // Silently handle aborted (user stopped)
        setError('');
      } else if (event.error === 'audio-capture') {
        setError('No microphone detected. Please connect a microphone.');
      } else if (event.error === 'service-not-allowed') {
        setError('Speech recognition service not allowed. Please check browser settings.');
      } else {
        setError(`Voice recognition error: ${event.error}. Please try again.`);
      }
      
      // Show text input as fallback
      setShowTextInput(true);
      
      // Auto-clear error after 8 seconds
      setTimeout(() => setError(''), 8000);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-clear transcript after 3 seconds
      setTimeout(() => setTranscript(''), 3000);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          // Ignore errors on cleanup
        }
      }
    };
  } catch (err) {
    console.error('Error initializing speech recognition:', err);
    setIsSupported(false);
    setError('Failed to initialize voice recognition. Please refresh the page.');
    return;
  }
  }, [language]);

  const toggleListening = () => {
    if (!isSupported) return;
    
    if (isListening) {
      // Stop listening and process the command
      stopListening();
    } else {
      // Start listening
      startListening();
    }
  };

  const startListening = () => {
    // Clear any previous errors and transcript
    setError('');
    setTranscript('');
    
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error('Error starting recognition:', err);
      
      // Handle specific error cases
      if (err.name === 'InvalidStateError') {
        // Recognition already started, stop and restart
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            try {
              recognitionRef.current.start();
            } catch (retryErr) {
              setError('Failed to start voice recognition. Please refresh the page.');
            }
          }, 100);
        } catch (stopErr) {
          setError('Voice recognition is busy. Please try again in a moment.');
        }
      } else if (err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone in browser settings.');
      } else {
        setError('Failed to start listening. Please try again or refresh the page.');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      
      // Process the command if we have a transcript
      if (transcript && transcript.trim()) {
        console.log('Processing transcript:', transcript);
        setIsProcessing(true);
        processVoiceCommand(transcript);
      } else {
        setError('No speech detected. Please try again.');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const speak = (text, lang = null) => {
    if (!window.speechSynthesis) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Use provided language or current selected language
    utterance.lang = lang || language;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    synthRef.current.cancel();
    setIsSpeaking(false);
  };

  const processVoiceCommand = async (command) => {
    console.log('Processing command:', command);
    const lowerCommand = command.toLowerCase().trim();

    // Don't process empty commands
    if (!lowerCommand) {
      speak('I did not hear anything. Please try again.');
      setIsProcessing(false);
      return;
    }

    // Navigation commands
    if (lowerCommand.includes('home') || lowerCommand.includes('input')) {
      speak('Going to input page');
      setTimeout(() => {
        setIsProcessing(false);
        window.location.href = '/';
      }, 1000);
    } else if (lowerCommand.includes('recommendation') || lowerCommand.includes('suggest')) {
      speak('Showing recommendations');
      setTimeout(() => {
        setIsProcessing(false);
        window.location.href = '/recommendation';
      }, 1000);
    } else if (lowerCommand.includes('plan') || lowerCommand.includes('dashboard')) {
      speak('Opening farming plan');
      setTimeout(() => {
        setIsProcessing(false);
        window.location.href = '/dashboard';
      }, 1000);
    } else if (lowerCommand.includes('disease')) {
      speak('Opening disease detection');
      setTimeout(() => {
        setIsProcessing(false);
        window.location.href = '/disease';
      }, 1000);
    } else if (lowerCommand.includes('alert') || lowerCommand.includes('weather')) {
      speak('Showing weather alerts');
      setTimeout(() => {
        setIsProcessing(false);
        window.location.href = '/alerts';
      }, 1000);
    }
    // Form filling commands (if on input page)
    else if (context.page === 'input') {
      const formData = extractFormData(command);
      if (formData && onCommand) {
        onCommand({ type: 'fillForm', data: formData });
        speak('Form data filled. Please verify and submit.');
      } else {
        speak('I could not understand the form data. Please try again.');
      }
      setIsProcessing(false);
    }
    // Read content commands
    else if (lowerCommand.includes('read') || lowerCommand.includes('tell me')) {
      if (context.content) {
        speak(context.content);
      } else {
        speak('No content available to read');
      }
      setIsProcessing(false);
    }
    // Help command
    else if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
      const helpText = 'You can say: Go to recommendations, Show weather alerts, Open disease detection, Go to dashboard, or ask me anything about farming.';
      speak(helpText);
      setIsProcessing(false);
    }
    // Send to chatbot (AI-powered answers with action plans)
    else {
      // Speak in current selected language
      const speakingLang = language; // Use the selected language
      
      // Translate "Let me check that for you" based on language
      const checkingMessages = {
        'en-US': 'Let me check that for you',
        'hi-IN': 'मैं आपके लिए जांच करता हूं',
        'mr-IN': 'मी तुमच्यासाठी तपासतो',
      };
      const checkingMessage = checkingMessages[speakingLang] || checkingMessages['en-US'];
      
      speak(checkingMessage, speakingLang);
      setIsProcessing(true);
      
      try {
        // Call the chatbot API directly
        const response = await fetch('http://localhost:8000/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: command,
            history: [],
            context: null
          })
        });
        
        const data = await response.json();
        const answer = data.reply;
        const detectedLanguage = data.language || 'English';
        const actionPlan = data.plan || [];
        const planTitle = data.plan_title || 'Action Plan';
        
        console.log('AI Response:', answer);
        console.log('Language:', detectedLanguage);
        console.log('Action Plan:', actionPlan);
        
        // Map detected language to voice language code
        const voiceLangMap = {
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
        const voiceLang = voiceLangMap[detectedLanguage] || 'en-US';
        
        // Speak the answer in the detected language
        speak(answer, voiceLang);
        
        // Save to localStorage and navigate to voice assistant page
        const conversationItem = {
          question: command,
          answer: answer,
          language: detectedLanguage,
          plan: actionPlan,
          planTitle: planTitle,
          timestamp: new Date().toISOString()
        };
        
        // Get existing conversations
        const existing = localStorage.getItem('voiceConversations');
        const conversations = existing ? JSON.parse(existing) : [];
        conversations.push(conversationItem);
        localStorage.setItem('voiceConversations', JSON.stringify(conversations));
        
        // Navigate to voice assistant page after speaking
        setTimeout(() => {
          window.location.href = '/voice-assistant';
        }, 2000);
        
      } catch (error) {
        console.error('Chat API error:', error);
        const errorMessages = {
          'en-US': 'Sorry, I could not connect to the chatbot. Please make sure the backend is running.',
          'hi-IN': 'क्षमा करें, मैं चैटबॉट से कनेक्ट नहीं हो सका। कृपया सुनिश्चित करें कि बैकएंड चल रहा है।',
          'mr-IN': 'माफ करा, मी चॅटबॉटशी कनेक्ट होऊ शकलो नाही। कृपया बॅकएंड चालू असल्याची खात्री करा।',
        };
        const errorMessage = errorMessages[speakingLang] || errorMessages['en-US'];
        speak(errorMessage, speakingLang);
      }
      
      setIsProcessing(false);
    }
  };

  const extractFormData = (command) => {
    const data = {};
    
    // Extract numbers with labels
    const patterns = {
      N: /nitrogen\s+(?:is\s+)?(\d+)/i,
      P: /phosphorus\s+(?:is\s+)?(\d+)/i,
      K: /potassium\s+(?:is\s+)?(\d+)/i,
      pH: /ph\s+(?:is\s+)?(\d+\.?\d*)/i,
      location: /location\s+(?:is\s+)?([a-z\s]+)/i,
    };

    for (const [key, pattern] of Object.entries(patterns)) {
      const match = command.match(pattern);
      if (match) {
        data[key] = key === 'location' ? match[1].trim() : parseFloat(match[1]);
      }
    }

    return Object.keys(data).length > 0 ? data : null;
  };

  const changeLanguage = (langCode) => {
    setLanguage(langCode);
    setShowLanguages(false);
    // Save to localStorage
    localStorage.setItem('voiceAssistantLanguage', langCode);
    if (recognitionRef.current) {
      recognitionRef.current.lang = langCode;
    }
    const langName = SUPPORTED_LANGUAGES.find(l => l.code === langCode)?.name;
    speak(`Language changed to ${langName}`, langCode);
  };

  if (!isSupported) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        background: 'rgba(196, 69, 54, 0.15)',
        border: '2px solid rgba(196, 69, 54, 0.4)',
        borderRadius: '12px',
        padding: '14px 18px',
        color: '#ffb4a8',
        fontSize: '0.9rem',
        maxWidth: '320px',
        zIndex: 1000,
        lineHeight: '1.5',
      }}>
        <strong>Voice Assistant Unavailable</strong>
        <br />
        {error}
        <br />
        <small style={{ color: '#d4a574', marginTop: '8px', display: 'block' }}>
          Tip: Use Chrome or Edge browser for best experience.
        </small>
      </div>
    );
  }

  return (
    <>
      {/* Voice Assistant Button */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        alignItems: 'flex-start',
      }}>
        {/* Main Mic Button */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={toggleListening}
            disabled={!isSupported || isProcessing}
            style={{
              width: '62px',
              height: '62px',
              borderRadius: '50%',
              background: isListening
                ? 'linear-gradient(135deg, #c44536, #ef4444)'
                : isProcessing
                ? 'linear-gradient(135deg, #d4a574, #8b6914)'
                : 'linear-gradient(135deg, #6b8e23, #5a8f3a)',
              border: '3px solid rgba(255, 248, 240, 0.2)',
              cursor: (isProcessing || !isSupported) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isListening
                ? '0 0 30px rgba(196, 69, 54, 0.6)'
                : '0 6px 24px rgba(107, 142, 35, 0.4)',
              transition: 'all 0.3s ease',
              animation: isListening ? 'pulse 1.5s infinite' : 'none',
              opacity: isProcessing ? 0.7 : 1,
            }}
            onMouseEnter={e => !isListening && !isProcessing && (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={e => !isListening && !isProcessing && (e.currentTarget.style.transform = 'scale(1)')}
            title={isListening ? 'Click to stop and process' : isProcessing ? 'Processing...' : 'Click to start listening'}
          >
            {isListening ? <MicOff size={28} color="#fff" /> : <Mic size={28} color="#fff" />}
          </button>

          {/* Speaker Button */}
          <button
            onClick={isSpeaking ? stopSpeaking : null}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: isSpeaking
                ? 'linear-gradient(135deg, #d4a574, #8b6914)'
                : 'rgba(255, 248, 240, 0.1)',
              border: '2px solid rgba(139, 105, 68, 0.3)',
              cursor: isSpeaking ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              opacity: isSpeaking ? 1 : 0.5,
            }}
            title={isSpeaking ? 'Stop speaking' : 'Speaker'}
          >
            {isSpeaking ? <Volume2 size={20} color="#fff" /> : <VolumeX size={20} color="#d4a574" />}
          </button>

          {/* Language Button */}
          <button
            onClick={() => setShowLanguages(!showLanguages)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(255, 248, 240, 0.1)',
              border: '2px solid rgba(139, 105, 68, 0.3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
            title="Change language"
          >
            <Languages size={20} color="#d4a574" />
          </button>

          {/* Text Input Button */}
          <button
            onClick={() => setShowTextInput(!showTextInput)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: showTextInput 
                ? 'linear-gradient(135deg, #6b8e23, #5a8f3a)'
                : 'rgba(255, 248, 240, 0.1)',
              border: '2px solid rgba(139, 105, 68, 0.3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
            title="Type instead of speaking"
          >
            <span style={{ fontSize: '20px', color: showTextInput ? '#fff' : '#d4a574' }}>💬</span>
          </button>
        </div>

        {/* Language Selector */}
        {showLanguages && (
          <div style={{
            background: 'rgba(42, 35, 28, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(139, 105, 68, 0.4)',
            borderRadius: '14px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minWidth: '180px',
            animation: 'slideUp 0.3s ease-out',
          }}>
            {SUPPORTED_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                style={{
                  background: language === lang.code
                    ? 'rgba(107, 142, 35, 0.2)'
                    : 'transparent',
                  border: language === lang.code
                    ? '2px solid rgba(107, 142, 35, 0.5)'
                    : '2px solid transparent',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#f5f1e8',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(107, 142, 35, 0.15)'}
                onMouseLeave={e => language !== lang.code && (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontSize: '1.2rem' }}>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Transcript Display */}
        {(isListening || transcript || isProcessing) && (
          <div style={{
            background: 'rgba(42, 35, 28, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(107, 142, 35, 0.4)',
            borderRadius: '14px',
            padding: '14px 18px',
            maxWidth: '350px',
            animation: 'slideUp 0.3s ease-out',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              {(isListening || isProcessing) && <Loader size={16} color="#b8e994" style={{ animation: 'spin 1s linear infinite' }} />}
              <span style={{ color: '#b8e994', fontSize: '0.85rem', fontWeight: 600 }}>
                {isListening ? 'Listening... (Click mic to stop)' : isProcessing ? 'Processing...' : 'You said:'}
              </span>
            </div>
            <p style={{ color: '#f5f1e8', fontSize: '0.95rem', margin: 0, lineHeight: '1.5' }}>
              {transcript || (isListening ? 'Speak now...' : 'Processing your command...')}
            </p>
            {isListening && transcript && (
              <div style={{
                marginTop: '12px',
                padding: '8px 12px',
                background: 'rgba(196, 69, 54, 0.15)',
                border: '1px solid rgba(196, 69, 54, 0.3)',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: '#ffb4a8',
                textAlign: 'center',
              }}>
                Click mic button again to process
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div style={{
            background: 'rgba(196, 69, 54, 0.15)',
            border: '2px solid rgba(196, 69, 54, 0.4)',
            borderRadius: '12px',
            padding: '12px 16px',
            color: '#ffb4a8',
            fontSize: '0.85rem',
            maxWidth: '320px',
            lineHeight: '1.5',
          }}>
            <div style={{ fontWeight: 600, marginBottom: '6px' }}>⚠️ Voice Recognition Error</div>
            {error}
            {error.includes('Internet connection') && (
              <div style={{
                marginTop: '10px',
                padding: '8px 10px',
                background: 'rgba(212, 165, 116, 0.15)',
                border: '1px solid rgba(212, 165, 116, 0.3)',
                borderRadius: '6px',
                fontSize: '0.8rem',
                color: '#d4a574',
              }}>
                <strong>Why?</strong> Chrome's voice recognition uses Google's cloud service.
                <br />
                <strong>Fix:</strong> Check your internet connection and firewall settings.
                <br />
                <strong>Alternative:</strong> Use the text input below instead!
              </div>
            )}
            <button
              onClick={() => setShowTextInput(true)}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #6b8e23, #5a8f3a)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.85rem',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              💬 Use Text Input Instead
            </button>
          </div>
        )}

        {/* Text Input Fallback */}
        {showTextInput && (
          <div style={{
            background: 'rgba(42, 35, 28, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(107, 142, 35, 0.4)',
            borderRadius: '14px',
            padding: '14px 18px',
            maxWidth: '350px',
            animation: 'slideUp 0.3s ease-out',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#b8e994', fontSize: '0.9rem', fontWeight: 600 }}>
                💬 Type Your Question
              </span>
              <button
                onClick={() => setShowTextInput(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#d4a574',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '0',
                }}
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && textInput.trim()) {
                  processVoiceCommand(textInput);
                  setTextInput('');
                }
              }}
              placeholder="Type your farming question..."
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(255, 248, 240, 0.08)',
                border: '2px solid rgba(139, 105, 68, 0.3)',
                borderRadius: '10px',
                color: '#f5f1e8',
                fontSize: '0.9rem',
                marginBottom: '10px',
              }}
            />
            <button
              onClick={() => {
                if (textInput.trim()) {
                  processVoiceCommand(textInput);
                  setTextInput('');
                }
              }}
              disabled={!textInput.trim()}
              style={{
                width: '100%',
                padding: '10px',
                background: textInput.trim() 
                  ? 'linear-gradient(135deg, #6b8e23, #5a8f3a)'
                  : 'rgba(107, 142, 35, 0.3)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: textInput.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Send Question
            </button>
            <p style={{ 
              color: '#d4a574', 
              fontSize: '0.75rem', 
              marginTop: '8px', 
              marginBottom: 0,
              textAlign: 'center' 
            }}>
              Works without microphone or internet issues
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 30px rgba(196, 69, 54, 0.6); }
          50% { box-shadow: 0 0 50px rgba(196, 69, 54, 0.9); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
