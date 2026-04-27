import React from 'react';

function TestDashboard() {
  return (
    <div style={{
      padding: '40px',
      color: '#f5f1e8',
      minHeight: '500px',
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Test Dashboard</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
        If you can see this, React is working!
      </p>
      <div style={{
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Test Card</h2>
        <p>This is a test card to verify styling works.</p>
      </div>
      <button style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 24px',
        fontSize: '1rem',
        cursor: 'pointer',
      }}>
        Test Button
      </button>
    </div>
  );
}

export default TestDashboard;
