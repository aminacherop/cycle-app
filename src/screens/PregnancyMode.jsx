import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './PregnancyMode.css'
import dayjs from 'dayjs'

const PregnancyMode = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState('congrats') 
  // steps: congrats → lmp → result

  const [lmpDate, setLmpDate] = useState('')
  const [dueDate, setDueDate] = useState(null)
  const [weeksPregnant, setWeeksPregnant] = useState(null)

  const calculateDueDate = () => {
    if (!lmpDate) return
    const lmp = dayjs(lmpDate)
    const due = lmp.add(280, 'day') // Naegele's rule: 40 weeks from LMP
    const weeks = dayjs().diff(lmp, 'week')
    setDueDate(due.format('MMMM D, YYYY'))
    setWeeksPregnant(weeks)
    setStep('result')
  }

  const getTrimester = (weeks) => {
    if (weeks <= 12) return { name: 'First Trimester', emoji: '🌱', color: '#10B981' }
    if (weeks <= 26) return { name: 'Second Trimester', emoji: '🌸', color: '#E91E8C' }
    return { name: 'Third Trimester', emoji: '🌟', color: '#7C3AED' }
  }

  const trimester = weeksPregnant !== null ? getTrimester(weeksPregnant) : null

  return (
    <div className="pregnancy-screen">

      {/* Congrats Step */}
      {step === 'congrats' && (
        <div className="preg-step">
          <div className="preg-animation">
            <div className="preg-circle">👶</div>
            <div className="confetti">🎊</div>
            <div className="confetti two">🎉</div>
            <div className="confetti three">✨</div>
          </div>

          <h1 className="preg-title">
            Congratulations,<br />Mama-to-be! 🤰
          </h1>

          <p className="preg-subtitle">
            What wonderful news! Your body is doing something 
            truly amazing. We are here to support you every 
            step of the way.
          </p>

          <div className="preg-info-card">
            <p className="preg-info-title">🌟 Pregnancy mode includes:</p>
            <div className="preg-feature">
              <span>📅</span>
              <span>Due date calculator</span>
            </div>
            <div className="preg-feature">
              <span>👶</span>
              <span>Weekly baby development updates</span>
            </div>
            <div className="preg-feature">
              <span>🩺</span>
              <span>Antenatal appointment reminders</span>
            </div>
            <div className="preg-feature">
              <span>🥗</span>
              <span>Nutrition tips for each trimester</span>
            </div>
            <div className="preg-feature">
              <span>💊</span>
              <span>Folic acid & supplement reminders</span>
            </div>
            <div className="preg-feature">
              <span>📋</span>
              <span>Symptom tracker for pregnancy</span>
            </div>
          </div>

          <button
            className="preg-btn primary"
            onClick={() => setStep('lmp')}
          >
            Continue — Calculate my due date
          </button>

          <button
            className="preg-btn secondary"
            onClick={() => navigate('/')}
          >
            Turn off pregnancy mode
          </button>

          <p className="preg-disclaimer">
            This app is not a substitute for professional 
            medical advice. Please see a doctor to confirm 
            your pregnancy.
          </p>
        </div>
      )}

      {/* LMP Date Step */}
      {step === 'lmp' && (
        <div className="preg-step">
          <button
            className="back-btn"
            onClick={() => setStep('congrats')}
          >
            ← Back
          </button>

          <div className="lmp-icon">📅</div>

          <h2 className="preg-title small">
            When did your last period start?
          </h2>

          <p className="preg-subtitle">
            This is called your Last Menstrual Period (LMP). 
            We use this date to estimate how far along you are 
            and when your baby is due.
          </p>

          <div className="lmp-input-wrap">
            <label className="lmp-label">
              Date of last period
            </label>
            <input
              type="date"
              className="lmp-input"
              value={lmpDate}
              max={dayjs().format('YYYY-MM-DD')}
              onChange={e => setLmpDate(e.target.value)}
            />
          </div>

          <div className="lmp-tip">
            💡 Not sure of the exact date? Pick the closest 
            date you remember — it does not have to be perfect.
          </div>

          <button
            className="preg-btn primary"
            onClick={calculateDueDate}
            disabled={!lmpDate}
          >
            Calculate my due date →
          </button>
        </div>
      )}

      {/* Result Step */}
      {step === 'result' && trimester && (
        <div className="preg-step">

          <div
            className="result-header"
            style={{ background: trimester.color + '15' }}
          >
            <div
              className="result-week-circle"
              style={{ background: trimester.color }}
            >
              <span className="result-week-num">{weeksPregnant}</span>
              <span className="result-week-label">weeks</span>
            </div>
            <div>
              <p
                className="result-trimester"
                style={{ color: trimester.color }}
              >
                {trimester.emoji} {trimester.name}
              </p>
              <p className="result-subtitle">
                You are {weeksPregnant} weeks pregnant
              </p>
            </div>
          </div>

          <div className="result-due-card">
            <p className="result-due-label">🎯 Estimated due date</p>
            <p className="result-due-date">{dueDate}</p>
            <p className="result-due-note">
              Only 5% of babies arrive on their due date — 
              most arrive within 2 weeks either side.
            </p>
          </div>

          <div className="result-tips">
            <p className="result-tips-title">
              What to do right now:
            </p>
            <div className="result-tip-item">
              <span>1️⃣</span>
              <span>Book your first antenatal appointment</span>
            </div>
            <div className="result-tip-item">
              <span>2️⃣</span>
              <span>Start taking folic acid 400mcg daily</span>
            </div>
            <div className="result-tip-item">
              <span>3️⃣</span>
              <span>Avoid alcohol, smoking and raw foods</span>
            </div>
            <div className="result-tip-item">
              <span>4️⃣</span>
              <span>Stay hydrated and rest when you can</span>
            </div>
          </div>

          <button
            className="preg-btn primary"
            onClick={() => navigate('/')}
          >
            🏠 Go to my pregnancy dashboard
          </button>

          <button
            className="preg-btn secondary"
            onClick={() => navigate('/log')}
          >
            ← Back to log
          </button>

        </div>
      )}

    </div>
  )
}

export default PregnancyMode