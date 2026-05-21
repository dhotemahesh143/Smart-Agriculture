import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, TrendingUp, TrendingDown, AlertTriangle, Cloud, Leaf, DollarSign, BookOpen } from 'lucide-react';

function SimpleHomePage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      padding: '40px 20px',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          animation: 'fadeIn 0.8s ease-out',
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 700,
            color: '#f5f1e8',
            marginBottom: '16px',
          }}>
            🌾 LIVE INTELLIGENCE
          </h1>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 600,
            color: '#d4a574',
            marginBottom: '12px',
          }}>
            Agricultural Intelligence Feed
          </h2>
          <p style={{
            color: '#b8a896',
            fontSize: '1.1rem',
            maxWidth: '700px',
            margin: '0 auto',
          }}>
            Real-time localized alerts and global agricultural insights tailored for your specific farm coordinates.
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '50px',
        }}>
          <div
            onClick={() => navigate('/input')}
            style={{
              background: 'rgba(107, 142, 35, 0.15)',
              border: '2px solid rgba(107, 142, 35, 0.3)',
              borderRadius: '16px',
              padding: '30px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'rgba(107, 142, 35, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(107, 142, 35, 0.3)';
            }}
          >
            <Sprout size={48} color="#6b8e23" style={{ marginBottom: '16px' }} />
            <h3 style={{ color: '#f5f1e8', marginBottom: '8px' }}>Crop Recommendation</h3>
            <p style={{ color: '#b8a896', fontSize: '0.9rem' }}>Get AI-powered crop suggestions based on your soil</p>
          </div>

          <div
            onClick={() => navigate('/fertilizer')}
            style={{
              background: 'rgba(212, 165, 116, 0.15)',
              border: '2px solid rgba(212, 165, 116, 0.3)',
              borderRadius: '16px',
              padding: '30px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'rgba(212, 165, 116, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(212, 165, 116, 0.3)';
            }}
          >
            <Leaf size={48} color="#d4a574" style={{ marginBottom: '16px' }} />
            <h3 style={{ color: '#f5f1e8', marginBottom: '8px' }}>Fertilizer Guide</h3>
            <p style={{ color: '#b8a896', fontSize: '0.9rem' }}>Smart fertilizer recommendations with cost analysis</p>
          </div>

          <div
            onClick={() => navigate('/disease')}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '2px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px',
              padding: '30px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            }}
          >
            <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
            <h3 style={{ color: '#f5f1e8', marginBottom: '8px' }}>Disease Detection</h3>
            <p style={{ color: '#b8a896', fontSize: '0.9rem' }}>Upload leaf images for instant disease diagnosis</p>
          </div>

          <div
            onClick={() => navigate('/alerts')}
            style={{
              background: 'rgba(245, 158, 11, 0.15)',
              border: '2px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '16px',
              padding: '30px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)';
            }}
          >
            <Cloud size={48} color="#f59e0b" style={{ marginBottom: '16px' }} />
            <h3 style={{ color: '#f5f1e8', marginBottom: '8px' }}>Weather Alerts</h3>
            <p style={{ color: '#b8a896', fontSize: '0.9rem' }}>Real-time weather updates and warnings</p>
          </div>
        </div>

        {/* Critical Alerts */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
          }}>
            <AlertTriangle size={24} color="#f59e0b" />
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#f5f1e8',
              margin: 0,
            }}>
              Critical Alerts
            </h3>
            <span style={{
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}>
              2 NEW
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px',
          }}>
            <div style={{
              background: 'rgba(42, 35, 28, 0.92)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderLeft: '4px solid #ef4444',
              borderRadius: '16px',
              padding: '24px',
            }}>
              <div style={{ marginBottom: '12px' }}>
                <span style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>
                  HIGH RISK
                </span>
                <span style={{ color: '#6b5d4f', fontSize: '0.8rem', marginLeft: '8px' }}>2h ago</span>
              </div>
              <h4 style={{ color: '#f5f1e8', fontSize: '1.1rem', marginBottom: '8px' }}>
                🐛 Spodoptera Frugiperda Outbreak
              </h4>
              <p style={{ color: '#c4b5a0', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Early detection of Fall Armyworm reported in neighboring districts. Immediate inspection of maize crops recommended.
              </p>
            </div>

            <div style={{
              background: 'rgba(42, 35, 28, 0.92)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderLeft: '4px solid #f59e0b',
              borderRadius: '16px',
              padding: '24px',
            }}>
              <div style={{ marginBottom: '12px' }}>
                <span style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#f59e0b',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>
                  WEATHER WARNING
                </span>
                <span style={{ color: '#6b5d4f', fontSize: '0.8rem', marginLeft: '8px' }}>5h ago</span>
              </div>
              <h4 style={{ color: '#f5f1e8', fontSize: '1.1rem', marginBottom: '8px' }}>
                ⛈️ Unseasonal Hailstorm Warning
              </h4>
              <p style={{ color: '#c4b5a0', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Severe hail expected within 48 hours across the Marathwada region. Cover harvest-ready produce immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Market Intelligence */}
        <div style={{
          background: 'rgba(42, 35, 28, 0.92)',
          border: '1px solid rgba(107, 142, 35, 0.3)',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '50px',
        }}>
          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: 600,
            color: '#f5f1e8',
            marginBottom: '24px',
          }}>
            📈 Global Market Shifts
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '20px',
            marginBottom: '20px',
          }}>
            <div style={{
              textAlign: 'center',
              padding: '20px',
              background: 'rgba(107, 142, 35, 0.1)',
              borderRadius: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
                <TrendingUp size={20} color="#10b981" />
                <span style={{ fontSize: '0.85rem', color: '#d4a574' }}>Wheat Futures</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>+4.2%</div>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '20px',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
                <TrendingDown size={20} color="#ef4444" />
                <span style={{ fontSize: '0.85rem', color: '#d4a574' }}>Soybean Oil</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>-1.8%</div>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '20px',
              background: 'rgba(107, 142, 35, 0.1)',
              borderRadius: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
                <TrendingUp size={20} color="#10b981" />
                <span style={{ fontSize: '0.85rem', color: '#d4a574' }}>Cotton Export</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>+2.5%</div>
            </div>
          </div>
          <p style={{ color: '#c4b5a0', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
            Global supply chain disruptions are pushing grain prices higher. Consider holding stock for late-month sale.
          </p>
        </div>

        {/* News Section */}
        <div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#f5f1e8',
            marginBottom: '24px',
          }}>
            📰 Agricultural News & Trends
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}>
            <div style={{
              background: 'rgba(42, 35, 28, 0.92)',
              border: '1px solid rgba(107, 142, 35, 0.3)',
              borderRadius: '16px',
              padding: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <DollarSign size={20} color="#6b8e23" />
                <span style={{ color: '#6b8e23', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                  GOVERNMENT SCHEMES
                </span>
              </div>
              <h4 style={{ color: '#f5f1e8', fontSize: '1.05rem', marginBottom: '12px', lineHeight: 1.4 }}>
                New PM-Kisan Digital Subsidy for Drip Irrigation Sensors
              </h4>
              <p style={{ color: '#c4b5a0', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
                The central government has announced an additional 15% subsidy for farmers implementing IoT-based soil moisture sensors...
              </p>
              <div style={{ color: '#6b5d4f', fontSize: '0.8rem' }}>By AgriDept Insights</div>
            </div>

            <div style={{
              background: 'rgba(42, 35, 28, 0.92)',
              border: '1px solid rgba(107, 142, 35, 0.3)',
              borderRadius: '16px',
              padding: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <BookOpen size={20} color="#d4a574" />
                <span style={{ color: '#d4a574', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                  EXPERT TIP
                </span>
              </div>
              <h4 style={{ color: '#f5f1e8', fontSize: '1.05rem', marginBottom: '12px', lineHeight: 1.4 }}>
                Optimizing Nitrogen with Soil Testing
              </h4>
              <p style={{ color: '#c4b5a0', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
                Save up to 20% on fertilizer costs by timing application exactly with the crop growth phase...
              </p>
              <div style={{ color: '#6b5d4f', fontSize: '0.8rem' }}>By Expert Advice</div>
            </div>

            <div style={{
              background: 'rgba(42, 35, 28, 0.92)',
              border: '1px solid rgba(107, 142, 35, 0.3)',
              borderRadius: '16px',
              padding: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Leaf size={20} color="#5a8f3a" />
                <span style={{ color: '#5a8f3a', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                  SUSTAINABLE FARMING
                </span>
              </div>
              <h4 style={{ color: '#f5f1e8', fontSize: '1.05rem', marginBottom: '12px', lineHeight: 1.4 }}>
                Vertical Multicropping Guide
              </h4>
              <p style={{ color: '#c4b5a0', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
                Maximizing land utility through layered cropping of pulses and cereals. Success stories from Satara...
              </p>
              <div style={{ color: '#6b5d4f', fontSize: '0.8rem' }}>By Eco Farming</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SimpleHomePage;
