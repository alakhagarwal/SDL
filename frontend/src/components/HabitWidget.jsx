import React, { useState, useEffect } from 'react';
import api from '../api';
import { Flame, Moon, Droplets, Smile, Dumbbell, Sparkles, Check, Lock, ChevronRight } from 'lucide-react';

const HabitWidget = () => {
  const [trends, setTrends] = useState(null);
  const [sleepHours, setSleepHours] = useState(7.0);
  const [waterIntake, setWaterIntake] = useState(2.5);
  const [moodScore, setMoodScore] = useState(4);
  const [workoutMinutes, setWorkoutMinutes] = useState(20);
  const [journalTag, setJournalTag] = useState('');
  const [isLoggedToday, setIsLoggedToday] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const fetchTrends = () => {
    api.get('/habits/trends')
      .then((res) => {
        setTrends(res.data);
        const todayStr = new Date().toISOString().split('T')[0];
        const logged = res.data?.recentLogs?.some((l) => l.logDate === todayStr);
        setIsLoggedToday(logged);
      })
      .catch((err) => console.error('Failed to fetch habit trends', err));
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const handleLog = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/habits/log', {
        sleepHours: Number(sleepHours),
        waterIntakeLiters: Number(waterIntake),
        moodScore: Number(moodScore),
        workoutMinutes: Number(workoutMinutes),
        journalTag: journalTag || 'Logged daily self-care check-in',
      });
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
      fetchTrends();
    } catch (err) {
      console.error('Failed to log habit', err);
    } finally {
      setSaving(false);
    }
  };

  const getMoodEmoji = (score) => {
    switch (score) {
      case 1: return '😞 Deep Distress';
      case 2: return '🙁 Low Energy';
      case 3: return '😐 Neutral / Coping';
      case 4: return '🙂 Good & Balanced';
      case 5: return '🌟 Thriving / Energized';
      default: return '🙂 Good';
    }
  };

  return (
    <div className="card" style={{ height: '100%' }}>
      {/* Widget Header with Streak Flame */}
      <div className="card-header">
        <div>
          <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0 }}>
            <span>Daily Self-Care & Habit Tracker</span>
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            Private Longitudinal Wellness & Mindful Journal
          </p>
        </div>

        {/* Streak Counter Flame */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
            border: '1px solid #fed7aa',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            color: '#c2410c',
            fontWeight: 700,
            fontSize: '0.82rem',
            boxShadow: '0 2px 4px rgba(234, 88, 12, 0.1)',
          }}
        >
          <Flame size={18} fill="#f97316" color="#ea580c" />
          <span>{trends?.currentStreak || 0} Day Streak</span>
        </div>
      </div>

      {successToast && (
        <div
          style={{
            padding: '0.65rem 1rem',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '8px',
            color: '#065f46',
            fontSize: '0.82rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <Check size={16} />
          <span>Today's self-care habits saved & streak updated!</span>
        </div>
      )}

      {/* Quick Daily Check-In Form */}
      <form onSubmit={handleLog} style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem', marginBottom: '0.85rem' }}>
          {/* Sleep Hours */}
          <div
            style={{
              padding: '0.75rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4338ca', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              <Moon size={15} />
              <span>Sleep: {sleepHours} hrs</span>
            </div>
            <input
              type="range"
              min="0"
              max="14"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              style={{ width: '100%', accentColor: '#4338ca' }}
            />
          </div>

          {/* Water Intake */}
          <div
            style={{
              padding: '0.75rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              <Droplets size={15} />
              <span>Water: {waterIntake} Liters</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6"
              step="0.5"
              value={waterIntake}
              onChange={(e) => setWaterIntake(e.target.value)}
              style={{ width: '100%', accentColor: '#0284c7' }}
            />
          </div>
        </div>

        {/* Mood Check-In 1 to 5 */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Daily Mood Check-In</span>
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{getMoodEmoji(Number(moodScore))}</span>
          </label>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                type="button"
                key={score}
                onClick={() => setMoodScore(score)}
                style={{
                  flex: 1,
                  padding: '0.45rem',
                  borderRadius: '8px',
                  border: Number(moodScore) === score ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                  background: Number(moodScore) === score ? 'var(--primary-light)' : '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: Number(moodScore) === score ? 'var(--primary)' : '#475569',
                }}
              >
                {score} {score === 1 ? '😞' : score === 2 ? '🙁' : score === 3 ? '😐' : score === 4 ? '🙂' : '🌟'}
              </button>
            ))}
          </div>
        </div>

        {/* Reflection Note */}
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Quick mindful reflection tag (e.g. evening walk, felt productive)..."
            value={journalTag}
            onChange={(e) => setJournalTag(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-sm"
          style={{ width: '100%' }}
          disabled={saving}
        >
          <Check size={14} />
          <span>{saving ? 'Logging...' : isLoggedToday ? 'Update Today\'s Entry' : 'Log Today\'s Habits'}</span>
        </button>
      </form>

      {/* 7-Day Trend Visualizations (FR-052) */}
      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 600 }}>7-Day Habit Consistency</h4>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
            Avg Sleep: <strong>{trends?.averageSleepHours || 7}h</strong> • Avg Water: <strong>{trends?.averageWaterIntake || 2.5}L</strong>
          </span>
        </div>

        {/* 7-Day Mini Bar Chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '80px', padding: '0 0.5rem' }}>
          {(trends?.recentLogs || []).slice(-7).map((log, idx) => {
            const heightPercent = Math.min(100, Math.max(20, (log.sleepHours / 9) * 100));
            const dayLabel = new Date(log.logDate).toLocaleDateString([], { weekday: 'narrow' });
            return (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                <div
                  style={{
                    width: '100%',
                    height: `${heightPercent}%`,
                    background: 'linear-gradient(180deg, #8b1523 0%, #fda4af 100%)',
                    borderRadius: '4px',
                    transition: 'height 0.3s ease',
                  }}
                  title={`${log.logDate}: ${log.sleepHours}h sleep, Mood: ${log.moodScore}/5`}
                />
                <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{dayLabel}</span>
              </div>
            );
          })}
        </div>

        {/* Privacy Note */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.75rem', fontSize: '0.7rem', color: '#94a3b8' }}>
          <Lock size={12} />
          <span><strong>Privacy Guarantee:</strong> Habit records are private to you and never shared with counselors without your consent.</span>
        </div>
      </div>
    </div>
  );
};

export default HabitWidget;
