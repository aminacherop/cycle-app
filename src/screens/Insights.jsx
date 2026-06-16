import { useState } from 'react'
import './Insights.css'
import dayjs from 'dayjs'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts'

const Insights = ({ cycleSettings }) => {
  const [activeTab, setActiveTab] = useState('overview')
  // tabs: overview | cycle | symptoms | mood

  const cycleLength = cycleSettings?.cycleLength || 26
  const periodLength = cycleSettings?.periodLength || 4
  const lastPeriodStart = cycleSettings?.lastPeriodStart || dayjs().format('YYYY-MM-DD')
  const lpsDate = dayjs(lastPeriodStart)

  // Generate 6 months of simulated cycle data
  const generateCycleData = () => {
    return Array.from({ length: 6 }, (_, i) => {
      const start = lpsDate.subtract((5 - i) * cycleLength, 'day')
      const variation = Math.floor(Math.random() * 3) - 1
      return {
        month: start.format('MMM'),
        cycleLength: cycleLength + variation,
        periodLength: periodLength + (Math.random() > 0.5 ? 0 : 1),
        ovulationDay: cycleLength - 14,
      }
    })
  }

  const cycleData = generateCycleData()

  const avgCycle = Math.round(
    cycleData.reduce((s, d) => s + d.cycleLength, 0) / cycleData.length
  )
  const avgPeriod = Math.round(
    cycleData.reduce((s, d) => s + d.periodLength, 0) / cycleData.length
  )

  // Symptom frequency data
  const symptomData = [
    { name: 'Cramps', count: 5, color: '#C2527A' },
    { name: 'Headache', count: 3, color: '#E74C3C' },
    { name: 'Bloating', count: 4, color: '#E67E22' },
    { name: 'Fatigue', count: 6, color: '#F39C12' },
    { name: 'Nausea', count: 2, color: '#27AE60' },
    { name: 'Acne', count: 3, color: '#8E44AD' },
  ]

  // Mood data per cycle phase
  const moodData = [
    { phase: 'Menstrual', happy: 20, tired: 70, calm: 30, irritable: 50 },
    { phase: 'Follicular', happy: 70, tired: 30, calm: 60, irritable: 20 },
    { phase: 'Ovulation', happy: 90, tired: 20, calm: 70, irritable: 15 },
    { phase: 'Luteal', happy: 40, tired: 50, calm: 35, irritable: 65 },
  ]

  // Water & sleep data
  const wellnessData = Array.from({ length: 7 }, (_, i) => ({
    day: dayjs().subtract(6 - i, 'day').format('ddd'),
    water: Math.floor(Math.random() * 4) + 4,
    sleep: (Math.random() * 3 + 6).toFixed(1),
  }))

  // Current cycle day
  const currentCycleDay = dayjs().diff(lpsDate, 'day') + 1
  const currentPhase =
    currentCycleDay <= periodLength ? 'Menstrual' :
    currentCycleDay <= cycleLength - 14 - 2 ? 'Follicular' :
    currentCycleDay <= cycleLength - 14 + 2 ? 'Ovulation' : 'Luteal'

  const phaseColors = {
    Menstrual: '#C2527A',
    Follicular: '#7C3AED',
    Ovulation: '#F59E0B',
    Luteal: '#10B981',
  }

  const phaseTips = {
    Menstrual: {
      energy: 'Low',
      workout: 'Light yoga, walking, rest',
      food: 'Iron-rich foods, dark chocolate, warm soups',
      focus: 'Rest, reflection, gentle tasks',
    },
    Follicular: {
      energy: 'Rising',
      workout: 'Cardio, strength training, HIIT',
      food: 'Fresh vegetables, lean protein, fermented foods',
      focus: 'New projects, learning, socializing',
    },
    Ovulation: {
      energy: 'Peak',
      workout: 'High intensity, group classes, runs',
      food: 'Raw foods, fruits, light meals',
      focus: 'Important meetings, presentations, networking',
    },
    Luteal: {
      energy: 'Declining',
      workout: 'Moderate cardio, pilates, stretching',
      food: 'Complex carbs, magnesium-rich foods, herbal tea',
      focus: 'Detail work, finishing tasks, self care',
    },
  }

  const currentTips = phaseTips[currentPhase]
  const phaseColor = phaseColors[currentPhase]

  return (
    <div className="insights-screen">

      <div className="insights-header">
        <h2 className="insights-title">Insights</h2>
        <p className="insights-sub">Based on your last {cycleData.length} cycles</p>
      </div>

      {/* Current phase card */}
      <div
        className="phase-card"
        style={{ background: phaseColor + '15', borderColor: phaseColor + '40' }}
      >
        <div className="phase-card-top">
          <div>
            <p className="phase-card-label">Current phase</p>
            <p className="phase-card-name" style={{ color: phaseColor }}>
              {currentPhase} phase
            </p>
            <p className="phase-card-day">Day {currentCycleDay} of {cycleLength}</p>
          </div>
          <div
            className="phase-ring"
            style={{ borderColor: phaseColor }}
          >
            <span className="phase-ring-num" style={{ color: phaseColor }}>
              {currentCycleDay}
            </span>
            <span className="phase-ring-label">day</span>
          </div>
        </div>
        <div className="phase-tips-row">
          <div className="phase-tip-item">
            <span className="phase-tip-icon">⚡</span>
            <div>
              <p className="phase-tip-label">Energy</p>
              <p className="phase-tip-value">{currentTips.energy}</p>
            </div>
          </div>
          <div className="phase-tip-item">
            <span className="phase-tip-icon">🏃</span>
            <div>
              <p className="phase-tip-label">Workout</p>
              <p className="phase-tip-value">{currentTips.workout}</p>
            </div>
          </div>
          <div className="phase-tip-item">
            <span className="phase-tip-icon">🥗</span>
            <div>
              <p className="phase-tip-label">Food</p>
              <p className="phase-tip-value">{currentTips.food}</p>
            </div>
          </div>
          <div className="phase-tip-item">
            <span className="phase-tip-icon">🎯</span>
            <div>
              <p className="phase-tip-label">Focus</p>
              <p className="phase-tip-value">{currentTips.focus}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="insights-tabs">
        {[
          { id: 'overview', label: '📊 Overview' },
          { id: 'cycle', label: '🔄 Cycle' },
          { id: 'symptoms', label: '⚡ Symptoms' },
          { id: 'mood', label: '😊 Mood' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`insights-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="insights-content">

          {/* Key stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-card-emoji">🔄</span>
              <p className="stat-card-value">{avgCycle}</p>
              <p className="stat-card-label">Avg cycle length</p>
            </div>
            <div className="stat-card">
              <span className="stat-card-emoji">🩸</span>
              <p className="stat-card-value">{avgPeriod}</p>
              <p className="stat-card-label">Avg period days</p>
            </div>
            <div className="stat-card">
              <span className="stat-card-emoji">✨</span>
              <p className="stat-card-value">Day {cycleLength - 14}</p>
              <p className="stat-card-label">Avg ovulation</p>
            </div>
            <div className="stat-card">
              <span className="stat-card-emoji">🌱</span>
              <p className="stat-card-value">7 days</p>
              <p className="stat-card-label">Fertile window</p>
            </div>
          </div>

          {/* Cycle length trend */}
          <div className="chart-card">
            <p className="chart-title">🔄 Cycle length trend</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={cycleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E6E6" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[20, 35]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <ReferenceLine y={avgCycle} stroke="#C2527A" strokeDasharray="4 4" label={{ value: 'Avg', fontSize: 10 }} />
                <Line type="monotone" dataKey="cycleLength" stroke="#C2527A" strokeWidth={2} dot={{ r: 4, fill: '#C2527A' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Period length trend */}
          <div className="chart-card">
            <p className="chart-title">🩸 Period length trend</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={cycleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E6E6" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 8]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="periodLength" fill="#C2527A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Wellness */}
          <div className="chart-card">
            <p className="chart-title">💧 Water intake — last 7 days</p>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={wellnessData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E6E6" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 8]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <ReferenceLine y={8} stroke="#3B82F6" strokeDasharray="4 4" label={{ value: 'Goal', fontSize: 10 }} />
                <Bar dataKey="water" fill="#60A5FA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}

      {/* ── CYCLE TAB ── */}
      {activeTab === 'cycle' && (
        <div className="insights-content">

          <div className="chart-card">
            <p className="chart-title">🔄 Cycle length history</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={cycleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E6E6" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[18, 40]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <ReferenceLine y={28} stroke="#9CA3AF" strokeDasharray="4 4" label={{ value: '28d avg', fontSize: 9 }} />
                <ReferenceLine y={avgCycle} stroke="#C2527A" strokeDasharray="4 4" label={{ value: 'Your avg', fontSize: 9 }} />
                <Line type="monotone" dataKey="cycleLength" stroke="#C2527A" strokeWidth={2} dot={{ r: 5, fill: '#C2527A' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Phase breakdown */}
          <div className="chart-card">
            <p className="chart-title">📅 Cycle phase breakdown</p>
            <div className="phase-breakdown">
              {[
                { name: 'Menstrual', days: periodLength, color: '#C2527A', desc: 'Period days' },
                { name: 'Follicular', days: cycleLength - 14 - periodLength - 2, color: '#7C3AED', desc: 'Before ovulation' },
                { name: 'Ovulation', days: 3, color: '#F59E0B', desc: 'Fertile peak' },
                { name: 'Luteal', days: 14, color: '#10B981', desc: 'After ovulation' },
              ].map(phase => (
                <div key={phase.name} className="phase-breakdown-item">
                  <div className="phase-breakdown-bar-wrap">
                    <div
                      className="phase-breakdown-bar"
                      style={{
                        width: `${(phase.days / cycleLength) * 100}%`,
                        background: phase.color,
                      }}
                    />
                  </div>
                  <div className="phase-breakdown-info">
                    <span style={{ color: phase.color, fontWeight: 600 }}>{phase.name}</span>
                    <span className="phase-breakdown-days">{phase.days} days — {phase.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prediction accuracy */}
          <div className="chart-card">
            <p className="chart-title">🎯 Prediction accuracy</p>
            <div className="accuracy-row">
              <div className="accuracy-item">
                <div className="accuracy-circle" style={{ background: '#10B981' }}>
                  <span className="accuracy-pct">92%</span>
                </div>
                <p className="accuracy-label">Period prediction</p>
              </div>
              <div className="accuracy-item">
                <div className="accuracy-circle" style={{ background: '#F59E0B' }}>
                  <span className="accuracy-pct">85%</span>
                </div>
                <p className="accuracy-label">Ovulation prediction</p>
              </div>
              <div className="accuracy-item">
                <div className="accuracy-circle" style={{ background: '#7C3AED' }}>
                  <span className="accuracy-pct">88%</span>
                </div>
                <p className="accuracy-label">Fertile window</p>
              </div>
            </div>
            <p className="accuracy-note">
              💡 Accuracy improves as you log more cycles. Log daily
              for the best predictions.
            </p>
          </div>

        </div>
      )}

      {/* ── SYMPTOMS TAB ── */}
      {activeTab === 'symptoms' && (
        <div className="insights-content">

          <div className="chart-card">
            <p className="chart-title">⚡ Most common symptoms</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={symptomData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E6E6" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={70} />
                <Tooltip />
                <Bar dataKey="count" fill="#C2527A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <p className="chart-title">📅 Symptoms by cycle phase</p>
            <div className="symptom-phase-grid">
              {[
                {
                  phase: 'Menstrual', color: '#C2527A',
                  symptoms: ['Cramps', 'Fatigue', 'Headache', 'Bloating']
                },
                {
                  phase: 'Follicular', color: '#7C3AED',
                  symptoms: ['Mild cramps', 'Light spotting']
                },
                {
                  phase: 'Ovulation', color: '#F59E0B',
                  symptoms: ['Breast tenderness', 'Discharge', 'Mild pain']
                },
                {
                  phase: 'Luteal', color: '#10B981',
                  symptoms: ['Bloating', 'Mood swings', 'Cravings', 'Acne']
                },
              ].map(p => (
                <div key={p.phase} className="symptom-phase-card">
                  <p className="symptom-phase-name" style={{ color: p.color }}>
                    {p.phase}
                  </p>
                  <div className="symptom-tag-list">
                    {p.symptoms.map(s => (
                      <span
                        key={s}
                        className="symptom-tag"
                        style={{ background: p.color + '20', color: p.color }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <p className="chart-title">💡 Health insights</p>
            <div className="health-insight">
              <span className="health-insight-icon">🔴</span>
              <div>
                <p className="health-insight-title">Frequent cramps</p>
                <p className="health-insight-desc">
                  You logged cramps in 5 of 6 cycles. Consider speaking
                  to a doctor if cramps are severe.
                </p>
              </div>
            </div>
            <div className="health-insight">
              <span className="health-insight-icon">🟡</span>
              <div>
                <p className="health-insight-title">Fatigue pattern</p>
                <p className="health-insight-desc">
                  Fatigue appears consistently in your luteal phase.
                  Iron-rich foods and rest may help.
                </p>
              </div>
            </div>
            <div className="health-insight">
              <span className="health-insight-icon">🟢</span>
              <div>
                <p className="health-insight-title">Regular cycle</p>
                <p className="health-insight-desc">
                  Your cycle length varies by only ±1 day. This is
                  very regular — great for predictions.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ── MOOD TAB ── */}
      {activeTab === 'mood' && (
        <div className="insights-content">

          <div className="chart-card">
            <p className="chart-title">😊 Mood by cycle phase</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E6E6" />
                <XAxis dataKey="phase" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="happy" name="Happy" fill="#F59E0B" radius={[2, 2, 0, 0]} />
                <Bar dataKey="calm" name="Calm" fill="#10B981" radius={[2, 2, 0, 0]} />
                <Bar dataKey="tired" name="Tired" fill="#6B7280" radius={[2, 2, 0, 0]} />
                <Bar dataKey="irritable" name="Irritable" fill="#EF4444" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mood-legend">
              {[
                { label: 'Happy', color: '#F59E0B' },
                { label: 'Calm', color: '#10B981' },
                { label: 'Tired', color: '#6B7280' },
                { label: 'Irritable', color: '#EF4444' },
              ].map(m => (
                <div key={m.label} className="mood-legend-item">
                  <span className="mood-legend-dot" style={{ background: m.color }} />
                  <span>{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <p className="chart-title">💡 Mood insights</p>
            <div className="mood-insight-list">
              {[
                {
                  phase: 'Menstrual', emoji: '🌸', color: '#C2527A',
                  insight: 'You tend to feel more tired and withdrawn. Rest and self-care help most.'
                },
                {
                  phase: 'Follicular', emoji: '🌱', color: '#7C3AED',
                  insight: 'Energy and happiness rise. Great time for social plans and new challenges.'
                },
                {
                  phase: 'Ovulation', emoji: '✨', color: '#F59E0B',
                  insight: 'Peak confidence and social energy. Best time for important conversations.'
                },
                {
                  phase: 'Luteal', emoji: '🍂', color: '#10B981',
                  insight: 'Irritability rises in the second half. Journaling and magnesium can help.'
                },
              ].map(m => (
                <div key={m.phase} className="mood-insight-item">
                  <span style={{ fontSize: 20 }}>{m.emoji}</span>
                  <div>
                    <p className="mood-insight-phase" style={{ color: m.color }}>{m.phase}</p>
                    <p className="mood-insight-text">{m.insight}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  )
}

export default Insights