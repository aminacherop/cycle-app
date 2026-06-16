import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './PartnerView.css'
import {
  loadPartnerPairing,
  removePartnerPairing,
  getDaysRemaining,
} from '../utils/partnerCode'
import dayjs from 'dayjs'

const PartnerView = () => {
  const navigate = useNavigate()
  const [pairing, setPairing] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const data = await loadPartnerPairing()
      setPairing(data)
      setLoading(false)
    }
    load()
  }, [])

  const handleUnpair = async () => {
    await removePartnerPairing()
    navigate(-1)
  }

  if (loading) return null

  if (!pairing) {
    return (
      <div style={{
        padding: '2rem 1.2rem',
        textAlign: 'center',
        background: 'var(--background)',
        minHeight: '100vh',
      }}>
        <p style={{ fontSize: 48, marginBottom: 16 }}>👫</p>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
          No partner paired yet
        </p>
        <button
          onClick={() => navigate('/partner/enter')}
          style={{
            marginTop: 20,
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #C2527A, #9A3A5C)',
            color: 'white',
            border: 'none',
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Enter partner code →
        </button>
      </div>
    )
  }

  // Calculate cycle info from pairing data
  const { sharedData, userName } = pairing
  const lpsDate = dayjs(sharedData.lastPeriodStart)
  const today = dayjs()
  const cycleLength = sharedData.cycleLength || 28
  const periodLength = sharedData.periodLength || 5
  const currentCycleDay = Math.max(1, today.diff(lpsDate, 'day') + 1)

  let nextPeriod = lpsDate.add(cycleLength, 'day')
  while (nextPeriod.isBefore(today, 'day')) {
    nextPeriod = nextPeriod.add(cycleLength, 'day')
  }

  const daysUntilPeriod = Math.max(0, nextPeriod.diff(today, 'day'))
  const ovulationDate = lpsDate.add(cycleLength - 14, 'day')
  const daysUntilOvulation = Math.max(0, ovulationDate.diff(today, 'day'))

  const phase =
    currentCycleDay <= periodLength ? 'Menstrual' :
    currentCycleDay <= cycleLength - 16 ? 'Follicular' :
    currentCycleDay <= cycleLength - 12 ? 'Ovulation' : 'Luteal'

  const phaseInfo = {
    Menstrual: {
      color: '#C2527A', bg: '#F8DDE6', emoji: '🌸',
      desc: 'Period is currently happening',
      partnerTips: [
        '💗 Be extra patient and understanding today',
        '🍫 Offer dark chocolate or comfort food',
        '🌡️ A warm water bottle can help with cramps',
        '🤗 Hugs and gentle support go a long way',
        '🏠 She may prefer staying home and resting',
      ]
    },
    Follicular: {
      color: '#7C3AED', bg: '#EDE9FE', emoji: '🌱',
      desc: 'Energy and mood are rising',
      partnerTips: [
        '🌟 Great time to plan dates and activities',
        '💬 She is social and communicative right now',
        '🏃 Suggest outdoor activities or workouts together',
        '🎯 Good time for important conversations',
        '😊 She may be feeling optimistic and creative',
      ]
    },
    Ovulation: {
      color: '#F59E0B', bg: '#FEF3C7', emoji: '✨',
      desc: 'Peak energy and confidence',
      partnerTips: [
        '✨ She is at her most energetic and confident',
        '❤️ Great time for romance and connection',
        '🎉 Plan something special together',
        '💬 She is extra communicative right now',
        '🌟 Celebrate her and make her feel loved',
      ]
    },
    Luteal: {
      color: '#10B981', bg: '#D1FAE5', emoji: '🍂',
      desc: 'Winding down, may have PMS',
      partnerTips: [
        '🧘 Give her space when she needs it',
        '🍕 Cravings are real — be understanding',
        '😤 Mood swings are hormonal, not personal',
        '🛁 Help create a relaxing environment',
        '💊 Remind her to take magnesium if she does',
      ]
    },
  }

  const info = phaseInfo[phase]

  return (
    <div className="partner-view-screen">

      <div className="partner-view-header">
        <button className="partner-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h2 className="partner-view-title">{userName}'s Cycle</h2>
        <p className="partner-view-sub">Partner view · Safe summary only</p>
      </div>

      {/* Current phase card */}
      <div
        className="partner-phase-card"
        style={{ background: info.bg, borderColor: info.color + '40' }}
      >
        <div className="partner-phase-top">
          <div>
            <p className="partner-phase-label">Current phase</p>
            <p className="partner-phase-name" style={{ color: info.color }}>
              {info.emoji} {phase} phase
            </p>
            <p className="partner-phase-desc">{info.desc}</p>
          </div>
          <div
            className="partner-phase-ring"
            style={{ borderColor: info.color }}
          >
            <span className="partner-phase-day" style={{ color: info.color }}>
              {currentCycleDay}
            </span>
            <span className="partner-phase-of">of {cycleLength}</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="partner-stats">
        <div className="partner-stat-card">
          <span className="partner-stat-emoji">⏭️</span>
          <p className="partner-stat-value" style={{ color: '#C2527A' }}>
            {daysUntilPeriod}
          </p>
          <p className="partner-stat-label">days to period</p>
        </div>
        <div className="partner-stat-card">
          <span className="partner-stat-emoji">✨</span>
          <p className="partner-stat-value" style={{ color: '#F59E0B' }}>
            {daysUntilOvulation}
          </p>
          <p className="partner-stat-label">days to ovulation</p>
        </div>
        <div className="partner-stat-card">
          <span className="partner-stat-emoji">🔄</span>
          <p className="partner-stat-value" style={{ color: '#7C3AED' }}>
            {cycleLength}
          </p>
          <p className="partner-stat-label">day cycle</p>
        </div>
      </div>

      {/* Period alert */}
      {daysUntilPeriod <= 3 && daysUntilPeriod > 0 && (
        <div className="partner-alert">
          🩸 {userName}'s period is coming in {daysUntilPeriod} day{daysUntilPeriod !== 1 ? 's' : ''} — be extra supportive!
        </div>
      )}
      {phase === 'Menstrual' && (
        <div className="partner-alert period">
          🌸 {userName} is currently on her period — extra care needed!
        </div>
      )}

      {/* Partner tips */}
      <div className="partner-tips-card">
        <p className="partner-tips-title">
          💡 How to support {userName} right now
        </p>
        {info.partnerTips.map((tip, i) => (
          <div key={i} className="partner-tip-item">
            <span>{tip}</span>
          </div>
        ))}
      </div>

      {/* Phase timeline */}
      <div className="partner-timeline">
        <p className="partner-timeline-title">📅 Upcoming</p>
        <div className="partner-timeline-item">
          <span className="timeline-dot" style={{ background: '#F59E0B' }} />
          <div>
            <p className="timeline-label">Next ovulation</p>
            <p className="timeline-date">{ovulationDate.format('MMM D, YYYY')}</p>
          </div>
        </div>
        <div className="partner-timeline-item">
          <span className="timeline-dot" style={{ background: '#C2527A' }} />
          <div>
            <p className="timeline-label">Next period</p>
            <p className="timeline-date">{nextPeriod.format('MMM D, YYYY')}</p>
          </div>
        </div>
      </div>

      {/* Privacy note */}
      <div className="partner-privacy-note">
        🔒 This is a safe summary only. No flow details, test results,
        or personal health data are shared.
      </div>

      {/* Unpair button */}
      <button
        className="partner-unpair-btn"
        onClick={handleUnpair}
      >
        Disconnect from {userName}
      </button>

    </div>
  )
}

export default PartnerView