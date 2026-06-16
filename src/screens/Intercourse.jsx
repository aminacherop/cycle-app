import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Intercourse.css'
import dayjs from 'dayjs'

const Intercourse = () => {
  const navigate = useNavigate()
  const today = dayjs().format('dddd, MMMM D YYYY')

  const [didNotHave, setDidNotHave] = useState(false)
  const [protection, setProtection] = useState(null)
  const [orgasmTimes, setOrgasmTimes] = useState(0)
  const [activities, setActivities] = useState([])
  const [saved, setSaved] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)

  // Simulated cycle day for risk calculation
  const cycleDay = 14
  const cycleLength = 28

  const protectionOptions = [
    { id: 'condom', label: 'Condom', emoji: '🛡️', color: '#3B82F6' },
    { id: 'pullout', label: 'Pull-out method', emoji: '⚠️', color: '#F59E0B' },
    { id: 'other', label: 'Other contraception', emoji: '💊', color: '#7C3AED' },
    { id: 'unprotected', label: 'Unprotected', emoji: '🔓', color: '#EF4444' },
  ]

  const activityOptions = [
    { id: 'intercourse', label: 'Intercourse', emoji: '❤️' },
    { id: 'oral', label: 'Oral', emoji: '💋' },
    { id: 'masturbation', label: 'Solo', emoji: '🌸' },
    { id: 'cuddling', label: 'Cuddling', emoji: '🤗' },
  ]

  const toggleActivity = (id) => {
    setActivities(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const getConceptionRisk = () => {
    const fertileStart = cycleLength - 18
    const fertileEnd = cycleLength - 11
    const isInFertileWindow = cycleDay >= fertileStart && cycleDay <= fertileEnd
    const isOvulationDay = cycleDay === Math.round(cycleLength - 14)

    if (protection === 'condom' || protection === 'other') {
      return {
        level: 'Low',
        percent: 3,
        color: '#10B981',
        bg: '#D1FAE5',
        emoji: '🟢',
        message: 'Protection was used. Conception risk is very low.',
      }
    }
    if (isOvulationDay && (protection === 'unprotected' || protection === 'pullout')) {
      return {
        level: 'Very High',
        percent: 33,
        color: '#EF4444',
        bg: '#FEE2E2',
        emoji: '🔴',
        message: 'Ovulation day with no reliable protection. Very high chance of conception.',
      }
    }
    if (isInFertileWindow && protection === 'unprotected') {
      return {
        level: 'High',
        percent: 20,
        color: '#F59E0B',
        bg: '#FEF3C7',
        emoji: '🟡',
        message: 'You are in your fertile window. High chance of conception.',
      }
    }
    if (isInFertileWindow && protection === 'pullout') {
      return {
        level: 'Medium',
        percent: 12,
        color: '#F59E0B',
        bg: '#FEF3C7',
        emoji: '🟡',
        message: 'Fertile window with pull-out method. Some risk remains.',
      }
    }
    if (!isInFertileWindow && protection === 'unprotected') {
      return {
        level: 'Low',
        percent: 5,
        color: '#10B981',
        bg: '#D1FAE5',
        emoji: '🟢',
        message: 'Outside your fertile window. Lower chance of conception.',
      }
    }
    return {
      level: 'Very Low',
      percent: 2,
      color: '#10B981',
      bg: '#D1FAE5',
      emoji: '🟢',
      message: 'Very low risk of conception.',
    }
  }

  const handleSave = () => {
    if (didNotHave) {
      navigate(-1)
      return
    }
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      setShowAnalysis(true)
    }, 800)
  }

  const risk = !didNotHave && protection ? getConceptionRisk() : null

  // Simulated frequency stats
  const stats = {
    thisMonth: 6,
    lastMonth: 8,
    protectedPercent: 67,
    avgOrgasms: 1.4,
  }

  if (showAnalysis) {
    return (
      <div className="intercourse-screen">
        <div className="int-header">
          <button className="back-btn" onClick={() => setShowAnalysis(false)}>← Back</button>
          <h2 className="int-title">Analysis</h2>
          <p className="int-date">{today}</p>
        </div>

        {/* Conception Risk Chart */}
        {risk && (
          <div className="analysis-section">
            <p className="analysis-section-title">🎯 Conception risk</p>
            <div className="risk-card" style={{ background: risk.bg, borderColor: risk.color + '40' }}>
              <div className="risk-top">
                <div>
                  <p className="risk-level" style={{ color: risk.color }}>
                    {risk.emoji} {risk.level} Risk
                  </p>
                  <p className="risk-message">{risk.message}</p>
                </div>
                <div className="risk-percent-circle" style={{ background: risk.color }}>
                  <span className="risk-percent-num">{risk.percent}%</span>
                  <span className="risk-percent-label">chance</span>
                </div>
              </div>

              {/* Risk bar */}
              <div className="risk-bar-wrap">
                <div className="risk-bar-track">
                  <div
                    className="risk-bar-fill"
                    style={{
                      width: `${risk.percent * 3}%`,
                      background: risk.color
                    }}
                  />
                </div>
                <div className="risk-bar-labels">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>

              <div className="risk-cycle-info">
                <div className="risk-cycle-item">
                  <span className="risk-cycle-label">Cycle day</span>
                  <span className="risk-cycle-value">{cycleDay}</span>
                </div>
                <div className="risk-cycle-item">
                  <span className="risk-cycle-label">Protection</span>
                  <span className="risk-cycle-value">
                    {protectionOptions.find(p => p.id === protection)?.emoji}{' '}
                    {protectionOptions.find(p => p.id === protection)?.label}
                  </span>
                </div>
                <div className="risk-cycle-item">
                  <span className="risk-cycle-label">Phase</span>
                  <span className="risk-cycle-value">
                    {cycleDay <= 5 ? '🌸 Menstrual' :
                      cycleDay <= 13 ? '🌱 Follicular' :
                        cycleDay <= 16 ? '✨ Ovulation' : '🍂 Luteal'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Summary */}
        <div className="analysis-section">
          <p className="analysis-section-title">🎯 Today's activity</p>
          <div className="activity-summary-grid">
            <div className="activity-summary-card">
              <span className="activity-summary-emoji">❤️</span>
              <span className="activity-summary-label">Intercourse</span>
              <span className={`activity-tag ${activities.includes('intercourse') ? 'yes' : 'no'}`}>
                {activities.includes('intercourse') ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="activity-summary-card">
              <span className="activity-summary-emoji">🌸</span>
              <span className="activity-summary-label">Female orgasm</span>
              <span className="activity-tag yes">{orgasmTimes}x</span>
            </div>
            <div className="activity-summary-card">
              <span className="activity-summary-emoji">🛡️</span>
              <span className="activity-summary-label">Protected</span>
              <span className={`activity-tag ${protection === 'condom' || protection === 'other' ? 'yes' : 'no'}`}>
                {protection === 'condom' || protection === 'other' ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="activity-summary-card">
              <span className="activity-summary-emoji">🔓</span>
              <span className="activity-summary-label">Unprotected</span>
              <span className={`activity-tag ${protection === 'unprotected' ? 'warn' : 'no'}`}>
                {protection === 'unprotected' ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Frequency Statistics */}
        <div className="analysis-section">
          <p className="analysis-section-title">📊 Frequency statistics</p>
          <div className="freq-grid">
            <div className="freq-card">
              <span className="freq-emoji">📅</span>
              <p className="freq-value">{stats.thisMonth}</p>
              <p className="freq-label">This month</p>
            </div>
            <div className="freq-card">
              <span className="freq-emoji">🗓️</span>
              <p className="freq-value">{stats.lastMonth}</p>
              <p className="freq-label">Last month</p>
            </div>
            <div className="freq-card">
              <span className="freq-emoji">🛡️</span>
              <p className="freq-value">{stats.protectedPercent}%</p>
              <p className="freq-label">Protected rate</p>
            </div>
            <div className="freq-card">
              <span className="freq-emoji">🌸</span>
              <p className="freq-value">{stats.avgOrgasms}</p>
              <p className="freq-label">Avg orgasms</p>
            </div>
          </div>

          {/* Monthly bar chart */}
          <div className="freq-bar-chart">
            <p className="freq-chart-title">Activity this month</p>
            <div className="freq-bars">
              {['W1', 'W2', 'W3', 'W4'].map((week, i) => {
                const heights = [60, 80, 40, 30]
                const colors = ['#E91E8C', '#7C3AED', '#E91E8C', '#10B981']
                return (
                  <div key={week} className="freq-bar-item">
                    <div className="freq-bar-outer">
                      <div
                        className="freq-bar-inner"
                        style={{
                          height: `${heights[i]}%`,
                          background: colors[i]
                        }}
                      />
                    </div>
                    <span className="freq-bar-label">{week}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <button className="save-btn" onClick={() => navigate(-1)}>
          ✅ Done
        </button>
      </div>
    )
  }

  return (
    <div className="intercourse-screen">

      {/* Header */}
      <div className="int-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h2 className="int-title">Intercourse Log</h2>
        <p className="int-date">{today}</p>
      </div>

      {/* Did not have option */}
      <div className="log-section">
        <button
          className={`did-not-btn ${didNotHave ? 'selected' : ''}`}
          onClick={() => {
            setDidNotHave(!didNotHave)
            if (!didNotHave) {
              setProtection(null)
              setActivities([])
              setOrgasmTimes(0)
            }
          }}
        >
          <span>🚫</span>
          <span>Did not have intercourse today</span>
          {didNotHave && <span className="check">✓</span>}
        </button>
      </div>

      {/* Only show rest if had intercourse */}
      {!didNotHave && (
        <>
          {/* Activity type */}
          <div className="log-section">
            <p className="log-section-title">
              ❤️ Activity
              <span className="multi-hint">select all that apply</span>
            </p>
            <div className="tag-grid">
              {activityOptions.map(option => (
                <button
                  key={option.id}
                  className={`tag-btn ${activities.includes(option.id) ? 'tag-selected' : ''}`}
                  onClick={() => toggleActivity(option.id)}
                >
                  {option.emoji} {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Protection */}
          <div className="log-section">
            <p className="log-section-title">🛡️ Protection used</p>
            <div className="protection-grid">
              {protectionOptions.map(option => (
                <button
                  key={option.id}
                  className={`protection-btn ${protection === option.id ? 'selected' : ''}`}
                  style={protection === option.id ? {
                    borderColor: option.color,
                    background: option.color + '15',
                  } : {}}
                  onClick={() => setProtection(option.id)}
                >
                  <span className="protection-emoji">{option.emoji}</span>
                  <span
                    className="protection-label"
                    style={protection === option.id ? { color: option.color } : {}}
                  >
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
            {protection === 'unprotected' && (
              <div className="protection-warning">
                ⚠️ Unprotected intercourse during your fertile window
                can result in pregnancy. Check your conception risk
                in the analysis after saving.
              </div>
            )}
          </div>

          {/* Female Orgasm */}
          <div className="log-section">
            <p className="log-section-title">
              🌸 Female orgasm times
            </p>
            <div className="orgasm-counter">
              <button
                className="counter-btn"
                onClick={() => setOrgasmTimes(prev => Math.max(0, prev - 1))}
              >
                −
              </button>
              <div className="counter-display">
                <span className="counter-num">{orgasmTimes}</span>
                <span className="counter-label">
                  {orgasmTimes === 0 ? 'None' :
                    orgasmTimes === 1 ? 'time' : 'times'}
                </span>
              </div>
              <button
                className="counter-btn"
                onClick={() => setOrgasmTimes(prev => prev + 1)}
              >
                +
              </button>
            </div>
          </div>

        </>
      )}

      {/* Save Button */}
      <button
        className={`save-btn ${saved ? 'saved' : ''}`}
        onClick={handleSave}
        disabled={!didNotHave && !protection}
      >
        {saved ? '✅ Saving...' :
          didNotHave ? 'Save & go back' : 'Save & view analysis'}
      </button>

    </div>
  )
}

export default Intercourse