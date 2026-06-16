import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Onboarding.css'
import dayjs from 'dayjs'

const Onboarding = ({ onComplete }) => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const [data, setData] = useState({
    name: '',
    dob: '',
    lastPeriodStart: '',
    cycleLength: 28,
    periodLength: 5,
    condition: 'none',
  })

  const [errors, setErrors] = useState({})

  const conditionOptions = [
    { id: 'none', label: 'None', emoji: '✅' },
    { id: 'pcos', label: 'PCOS', emoji: '🔵' },
    { id: 'endo', label: 'Endometriosis', emoji: '🟠' },
    { id: 'peri', label: 'Perimenopause', emoji: '🟣' },
    { id: 'postpill', label: 'Post-pill', emoji: '💊' },
    { id: 'other', label: 'Other', emoji: '⭕' },
  ]

  const validateStep = () => {
    const newErrors = {}
    if (step === 2) {
      if (!data.name.trim()) newErrors.name = 'Please enter your name'
    }
    if (step === 3) {
      if (!data.lastPeriodStart) newErrors.lastPeriodStart = 'Please enter your last period date'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validateStep()) return
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleComplete = () => {
    onComplete({
      profile: {
        name: data.name,
        dob: data.dob,
        condition: data.condition,
      },
      cycleSettings: {
        lastPeriodStart: data.lastPeriodStart,
        cycleLength: data.cycleLength,
        periodLength: data.periodLength,
      },
    })
    navigate('/')
  }

  const nextPeriod = data.lastPeriodStart
    ? dayjs(data.lastPeriodStart).add(data.cycleLength, 'day').format('MMMM D, YYYY')
    : null

  const ovulationDate = data.lastPeriodStart
    ? dayjs(data.lastPeriodStart).add(data.cycleLength - 14, 'day').format('MMMM D, YYYY')
    : null

  const progressWidth = `${((step - 1) / 3) * 100}%`

  return (
    <div className="onboarding">

      {/* Progress bar */}
      {step > 1 && (
        <div className="onboarding-progress">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: progressWidth }} />
          </div>
          <p className="progress-label">Step {step - 1} of 3</p>
        </div>
      )}

      {/* ── STEP 1: WELCOME ── */}
      {step === 1 && (
        <div className="onboarding-step center">
          <div className="welcome-animation">
            <div className="welcome-circle">🌸</div>
            <div className="welcome-dot dot1">✨</div>
            <div className="welcome-dot dot2">💫</div>
            <div className="welcome-dot dot3">🌙</div>
          </div>

          <h1 className="onboarding-title">Welcome to<br />CycleApp 🌸</h1>

          <p className="onboarding-desc">
            Your personal period tracker built for Kenyan women.
            Private, offline-first, and designed around your body.
          </p>

          <div className="welcome-features">
            <div className="welcome-feature">
              <span className="welcome-feature-icon">📅</span>
              <div>
                <p className="welcome-feature-title">Track your cycle</p>
                <p className="welcome-feature-desc">Period predictions, fertile window, ovulation</p>
              </div>
            </div>
            <div className="welcome-feature">
              <span className="welcome-feature-icon">😊</span>
              <div>
                <p className="welcome-feature-title">Log daily health</p>
                <p className="welcome-feature-desc">Mood, symptoms, water, sleep</p>
              </div>
            </div>
            <div className="welcome-feature">
              <span className="welcome-feature-icon">🔒</span>
              <div>
                <p className="welcome-feature-title">100% private</p>
                <p className="welcome-feature-desc">Data stays on your device. Never sold.</p>
              </div>
            </div>
            <div className="welcome-feature">
              <span className="welcome-feature-icon">📡</span>
              <div>
                <p className="welcome-feature-title">Works offline</p>
                <p className="welcome-feature-desc">No internet needed. No data bundles wasted.</p>
              </div>
            </div>
          </div>

          <button className="onboarding-btn primary" onClick={handleNext}>
            Get started →
          </button>

          <p className="onboarding-skip" onClick={handleComplete}>
            Skip setup — I'll configure later
          </p>
        </div>
      )}

      {/* ── STEP 2: PERSONAL INFO ── */}
      {step === 2 && (
        <div className="onboarding-step">
          <div className="step-icon">👤</div>
          <h2 className="onboarding-title small">Tell us about yourself</h2>
          <p className="onboarding-desc">
            This helps us personalise your experience.
            You can change this later in your profile.
          </p>

          <div className="onboarding-form">

            <div className="form-group">
              <label className="form-label">Your name *</label>
              <input
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="e.g. Amina"
                value={data.name}
                onChange={e => {
                  setData(prev => ({ ...prev, name: e.target.value }))
                  setErrors(prev => ({ ...prev, name: '' }))
                }}
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Date of birth (optional)</label>
              <input
                type="date"
                className="form-input"
                value={data.dob}
                max={dayjs().format('YYYY-MM-DD')}
                onChange={e => setData(prev => ({ ...prev, dob: e.target.value }))}
              />
              <p className="form-hint">Used to calculate your age and personalise tips</p>
            </div>

            <div className="form-group">
              <label className="form-label">Health condition (optional)</label>
              <div className="condition-grid">
                {conditionOptions.map(c => (
                  <button
                    key={c.id}
                    className={`condition-btn ${data.condition === c.id ? 'selected' : ''}`}
                    onClick={() => setData(prev => ({ ...prev, condition: c.id }))}
                  >
                    <span>{c.emoji}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="onboarding-nav">
            <button className="onboarding-btn secondary" onClick={handleBack}>← Back</button>
            <button className="onboarding-btn primary" onClick={handleNext}>Continue →</button>
          </div>
        </div>
      )}

      {/* ── STEP 3: CYCLE SETUP ── */}
      {step === 3 && (
        <div className="onboarding-step">
          <div className="step-icon">🩸</div>
          <h2 className="onboarding-title small">Set up your cycle</h2>
          <p className="onboarding-desc">
            This is how we calculate your next period,
            ovulation day, and fertile window.
          </p>

          <div className="onboarding-form">

            <div className="form-group">
              <label className="form-label">When did your last period start? *</label>
              <input
                type="date"
                className={`form-input ${errors.lastPeriodStart ? 'error' : ''}`}
                value={data.lastPeriodStart}
                max={dayjs().format('YYYY-MM-DD')}
                onChange={e => {
                  setData(prev => ({ ...prev, lastPeriodStart: e.target.value }))
                  setErrors(prev => ({ ...prev, lastPeriodStart: '' }))
                }}
              />
              {errors.lastPeriodStart && (
                <p className="form-error">{errors.lastPeriodStart}</p>
              )}
              <p className="form-hint">
                💡 Not sure of the exact date? Pick the closest you remember.
              </p>
            </div>

            <div className="form-group">
              <div className="slider-label-row">
                <label className="form-label">Average cycle length</label>
                <span className="slider-value">{data.cycleLength} days</span>
              </div>
              <input
                type="range"
                min="21" max="45" step="1"
                value={data.cycleLength}
                className="cycle-slider"
                onChange={e => setData(prev => ({
                  ...prev, cycleLength: parseInt(e.target.value)
                }))}
              />
              <div className="slider-hints">
                <span>21 days</span>
                <span>28 days (average)</span>
                <span>45 days</span>
              </div>
              <p className="form-hint">
                Count from the first day of one period to the first day of the next.
                Most women are 26–32 days.
              </p>
            </div>

            <div className="form-group">
              <div className="slider-label-row">
                <label className="form-label">Average period length</label>
                <span className="slider-value">{data.periodLength} days</span>
              </div>
              <input
                type="range"
                min="2" max="10" step="1"
                value={data.periodLength}
                className="cycle-slider"
                onChange={e => setData(prev => ({
                  ...prev, periodLength: parseInt(e.target.value)
                }))}
              />
              <div className="slider-hints">
                <span>2 days</span>
                <span>5 days (average)</span>
                <span>10 days</span>
              </div>
            </div>

            {/* Live preview */}
            {data.lastPeriodStart && (
              <div className="cycle-preview">
                <p className="cycle-preview-title">📊 Your cycle preview</p>
                <div className="preview-grid">
                  <div className="preview-item">
                    <span className="preview-emoji">🩸</span>
                    <span className="preview-label">Last period</span>
                    <span className="preview-value">
                      {dayjs(data.lastPeriodStart).format('MMM D')} –{' '}
                      {dayjs(data.lastPeriodStart)
                        .add(data.periodLength - 1, 'day')
                        .format('MMM D')}
                    </span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-emoji">✨</span>
                    <span className="preview-label">Ovulation</span>
                    <span className="preview-value">{ovulationDate}</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-emoji">🌱</span>
                    <span className="preview-label">Fertile window</span>
                    <span className="preview-value">
                      {dayjs(data.lastPeriodStart)
                        .add(data.cycleLength - 19, 'day')
                        .format('MMM D')}
                      {' – '}
                      {dayjs(data.lastPeriodStart)
                        .add(data.cycleLength - 13, 'day')
                        .format('MMM D')}
                    </span>
                  </div>
                  <div className="preview-item highlight">
                    <span className="preview-emoji">⏭️</span>
                    <span className="preview-label">Next period</span>
                    <span className="preview-value" style={{ color: '#C2527A' }}>
                      {nextPeriod}
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="onboarding-nav">
            <button className="onboarding-btn secondary" onClick={handleBack}>← Back</button>
            <button className="onboarding-btn primary" onClick={handleNext}>Continue →</button>
          </div>
        </div>
      )}

      {/* ── STEP 4: ALL SET ── */}
      {step === 4 && (
        <div className="onboarding-step center">

          <div className="success-animation">
            <div className="success-circle">🎉</div>
            <div className="success-ring" />
          </div>

          <h2 className="onboarding-title">
            You're all set,<br />{data.name || 'welcome'}! 🌸
          </h2>

          <p className="onboarding-desc">
            Your cycle has been set up. Here is a summary
            of what we calculated for you.
          </p>

          {data.lastPeriodStart && (
            <div className="summary-card">
              <div className="summary-row">
                <span className="summary-label">🩸 Next period</span>
                <span className="summary-value">{nextPeriod}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">✨ Ovulation</span>
                <span className="summary-value">{ovulationDate}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">🔄 Cycle length</span>
                <span className="summary-value">{data.cycleLength} days</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">📅 Period length</span>
                <span className="summary-value">{data.periodLength} days</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">⏳ Days until next</span>
                <span className="summary-value" style={{ color: '#C2527A', fontWeight: 600 }}>
                  {Math.max(0, dayjs(data.lastPeriodStart)
                    .add(data.cycleLength, 'day')
                    .diff(dayjs(), 'day'))} days
                </span>
              </div>
            </div>
          )}

          <div className="whats-next">
            <p className="whats-next-title">What to do next:</p>
            <div className="whats-next-item">
              <span>📊</span>
              <span>Check your Dashboard for today's cycle overview</span>
            </div>
            <div className="whats-next-item">
              <span>📝</span>
              <span>Tap + to log today's mood and symptoms</span>
            </div>
            <div className="whats-next-item">
              <span>📅</span>
              <span>View your Calendar to see your full cycle</span>
            </div>
          </div>

          <button
            className="onboarding-btn primary large"
            onClick={handleComplete}
          >
            Go to my dashboard 🏠
          </button>

        </div>
      )}

    </div>
  )
}

export default Onboarding