import React, { useEffect, useState } from 'react';
import { AlertTriangle, CloudRain, Info, Thermometer, Wind, Droplets, RefreshCw, MessageSquare } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';

const SEVERITY_STYLE = {
  High:   { bg: 'rgba(196, 69, 54, 0.15)',   border: '#c44536',   icon: <AlertTriangle size={20} color="#ffb4a8" /> },
  Medium: { bg: 'rgba(232, 168, 56, 0.15)',  border: '#e8a838',   icon: <CloudRain size={20} color="#ffd98e" /> },
  Normal: { bg: 'rgba(107, 142, 35, 0.1)',   border: '#6b8e23',   icon: <Info size={20} color="#b8e994" /> },
  Low:    { bg: 'rgba(107, 142, 35, 0.1)',   border: '#6b8e23',   icon: <Info size={20} color="#b8e994" /> },
};

export default function AlertsPage() {
  const { t } = useLang();
  const [alerts, setAlerts] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneMsg, setPhoneMsg] = useState('');
  const [email, setEmail] = useState('');
  const [emailMsg, setEmailMsg] = useState('');
  const [cityInput, setCityInput] = useState('Pune');

  const fetchAlerts = () => {
    fetch('http://localhost:8000/alerts')
      .then(res => res.json())
      .then(data => { setAlerts(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const fetchWeather = (loc) => {
    if (!loc || !loc.trim()) return;
    setWeatherLoading(true);
    fetch(`http://localhost:8000/weather?location=${encodeURIComponent(loc.trim())}`)
      .then(res => res.json())
      .then(data => { setWeather({ ...data, location: loc.trim() }); setWeatherLoading(false); })
      .catch(() => setWeatherLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
    fetchWeather('Pune');
  }, []);

  const handleRegisterPhone = async () => {
    if (!phone) return;
    
    // Get current location from weather state or use cityInput
    const currentLocation = weather?.location || cityInput || 'Pune';
    
    try {
      const res = await fetch(
        `http://localhost:8000/register-phone?phone=${encodeURIComponent(phone)}&location=${encodeURIComponent(currentLocation)}`, 
        { method: 'POST' }
      );
      const data = await res.json();
      
      if (data.sms_sent) {
        setPhoneMsg(`✅ Registered! SMS sent with current weather for ${currentLocation}.`);
      } else {
        setPhoneMsg(`✅ ${data.message} (SMS not configured)`);
      }
      
      // Show weather info in message
      if (data.current_weather) {
        const w = data.current_weather;
        setTimeout(() => {
          setPhoneMsg(
            `✅ Registered for ${w.location}! Current: ${w.temperature}°C, ${w.condition}. ` +
            `${w.is_severe ? `⚠️ ${w.anomaly}` : 'Weather normal.'}`
          );
        }, 2000);
      }
    } catch {
      setPhoneMsg('❌ Failed to register. Ensure backend is running.');
    }
  };

  const handleRegisterEmail = async () => {
    if (!email) return;
    
    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailMsg('❌ Please enter a valid email address.');
      return;
    }
    
    // Get current location from weather state or use cityInput
    const currentLocation = weather?.location || cityInput || 'Pune';
    
    try {
      const res = await fetch(
        `http://localhost:8000/register-email?email=${encodeURIComponent(email)}&location=${encodeURIComponent(currentLocation)}`, 
        { method: 'POST' }
      );
      const data = await res.json();
      
      if (data.email_sent) {
        setEmailMsg(`✅ Registered! Welcome email sent with current weather for ${currentLocation}.`);
      } else {
        setEmailMsg(`✅ ${data.message}`);
      }
      
      // Show weather info in message
      if (data.current_weather) {
        const w = data.current_weather;
        setTimeout(() => {
          setEmailMsg(
            `✅ Registered for ${w.location}! Current: ${w.temperature}°C, ${w.condition}. ` +
            `${w.is_severe ? `⚠️ ${w.anomaly}` : 'Weather normal.'}`
          );
        }, 2000);
      }
    } catch (error) {
      setEmailMsg('❌ Failed to register. Ensure backend is running and email is configured.');
    }
  };

  if (loading) return <div className="spinner" style={{ margin: '100px auto' }} />;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>

      {/* Live Weather Card */}
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#f5f1e8' }}>
            <CloudRain size={24} color="#d4a574" /> {t('liveWeather')}
          </h2>
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
            <input
              placeholder="Enter city..."
              value={cityInput}
              onChange={e => setCityInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchWeather(cityInput)}
              style={{ background: 'rgba(255, 248, 240, 0.08)', border: '2px solid rgba(139, 105, 68, 0.3)', borderRadius: '10px', padding: '8px 14px', color: '#f5f1e8', fontSize: '0.95rem', minWidth: '180px' }}
              list="mh-cities"
              placeholder={t('enterCity')}
            />
            <datalist id="mh-cities">
              {['Pune','Nashik','Nagpur','Ratnagiri','Kolhapur','Satara','Solapur','Ahmednagar','Jalgaon','Amravati','Latur','Nanded','Beed','Palghar','Mumbai','Sindhudurg','Sangli','Wardha','Yavatmal','Akola','Dhule'].map(c => <option key={c} value={c} />)}
            </datalist>
            <button onClick={() => fetchWeather(cityInput)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              {t('searchCity')}
            </button>
            <button onClick={() => fetchWeather(cityInput)} className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {weatherLoading ? (
          <div className="spinner" style={{ margin: '20px auto' }} />
        ) : weather ? (
          <div>
            <p style={{ color: '#d4a574', marginBottom: '1.2rem', fontSize: '1rem', fontWeight: 500 }}>
              📍 {weather.location} &nbsp;·&nbsp; {weather.condition}
              {weather.is_severe && (
                <span style={{ marginLeft: '12px', background: 'rgba(196, 69, 54, 0.25)', color: '#ffb4a8', borderRadius: '14px', padding: '4px 12px', fontSize: '0.85rem', fontWeight: 700, border: '2px solid rgba(196, 69, 54, 0.4)' }}>
                  ⚠️ {weather.severity} Alert
                </span>
              )}
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <WeatherStat icon={<Thermometer size={20} color="#ffb4a8" />} label={t('temperature')} value={`${weather.temperature}°C`} />
              <WeatherStat icon={<CloudRain size={20} color="#a5b4fc" />} label={t('rainfall')} value={`${weather.rainfall}mm/hr`} />
              <WeatherStat icon={<Droplets size={20} color="#7dd3fc" />} label={t('humidity')} value={`${weather.humidity}%`} />
              <WeatherStat icon={<Wind size={20} color="#b8e994" />} label={t('windSpeed')} value={`${weather.wind_speed}km/h`} />
            </div>
            {weather.is_severe && weather.anomaly !== 'None' && (
              <div style={{ marginTop: '1.2rem', padding: '12px 16px', background: 'rgba(196, 69, 54, 0.15)', border: '2px solid rgba(196, 69, 54, 0.4)', borderRadius: '10px', color: '#ffb4a8', fontSize: '0.95rem', fontWeight: 500 }}>
                ⚠️ {weather.anomaly} — SMS alert will be sent to registered numbers.
              </div>
            )}
          </div>
        ) : (
          <p style={{ color: '#d4a574', fontSize: '1rem' }}>Enter a city above to check weather.</p>
        )}
      </div>

      {/* SMS Registration */}
      <div className="glass-panel" style={{ marginBottom: '2rem', background: 'rgba(107, 142, 35, 0.1)', border: '2px solid rgba(107, 142, 35, 0.3)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem', color: '#b8e994' }}>
          <MessageSquare size={20} color="#b8e994" /> {t('smsTitle')}
        </h3>
        <p style={{ color: '#d4a574', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: '1.6' }}>
          {t('smsDesc')}
        </p>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <input
            type="tel"
            placeholder={t('phonePlaceholder')}
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={{ flex: 1, minWidth: '220px', background: 'rgba(255, 248, 240, 0.08)', border: '2px solid rgba(139, 105, 68, 0.3)', borderRadius: '10px', padding: '10px 16px', color: '#f5f1e8', fontSize: '0.95rem' }}
          />
          <button onClick={handleRegisterPhone} className="btn btn-primary" style={{ padding: '10px 24px' }}>
            {t('btnRegister')}
          </button>
        </div>
        {phoneMsg && <p style={{ marginTop: '0.8rem', color: '#b8e994', fontSize: '0.95rem', fontWeight: 500 }}>✅ {phoneMsg}</p>}
        <p style={{ marginTop: '1rem', color: '#d4a574', fontSize: '0.85rem', lineHeight: '1.5' }}>
          {t('smsNote')}
        </p>
      </div>

      {/* Email Registration - Works in India! */}
      <div className="glass-panel" style={{ marginBottom: '2rem', background: 'rgba(59, 130, 246, 0.1)', border: '2px solid rgba(59, 130, 246, 0.3)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem', color: '#a5b4fc' }}>
          📧 Email Weather Alerts (Recommended for India 🇮🇳)
        </h3>
        <p style={{ color: '#d4a574', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: '1.6' }}>
          Get detailed weather alerts via email with beautiful formatting. Works instantly in India without any restrictions! 🎉
        </p>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <input
            type="email"
            placeholder="your.email@gmail.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRegisterEmail()}
            style={{ flex: 1, minWidth: '220px', background: 'rgba(255, 248, 240, 0.08)', border: '2px solid rgba(139, 105, 68, 0.3)', borderRadius: '10px', padding: '10px 16px', color: '#f5f1e8', fontSize: '0.95rem' }}
          />
          <button onClick={handleRegisterEmail} className="btn btn-primary" style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
            Register Email
          </button>
        </div>
        {emailMsg && <p style={{ marginTop: '0.8rem', color: emailMsg.includes('❌') ? '#ffb4a8' : '#a5b4fc', fontSize: '0.95rem', fontWeight: 500 }}>{emailMsg}</p>}
        <p style={{ marginTop: '1rem', color: '#d4a574', fontSize: '0.85rem', lineHeight: '1.5' }}>
          ✅ No restrictions • ✅ Rich HTML formatting • ✅ Instant delivery • ✅ Free (100-500 emails/day)
        </p>
      </div>

      {/* Alerts List */}
      <div className="glass-panel">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', color: '#f5f1e8' }}>
          <AlertTriangle size={22} color="#ffd98e" /> {t('alertsTitle')}
        </h2>

        {alerts.length === 0 ? (
          <p style={{ color: '#d4a574', fontSize: '1rem' }}>{t('noAlerts')}</p>
        ) : (
          alerts.map((a, idx) => {
            const style = SEVERITY_STYLE[a.severity] || SEVERITY_STYLE.Normal;
            return (
              <div key={idx} style={{
                padding: '1.4rem',
                background: style.bg,
                borderLeft: `5px solid ${style.border}`,
                borderRadius: '0 12px 12px 0',
                marginBottom: '1.2rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.2rem',
                border: `2px solid ${style.border}`,
                borderLeft: `5px solid ${style.border}`,
              }}>
                {style.icon}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <h4 style={{ margin: 0, color: '#f5f1e8', fontSize: '1.1rem' }}>{a.alert_type} Alert</h4>
                    <span style={{
                      background: a.severity === 'High' ? 'rgba(196, 69, 54, 0.25)' : 'rgba(232, 168, 56, 0.25)',
                      color: a.severity === 'High' ? '#ffb4a8' : '#ffd98e',
                      borderRadius: '14px', padding: '3px 10px', fontSize: '0.8rem', fontWeight: 700,
                      border: a.severity === 'High' ? '2px solid rgba(196, 69, 54, 0.4)' : '2px solid rgba(232, 168, 56, 0.4)'
                    }}>{a.severity}</span>
                  </div>
                  <p style={{ color: '#f5f1e8', margin: '0 0 8px', fontSize: '1rem', lineHeight: '1.6' }}>{a.message}</p>
                  <span style={{ fontSize: '0.85rem', color: '#d4a574' }}>
                    {new Date(a.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function WeatherStat({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255, 248, 240, 0.06)', borderRadius: '12px', padding: '12px 18px', minWidth: '140px', border: '2px solid rgba(139, 105, 68, 0.2)' }}>
      {icon}
      <div>
        <div style={{ fontSize: '0.8rem', color: '#d4a574', marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f5f1e8' }}>{value}</div>
      </div>
    </div>
  );
}
