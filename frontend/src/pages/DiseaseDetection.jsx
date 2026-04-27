import React, { useState } from 'react';
import { UploadCloud, Activity } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';

export default function DiseaseDetection() {
  const { t } = useLang();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/disease-detect', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('Failed to analyze image.');
    }
    setLoading(false);
  };

  return (
    <div className="grid">
      <div className="glass-panel" style={{ textAlign: 'center' }}>
        <h2><Activity style={{ display: 'inline', marginRight: '10px' }}/> {t('diseaseTitle')}</h2>
        <p>{t('diseaseDesc')}</p>
        
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '100%', 
            maxWidth: '500px', 
            height: '250px', 
            border: '3px dashed rgba(139, 105, 68, 0.4)', 
            borderRadius: '16px',
            cursor: 'pointer',
            transition: 'var(--transition)',
            background: preview ? 'transparent' : 'rgba(255, 248, 240, 0.05)'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = '#6b8e23'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(139, 105, 68, 0.4)'}
          >
            {preview ? (
              <img src={preview} alt="Crop Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} />
            ) : (
              <>
                <UploadCloud size={52} color="#d4a574" style={{ marginBottom: '1rem' }}/>
                <span style={{ color: '#f5f1e8', fontSize: '1.05rem' }}>{t('uploadPrompt')}</span>
              </>
            )}
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
          </label>

          <button onClick={handleUpload} className="btn btn-primary" style={{ marginTop: '2rem', padding: '1rem 3rem' }} disabled={!file || loading}>
            {loading ? <div className="spinner" style={{width:'24px', height:'24px', borderWidth:'3px'}}/> : t('btnAnalyzeAI')}
          </button>
        </div>

        {result && (
          <div className="glass-panel" style={{ marginTop: '2rem', background: 'rgba(107, 142, 35, 0.15)', borderColor: 'rgba(107, 142, 35, 0.5)' }}>
            <h3 style={{ color: '#b8e994', marginBottom: '1.5rem', fontSize: '1.8rem' }}>{t('analysisComplete')}</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', margin: '1.5rem 0', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '1rem', color: '#d4a574', marginBottom: '0.5rem', fontWeight: 600 }}>{t('detectedCondition')}</span>
                <strong style={{ fontSize: '1.4rem', color: '#f5f1e8', display: 'block' }}>{result.disease}</strong>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '1rem', color: '#d4a574', marginBottom: '0.5rem', fontWeight: 600 }}>{t('confidenceScore')}</span>
                <strong style={{ fontSize: '1.4rem', color: '#f5f1e8', display: 'block' }}>{(result.confidence * 100).toFixed(1)}%</strong>
              </div>
            </div>
            <div style={{ background: 'rgba(255, 248, 240, 0.08)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem', border: '2px solid rgba(139, 105, 68, 0.3)' }}>
              <span style={{ display: 'block', fontSize: '1.05rem', color: '#d4a574', marginBottom: '0.75rem', fontWeight: 600 }}>{t('recommendedTreatment')}</span>
              <p style={{ color: '#f5f1e8', fontSize: '1rem', lineHeight: '1.7', margin: 0 }}>{result.treatment}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
