import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const TOAST_TYPES = {
  success: { icon: CheckCircle, color: '#b8e994', bg: 'rgba(107, 142, 35, 0.15)', border: 'rgba(107, 142, 35, 0.5)' },
  error: { icon: AlertCircle, color: '#ffb4a8', bg: 'rgba(196, 69, 54, 0.15)', border: 'rgba(196, 69, 54, 0.5)' },
  info: { icon: Info, color: '#a5b4fc', bg: 'rgba(99, 102, 241, 0.15)', border: 'rgba(99, 102, 241, 0.5)' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, success: (msg) => addToast(msg, 'success'), error: (msg) => addToast(msg, 'error'), info: (msg) => addToast(msg, 'info') }}>
      {children}
      <div style={{
        position: 'fixed',
        top: '80px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '400px',
      }}>
        {toasts.map(toast => {
          const config = TOAST_TYPES[toast.type];
          const Icon = config.icon;
          return (
            <div
              key={toast.id}
              style={{
                background: 'rgba(42, 35, 28, 0.98)',
                backdropFilter: 'blur(20px)',
                border: `2px solid ${config.border}`,
                borderRadius: '14px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                animation: 'slideInRight 0.3s ease-out',
                minWidth: '300px',
              }}
            >
              <Icon size={20} color={config.color} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, color: '#f5f1e8', fontSize: '0.95rem', lineHeight: '1.4' }}>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#d4a574',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#f5f1e8'}
                onMouseLeave={e => e.currentTarget.style.color = '#d4a574'}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
