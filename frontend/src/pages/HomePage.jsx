import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, TrendingUp, TrendingDown, AlertTriangle, Cloud, Leaf, DollarSign, BookOpen, ExternalLink, Calendar, User, Filter } from 'lucide-react';

function HomePage() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All News' },
    { value: 'Government Schemes', label: 'Government' },
    { value: 'AgriTech', label: 'Technology' },
    { value: 'Sustainable Farming', label: 'Sustainable' },
    { value: 'Market Intelligence', label: 'Market' },
    { value: 'Weather & Climate', label: 'Weather' },
    { value: 'Crop Protection', label: 'Protection' },
  ];

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const url = selectedCategory === 'all' 
        ? 'http://localhost:8000/news?limit=12'
        : `http://localhost:8000/news?category=${encodeURIComponent(selectedCategory)}&limit=12`;
      
      const response = await fetch(url);
      const data = await response.json();
      setNews(data.news || []);
    } catch (error) {
      console.error('Failed to fetch news:', error);
      setNews([]);
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Government Schemes': '#6b8e23',
      'AgriTech': '#3b82f6',
      'Sustainable Farming': '#10b981',
      'Market Intelligence': '#f59e0b',
      'Weather & Climate': '#06b6d4',
      'Crop Protection': '#ef4444',
      'Soil & Fertilizers': '#8b5cf6',
      'General Agriculture': '#d4a574',
    };
    return colors[category] || '#d4a574';
  };

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
            Real-time farming news, market insights, and agricultural intelligence from across India and the world.
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '50px',
        }}>
          <ActionCard
            icon={<Sprout size={48} color="#6b8e23" />}
            title="Crop Recommendation"
            description="Get AI-powered crop suggestions based on your soil"
            onClick={() => navigate('/input')}
            color="rgba(107, 142, 35, 0.15)"
            borderColor="rgba(107, 142, 35, 0.3)"
          />
          <ActionCard
            icon={<Leaf size={48} color="#d4a574" />}
            title="Fertilizer Guide"
            description="Smart fertilizer recommendations with cost analysis"
            onClick={() => navigate('/fertilizer')}
            color="rgba(212, 165, 116, 0.15)"
            borderColor="rgba(212, 165, 116, 0.3)"
          />
          <ActionCard
            icon={<AlertTriangle size={48} color="#ef4444" />}
            title="Disease Detection"
            description="Upload leaf images for instant disease diagnosis"
            onClick={() => navigate('/disease')}
            color="rgba(239, 68, 68, 0.15)"
            borderColor="rgba(239, 68, 68, 0.3)"
          />
          <ActionCard
            icon={<Cloud size={48} color="#f59e0b" />}
            title="Weather Alerts"
            description="Real-time weather updates and warnings"
            onClick={() => navigate('/alerts')}
            color="rgba(245, 158, 11, 0.15)"
            borderColor="rgba(245, 158, 11, 0.3)"
          />
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
            <AlertCard
              type="HIGH RISK"
              title="🐛 Spodoptera Frugiperda Outbreak"
              description="Early detection of Fall Armyworm reported in neighboring districts. Immediate inspection of maize crops recommended."
              time="2h ago"
              color="#ef4444"
            />
            <AlertCard
              type="WEATHER WARNING"
              title="⛈️ Unseasonal Hailstorm Warning"
              description="Severe hail expected within 48 hours across the Marathwada region. Cover harvest-ready produce immediately."
              time="5h ago"
              color="#f59e0b"
            />
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
            <MarketCard name="Wheat Futures" change="+4.2%" trend="up" />
            <MarketCard name="Soybean Oil" change="-1.8%" trend="down" />
            <MarketCard name="Cotton Export" change="+2.5%" trend="up" />
          </div>
          <p style={{ color: '#c4b5a0', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
            Global supply chain disruptions are pushing grain prices higher. Consider holding stock for late-month sale.
          </p>
        </div>

        {/* News Section */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#f5f1e8',
              margin: 0,
            }}>
              📰 Latest Farming News
            </h3>
            
            {/* Category Filter */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  style={{
                    background: selectedCategory === cat.value 
                      ? 'rgba(107, 142, 35, 0.25)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    border: selectedCategory === cat.value
                      ? '1px solid rgba(107, 142, 35, 0.5)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '6px 16px',
                    cursor: 'pointer',
                    color: selectedCategory === cat.value ? '#6b8e23' : '#c4b5a0',
                    fontSize: '0.85rem',
                    fontWeight: selectedCategory === cat.value ? 600 : 400,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== cat.value) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== cat.value) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                border: '4px solid rgba(107, 142, 35, 0.2)',
                borderTop: '4px solid #6b8e23',
                borderRadius: '50%',
                margin: '0 auto 20px',
                animation: 'spin 1s linear infinite',
              }} />
              <p style={{ color: '#c4b5a0' }}>Loading latest farming news...</p>
            </div>
          )}

          {/* News Grid */}
          {!loading && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '24px',
            }}>
              {news.map((article, index) => (
                <NewsCard key={index} article={article} formatDate={formatDate} getCategoryColor={getCategoryColor} />
              ))}
            </div>
          )}

          {/* No News */}
          {!loading && news.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'rgba(42, 35, 28, 0.92)',
              border: '1px solid rgba(107, 142, 35, 0.3)',
              borderRadius: '16px',
            }}>
              <BookOpen size={48} color="#6b8e23" style={{ marginBottom: '16px' }} />
              <h4 style={{ color: '#f5f1e8', marginBottom: '8px' }}>No news found</h4>
              <p style={{ color: '#c4b5a0' }}>Try selecting a different category</p>
            </div>
          )}
        </div>

      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Action Card Component
function ActionCard({ icon, title, description, onClick, color, borderColor }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: color,
        border: `2px solid ${borderColor}`,
        borderRadius: '16px',
        padding: '30px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textAlign: 'center',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = borderColor.replace('0.3', '0.5');
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = borderColor;
      }}
    >
      <div style={{ marginBottom: '16px' }}>{icon}</div>
      <h3 style={{ color: '#f5f1e8', marginBottom: '8px', fontSize: '1.1rem' }}>{title}</h3>
      <p style={{ color: '#b8a896', fontSize: '0.9rem', margin: 0 }}>{description}</p>
    </div>
  );
}

// Alert Card Component
function AlertCard({ type, title, description, time, color }) {
  return (
    <div style={{
      background: 'rgba(42, 35, 28, 0.92)',
      border: `1px solid ${color}40`,
      borderLeft: `4px solid ${color}`,
      borderRadius: '16px',
      padding: '24px',
    }}>
      <div style={{ marginBottom: '12px' }}>
        <span style={{
          background: `${color}33`,
          color: color,
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}>
          {type}
        </span>
        <span style={{ color: '#6b5d4f', fontSize: '0.8rem', marginLeft: '8px' }}>{time}</span>
      </div>
      <h4 style={{ color: '#f5f1e8', fontSize: '1.1rem', marginBottom: '8px' }}>{title}</h4>
      <p style={{ color: '#c4b5a0', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{description}</p>
    </div>
  );
}

// Market Card Component
function MarketCard({ name, change, trend }) {
  const isPositive = trend === 'up';
  const color = isPositive ? '#10b981' : '#ef4444';
  
  return (
    <div style={{
      textAlign: 'center',
      padding: '20px',
      background: `${color}1a`,
      borderRadius: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
        {isPositive ? <TrendingUp size={20} color={color} /> : <TrendingDown size={20} color={color} />}
        <span style={{ fontSize: '0.85rem', color: '#d4a574' }}>{name}</span>
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color }}>{change}</div>
    </div>
  );
}

// News Card Component
function NewsCard({ article, formatDate, getCategoryColor }) {
  const categoryColor = getCategoryColor(article.category);
  
  return (
    <div
      style={{
        background: 'rgba(42, 35, 28, 0.92)',
        border: '1px solid rgba(107, 142, 35, 0.3)',
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      onClick={() => window.open(article.url, '_blank')}
    >
      {/* Image */}
      <div style={{
        width: '100%',
        height: '200px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <img
          src={article.image}
          alt={article.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80';
          }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: categoryColor,
          color: '#fff',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}>
          {article.category}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        <h4 style={{
          color: '#f5f1e8',
          fontSize: '1.05rem',
          marginBottom: '12px',
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {article.title}
        </h4>
        
        <p style={{
          color: '#c4b5a0',
          fontSize: '0.9rem',
          lineHeight: 1.6,
          marginBottom: '16px',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {article.description}
        </p>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '16px',
          borderTop: '1px solid rgba(107, 142, 35, 0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={14} color="#6b5d4f" />
            <span style={{ color: '#6b5d4f', fontSize: '0.8rem' }}>{article.source}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={14} color="#6b5d4f" />
            <span style={{ color: '#6b5d4f', fontSize: '0.8rem' }}>{formatDate(article.published_at)}</span>
          </div>
        </div>

        {/* Read More */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '12px',
          color: '#6b8e23',
          fontSize: '0.85rem',
          fontWeight: 600,
        }}>
          Read Full Article
          <ExternalLink size={14} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
