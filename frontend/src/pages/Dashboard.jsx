import React, { useEffect, useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, AlertTriangle, Leaf, Clock, CheckCircle2 } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';

const PRIORITY_STYLE_BASE = {
  high:   { color: '#ffb4a8', bg: 'rgba(196, 69, 54, 0.15)'  },
  medium: { color: '#ffd98e', bg: 'rgba(232, 168, 56, 0.15)' },
  low:    { color: '#b8e994', bg: 'rgba(107, 142, 35, 0.15)' },
};

const PHASE_COLORS = [
  '#a5b4fc', '#b8e994', '#ffd98e', '#ffb4a8', '#dda0dd', '#7dd3fc'
];

function PriorityBadge({ priority }) {
  const { t } = useLang();
  const s = PRIORITY_STYLE_BASE[priority?.toLowerCase()] || PRIORITY_STYLE_BASE.medium;
  const label = t(priority?.toLowerCase() || 'medium');
  return (
    <span style={{
      background: s.bg, color: s.color,
      border: `2px solid ${s.color}`,
      borderRadius: '20px', padding: '3px 12px',
      fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.04em'
    }}>
      {label}
    </span>
  );
}

function DayCard({ dayData }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const p = PRIORITY_STYLE_BASE[dayData.priority?.toLowerCase()] || PRIORITY_STYLE_BASE.medium;

  return (
    <div style={{
      background: 'rgba(255, 248, 240, 0.04)',
      border: `2px solid rgba(139, 105, 68, 0.3)`,
      borderLeft: `4px solid ${p.color}`,
      borderRadius: '12px',
      marginBottom: '12px',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s, transform 0.2s',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
      e.currentTarget.style.transform = 'translateX(4px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'translateX(0)';
    }}
    >
      {/* Header row */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Day circle */}
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: p.bg, border: `2px solid ${p.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: p.color }}>
              D{dayData.day}
            </span>
          </div>
          {/* First task preview */}
          <div>
            <span style={{ fontWeight: 600, fontSize: '0.92rem', color: '#f5f1e8' }}>
              {dayData.tasks[0]}
            </span>
            {dayData.tasks.length > 1 && (
              <span style={{ color: '#d4a574', fontSize: '0.85rem', marginLeft: '6px' }}>
                +{dayData.tasks.length - 1} {t('more')}
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <PriorityBadge priority={dayData.priority} />
          {open ? <ChevronUp size={16} color="#d4a574" /> : <ChevronDown size={16} color="#d4a574" />}
        </div>
      </div>

      {/* Expanded content */}
      {open && (
        <div style={{ padding: '0 16px 14px', borderTop: '2px solid rgba(139, 105, 68, 0.2)' }}>
          <div style={{ paddingTop: '12px' }}>
            <p style={{ fontSize: '0.85rem', color: '#d4a574', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {t('tasksFor')} {dayData.day}
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {dayData.tasks.map((task, i) => (
                <li key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '8px',
                  padding: '6px 0', borderBottom: i < dayData.tasks.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                }}>
                  <CheckCircle2 size={15} color={p.color} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem', color: '#f5f1e8', lineHeight: '1.5' }}>{task}</span>
                </li>
              ))}
            </ul>
            {dayData.notes && (
              <div style={{
                marginTop: '10px', padding: '8px 12px',
                background: 'rgba(232, 168, 56, 0.1)', borderRadius: '8px',
                display: 'flex', gap: '8px', alignItems: 'flex-start',
                border: '1px solid rgba(232, 168, 56, 0.3)'
              }}>
                <AlertTriangle size={14} color="#ffd98e" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', color: '#ffd98e', lineHeight: '1.5' }}>{dayData.notes}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PhaseSection({ phase, phaseData, colorIdx }) {
  const [collapsed, setCollapsed] = useState(false);
  const color = PHASE_COLORS[colorIdx % PHASE_COLORS.length];
  const days = phaseData.days || [];

  return (
    <div style={{
      marginBottom: '2rem',
      background: 'rgba(255, 248, 240, 0.03)',
      border: `2px solid rgba(139, 105, 68, 0.3)`,
      borderRadius: '16px',
      overflow: 'hidden',
    }}>
      {/* Phase header */}
      <div
        onClick={() => setCollapsed(c => !c)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', cursor: 'pointer',
          background: `linear-gradient(90deg, ${color}18, transparent)`,
          borderBottom: collapsed ? 'none' : `1px solid rgba(255,255,255,0.07)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: color, boxShadow: `0 0 8px ${color}`
          }} />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color, fontWeight: 700 }}>{phase}</h3>
            <span style={{ fontSize: '0.9rem', color: '#d4a574', fontWeight: 500 }}>
              {phaseData.week_range} &nbsp;·&nbsp; {days.length} activity days
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: `${color}30`, color, border: `2px solid ${color}`,
            borderRadius: '20px', padding: '4px 14px', fontSize: '0.8rem', fontWeight: 700
          }}>
            Day {days[0]?.day} – Day {days[days.length - 1]?.day}
          </span>
          {collapsed
            ? <ChevronDown size={18} color="#d4a574" />
            : <ChevronUp size={18} color="#d4a574" />}
        </div>
      </div>

      {/* Days list */}
      {!collapsed && (
        <div style={{ padding: '16px 20px' }}>
          {days.map((dayData, i) => (
            <DayCard key={i} dayData={dayData} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { t } = useLang();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try localStorage first (freshly generated plan)
    const stored = localStorage.getItem('farmingPlan');
    if (stored) {
      try {
        setPlan(JSON.parse(stored));
        setLoading(false);
        return;
      } catch (_) {}
    }
    // Fallback: fetch tasks from DB and show basic view
    fetch('http://localhost:8000/tasks')
      .then(res => res.json())
      .then(tasks => {
        if (tasks.length > 0) {
          // Reconstruct a minimal plan from DB tasks
          const phaseMap = {};
          tasks.forEach(t => {
            if (!phaseMap[t.phase]) phaseMap[t.phase] = { phase: t.phase, week_range: '', days: [] };
            phaseMap[t.phase].days.push({
              day: t.day_offset,
              tasks: t.task_name.split(' | '),
              notes: '',
              priority: t.priority
            });
          });
          setPlan({ crop: 'Your Crop', total_days: null, phases: Object.values(phaseMap), alerts: [] });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" style={{ margin: '100px auto' }} />;

  if (!plan || !plan.phases || plan.phases.length === 0) {
    return (
      <div className="grid">
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem' }}>
          <Calendar size={48} color="#d4a574" style={{ marginBottom: '1rem' }} />
          <h2>{t('noPlan')}</h2>
          <p style={{ color: '#d4a574', fontSize: '1rem' }}>{t('noPlanDesc')}</p>
        </div>
      </div>
    );
  }

  const totalTasks = plan.phases.reduce((sum, p) => sum + (p.days?.length || 0), 0);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>

      {/* Header card */}
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Leaf size={26} color="#fff" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#f5f1e8' }}>{plan.crop} {t('farmingPlan')}</h2>
              <span style={{ color: '#d4a574', fontSize: '0.95rem' }}>
                {t('dayByDay')}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {plan.total_days && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#b8e994' }}>{plan.total_days}</div>
                <div style={{ fontSize: '0.8rem', color: '#d4a574' }}>{t('totalDays')}</div>
              </div>
            )}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d4a574' }}>{plan.phases.length}</div>
              <div style={{ fontSize: '0.8rem', color: '#d4a574' }}>{t('phases')}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffd98e' }}>{totalTasks}</div>
              <div style={{ fontSize: '0.8rem', color: '#d4a574' }}>{t('activityDays')}</div>
            </div>
          </div>
        </div>

        {/* Progress bar across phases */}
        {plan.total_days && (
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', height: '8px', borderRadius: '999px', overflow: 'hidden', gap: '2px' }}>
              {plan.phases.map((ph, i) => {
                const days = ph.days || [];
                const span = days.length > 0
                  ? (days[days.length - 1].day - days[0].day + 1)
                  : 1;
                const pct = (span / plan.total_days) * 100;
                return (
                  <div key={i} style={{
                    flex: `0 0 ${pct}%`,
                    background: PHASE_COLORS[i % PHASE_COLORS.length],
                    borderRadius: '999px',
                    minWidth: '4px'
                  }} title={ph.phase} />
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '8px', flexWrap: 'wrap' }}>
              {plan.phases.map((ph, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#d4a574' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: PHASE_COLORS[i % PHASE_COLORS.length], display: 'inline-block' }} />
                  {ph.phase}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Alerts */}
      {plan.alerts && plan.alerts.length > 0 && (
        <div className="glass-panel" style={{ marginBottom: '2rem', background: 'rgba(232, 168, 56, 0.1)', border: '2px solid rgba(232, 168, 56, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem' }}>
            <AlertTriangle size={20} color="#ffd98e" />
            <span style={{ fontWeight: 700, color: '#ffd98e', fontSize: '1rem' }}>{t('importantAlerts')}</span>
          </div>
          {plan.alerts.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', padding: '8px 0', borderTop: i > 0 ? '1px solid rgba(232, 168, 56, 0.2)' : 'none' }}>
              <span style={{ color: '#ffd98e', flexShrink: 0, fontSize: '1.2rem' }}>•</span>
              <span style={{ fontSize: '0.95rem', color: '#f5f1e8', lineHeight: '1.6' }}>{a}</span>
            </div>
          ))}
        </div>
      )}

      {/* Phase sections */}
      {plan.phases.map((phaseData, i) => (
        <PhaseSection
          key={i}
          phase={phaseData.phase}
          phaseData={phaseData}
          colorIdx={i}
        />
      ))}

    </div>
  );
}
