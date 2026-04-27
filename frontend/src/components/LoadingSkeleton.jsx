import React from 'react';

export function SkeletonCard() {
  return (
    <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ height: '180px', background: 'linear-gradient(90deg, rgba(255, 248, 240, 0.05) 0%, rgba(255, 248, 240, 0.1) 50%, rgba(255, 248, 240, 0.05) 100%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
      <div style={{ padding: '1.2rem' }}>
        <div style={{ height: '20px', background: 'rgba(255, 248, 240, 0.1)', borderRadius: '8px', marginBottom: '12px', width: '70%', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '14px', background: 'rgba(255, 248, 240, 0.08)', borderRadius: '6px', marginBottom: '8px', width: '90%', animation: 'pulse 1.5s infinite 0.2s' }} />
        <div style={{ height: '6px', background: 'rgba(255, 248, 240, 0.08)', borderRadius: '4px', marginTop: '12px', animation: 'pulse 1.5s infinite 0.4s' }} />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i} style={{
          padding: '1.4rem',
          background: 'rgba(255, 248, 240, 0.05)',
          borderLeft: '5px solid rgba(139, 105, 68, 0.3)',
          borderRadius: '0 12px 12px 0',
          marginBottom: '1.2rem',
          animation: 'pulse 1.5s infinite',
          animationDelay: `${i * 0.1}s`
        }}>
          <div style={{ height: '18px', background: 'rgba(255, 248, 240, 0.1)', borderRadius: '6px', marginBottom: '10px', width: '40%' }} />
          <div style={{ height: '14px', background: 'rgba(255, 248, 240, 0.08)', borderRadius: '6px', marginBottom: '8px', width: '85%' }} />
          <div style={{ height: '12px', background: 'rgba(255, 248, 240, 0.06)', borderRadius: '6px', width: '30%' }} />
        </div>
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </>
  );
}

export function SkeletonWeather() {
  return (
    <div className="glass-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ height: '28px', background: 'rgba(255, 248, 240, 0.1)', borderRadius: '8px', width: '200px', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '36px', background: 'rgba(255, 248, 240, 0.08)', borderRadius: '10px', width: '300px', animation: 'pulse 1.5s infinite 0.2s' }} />
      </div>
      <div style={{ height: '16px', background: 'rgba(255, 248, 240, 0.08)', borderRadius: '6px', marginBottom: '1.2rem', width: '60%', animation: 'pulse 1.5s infinite 0.3s' }} />
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 248, 240, 0.06)',
            borderRadius: '12px',
            padding: '12px 18px',
            minWidth: '140px',
            border: '2px solid rgba(139, 105, 68, 0.2)',
            animation: 'pulse 1.5s infinite',
            animationDelay: `${i * 0.1}s`
          }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255, 248, 240, 0.1)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: '10px', background: 'rgba(255, 248, 240, 0.1)', borderRadius: '4px', marginBottom: '6px', width: '60%' }} />
              <div style={{ height: '14px', background: 'rgba(255, 248, 240, 0.12)', borderRadius: '6px', width: '80%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
