import { useState } from 'react'
import './Dashboard.css'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import usePWAInstall from '../hooks/usePWAInstall'

const Dashboard = ({ cycleSettings, userProfile }) => {
  const navigate = useNavigate()
  const { t, language, changeLanguage } = useLanguage()
  const { isDark, changeTheme } = useTheme()
  const { isInstallable, isInstalled, install } = usePWAInstall()

  // ── MOOD STATE ─────────────────────────────────
  const [selectedMood, setSelectedMood] = useState(null)

  // ── REAL DATA FROM PROPS ───────────────────────
  const name = userProfile?.name || ''

  const cycleLength = cycleSettings?.cycleLength || 28
  const periodLength = cycleSettings?.periodLength || 5
  const lastPeriodStart = cycleSettings?.lastPeriodStart ||
    dayjs().subtract(14, 'day').format('YYYY-MM-DD')

  const lpsDate = dayjs(lastPeriodStart)
  const todayDate = dayjs()
  const currentCycleDay = Math.max(1, todayDate.diff(lpsDate, 'day') + 1)
  const daysUntilPeriod = Math.max(0,
    lpsDate.add(cycleLength, 'day').diff(todayDate, 'day')
  )
  const ovulationDate = lpsDate.add(cycleLength - 14, 'day')
  const daysUntilOvulation = Math.max(0, ovulationDate.diff(todayDate, 'day'))

  const currentPhase =
    currentCycleDay <= periodLength ? 'Menstrual' :
    currentCycleDay <= cycleLength - 16 ? 'Follicular' :
    currentCycleDay <= cycleLength - 12 ? 'Ovulation' : 'Luteal'

  const cycleData = {
    currentDay: currentCycleDay,
    cycleLength,
    periodLength,
    phase: currentPhase,
    daysUntilPeriod,
    daysUntilOvulation,
    fertile: currentPhase === 'Ovulation',
  }

  // ── PHASE CONFIG ───────────────────────────────
  const phaseInfo = {
    Menstrual: {
      color: '#C2527A',
      bg: '#F8DDE6',
      emoji: '🌸',
      tip: t('phase_menstrual_tip'),
      fullTip: t('phase_menstrual_tip'),
    },
    Follicular: {
      color: '#7C3AED',
      bg: '#EDE9FE',
      emoji: '🌱',
      tip: t('phase_follicular_tip'),
      fullTip: t('phase_follicular_tip'),
    },
    Ovulation: {
      color: '#F59E0B',
      bg: '#FEF3C7',
      emoji: '✨',
      tip: t('phase_ovulation_tip'),
      fullTip: t('phase_ovulation_tip'),
    },
    Luteal: {
      color: '#10B981',
      bg: '#D1FAE5',
      emoji: '🍂',
      tip: t('phase_luteal_tip'),
      fullTip: t('phase_luteal_tip'),
    },
  }

  // ── GREETING ───────────────────────────────────
  const hour = todayDate.hour()
  const greeting =
    hour < 12 ? t('good_morning') :
    hour < 17 ? t('good_afternoon') : t('good_evening')

  // ── MOODS ──────────────────────────────────────
  const moods = [
    { id: 'good', label: t('mood_good'), emoji: '😊' },
    { id: 'tired', label: t('mood_tired'), emoji: '😴' },
    { id: 'cramps', label: t('mood_cramps'), emoji: '😣' },
    { id: 'moody', label: t('mood_moody'), emoji: '😤' },
    { id: 'nausea', label: t('mood_nausea'), emoji: '🤢' },
    { id: 'energetic', label: t('mood_energetic'), emoji: '💪' },
  ]

  const phase = phaseInfo[cycleData.phase]
  const progress = Math.min(100, (cycleData.currentDay / cycleData.cycleLength) * 100)
  const circumference = 2 * Math.PI * 54

  return (
    <div className="dashboard">

      {/* ── HEADER ── */}
      <div className="header">
        <div>
          <p className="greeting">{greeting} 👋</p>
          <h2 className="username">{name}</h2>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className="lang-switch-btn"
            onClick={() => changeLanguage(language === 'en' ? 'sw' : 'en')}
            title="Switch language"
          >
            {language === 'en' ? '🇰🇪' : '🇬🇧'}
          </button>
          <button
            className="lang-switch-btn"
            onClick={() => changeTheme(isDark ? 'light' : 'dark')}
            title="Toggle dark mode"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <div
            className="notif-btn"
            onClick={() => navigate('/notifications')}
          >
            🔔
          </div>
        </div>
      </div>

      {/* ── PWA INSTALL BANNER ── */}
      {isInstallable && !isInstalled && (
        <div className="install-banner">
          <div className="install-banner-left">
            <span className="install-icon">📲</span>
            <div>
              <p className="install-title">Install CycleApp</p>
              <p className="install-desc">Add to home screen for offline use</p>
            </div>
          </div>
          <button className="install-btn" onClick={install}>
            Install
          </button>
        </div>
      )}

      {/* ── CYCLE RING CARD ── */}
      <div className="cycle-card" style={{ background: phase.bg }}>
        <div className="cycle-ring-wrapper">
          <svg width="140" height="140" viewBox="0 0 120 120">
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="10"
            />
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke={phase.color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={
                circumference - (progress / 100) * circumference
              }
              transform="rotate(-90 60 60)"
            />
            <text
              x="60" y="52"
              textAnchor="middle"
              fontSize="11"
              fill="#6B7280"
            >
              {t('cycle_day')}
            </text>
            <text
              x="60" y="68"
              textAnchor="middle"
              fontSize="26"
              fontWeight="600"
              fill={phase.color}
            >
              {cycleData.currentDay}
            </text>
            <text
              x="60" y="82"
              textAnchor="middle"
              fontSize="10"
              fill="#6B7280"
            >
              of {cycleData.cycleLength}
            </text>
          </svg>
        </div>

        <div className="cycle-info">
          <div className="phase-badge" style={{ background: phase.color }}>
            {phase.emoji} {t(`phase_${cycleData.phase.toLowerCase()}`)} phase
          </div>
          <div className="cycle-stats">
            <div className="stat">
              <p className="stat-value" style={{ color: phase.color }}>
                {cycleData.daysUntilPeriod}
              </p>
              <p className="stat-label">{t('days_to_period')}</p>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <p className="stat-value" style={{ color: phase.color }}>
                {cycleData.daysUntilOvulation}
              </p>
              <p className="stat-label">{t('days_to_ovulation')}</p>
            </div>
          </div>
          <p className="phase-tip">{phase.tip}</p>
        </div>
      </div>

      {/* ── PERIOD ALERT — coming soon ── */}
      {cycleData.daysUntilPeriod <= 5 && cycleData.daysUntilPeriod > 0 && (
        <div className="period-alert">
          🌸 {t('period_coming')} {cycleData.daysUntilPeriod} {t('days')}
        </div>
      )}

      {/* ── PERIOD ALERT — today ── */}
      {cycleData.daysUntilPeriod === 0 && currentPhase !== 'Menstrual' && (
        <div className="period-alert">
          🩸 {t('period_today')}
        </div>
      )}

      {/* ── OVULATION ALERT ── */}
      {cycleData.daysUntilOvulation <= 2 &&
        cycleData.daysUntilOvulation >= 0 &&
        currentPhase !== 'Menstrual' && (
        <div className="ovulation-alert">
          ✨ {cycleData.daysUntilOvulation === 0
            ? t('ovulation_today')
            : `${t('ovulation_soon')} ${cycleData.daysUntilOvulation} ${t('days')}`}
        </div>
      )}

      {/* ── HOW ARE YOU FEELING ── */}
      <div className="section">
        <p className="section-title">{t('how_feeling')}</p>
        <div className="quick-log">
          {moods.map(mood => (
            <button
              key={mood.id}
              className={`mood-btn ${selectedMood === mood.id ? 'selected' : ''}`}
              onClick={() => setSelectedMood(
                selectedMood === mood.id ? null : mood.id
              )}
              style={selectedMood === mood.id ? {
                borderColor: phase.color,
                background: phase.bg,
                color: phase.color,
              } : {}}
            >
              {mood.emoji} {mood.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TODAY'S STATS ── */}
      <div className="section">
        <p className="section-title">{t('todays_log')}</p>
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-card-icon">💧</span>
            <p className="stat-card-value">6</p>
            <p className="stat-card-label">{t('glasses_water')}</p>
          </div>
          <div className="stat-card">
            <span className="stat-card-icon">😴</span>
            <p className="stat-card-value">7h</p>
            <p className="stat-card-label">{t('sleep')}</p>
          </div>
          <div className="stat-card">
            <span className="stat-card-icon">🏃</span>
            <p className="stat-card-value">30m</p>
            <p className="stat-card-label">{t('exercise')}</p>
          </div>
        </div>
      </div>

      {/* ── PHASE TIP ── */}
      <div className="section">
        <p className="section-title">{t('tip_for_phase')}</p>
        <div
          className="tip-card"
          style={{ borderLeft: `4px solid ${phase.color}` }}
        >
          <p className="tip-title" style={{ color: phase.color }}>
            {phase.emoji} {t(`phase_${cycleData.phase.toLowerCase()}`)} phase
          </p>
          <p className="tip-text">{phase.fullTip}</p>
        </div>
      </div>

      {/* ── CYCLE SUMMARY BAR ── */}
      <div className="section">
        <p className="section-title">{t('this_cycle')}</p>
        <div className="cycle-summary-bar">
          <div className="csb-item">
            <span className="csb-emoji">📅</span>
            <p className="csb-label">{t('started')}</p>
            <p className="csb-value">{lpsDate.format('MMM D')}</p>
          </div>
          <div className="csb-item">
            <span className="csb-emoji">✨</span>
            <p className="csb-label">{t('ovulation')}</p>
            <p className="csb-value">{ovulationDate.format('MMM D')}</p>
          </div>
          <div className="csb-item">
            <span className="csb-emoji">⏭️</span>
            <p className="csb-label">{t('next_period')}</p>
            <p className="csb-value" style={{ color: '#C2527A' }}>
              {lpsDate.add(cycleLength, 'day').format('MMM D')}
            </p>
          </div>
        </div>
      </div>

      {/* ── QUICK SHORTCUTS ── */}
      <div className="section">
        <p className="section-title">Quick access</p>
        <div className="shortcuts-grid">

          <div
            className="shortcut-card"
            onClick={() => navigate('/articles')}
          >
            <span className="shortcut-icon">📚</span>
            <div>
              <p className="shortcut-title">Health Articles</p>
              <p className="shortcut-desc">Cycle, PCOS, fertility</p>
            </div>
            <span className="shortcut-arrow">→</span>
          </div>

          <div
            className="shortcut-card"
            onClick={() => navigate('/medications')}
          >
            <span className="shortcut-icon">💊</span>
            <div>
              <p className="shortcut-title">Pills & Supplements</p>
              <p className="shortcut-desc">Daily reminders</p>
            </div>
            <span className="shortcut-arrow">→</span>
          </div>

          <div
            className="shortcut-card"
            onClick={() => navigate('/partner/invite')}
          >
            <span className="shortcut-icon">👫</span>
            <div>
              <p className="shortcut-title">Partner sharing</p>
              <p className="shortcut-desc">Share cycle summary</p>
            </div>
            <span className="shortcut-arrow">→</span>
          </div>

          <div
            className="shortcut-card"
            onClick={() => navigate('/notifications')}
          >
            <span className="shortcut-icon">🔔</span>
            <div>
              <p className="shortcut-title">Reminders</p>
              <p className="shortcut-desc">Period & ovulation alerts</p>
            </div>
            <span className="shortcut-arrow">→</span>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Dashboard