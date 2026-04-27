import React, { useState, useEffect } from 'react';
import {
  Dashboard as DashboardIcon,
  Agriculture,
  Notifications,
  TrendingUp,
  TrendingDown,
  BugReport,
  Thunderstorm,
  Warning,
  Psychology,
  MonetizationOn,
  Eco,
  FilterList,
  Sort,
  ArrowForward,
} from '@mui/icons-material';
import { modernColors, modernCard, modernBadge, modernSpacing, modernBorderRadius, modernShadows } from '../theme/modernTheme';

function ModernDashboard() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'pest',
      severity: 'high',
      title: 'Spodoptera Frugiperda Outbreak',
      description: 'Early detection of Fall Armyworm reported in neighboring districts. Immediate inspection of maize crops recommended.',
      time: '2h ago',
      icon: BugReport,
      color: modernColors.error,
    },
    {
      id: 2,
      type: 'weather',
      severity: 'warning',
      title: 'Unseasonal Hailstorm Warning',
      description: 'Severe hail expected within 48 hours across the Marathwada region. Cover harvest-ready produce immediately.',
      time: '5h ago',
      icon: Thunderstorm,
      color: modernColors.warning,
    },
  ]);

  const [marketData, setMarketData] = useState([
    { name: 'Wheat Futures', change: '+4.2%', trend: 'up', color: modernColors.success },
    { name: 'Soybean Oil', change: '-1.8%', trend: 'down', color: modernColors.error },
    { name: 'Cotton Export', change: '+2.5%', trend: 'up', color: modernColors.success },
  ]);

  const [news, setNews] = useState([
    {
      id: 1,
      category: 'Government Schemes',
      title: 'New PM-Kisan Digital Subsidy for Drip Irrigation Sensors',
      description: 'The central government has announced an additional 15% subsidy for farmers implementing IoT-based soil moisture sensors and automated drip controls.',
      source: 'AgriDept Insights',
      icon: MonetizationOn,
      color: modernColors.primary,
    },
    {
      id: 2,
      category: 'Expert Tip',
      title: 'Optimizing Nitrogen with Soil Testing',
      description: 'Save up to 20% on fertilizer costs by timing application exactly with the crop growth phase...',
      source: 'Expert Advice',
      icon: Psychology,
      color: modernColors.secondary,
    },
    {
      id: 3,
      category: 'Sustainable Farming',
      title: 'Vertical Multicropping Guide',
      description: 'Maximizing land utility through layered cropping of pulses and cereals. Success stories from Satara...',
      source: 'Eco Farming',
      icon: Eco,
      color: modernColors.success,
    },
  ]);

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      padding: modernSpacing.lg,
      maxWidth: '1400px',
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{
        marginBottom: modernSpacing.xl,
        animation: 'fadeIn 0.5s ease-out',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: modernSpacing.md,
          marginBottom: modernSpacing.sm,
        }}>
          <DashboardIcon style={{ fontSize: '2rem', color: modernColors.primary }} />
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: modernColors.textPrimary,
            margin: 0,
          }}>
            LIVE INTELLIGENCE
          </h1>
        </div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: modernColors.textPrimary,
          margin: `${modernSpacing.md} 0 ${modernSpacing.sm} 0`,
        }}>
          Agricultural Intelligence Feed
        </h2>
        <p style={{
          color: modernColors.textMuted,
          fontSize: '0.95rem',
          margin: 0,
        }}>
          Real-time localized alerts and global agricultural insights tailored for your specific farm coordinates.
        </p>
      </div>

      {/* Critical Alerts Section */}
      <div style={{
        marginBottom: modernSpacing.xl,
        animation: 'slideUp 0.6s ease-out',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: modernSpacing.lg,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: modernSpacing.md }}>
            <Warning style={{ fontSize: '1.5rem', color: modernColors.warning }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: modernColors.textPrimary,
              margin: 0,
            }}>
              Critical Alerts
            </h3>
          </div>
          <span style={{
            ...modernBadge.error,
            fontSize: '0.85rem',
          }}>
            {alerts.length} NEW ALERTS TODAY
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: modernSpacing.lg,
        }}>
          {alerts.map((alert, index) => {
            const Icon = alert.icon;
            return (
              <div
                key={alert.id}
                style={{
                  ...modernCard.base,
                  borderLeft: `4px solid ${alert.color}`,
                  animation: `slideUp 0.6s ease-out ${index * 0.1}s backwards`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = modernShadows.xl;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: modernSpacing.md,
                  marginBottom: modernSpacing.md,
                }}>
                  <div style={{
                    background: `${alert.color}20`,
                    borderRadius: modernBorderRadius.md,
                    padding: modernSpacing.sm,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon style={{ fontSize: '1.5rem', color: alert.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: modernSpacing.sm,
                      marginBottom: modernSpacing.xs,
                    }}>
                      <span style={{
                        ...modernBadge[alert.severity === 'high' ? 'error' : 'warning'],
                        fontSize: '0.7rem',
                        padding: `2px ${modernSpacing.sm}`,
                      }}>
                        {alert.severity === 'high' ? 'High Risk' : 'Weather Warning'}
                      </span>
                      <span style={{
                        color: modernColors.textDim,
                        fontSize: '0.8rem',
                      }}>
                        {alert.time}
                      </span>
                    </div>
                    <h4 style={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: modernColors.textPrimary,
                      margin: `${modernSpacing.xs} 0`,
                    }}>
                      {alert.title}
                    </h4>
                    <p style={{
                      color: modernColors.textSecondary,
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      margin: 0,
                    }}>
                      {alert.description}
                    </p>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  gap: modernSpacing.md,
                  marginTop: modernSpacing.md,
                }}>
                  <button style={{
                    background: modernColors.gradientPrimary,
                    color: modernColors.textPrimary,
                    border: 'none',
                    borderRadius: modernBorderRadius.md,
                    padding: `${modernSpacing.sm} ${modernSpacing.lg}`,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    flex: 1,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    View Action Plan
                  </button>
                  <button style={{
                    background: 'transparent',
                    color: modernColors.textMuted,
                    border: `1px solid ${modernColors.border}`,
                    borderRadius: modernBorderRadius.md,
                    padding: `${modernSpacing.sm} ${modernSpacing.lg}`,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = modernColors.textMuted;
                    e.currentTarget.style.color = modernColors.textPrimary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = modernColors.border;
                    e.currentTarget.style.color = modernColors.textMuted;
                  }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Market Intelligence */}
      <div style={{
        ...modernCard.base,
        marginBottom: modernSpacing.xl,
        animation: 'slideUp 0.7s ease-out',
      }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          color: modernColors.textPrimary,
          marginBottom: modernSpacing.lg,
        }}>
          Global Market Shifts
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: modernSpacing.lg,
          marginBottom: modernSpacing.lg,
        }}>
          {marketData.map((item, index) => (
            <div key={index} style={{
              textAlign: 'center',
              padding: modernSpacing.md,
              background: modernColors.glassLight,
              borderRadius: modernBorderRadius.md,
              border: `1px solid ${modernColors.borderLight}`,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: modernSpacing.xs,
                marginBottom: modernSpacing.xs,
              }}>
                {item.trend === 'up' ? (
                  <TrendingUp style={{ fontSize: '1.2rem', color: item.color }} />
                ) : (
                  <TrendingDown style={{ fontSize: '1.2rem', color: item.color }} />
                )}
                <span style={{
                  fontSize: '0.85rem',
                  color: modernColors.textSecondary,
                  fontWeight: 500,
                }}>
                  {item.name}
                </span>
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: item.color,
              }}>
                {item.change}
              </div>
            </div>
          ))}
        </div>
        <p style={{
          color: modernColors.textSecondary,
          fontSize: '0.9rem',
          lineHeight: 1.6,
          margin: 0,
        }}>
          Global supply chain disruptions are pushing grain prices higher. Consider holding stock for late-month sale.
        </p>
      </div>

      {/* Agricultural News & Trends */}
      <div style={{
        animation: 'slideUp 0.8s ease-out',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: modernSpacing.lg,
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: modernColors.textPrimary,
            margin: 0,
          }}>
            Agricultural News & Trends
          </h3>
          <div style={{ display: 'flex', gap: modernSpacing.sm }}>
            <button style={{
              background: 'transparent',
              color: modernColors.textMuted,
              border: `1px solid ${modernColors.border}`,
              borderRadius: modernBorderRadius.md,
              padding: modernSpacing.sm,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: modernSpacing.xs,
            }}>
              <FilterList style={{ fontSize: '1.2rem' }} />
            </button>
            <button style={{
              background: 'transparent',
              color: modernColors.textMuted,
              border: `1px solid ${modernColors.border}`,
              borderRadius: modernBorderRadius.md,
              padding: modernSpacing.sm,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: modernSpacing.xs,
            }}>
              <Sort style={{ fontSize: '1.2rem' }} />
            </button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: modernSpacing.lg,
        }}>
          {news.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                style={{
                  ...modernCard.base,
                  animation: `slideUp 0.8s ease-out ${index * 0.1}s backwards`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = modernShadows.lg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: modernSpacing.sm,
                  marginBottom: modernSpacing.md,
                }}>
                  <Icon style={{ fontSize: '1.2rem', color: item.color }} />
                  <span style={{
                    color: item.color,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    {item.category}
                  </span>
                </div>
                <h4 style={{
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: modernColors.textPrimary,
                  marginBottom: modernSpacing.sm,
                  lineHeight: 1.4,
                }}>
                  {item.title}
                </h4>
                <p style={{
                  color: modernColors.textSecondary,
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  marginBottom: modernSpacing.md,
                }}>
                  {item.description}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: modernSpacing.md,
                  borderTop: `1px solid ${modernColors.divider}`,
                }}>
                  <span style={{
                    color: modernColors.textDim,
                    fontSize: '0.8rem',
                  }}>
                    By {item.source}
                  </span>
                  <button style={{
                    background: 'transparent',
                    color: modernColors.primary,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: modernSpacing.xs,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    padding: 0,
                  }}>
                    Read More
                    <ArrowForward style={{ fontSize: '1rem' }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ModernDashboard;
