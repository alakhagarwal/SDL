import React, { useState, useEffect } from 'react';
import api from '../api';
import { Flame, Moon, Droplets, Check, Lock, TrendingUp } from 'lucide-react';

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
        const todayLog = res.data?.recentLogs?.find((l) => l.logDate === todayStr);
        setIsLoggedToday(!!todayLog);
        // Pre-fill with today's existing values so slider shows accurate state
        if (todayLog) {
          if (todayLog.sleepHours != null) setSleepHours(todayLog.sleepHours);
          if (todayLog.waterIntakeLiters != null) setWaterIntake(todayLog.waterIntakeLiters);
          if (todayLog.moodScore != null) setMoodScore(todayLog.moodScore);
          if (todayLog.workoutMinutes != null) setWorkoutMinutes(todayLog.workoutMinutes);
        }
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
        journalTag: journalTag || 'Daily self-care check-in',
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
    const e = { 1: '😞', 2: '🙁', 3: '😐', 4: '🙂', 5: '🌟' };
    return e[score] || '🙂';
  };

  const getMoodLabel = (score) => {
    const l = { 1: 'Struggling', 2: 'Low', 3: 'Neutral', 4: 'Good', 5: 'Thriving' };
    return l[score] || 'Good';
  };

  const streak = trends?.currentStreak || 0;

  return (
    <div className="card" style={{ height: '100%' }}>

      {/* Header */}
      <div className="card-header">
        <div>
          <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Daily Self-Care Tracker</h3>
          <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', margin: 0 }}>
            Private wellness journal &amp; habit log
          </p>
        </div>

        {/* Streak Badge — shows flame only if active */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: streak > 0 ? '#fff7ed' : '#f8fafc',
            border: `1px solid ${streak > 0 ? '#fed7aa' : '#e2e8f0'}`,
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            color: streak > 0 ? '#c2410c' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.82rem',
          }}
        >
          <Flame
            size={17}
            fill={streak > 0 ? '#f97316' : 'none'}
            color={streak > 0 ? '#ea580c' : '#cbd5e1'}
          />
          <span>{streak} day{streak !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div
          style={{
            padding: '0.6rem 1rem',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            color: '#14532d',
            fontSize: '0.82rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <Check size={15} />
          <span>Habits saved — streak updated!</span>
        </div>
      )}

      {/* Log Form */}
      <form onSubmit={handleLog} style={{ marginBottom: '1.25rem' }}>

        {/* Sleep + Water sliders */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>

          <div style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
              <Moon size={14} color="#64748b" />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>
                Sleep: <span style={{ color: 'var(--primary)' }}>{sleepHours}h</span>
              </span>
            </div>
            <input
              type="range" min="0" max="14" step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              style={{ width: '100%', accentColor: '#8b1523' }}
            />
          </div>

          <div style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
              <Droplets size={14} color="#64748b" />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>
                Water: <span style={{ color: 'var(--primary)' }}>{waterIntake}L</span>
              </span>
            </div>
            <input
              type="range" min="0.5" max="6" step="0.5"
              value={waterIntake}
              onChange={(e) => setWaterIntake(e.target.value)}
              style={{ width: '100%', accentColor: '#8b1523' }}
            />
          </div>
        </div>

        {/* Mood selector */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Mood Check-In</span>
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem' }}>
              {getMoodEmoji(Number(moodScore))} {getMoodLabel(Number(moodScore))}
            </span>
          </label>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                type="button"
                key={score}
                onClick={() => setMoodScore(score)}
                style={{
                  flex: 1,
                  padding: '0.5rem 0.25rem',
                  borderRadius: '8px',
                  border: Number(moodScore) === score
                    ? '2px solid var(--primary)'
                    : '1px solid #e2e8f0',
                  background: Number(moodScore) === score ? 'var(--primary-light)' : '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  color: Number(moodScore) === score ? 'var(--primary)' : '#64748b',
                  transition: 'all 0.15s ease',
                }}
              >
                {getMoodEmoji(score)}
              </button>
            ))}
          </div>
        </div>

        {/* Reflection note */}
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Quick reflection (e.g. evening walk, felt focused)..."
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
          <span>{saving ? 'Saving...' : isLoggedToday ? "Update Today's Entry" : "Log Today's Habits"}</span>
        </button>
      </form>

      {/* 7-Day Trend */}
      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <TrendingUp size={14} color="#64748b" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>7-Day Trend</span>
          </div>
          <span style={{ fontSize: '0.71rem', color: '#94a3b8' }}>
            <strong style={{ color: '#475569' }}>{trends?.averageSleepHours || 7}h</strong> sleep avg
            {' · '}
            <strong style={{ color: '#475569' }}>{trends?.averageWaterIntake || 2.5}L</strong> water avg
          </span>
        </div>

        {/* Mini bar chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem', height: '72px' }}>
          {(trends?.recentLogs?.length > 0)
            ? trends.recentLogs.slice(-7).map((log, idx) => {
                const heightPct = Math.min(100, Math.max(15, ((log.sleepHours ?? 7) / 9) * 100));
                const todayStr = new Date().toISOString().split('T')[0];
                const isToday = log.logDate === todayStr;
                // Parse date without timezone shift
                const d = new Date(log.logDate + 'T12:00:00');
                const dayLabel = d.toLocaleDateString('en-US', { weekday: 'narrow' });
                return (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                    <div
                      style={{
                        width: '100%',
                        height: `${heightPct}%`,
                        background: isToday
                          ? 'linear-gradient(180deg, #8b1523 0%, #c25568 100%)'
                          : 'linear-gradient(180deg, #94a3b8 0%, #cbd5e1 100%)',
                        borderRadius: '4px 4px 3px 3px',
                        transition: 'height 0.3s ease',
                        minHeight: '6px',
                      }}
                      title={`${log.logDate}: ${log.sleepHours ?? '—'}h sleep, mood ${log.moodScore ?? '—'}/5`}
                    />
                    <span style={{
                      fontSize: '0.65rem',
                      color: isToday ? 'var(--primary)' : '#94a3b8',
                      fontWeight: isToday ? 700 : 400,
                    }}>
                      {dayLabel}
                    </span>
                  </div>
                );
              })
            : Array.from({ length: 7 }).map((_, idx) => (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                  <div style={{ width: '100%', height: '12%', background: '#f1f5f9', borderRadius: '4px', minHeight: '6px' }} />
                  <span style={{ fontSize: '0.65rem', color: '#e2e8f0' }}>—</span>
                </div>
              ))
          }
        </div>

        {/* Privacy note */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.75rem', fontSize: '0.68rem', color: '#94a3b8' }}>
          <Lock size={11} />
          <span>Habit data is private and never shared with counselors without your consent.</span>
        </div>
      </div>
    </div>
  );
};

export default HabitWidget;
