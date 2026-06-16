import { useState } from 'react'
import './LogToday.css'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const LogToday = ({ saveLog, getLog, todayLog }) => {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const today = dayjs().format('dddd, MMMM D YYYY')
  const isToday = true

  // ── STATE ──────────────────────────────────────
  const [flow, setFlow] = useState(todayLog?.flow || null)
  const [moods, setMoods] = useState(todayLog?.moods || [])
  const [symptoms, setSymptoms] = useState(todayLog?.symptoms || [])
  const [water, setWater] = useState(todayLog?.water || 0)
  const [sleep, setSleep] = useState(todayLog?.sleep || 7)
  const [notes, setNotes] = useState(todayLog?.notes || '')
  const [saved, setSaved] = useState(false)
  const [cervicalMucus, setCervicalMucus] = useState(todayLog?.cervicalMucus || null)
  const [ovulationTest, setOvulationTest] = useState(todayLog?.ovulationTest || null)
  const [pregnancyTest, setPregnancyTest] = useState(todayLog?.pregnancyTest || null)
  const [breastExam, setBreastExam] = useState(todayLog?.breastExam || null)
  const [periodStatus, setPeriodStatus] = useState(todayLog?.periodStatus || null)

  // ── OPTIONS ────────────────────────────────────
  const flowOptions = [
    { id: 'none', label: 'None', emoji: '⬜', color: '#9CA3AF' },
    { id: 'spotting', label: 'Spotting', emoji: '🩸', color: '#F5B7B1' },
    { id: 'light', label: 'Light', emoji: '💧', color: '#E59896' },
    { id: 'medium', label: 'Medium', emoji: '💧💧', color: '#C2527A' },
    { id: 'heavy', label: 'Heavy', emoji: '💧💧💧', color: '#9A3A5C' },
  ]

  const moodOptions = [
    { id: 'happy', label: 'Happy', emoji: '😊' },
    { id: 'sad', label: 'Sad', emoji: '😢' },
    { id: 'anxious', label: 'Anxious', emoji: '😰' },
    { id: 'calm', label: 'Calm', emoji: '😌' },
    { id: 'tired', label: 'Tired', emoji: '😴' },
    { id: 'irritable', label: 'Irritable', emoji: '😤' },
    { id: 'energetic', label: 'Energetic', emoji: '💪' },
    { id: 'moody', label: 'Moody', emoji: '🌊' },
  ]

  const symptomOptions = [
    { id: 'cramps', label: 'Cramps', emoji: '⚡' },
    { id: 'headache', label: 'Headache', emoji: '🤕' },
    { id: 'bloating', label: 'Bloating', emoji: '🫧' },
    { id: 'backpain', label: 'Back pain', emoji: '🦴' },
    { id: 'nausea', label: 'Nausea', emoji: '🤢' },
    { id: 'breasttender', label: 'Breast tenderness', emoji: '💗' },
    { id: 'acne', label: 'Acne', emoji: '😖' },
    { id: 'cravings', label: 'Cravings', emoji: '🍫' },
    { id: 'insomnia', label: 'Insomnia', emoji: '🌙' },
    { id: 'dizziness', label: 'Dizziness', emoji: '💫' },
    { id: 'hotflashes', label: 'Hot flashes', emoji: '🔥' },
    { id: 'discharge', label: 'Discharge', emoji: '💦' },
  ]

  const cervicalMucusOptions = [
    { id: 'dry', label: 'Dry', emoji: '🏜️', desc: 'No moisture', color: '#9CA3AF' },
    { id: 'sticky', label: 'Sticky', emoji: '🍯', desc: 'Thick & sticky', color: '#F59E0B' },
    { id: 'creamy', label: 'Creamy', emoji: '🥛', desc: 'White & lotion-like', color: '#FCD34D' },
    { id: 'watery', label: 'Watery', emoji: '💧', desc: 'Clear & wet', color: '#60A5FA' },
    { id: 'eggwhite', label: 'Egg-white', emoji: '🥚', desc: 'Stretchy & clear', color: '#10B981' },
  ]

  const ovulationTestOptions = [
    { id: 'positive', label: 'Positive', emoji: '✅', desc: 'LH surge detected', color: '#10B981' },
    { id: 'negative', label: 'Negative', emoji: '❌', desc: 'No LH surge', color: '#EF4444' },
    { id: 'notaken', label: 'Not taken', emoji: '⬜', desc: 'Did not test today', color: '#9CA3AF' },
  ]

  const pregnancyTestOptions = [
    { id: 'positive', label: 'Positive', emoji: '🎉', desc: 'Two clear lines', color: '#10B981' },
    { id: 'faint', label: 'Faint line', emoji: '🔍', desc: 'Very light second line', color: '#F59E0B' },
    { id: 'negative', label: 'Negative', emoji: '❌', desc: 'One line only', color: '#EF4444' },
    { id: 'notaken', label: 'Not taken', emoji: '⬜', desc: 'Did not test today', color: '#9CA3AF' },
  ]

  const breastExamOptions = [
    { id: 'normal', label: 'Normal', emoji: '✅', desc: 'No changes noticed', color: '#10B981' },
    { id: 'tender', label: 'Tender', emoji: '💗', desc: 'Sore or sensitive', color: '#F472B6' },
    { id: 'lump', label: 'Lump noticed', emoji: '⚠️', desc: 'See a doctor soon', color: '#EF4444' },
    { id: 'discharge', label: 'Discharge', emoji: '💧', desc: 'Nipple discharge present', color: '#F59E0B' },
    { id: 'skipping', label: 'Skipped today', emoji: '⬜', desc: 'Did not check today', color: '#9CA3AF' },
  ]

  const periodStatusOptions = [
    { id: 'started', label: 'Period started today', emoji: '🌸' },
    { id: 'ended', label: 'Period ended today', emoji: '✅' },
    { id: 'ongoing', label: 'Still on period', emoji: '🩸' },
  ]

  // ── HANDLERS ───────────────────────────────────
  const toggleItem = (id, list, setList) => {
    setList(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleSave = async () => {
    const logEntry = {
      date: dayjs().format('YYYY-MM-DD'),
      flow,
      moods,
      symptoms,
      water,
      sleep,
      notes,
      cervicalMucus,
      ovulationTest,
      pregnancyTest,
      breastExam,
      periodStatus,
    }
    if (saveLog) {
      await saveLog(dayjs().format('YYYY-MM-DD'), logEntry)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  // ── RENDER ─────────────────────────────────────
  return (
    <div className="log-screen">

      {/* Header */}
      <div className="log-header">
        <h2 className="log-title">{isToday ? 'Log Today' : 'Edit Log'}</h2>
        <p className="log-date">{today}</p>
        {!isToday && <p className="edit-hint">Editing a past entry</p>}
      </div>

      {/* Period status */}
      <div className="log-section">
        <p className="log-section-title">🌸 Period status</p>
        <div className="tag-grid">
          {periodStatusOptions.map(option => (
            <button
              key={option.id}
              className={`tag-btn ${periodStatus === option.id ? 'tag-selected' : ''}`}
              onClick={() => setPeriodStatus(
                periodStatus === option.id ? null : option.id
              )}
            >
              {option.emoji} {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Period Flow */}
      <div className="log-section">
        <p className="log-section-title">🩸 Period flow</p>
        <div className="flow-options">
          {flowOptions.map(option => (
            <button
              key={option.id}
              className={`flow-btn ${flow === option.id ? 'selected' : ''}`}
              style={flow === option.id ? {
                borderColor: option.color,
                background: option.color + '20',
                color: option.color,
              } : {}}
              onClick={() => setFlow(option.id)}
            >
              <span className="flow-emoji">{option.emoji}</span>
              <span className="flow-label">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Intercourse */}
      <div
        className="log-section intercourse-link"
        onClick={() => navigate('/intercourse')}
      >
        <div className="intercourse-row">
          <div>
            <p className="log-section-title" style={{ marginBottom: 2 }}>
              ❤️ Intercourse
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Log activity, protection & analysis
            </p>
          </div>
          <span className="intercourse-arrow">→</span>
        </div>
      </div>

      {/* Mood */}
      <div className="log-section">
        <p className="log-section-title">
          😊 Mood <span className="multi-hint">select all that apply</span>
        </p>
        <div className="tag-grid">
          {moodOptions.map(option => (
            <button
              key={option.id}
              className={`tag-btn ${moods.includes(option.id) ? 'tag-selected' : ''}`}
              onClick={() => toggleItem(option.id, moods, setMoods)}
            >
              {option.emoji} {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Symptoms */}
      <div className="log-section">
        <p className="log-section-title">
          ⚡ Symptoms <span className="multi-hint">select all that apply</span>
        </p>
        <div className="tag-grid">
          {symptomOptions.map(option => (
            <button
              key={option.id}
              className={`tag-btn ${symptoms.includes(option.id) ? 'tag-selected' : ''}`}
              onClick={() => toggleItem(option.id, symptoms, setSymptoms)}
            >
              {option.emoji} {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cervical Mucus */}
      <div className="log-section">
        <p className="log-section-title">
          💦 Cervical mucus
          <span className="multi-hint">helps track fertility</span>
        </p>
        <div className="test-grid">
          {cervicalMucusOptions.map(option => (
            <button
              key={option.id}
              className={`test-btn ${cervicalMucus === option.id ? 'test-selected' : ''}`}
              style={cervicalMucus === option.id ? {
                borderColor: option.color,
                background: option.color + '20',
              } : {}}
              onClick={() => setCervicalMucus(option.id)}
            >
              <span className="test-emoji">{option.emoji}</span>
              <span
                className="test-label"
                style={cervicalMucus === option.id ? { color: option.color } : {}}
              >
                {option.label}
              </span>
              <span className="test-desc">{option.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Ovulation Test */}
      <div className="log-section">
        <p className="log-section-title">
          🔬 Ovulation test
          <span className="multi-hint">LH surge tracker</span>
        </p>
        <div className="test-grid">
          {ovulationTestOptions.map(option => (
            <button
              key={option.id}
              className={`test-btn ${ovulationTest === option.id ? 'test-selected' : ''}`}
              style={ovulationTest === option.id ? {
                borderColor: option.color,
                background: option.color + '20',
              } : {}}
              onClick={() => setOvulationTest(option.id)}
            >
              <span className="test-emoji">{option.emoji}</span>
              <span
                className="test-label"
                style={ovulationTest === option.id ? { color: option.color } : {}}
              >
                {option.label}
              </span>
              <span className="test-desc">{option.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pregnancy Test */}
      <div className="log-section">
        <p className="log-section-title">
          🤰 Pregnancy test
          <span className="multi-hint">optional</span>
        </p>
        <div className="test-grid">
          {pregnancyTestOptions.map(option => (
            <button
              key={option.id}
              className={`test-btn ${pregnancyTest === option.id ? 'test-selected' : ''}`}
              style={pregnancyTest === option.id ? {
                borderColor: option.color,
                background: option.color + '20',
              } : {}}
              onClick={() => {
                setPregnancyTest(option.id)
                if (option.id === 'positive') {
                  setTimeout(() => navigate('/pregnancy'), 400)
                }
              }}
            >
              <span className="test-emoji">{option.emoji}</span>
              <span
                className="test-label"
                style={pregnancyTest === option.id ? { color: option.color } : {}}
              >
                {option.label}
              </span>
              <span className="test-desc">{option.desc}</span>
            </button>
          ))}
        </div>
        {pregnancyTest === 'faint' && (
          <div className="test-alert">
            ⚠️ A faint line may indicate early pregnancy.
            Retest in 2 days with morning urine for best results.
          </div>
        )}
        {pregnancyTest === 'positive' && (
          <div className="test-alert success">
            🎉 Congratulations! Consider booking a doctor appointment to confirm.
          </div>
        )}
      </div>

      {/* Breast Self Exam */}
      <div className="log-section">
        <p className="log-section-title">
          🩺 Breast self exam
          <span className="multi-hint">recommended monthly</span>
        </p>
        <div className="exam-tip">
          💡 Best done 3–5 days after your period starts when
          breasts are least tender.
        </div>
        <div className="test-grid">
          {breastExamOptions.map(option => (
            <button
              key={option.id}
              className={`test-btn ${breastExam === option.id ? 'test-selected' : ''}`}
              style={breastExam === option.id ? {
                borderColor: option.color,
                background: option.color + '20',
              } : {}}
              onClick={() => setBreastExam(option.id)}
            >
              <span className="test-emoji">{option.emoji}</span>
              <span
                className="test-label"
                style={breastExam === option.id ? { color: option.color } : {}}
              >
                {option.label}
              </span>
              <span className="test-desc">{option.desc}</span>
            </button>
          ))}
        </div>
        {breastExam === 'lump' && (
          <div className="test-alert danger">
            🚨 Please consult a doctor or gynecologist as soon as possible.
            Early detection saves lives.
          </div>
        )}
      </div>

      {/* Water Intake */}
      <div className="log-section">
        <p className="log-section-title">💧 Water intake</p>
        <div className="water-tracker">
          {[...Array(8)].map((_, i) => (
            <button
              key={i}
              className={`water-glass ${i < water ? 'filled' : ''}`}
              onClick={() => setWater(i + 1)}
            >
              💧
            </button>
          ))}
        </div>
        <p className="water-count">{water} of 8 glasses</p>
      </div>

      {/* Sleep */}
      <div className="log-section">
        <p className="log-section-title">😴 Sleep hours</p>
        <div className="sleep-slider-row">
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={sleep}
            onChange={e => setSleep(parseFloat(e.target.value))}
            className="sleep-slider"
          />
          <span className="sleep-value">{sleep}h</span>
        </div>
        <div className="sleep-labels">
          <span>0h</span>
          <span>6h</span>
          <span>12h</span>
        </div>
      </div>

      {/* Notes */}
      <div className="log-section">
        <p className="log-section-title">📝 Notes</p>
        <textarea
          className="notes-input"
          placeholder="How are you feeling today? Any other observations..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      {/* Save Button */}
      <button
        className={`save-btn ${saved ? 'saved' : ''}`}
        onClick={handleSave}
      >
        {saved ? '✅ Saved!' : "Save Today's Log"}
      </button>

    </div>
  )
}

export default LogToday