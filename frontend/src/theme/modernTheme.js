// Modern Design System for KrushiSahayak
// Dark theme with blue/purple accents and glassmorphism

export const modernColors = {
  // Background
  bgPrimary: '#0a0e1a',
  bgSecondary: '#111827',
  bgCard: 'rgba(17, 24, 39, 0.8)',
  bgCardHover: 'rgba(17, 24, 39, 0.95)',
  
  // Accent Colors
  primary: '#3b82f6', // Blue
  primaryLight: '#60a5fa',
  primaryDark: '#2563eb',
  
  secondary: '#8b5cf6', // Purple
  secondaryLight: '#a78bfa',
  secondaryDark: '#7c3aed',
  
  accent: '#06b6d4', // Cyan
  accentLight: '#22d3ee',
  
  // Status Colors
  success: '#10b981',
  successLight: '#34d399',
  warning: '#f59e0b',
  warningLight: '#fbbf24',
  error: '#ef4444',
  errorLight: '#f87171',
  info: '#3b82f6',
  
  // Text Colors
  textPrimary: '#f9fafb',
  textSecondary: '#d1d5db',
  textMuted: '#9ca3af',
  textDim: '#6b7280',
  
  // Border & Divider
  border: 'rgba(255, 255, 255, 0.1)',
  borderLight: 'rgba(255, 255, 255, 0.05)',
  divider: 'rgba(255, 255, 255, 0.08)',
  
  // Glassmorphism
  glass: 'rgba(17, 24, 39, 0.7)',
  glassLight: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  
  // Gradients
  gradientPrimary: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  gradientSuccess: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
  gradientWarning: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  gradientDark: 'linear-gradient(180deg, rgba(17, 24, 39, 0) 0%, rgba(17, 24, 39, 0.8) 100%)',
};

export const modernShadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  glow: '0 0 20px rgba(59, 130, 246, 0.3)',
  glowPurple: '0 0 20px rgba(139, 92, 246, 0.3)',
  glowSuccess: '0 0 20px rgba(16, 185, 129, 0.3)',
};

export const modernSpacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

export const modernBorderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
};

export const modernTypography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
};

// Card Styles
export const modernCard = {
  base: {
    background: modernColors.bgCard,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${modernColors.glassBorder}`,
    borderRadius: modernBorderRadius.lg,
    padding: modernSpacing.lg,
    transition: 'all 0.3s ease',
  },
  hover: {
    background: modernColors.bgCardHover,
    boxShadow: modernShadows.lg,
    transform: 'translateY(-2px)',
  },
};

// Button Styles
export const modernButton = {
  primary: {
    background: modernColors.gradientPrimary,
    color: modernColors.textPrimary,
    border: 'none',
    borderRadius: modernBorderRadius.md,
    padding: `${modernSpacing.sm} ${modernSpacing.lg}`,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: modernShadows.md,
  },
  secondary: {
    background: 'transparent',
    color: modernColors.primary,
    border: `1px solid ${modernColors.primary}`,
    borderRadius: modernBorderRadius.md,
    padding: `${modernSpacing.sm} ${modernSpacing.lg}`,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  ghost: {
    background: 'transparent',
    color: modernColors.textSecondary,
    border: 'none',
    borderRadius: modernBorderRadius.md,
    padding: `${modernSpacing.sm} ${modernSpacing.lg}`,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

// Badge Styles
export const modernBadge = {
  success: {
    background: 'rgba(16, 185, 129, 0.1)',
    color: modernColors.success,
    border: `1px solid rgba(16, 185, 129, 0.3)`,
    borderRadius: modernBorderRadius.full,
    padding: `${modernSpacing.xs} ${modernSpacing.md}`,
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  warning: {
    background: 'rgba(245, 158, 11, 0.1)',
    color: modernColors.warning,
    border: `1px solid rgba(245, 158, 11, 0.3)`,
    borderRadius: modernBorderRadius.full,
    padding: `${modernSpacing.xs} ${modernSpacing.md}`,
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  error: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: modernColors.error,
    border: `1px solid rgba(239, 68, 68, 0.3)`,
    borderRadius: modernBorderRadius.full,
    padding: `${modernSpacing.xs} ${modernSpacing.md}`,
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  info: {
    background: 'rgba(59, 130, 246, 0.1)',
    color: modernColors.info,
    border: `1px solid rgba(59, 130, 246, 0.3)`,
    borderRadius: modernBorderRadius.full,
    padding: `${modernSpacing.xs} ${modernSpacing.md}`,
    fontSize: '0.75rem',
    fontWeight: 600,
  },
};

// Animation Keyframes
export const modernAnimations = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  .fade-in {
    animation: fadeIn 0.5s ease-out;
  }

  .slide-up {
    animation: slideUp 0.5s ease-out;
  }

  .slide-down {
    animation: slideDown 0.5s ease-out;
  }

  .scale-in {
    animation: scaleIn 0.3s ease-out;
  }

  .pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`;
