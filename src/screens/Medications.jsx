import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Medications.css'
import dayjs from 'dayjs'
import {
  MEDICATION_TYPES,
  loadMedications,
  addMedication,
  updateMedication,
  deleteMedication,
  loadMedicationLogs,
  logMedicationTaken,
  calculateAdherence,
  calculateStreak,
} from '../utils/medications'
import {
  scheduleMedicationReminders,
  requestNotificationPermission,
} from '../utils/notifications'

const Medications = () => {
  const navigate = useNavigate()
  const [medications, setMedications] = useState([])
  const [todayLogs, setTodayLogs] = useState({})
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [adherenceData, setAdherenceData] = useState({})
  const [streakData, setStreakData] = useState({})
  const [error, setError] = useState(null)

  const [newMed, setNewMed] = useState({
    type: 'birth_control',
    name: '',
    reminderTime: '08:00',
    dosage: '',
    notes: '',
  })

  const today = dayjs().format('YYYY-MM-DD')

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    try {
      setLoading(true)
      const meds = await loadMedications()
      const logs = await loadMedicationLogs()

      setMedications(Array.isArray(meds) ? meds : [])

      const todayStatus = {}
      if (Array.isArray(meds)) {
        meds.forEach(med => {
          todayStatus[med.id] = logs?.[`${med.id}_${today}`]?.taken || false
        })
      }
      setTodayLogs(todayStatus)

      // Calculate adherence and streaks
      const adherence = {}
      const streaks = {}
      if (Array.isArray(meds)) {
        for (const med of meds) {
          try {
            adherence[med.id] = await calculateAdherence(med.id, 30)
            streaks[med.id] = await calculateStreak(med.id)
          } catch (e) {
            adherence[med.id] = null
            streaks[med.id] = 0
          }
        }
      }
      setAdherenceData(adherence)
      setStreakData(streaks)
    } catch (err) {
      console.error('Error loading medications:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleTaken = async (medId) => {
    const newStatus = !todayLogs[medId]
    await logMedicationTaken(medId, today, newStatus)
    setTodayLogs(prev => ({ ...prev, [medId]: newStatus }))
    await loadAll()
  }

  const handleAddMedication = async () => {
    if (!newMed.name.trim()) return
    try {
      const granted = await requestNotificationPermission()
      const updated = await addMedication(newMed)
      setMedications(Array.isArray(updated) ? updated : [])
      if (granted) scheduleMedicationReminders(updated)
      setShowAddModal(false)
      setNewMed({
        type: 'birth_control',
        name: '',
        reminderTime: '08:00',
        dosage: '',
        notes: '',
      })
      await loadAll()
    } catch (err) {
      console.error('Error adding medication:', err)
    }
  }

  const handleDelete = async (medId) => {
    try {
      const updated = await deleteMedication(medId)
      setMedications(Array.isArray(updated) ? updated : [])
      await loadAll()
    } catch (err) {
      console.error('Error deleting medication:', err)
    }
  }

  const handleToggleActive = async (medId, active) => {
    try {
      const updated = await updateMedication(medId, { active: !active })
      setMedications(Array.isArray(updated) ? updated : [])
      if (!active) scheduleMedicationReminders(updated)
    } catch (err) {
      console.error('Error updating medication:', err)
    }
  }

  const getTypeInfo = (typeId) => {
    return MEDICATION_TYPES.find(t => t.id === typeId) ||
      MEDICATION_TYPES[MEDICATION_TYPES.length - 1]
  }

  const activeMeds = medications.filter(m => m.active)
  const takenCount = activeMeds.filter(m => todayLogs[m.id]).length
  const allTakenToday = activeMeds.length > 0 && takenCount === activeMeds.length

  // ── LOADING ─────────────────────────────────────
  if (loading) {
    return (
      <div className="meds-screen">
        <div className="meds-header">
          <button className="meds-back" onClick={() => navigate(-1)}>← Back</button>
          <h2 className="meds-title">Pills & Supplements</h2>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '4rem 1rem',
          gap: '12px',
        }}>
          <span style={{ fontSize: 40, animation: 'pulse 1.5s infinite' }}>💊</span>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Loading medications...
          </p>
        </div>
      </div>
    )
  }

  // ── ERROR ────────────────────────────────────────
  if (error) {
    return (
      <div className="meds-screen">
        <div className="meds-header">
          <button className="meds-back" onClick={() => navigate(-1)}>← Back</button>
          <h2 className="meds-title">Pills & Supplements</h2>
        </div>
        <div style={{
          textAlign: 'center',
          padding: '3rem 1rem',
        }}>
          <p style={{ fontSize: 36, marginBottom: 12 }}>⚠️</p>
          <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 6 }}>
            Something went wrong
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 }}>
            {error}
          </p>
          <button
            onClick={loadAll}
            style={{
              padding: '12px 24px',
              background: '#C2527A',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  // ── MAIN RENDER ──────────────────────────────────
  return (
    <div className="meds-screen">

      {/* Header */}
      <div className="meds-header">
        <button className="meds-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h2 className="meds-title">Pills & Supplements</h2>
        <p className="meds-sub">
          {activeMeds.length} active reminder{activeMeds.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Today's status */}
      {medications.length > 0 && (
        <div className={`meds-today-card ${allTakenToday ? 'all-done' : ''}`}>
          <span className="meds-today-icon">
            {allTakenToday ? '🎉' : '💊'}
          </span>
          <div>
            <p className="meds-today-title">
              {allTakenToday
                ? 'All done for today!'
                : "Today's medications"}
            </p>
            <p className="meds-today-desc">
              {takenCount} of {activeMeds.length} taken today
            </p>
          </div>
          {/* Progress bar */}
          <div style={{ flex: 1, marginLeft: 12 }}>
            <div style={{
              height: 6,
              background: 'var(--border)',
              borderRadius: 3,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: activeMeds.length > 0
                  ? `${(takenCount / activeMeds.length) * 100}%`
                  : '0%',
                background: allTakenToday
                  ? '#10B981'
                  : 'linear-gradient(90deg, #C2527A, #D67A96)',
                borderRadius: 3,
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Info card */}
      <div className="meds-info-card">
        <div className="meds-info-row">
          <span className="meds-info-icon">🩸</span>
          <div>
            <p className="meds-info-title">Period & ovulation reminders</p>
            <p className="meds-info-desc">
              Manage in Settings → Notifications
            </p>
          </div>
          <button
            className="meds-info-btn"
            onClick={() => navigate('/notifications')}
          >
            Set up →
          </button>
        </div>
      </div>

      {/* Medications list */}
      {medications.length === 0 ? (
        <div className="meds-empty">
          <span className="meds-empty-icon">💊</span>
          <p className="meds-empty-title">No medications yet</p>
          <p className="meds-empty-desc">
            Add your birth control pill, folic acid, iron supplement,
            or any other medication to get daily reminders.
          </p>
          <div className="meds-suggestion-row">
            {['💊 Birth control', '🟡 Folic acid', '🔴 Iron', '🌙 Magnesium'].map(s => (
              <span key={s} className="meds-suggestion-tag">{s}</span>
            ))}
          </div>
        </div>
      ) : (
        <div className="meds-list">
          <p className="meds-list-title">Your medications</p>
          {medications.map(med => {
            const typeInfo = getTypeInfo(med.type)
            const taken = todayLogs[med.id]
            const adherence = adherenceData[med.id]
            const streak = streakData[med.id]

            return (
              <div
                key={med.id}
                className={`med-card ${!med.active ? 'inactive' : ''}`}
              >
                <div className="med-card-top">
                  <div className="med-card-left">
                    <div
                      className="med-icon"
                      style={{ background: typeInfo.color + '20' }}
                    >
                      <span>{typeInfo.emoji}</span>
                    </div>
                    <div>
                      <p className="med-name">{med.name}</p>
                      <p className="med-meta">
                        {typeInfo.label}
                        {med.dosage ? ` · ${med.dosage}` : ''}
                        {' · '}⏰ {med.reminderTime}
                      </p>
                      {!med.active && (
                        <span className="med-paused-badge">Paused</span>
                      )}
                    </div>
                  </div>

                  {/* Take button */}
                  {med.active && (
                    <button
                      className={`med-check ${taken ? 'checked' : ''}`}
                      onClick={() => handleToggleTaken(med.id)}
                      title={taken ? 'Mark as not taken' : 'Mark as taken'}
                    >
                      {taken ? '✓' : ''}
                    </button>
                  )}
                </div>

                {/* Stats */}
                <div className="med-stats-row">
                  {streak > 0 && (
                    <span className="med-stat streak">
                      🔥 {streak} day streak
                    </span>
                  )}
                  {adherence !== null && (
                    <span className="med-stat adherence">
                      📊 {adherence}% this month
                    </span>
                  )}
                  {taken && (
                    <span className="med-stat taken-today">
                      ✅ Taken today
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="med-actions">
                  <button
                    className="med-action-btn"
                    onClick={() => handleToggleActive(med.id, med.active)}
                  >
                    {med.active ? '⏸ Pause' : '▶ Resume'}
                  </button>
                  <button
                    className="med-action-btn danger"
                    onClick={() => handleDelete(med.id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add button */}
      <button
        className="meds-add-btn"
        onClick={() => setShowAddModal(true)}
      >
        + Add pill or supplement
      </button>

      {/* Add modal */}
      {showAddModal && (
        <div
          className="meds-modal-overlay"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="meds-modal"
            onClick={e => e.stopPropagation()}
          >
            <p className="meds-modal-title">💊 Add medication</p>
            <p className="meds-modal-sub">
              Choose type and set a daily reminder
            </p>

            {/* Type picker */}
            <div className="meds-type-grid">
              {MEDICATION_TYPES.map(type => (
                <button
                  key={type.id}
                  className={`meds-type-btn ${newMed.type === type.id ? 'selected' : ''}`}
                  style={newMed.type === type.id ? {
                    borderColor: type.color,
                    background: type.color + '15',
                  } : {}}
                  onClick={() => setNewMed(prev => ({
                    ...prev,
                    type: type.id,
                    name: prev.name || type.label,
                  }))}
                >
                  <span>{type.emoji}</span>
                  <span className="meds-type-label">{type.label}</span>
                </button>
              ))}
            </div>

            {/* Name */}
            <div className="meds-form-group">
              <label className="meds-form-label">Medication name *</label>
              <input
                className="meds-form-input"
                placeholder="e.g. Yasmin, Folic acid, Feroglobin"
                value={newMed.name}
                onChange={e => setNewMed(prev => ({
                  ...prev, name: e.target.value
                }))}
                autoFocus
              />
            </div>

            {/* Dosage */}
            <div className="meds-form-group">
              <label className="meds-form-label">
                Dosage <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>(optional)</span>
              </label>
              <input
                className="meds-form-input"
                placeholder="e.g. 1 tablet, 400mcg, 5mg"
                value={newMed.dosage}
                onChange={e => setNewMed(prev => ({
                  ...prev, dosage: e.target.value
                }))}
              />
            </div>

            {/* Reminder time */}
            <div className="meds-form-group">
              <label className="meds-form-label">
                Daily reminder time
              </label>
              <input
                type="time"
                className="meds-form-input"
                value={newMed.reminderTime}
                onChange={e => setNewMed(prev => ({
                  ...prev, reminderTime: e.target.value
                }))}
              />
              <p style={{
                fontSize: 11,
                color: 'var(--text-secondary)',
                marginTop: 4,
              }}>
                You will get a notification at this time every day
              </p>
            </div>

            {/* Actions */}
            <div className="meds-modal-actions">
              <button
                className="meds-modal-cancel"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="meds-modal-save"
                onClick={handleAddMedication}
                disabled={!newMed.name.trim()}
              >
                Add reminder ✓
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Medications