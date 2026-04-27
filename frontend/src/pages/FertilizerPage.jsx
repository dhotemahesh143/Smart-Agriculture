import React, { useState } from 'react';
import { Sprout, DollarSign, Package, AlertCircle, CheckCircle, Leaf, TrendingUp } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { useToast } from '../components/Toast';

function FertilizerPage() {
  const { t } = useLang();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    n: '',
    p: '',
    k: '',
    ph: '',
    crop: '',
    location: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.n || !formData.p || !formData.k || !formData.ph) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/fertilizer-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          n: parseFloat(formData.n),
          p: parseFloat(formData.p),
          k: parseFloat(formData.k),
          ph: parseFloat(formData.ph),
          crop: formData.crop || null,
          location: formData.location || null
        })
      });

      if (!response.ok) throw new Error('Failed to get recommendations');
      
      const data = await response.json();
      setResult(data);
      showToast('Fertilizer recommendations generated!', 'success');
    } catch (error) {
      console.error('Error:', error);
      showToast('Failed to get recommendations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b8e23';
    }
  };

  // Input style with better visibility
  const inputStyle = {
    width: '100%',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(107, 142, 35, 0.4)',
    borderRadius: '8px',
    color: '#f5f1e8',
    fontSize: '1rem'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <style>{`
        input::placeholder {
          color: rgba(212, 165, 116, 0.6) !important;
          opacity: 1;
        }
        input:focus {
          outline: none;
          border-color: rgba(107, 142, 35, 0.7);
          background: rgba(255, 255, 255, 0.12);
        }
      `}</style>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        animation: 'fadeIn 0.6s ease-out'
      }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '12px',
          marginBottom: '12px'
        }}>
          <Sprout size={40} color="#6b8e23" />
          <h1 style={{ 
            fontSize: '2.5rem', 
            color: '#f5f1e8',
            margin: 0,
            fontWeight: 700
          }}>
            Smart Fertilizer Recommendation
          </h1>
        </div>
        <p style={{ 
          color: '#d4a574', 
          fontSize: '1.1rem',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          Get personalized fertilizer recommendations based on your soil's NPK values and pH level
        </p>
      </div>

      {/* Input Form */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(107, 142, 35, 0.3)',
        borderRadius: '16px',
        padding: '30px',
        marginBottom: '30px',
        animation: 'slideUp 0.6s ease-out'
      }}>
        <h2 style={{ 
          color: '#f5f1e8', 
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 600
        }}>
          <Leaf size={24} color="#6b8e23" />
          Soil Information
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                color: '#f5f1e8', 
                marginBottom: '8px',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}>
                Nitrogen (N) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="number"
                name="n"
                value={formData.n}
                onChange={handleChange}
                placeholder="e.g., 25"
                step="0.1"
                required
                style={inputStyle}
              />
              <small style={{ color: '#d4a574', fontSize: '0.85rem', display: 'block', marginTop: '4px' }}>
                mg/kg
              </small>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                color: '#f5f1e8', 
                marginBottom: '8px',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}>
                Phosphorus (P) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="number"
                name="p"
                value={formData.p}
                onChange={handleChange}
                placeholder="e.g., 30"
                step="0.1"
                required
                style={inputStyle}
              />
              <small style={{ color: '#d4a574', fontSize: '0.85rem', display: 'block', marginTop: '4px' }}>
                mg/kg
              </small>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                color: '#f5f1e8', 
                marginBottom: '8px',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}>
                Potassium (K) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="number"
                name="k"
                value={formData.k}
                onChange={handleChange}
                placeholder="e.g., 35"
                step="0.1"
                required
                style={inputStyle}
              />
              <small style={{ color: '#d4a574', fontSize: '0.85rem', display: 'block', marginTop: '4px' }}>
                mg/kg
              </small>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                color: '#f5f1e8', 
                marginBottom: '8px',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}>
                pH Level <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="number"
                name="ph"
                value={formData.ph}
                onChange={handleChange}
                placeholder="e.g., 6.5"
                step="0.1"
                min="0"
                max="14"
                required
                style={inputStyle}
              />
              <small style={{ color: '#d4a574', fontSize: '0.85rem', display: 'block', marginTop: '4px' }}>
                0-14 scale
              </small>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                color: '#f5f1e8', 
                marginBottom: '8px',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}>
                Crop (Optional)
              </label>
              <input
                type="text"
                name="crop"
                value={formData.crop}
                onChange={handleChange}
                placeholder="e.g., Rice, Wheat"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                color: '#f5f1e8', 
                marginBottom: '8px',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}>
                Location (Optional)
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Pune, Maharashtra"
                style={inputStyle}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? 'rgba(107, 142, 35, 0.5)' : 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            {loading ? (
              <>
                <div className="spinner" />
                Analyzing Soil...
              </>
            ) : (
              <>
                <TrendingUp size={20} />
                Get Recommendations
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results */}
      {result && (
        <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
          {/* Soil Status */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(107, 142, 35, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h3 style={{ 
              color: '#f5f1e8', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <CheckCircle size={24} color="var(--primary)" />
              Current Soil Status
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px'
            }}>
              <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(107, 142, 35, 0.1)', borderRadius: '10px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#6b8e23' }}>
                  {result.soil_status.nitrogen}
                </div>
                <div style={{ color: '#b8a896', fontSize: '0.9rem' }}>Nitrogen (N)</div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(107, 142, 35, 0.1)', borderRadius: '10px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#6b8e23' }}>
                  {result.soil_status.phosphorus}
                </div>
                <div style={{ color: '#b8a896', fontSize: '0.9rem' }}>Phosphorus (P)</div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(107, 142, 35, 0.1)', borderRadius: '10px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#6b8e23' }}>
                  {result.soil_status.potassium}
                </div>
                <div style={{ color: '#b8a896', fontSize: '0.9rem' }}>Potassium (K)</div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(107, 142, 35, 0.1)', borderRadius: '10px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#6b8e23' }}>
                  {result.soil_status.ph}
                </div>
                <div style={{ color: '#b8a896', fontSize: '0.9rem' }}>pH Level</div>
              </div>
            </div>
          </div>

          {/* pH Correction */}
          {result.ph_correction && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h3 style={{ 
                color: '#ef4444', 
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <AlertCircle size={24} />
                pH Correction Required
              </h3>
              <div style={{ color: '#f5f1e8' }}>
                <p style={{ marginBottom: '12px' }}>
                  <strong>Issue:</strong> {result.ph_correction.issue} (Current: {result.ph_correction.current_ph})
                </p>
                <p style={{ marginBottom: '12px' }}>
                  <strong>Solution:</strong> {result.ph_correction.solution}
                </p>
                <p style={{ marginBottom: '12px' }}>
                  <strong>Quantity:</strong> {result.ph_correction.quantity_per_acre}
                </p>
                <p style={{ marginBottom: '12px' }}>
                  <strong>Cost:</strong> ₹{result.ph_correction.cost_estimate}
                </p>
                <p style={{ marginBottom: '12px' }}>
                  <strong>Application:</strong> {result.ph_correction.application}
                </p>
                <p style={{ color: '#b8a896', fontSize: '0.9rem' }}>
                  {result.ph_correction.benefits}
                </p>
              </div>
            </div>
          )}

          {/* Recommendations */}
          <h3 style={{ 
            color: '#f5f1e8', 
            marginBottom: '20px',
            fontSize: '1.8rem'
          }}>
            Fertilizer Recommendations
          </h3>
          
          {result.recommendations.map((rec, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(10px)',
              border: `2px solid ${getPriorityColor(rec.priority)}`,
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              animation: `slideUp 0.6s ease-out ${index * 0.1}s backwards`
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <h4 style={{ 
                  color: '#f5f1e8', 
                  fontSize: '1.4rem',
                  margin: 0
                }}>
                  {rec.nutrient}
                </h4>
                <span style={{
                  padding: '6px 16px',
                  background: `${getPriorityColor(rec.priority)}20`,
                  color: getPriorityColor(rec.priority),
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}>
                  {rec.status}
                </span>
              </div>

              {rec.message ? (
                <div style={{ color: '#d4a574', marginBottom: '16px' }}>
                  {rec.message}
                </div>
              ) : (
                <>
                  <div style={{ 
                    color: '#b8a896', 
                    marginBottom: '20px',
                    fontSize: '0.95rem'
                  }}>
                    Current: {rec.current_value} mg/kg | Optimal: {rec.optimal_range}
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px'
                  }}>
                    {/* Chemical Fertilizer */}
                    <div style={{
                      background: 'rgba(107, 142, 35, 0.1)',
                      borderRadius: '12px',
                      padding: '20px'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        marginBottom: '12px'
                      }}>
                        <Package size={20} color="var(--primary)" />
                        <h5 style={{ color: '#f5f1e8', margin: 0 }}>
                          Chemical Option
                        </h5>
                      </div>
                      <p style={{ color: '#f5f1e8', fontWeight: 600, fontSize: '1.1rem' }}>
                        {rec.primary_fertilizer?.name || rec.maintenance_fertilizer?.name}
                      </p>
                      <p style={{ color: '#b8a896', fontSize: '0.9rem', marginBottom: '8px' }}>
                        NPK: {rec.primary_fertilizer?.npk || rec.maintenance_fertilizer?.npk}
                      </p>
                      <p style={{ color: '#d4a574', marginBottom: '8px' }}>
                        <strong>Quantity:</strong> {rec.primary_fertilizer?.quantity_per_acre || rec.maintenance_fertilizer?.quantity_per_acre}
                      </p>
                      <p style={{ 
                        color: '#6b8e23', 
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        marginBottom: '12px'
                      }}>
                        <DollarSign size={18} style={{ verticalAlign: 'middle' }} />
                        ₹{rec.primary_fertilizer?.cost_estimate || rec.maintenance_fertilizer?.cost_estimate}
                      </p>
                      <p style={{ color: '#b8a896', fontSize: '0.85rem', marginBottom: '8px' }}>
                        <strong>Application:</strong> {rec.primary_fertilizer?.application || rec.maintenance_fertilizer?.application}
                      </p>
                      <p style={{ color: '#b8a896', fontSize: '0.85rem' }}>
                        {rec.primary_fertilizer?.benefits || rec.maintenance_fertilizer?.benefits}
                      </p>
                    </div>

                    {/* Organic Alternative */}
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '12px',
                      padding: '20px'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        marginBottom: '12px'
                      }}>
                        <Leaf size={20} color="#10b981" />
                        <h5 style={{ color: '#f5f1e8', margin: 0 }}>
                          Organic Option
                        </h5>
                      </div>
                      <p style={{ color: '#f5f1e8', fontWeight: 600, fontSize: '1.1rem' }}>
                        {rec.organic_alternative?.name || rec.organic_maintenance?.name}
                      </p>
                      <p style={{ color: '#b8a896', fontSize: '0.9rem', marginBottom: '8px' }}>
                        NPK: {rec.organic_alternative?.npk || rec.organic_maintenance?.npk}
                      </p>
                      <p style={{ color: '#d4a574', marginBottom: '8px' }}>
                        <strong>Quantity:</strong> {rec.organic_alternative?.quantity_per_acre || rec.organic_maintenance?.quantity_per_acre}
                      </p>
                      <p style={{ 
                        color: '#10b981', 
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        marginBottom: '12px'
                      }}>
                        <DollarSign size={18} style={{ verticalAlign: 'middle' }} />
                        ₹{rec.organic_alternative?.cost_estimate || rec.organic_maintenance?.cost_estimate}
                      </p>
                      <p style={{ color: '#b8a896', fontSize: '0.85rem', marginBottom: '8px' }}>
                        <strong>Application:</strong> {rec.organic_alternative?.application || rec.organic_maintenance?.application}
                      </p>
                      <p style={{ color: '#b8a896', fontSize: '0.85rem' }}>
                        {rec.organic_alternative?.benefits || rec.organic_maintenance?.benefits}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Cost Summary */}
          <div style={{
            background: 'rgba(212, 165, 116, 0.1)',
            border: '1px solid rgba(212, 165, 116, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h3 style={{ 
              color: '#f5f1e8', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <DollarSign size={24} color="var(--secondary)" />
              Cost Summary (Per Acre)
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <div>
                <p style={{ color: '#b8a896', marginBottom: '4px' }}>Chemical Fertilizers</p>
                <p style={{ color: '#f5f1e8', fontSize: '1.5rem', fontWeight: 700 }}>
                  ₹{result.cost_summary.chemical_fertilizers}
                </p>
              </div>
              <div>
                <p style={{ color: '#b8a896', marginBottom: '4px' }}>Organic Fertilizers</p>
                <p style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 700 }}>
                  ₹{result.cost_summary.organic_fertilizers}
                </p>
              </div>
              {result.cost_summary.savings_with_organic > 0 && (
                <div>
                  <p style={{ color: '#b8a896', marginBottom: '4px' }}>Savings with Organic</p>
                  <p style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 700 }}>
                    ₹{result.cost_summary.savings_with_organic}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* General Tips */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(107, 142, 35, 0.3)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <h3 style={{ 
              color: '#f5f1e8', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <AlertCircle size={24} color="var(--primary)" />
              General Tips
            </h3>
            <ul style={{ 
              color: '#d4a574', 
              paddingLeft: '20px',
              lineHeight: '1.8'
            }}>
              {result.general_tips.map((tip, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>{tip}</li>
              ))}
            </ul>
            {result.crop_specific_note && (
              <p style={{ 
                color: '#b8a896', 
                marginTop: '16px',
                fontStyle: 'italic',
                fontSize: '0.9rem'
              }}>
                {result.crop_specific_note}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FertilizerPage;


