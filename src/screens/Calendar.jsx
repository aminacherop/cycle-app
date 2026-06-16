import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Calendar.css'
import dayjs from 'dayjs'

const Calendar = ({ cycleSettings, setCycleSettings,dailyLogs, calendarEdits, updateCalendarEdits  }) => {
  const navigate = useNavigate()

  // ── STATE ──────────────────────────────────────────────────────────
  const [currentMonth, setCurrentMonth] = useState(dayjs())
  const [selectedDay, setSelectedDay] = useState(null)
  const [viewMode, setViewMode] = useState('cycle')
  const [editData, setEditData] = useState({ flow: null, moods: [], symptoms: [] })
  const [showCycleEditor, setShowCycleEditor] = useState(false)
  const [editingPeriod, setEditingPeriod] = useState(false)
  const [selectingStart, setSelectingStart] = useState(true)
  const [savedEdits, setSavedEdits] = useState(calendarEdits || {})

  // ── SETTINGS ───────────────────────────────────────────────────────
  const cycleLength = cycleSettings?.cycleLength || 26
  const periodLength = cycleSettings?.periodLength || 4
  const lastPeriodStart = cycleSettings?.lastPeriodStart || dayjs().format('YYYY-MM-DD')

  const [periodStart, setPeriodStart] = useState(() => {
    const lps = dayjs(lastPeriodStart)
    return lps.date()
  })
  const [periodEnd, setPeriodEnd] = useState(() => {
    const lps = dayjs(lastPeriodStart)
    return lps.date() + periodLength - 1
  })
  const [draftCycle, setDraftCycle] = useState({
    cycleLength,
    periodLength,
    lastPeriodStart,
  })

  // ── TODAY & CURRENT MONTH ──────────────────────────────────────────
  const today = dayjs()
  const isCurrentMonth = currentMonth.format('YYYY-MM') === today.format('YYYY-MM')
  const startDayOfWeek = currentMonth.startOf('month').day()
  const daysInMonth = currentMonth.daysInMonth()

  // ── CYCLE CALCULATIONS ─────────────────────────────────────────────
  const lpsDate = dayjs(lastPeriodStart)
  const monthsDiff = currentMonth.diff(lpsDate, 'day')
  const cycleOffset = Math.floor(monthsDiff / cycleLength)

  const allPeriodDaysInMonth = new Set()
  const allOvulationDays = []
  const allFertileDays = []

  ;[-2, -1, 0, 1, 2, 3].forEach(offset => {
    const cycleStart = lpsDate.add((cycleOffset + offset) * cycleLength, 'day')
    const cycleOvulation = cycleStart.add(cycleLength - 14, 'day')
    const cycleFertileStart = cycleOvulation.subtract(5, 'day')
    const cycleFertileEnd = cycleOvulation.add(1, 'day')

    // Period days
    for (let i = 0; i < periodLength; i++) {
      const d = cycleStart.add(i, 'day')
      if (d.format('YYYY-MM') === currentMonth.format('YYYY-MM')) {
        allPeriodDaysInMonth.add(d.date())
      }
    }

    // Ovulation
    if (cycleOvulation.format('YYYY-MM') === currentMonth.format('YYYY-MM')) {
      allOvulationDays.push(cycleOvulation.date())
    }

    // Fertile days
    let fd = cycleFertileStart.clone()
    while (fd.isBefore(cycleFertileEnd) || fd.isSame(cycleFertileEnd, 'day')) {
      if (fd.format('YYYY-MM') === currentMonth.format('YYYY-MM')) {
        allFertileDays.push(fd.date())
      }
      fd = fd.add(1, 'day')
    }
  })

  // Apply manual period adjustments for the lps month
  const viewingLpsMonth = currentMonth.format('YYYY-MM') === lpsDate.format('YYYY-MM')
  if (viewingLpsMonth) {
    for (let i = 0; i < periodLength; i++) {
      allPeriodDaysInMonth.delete(lpsDate.date() + i)
    }
    for (let d = periodStart; d <= periodEnd; d++) {
      allPeriodDaysInMonth.add(d)
    }
  }

  const ovulationDayOfMonth = allOvulationDays.length > 0 ? allOvulationDays[0] : null
  const fertileDaysOfMonth = [...new Set(allFertileDays)].filter(
    d => !allPeriodDaysInMonth.has(d)
  )

  // ── SUMMARY DATES ──────────────────────────────────────────────────
  const relevantCycleStart = lpsDate.add(cycleOffset * cycleLength, 'day')
  const relevantOvulation = relevantCycleStart.add(cycleLength - 14, 'day')
  const relevantFertileStart = relevantOvulation.subtract(5, 'day')
  const relevantFertileEnd = relevantOvulation.add(1, 'day')
  const ovulationDate = relevantOvulation

  let nextPeriodDate = lpsDate.add(cycleLength, 'day')
  while (nextPeriodDate.isBefore(today, 'day')) {
    nextPeriodDate = nextPeriodDate.add(cycleLength, 'day')
  }

  // ── CYCLE DATA OBJECT ──────────────────────────────────────────────
  const cycleData = {
    fertileDays: fertileDaysOfMonth,
    ovulationDay: ovulationDayOfMonth,
    periodDays: [...allPeriodDaysInMonth],
  }

  // ── SUMMARY OBJECT ─────────────────────────────────────────────────
  const summary = {
    periodStart: relevantCycleStart.format('MMM D'),
    periodEnd: relevantCycleStart.add(periodLength - 1, 'day').format('MMM D'),
    ovulation: relevantOvulation.format('MMM D, YYYY'),
    fertileStart: relevantFertileStart.format('MMM D'),
    fertileEnd: relevantFertileEnd.format('MMM D'),
    nextPeriod: nextPeriodDate.format('MMM D, YYYY'),
    daysUntilNext: Math.max(0, nextPeriodDate.diff(today, 'day')),
    cycleLength,
    periodLength,
  }

  // ── CONSTANTS ──────────────────────────────────────────────────────
  const conceptionColors = {
    high: { bg: '#EF4444', text: 'white', label: 'High chance' },
    medium: { bg: '#F59E0B', text: 'white', label: 'Medium chance' },
    low: { bg: '#10B981', text: 'white', label: 'Low chance' },
    none: { bg: null, text: null, label: 'Very low' },
  }

  const typeColors = {
    period: { bg: '#C2527A', text: 'white', label: 'Period' },
    'period-light': { bg: '#F8DDE6', text: '#9A3A5C', label: 'Period' },
    fertile: { bg: '#D1FAE5', text: '#065F46', label: 'Fertile' },
    ovulation: { bg: '#FEF3C7', text: '#92400E', label: 'Ovulation' },
  }

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
    { id: 'tired', label: 'Tired', emoji: '😴' },
    { id: 'calm', label: 'Calm', emoji: '😌' },
    { id: 'irritable', label: 'Irritable', emoji: '😤' },
    { id: 'energetic', label: 'Energetic', emoji: '💪' },
    { id: 'anxious', label: 'Anxious', emoji: '😰' },
    { id: 'moody', label: 'Moody', emoji: '🌊' },
  ]

  const symptomOptions = [
    { id: 'cramps', label: 'Cramps', emoji: '⚡' },
    { id: 'headache', label: 'Headache', emoji: '🤕' },
    { id: 'bloating', label: 'Bloating', emoji: '🫧' },
    { id: 'backpain', label: 'Back pain', emoji: '🦴' },
    { id: 'nausea', label: 'Nausea', emoji: '🤢' },
    { id: 'cravings', label: 'Cravings', emoji: '🍫' },
    { id: 'acne', label: 'Acne', emoji: '😖' },
    { id: 'insomnia', label: 'Insomnia', emoji: '🌙' },
  ]

  const flowEmoji = {
    heavy: '💧💧💧', medium: '💧💧',
    light: '💧', spotting: '🩸', none: '⬜',
  }

  // ── FUNCTIONS ──────────────────────────────────────────────────────
   const getDayLog = (day) => {
  const key = `${currentMonth.format('YYYY-MM')}-${day}`
  // Check calendar edits first
  if (savedEdits[key]) return savedEdits[key]
  // Check real daily logs
  const dateStr = currentMonth.date(day).format('YYYY-MM-DD')
  if (dailyLogs && dailyLogs[dateStr]) return dailyLogs[dateStr]
  // Sample logs for period days only
  if (cycleData.periodDays.includes(day)) {
    const sorted = [...cycleData.periodDays].sort((a, b) => a - b)
    const idx = sorted.indexOf(day)
    const samples = [
      { flow: 'heavy', moods: ['tired'], symptoms: ['cramps'] },
      { flow: 'heavy', moods: ['tired', 'irritable'], symptoms: ['cramps', 'headache'] },
      { flow: 'medium', moods: ['sad'], symptoms: ['bloating'] },
      { flow: 'light', moods: ['calm'], symptoms: [] },
    ]
    return samples[idx] || samples[0]
  }
  return null
}
  const getDayType = (day) => {
    if (cycleData.periodDays.includes(day)) return 'period'
    if (cycleData.ovulationDay !== null && cycleData.ovulationDay === day) return 'ovulation'
    if (cycleData.fertileDays.includes(day)) return 'fertile'
    return null
  }

  const getConceptionChance = (day) => {
    const ov = cycleData.ovulationDay
    if (ov === null) return 'none'
    if (day === ov) return 'high'
    if (day === ov - 1 || day === ov + 1) return 'high'
    if (cycleData.fertileDays.includes(day)) return 'medium'
    if (day >= ov - 7 && day <= ov + 3) return 'low'
    return 'none'
  }

  const getConceptionPercent = (day) => {
    const ov = cycleData.ovulationDay
    if (ov === null) return { percent: 1, level: 'Minimal', color: '#D1D5DB', bar: 3 }
    const diff = Math.abs(day - ov)
    if (day === ov) return { percent: 33, level: 'Peak', color: '#EF4444', bar: 100 }
    if (diff === 1) return { percent: 28, level: 'Very High', color: '#EF4444', bar: 85 }
    if (diff === 2) return { percent: 20, level: 'High', color: '#F97316', bar: 65 }
    if (diff === 3) return { percent: 15, level: 'Medium', color: '#F59E0B', bar: 48 }
    if (diff === 4) return { percent: 10, level: 'Medium', color: '#F59E0B', bar: 34 }
    if (diff === 5) return { percent: 5, level: 'Low', color: '#10B981', bar: 18 }
    if (diff <= 7) return { percent: 2, level: 'Very Low', color: '#6B7280', bar: 8 }
    return { percent: 1, level: 'Minimal', color: '#D1D5DB', bar: 3 }
  }

  const getConceptionTip = (day) => {
    const ov = cycleData.ovulationDay
    if (ov === null) return '🌙 Ovulation falls outside this month.'
    if (day === ov) return '✨ Ovulation day — peak fertility. Highest chance of conception.'
    if (day === ov - 1) return '🔥 One day before ovulation — very high fertility.'
    if (day === ov + 1) return '🔥 One day after ovulation — still very high fertility.'
    if (day === ov - 2) return '📈 Fertility rising fast. Sperm deposited today can survive until ovulation.'
    if (day === ov + 2) return '📉 Fertility beginning to decline after ovulation.'
    if (cycleData.fertileDays.includes(day) && day < ov - 2) return '🌱 In the fertile window. Pregnancy is possible.'
    if (!cycleData.fertileDays.includes(day) && day > ov + 2) return '📉 Outside fertile window. Conception is unlikely.'
    return '🌙 Not yet in fertile window. Fertility is low.'
  }

  const getOvulationDistance = (day) => {
    const ov = cycleData.ovulationDay
    if (ov === null) return 'Ovulation outside this month'
    if (day === ov) return '✨ Ovulation day!'
    if (day < ov) return `${ov - day} days to ovulation`
    return `${day - ov} days after ovulation`
  }

  const toggleMood = (id) => setEditData(prev => ({
    ...prev,
    moods: prev.moods.includes(id)
      ? prev.moods.filter(m => m !== id)
      : [...prev.moods, id]
  }))

  const toggleSymptom = (id) => setEditData(prev => ({
    ...prev,
    symptoms: prev.symptoms.includes(id)
      ? prev.symptoms.filter(s => s !== id)
      : [...prev.symptoms, id]
  }))

  const handleDayClick = (day) => {
    if (viewMode === 'edit') {
      if (editingPeriod) {
        if (selectingStart) {
          setPeriodStart(day)
          if (day > periodEnd) setPeriodEnd(day)
          setSelectingStart(false)
        } else {
          if (day < periodStart) {
            setPeriodEnd(periodStart)
            setPeriodStart(day)
          } else {
            setPeriodEnd(day)
          }
          setEditingPeriod(false)
          setSelectingStart(true)
          setSelectedDay(null)
          return
        }
      } else {
        setSelectedDay(day)
        const existing = getDayLog(day)
        setEditData({
          flow: existing?.flow || null,
          moods: existing?.moods || [],
          symptoms: existing?.symptoms || [],
        })
      }
    } else {
      setSelectedDay(day)
    }
  }

  const handleSaveEdit = () => {
  const key = `${currentMonth.format('YYYY-MM')}-${selectedDay}`
  const updated = { ...savedEdits, [key]: { ...editData } }
  setSavedEdits(updated)
  if (updateCalendarEdits) updateCalendarEdits(updated)
  setSelectedDay(null)
}

  const getDayStyle = (day) => {
    if (viewMode === 'conception') {
      const c = conceptionColors[getConceptionChance(day)]
      if (c.bg) return { background: c.bg, color: c.text }
      return {}
    }
    if (viewMode === 'edit' && editingPeriod && day === periodStart) {
      return { background: '#C2527A', color: 'white' }
    }
    const type = getDayType(day)
    if (type) return { background: typeColors[type].bg, color: typeColors[type].text }
    return {}
  }

  // ── JSX ────────────────────────────────────────────────────────────
  return (
    <div className="calendar-screen">

      <div className="cal-header">
        <h2 className="cal-title">Calendar</h2>
      </div>

      {/* View tabs */}
      <div className="view-tabs">
        <button
          className={`view-tab ${viewMode === 'cycle' ? 'active' : ''}`}
          onClick={() => { setViewMode('cycle'); setSelectedDay(null); setEditingPeriod(false); setShowCycleEditor(false) }}
        >
          📅 Cycle
        </button>
        <button
          className={`view-tab ${viewMode === 'conception' ? 'active' : ''}`}
          onClick={() => { setViewMode('conception'); setSelectedDay(null); setEditingPeriod(false); setShowCycleEditor(false) }}
        >
          🌱 Conception
        </button>
        <button
          className={`view-tab ${viewMode === 'edit' ? 'active' : ''}`}
          onClick={() => { setViewMode('edit'); setSelectedDay(null); setEditingPeriod(false) }}
        >
          ✏️ Edit
        </button>
      </div>

      {/* Conception legend */}
      {viewMode === 'conception' && (
        <div className="conception-bar">
          {[
            { color: '#EF4444', label: 'High' },
            { color: '#F59E0B', label: 'Medium' },
            { color: '#10B981', label: 'Low' },
            { color: '#E5E7EB', label: 'Very low' },
          ].map(item => (
            <div key={item.label} className="conception-item">
              <span className="conception-dot" style={{ background: item.color }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Edit controls */}
      {viewMode === 'edit' && (
        <div className="edit-controls">

          {/* Period date adjustment */}
          <div className="period-adjust-card">
            <div className="period-adjust-header">
              <p className="period-adjust-title">🩸 Adjust period dates</p>
              {!editingPeriod ? (
                <button className="adjust-btn" onClick={() => {
                  setEditingPeriod(true); setSelectingStart(true); setSelectedDay(null)
                }}>
                  Adjust ✏️
                </button>
              ) : (
                <button className="adjust-btn cancel" onClick={() => {
                  setEditingPeriod(false); setSelectingStart(true)
                }}>
                  Cancel ✕
                </button>
              )}
            </div>

            <div className="period-dates-row">
              <div className={`period-date-chip ${editingPeriod && selectingStart ? 'active' : ''}`}>
                <span className="period-date-label">Start</span>
                <span className="period-date-value">{currentMonth.format('MMM')} {periodStart}</span>
                {editingPeriod && selectingStart && <span className="period-date-hint">← tap day</span>}
              </div>
              <span className="period-date-arrow">→</span>
              <div className={`period-date-chip ${editingPeriod && !selectingStart ? 'active' : ''}`}>
                <span className="period-date-label">End</span>
                <span className="period-date-value">{currentMonth.format('MMM')} {periodEnd}</span>
                {editingPeriod && !selectingStart && <span className="period-date-hint">← tap day</span>}
              </div>
              <div className="period-date-chip duration">
                <span className="period-date-label">Duration</span>
                <span className="period-date-value">{periodEnd - periodStart + 1} days</span>
              </div>
            </div>

            {editingPeriod && (
              <p className="period-adjust-hint">
                {selectingStart
                  ? '👆 Tap the day your period started on the calendar below'
                  : '👆 Now tap the day your period ended'}
              </p>
            )}
          </div>

          {/* Cycle & period length editor */}
          <div className="period-adjust-card">
            <div className="period-adjust-header">
              <p className="period-adjust-title">🔄 Cycle & period length</p>
              <button className="adjust-btn" onClick={() => {
                setShowCycleEditor(!showCycleEditor)
                setDraftCycle({ cycleLength, periodLength, lastPeriodStart })
              }}>
                {showCycleEditor ? 'Close ✕' : 'Edit ✏️'}
              </button>
            </div>

            <div className="period-dates-row">
              <div className="period-date-chip">
                <span className="period-date-label">Cycle length</span>
                <span className="period-date-value">{cycleLength} days</span>
              </div>
              <div className="period-date-chip">
                <span className="period-date-label">Period length</span>
                <span className="period-date-value">{periodLength} days</span>
              </div>
              <div className="period-date-chip">
                <span className="period-date-label">Ovulation</span>
                <span className="period-date-value">{ovulationDate.format('MMM D')}</span>
              </div>
            </div>

            {showCycleEditor && (
              <div className="cycle-editor">

                <div className="cycle-editor-row">
                  <div className="cycle-editor-label-row">
                    <p className="cycle-editor-label">📅 Last period start date</p>
                  </div>
                  <input
                    type="date"
                    className="cycle-date-input"
                    value={draftCycle.lastPeriodStart}
                    max={dayjs().format('YYYY-MM-DD')}
                    onChange={e => setDraftCycle(prev => ({ ...prev, lastPeriodStart: e.target.value }))}
                  />
                  <p className="cycle-date-hint">💡 First day of your most recent period</p>
                </div>

                <div className="cycle-editor-row">
                  <div className="cycle-editor-label-row">
                    <p className="cycle-editor-label">📅 Last period end date</p>
                    <span className="cycle-editor-value">
                      {draftCycle.lastPeriodStart
                        ? dayjs(draftCycle.lastPeriodStart).add(draftCycle.periodLength - 1, 'day').format('MMM D, YYYY')
                        : '—'}
                    </span>
                  </div>
                  <div className="cycle-date-auto">🔄 Auto-calculated from period length below</div>
                </div>

                <div className="cycle-editor-row">
                  <div className="cycle-editor-label-row">
                    <p className="cycle-editor-label">🔄 Average cycle length</p>
                    <span className="cycle-editor-value">{draftCycle.cycleLength} days</span>
                  </div>
                  <input
                    type="range" min="21" max="45" step="1"
                    value={draftCycle.cycleLength}
                    className="cycle-slider"
                    onChange={e => setDraftCycle(prev => ({ ...prev, cycleLength: parseInt(e.target.value) }))}
                  />
                  <div className="cycle-slider-labels">
                    <span>21</span><span>Short</span><span>Average</span><span>Long</span><span>45</span>
                  </div>
                </div>

                <div className="cycle-editor-row">
                  <div className="cycle-editor-label-row">
                    <p className="cycle-editor-label">🩸 Average period length</p>
                    <span className="cycle-editor-value">{draftCycle.periodLength} days</span>
                  </div>
                  <input
                    type="range" min="2" max="10" step="1"
                    value={draftCycle.periodLength}
                    className="cycle-slider"
                    onChange={e => setDraftCycle(prev => ({ ...prev, periodLength: parseInt(e.target.value) }))}
                  />
                  <div className="cycle-slider-labels">
                    <span>2</span><span>Short</span><span>Average</span><span>Long</span><span>10</span>
                  </div>
                </div>

                {draftCycle.lastPeriodStart && (
                  <div className="cycle-preview">
                    <p className="cycle-preview-title">📊 Your cycle preview</p>
                    <div className="cycle-preview-row">
                      <div className="cycle-preview-item">
                        <span className="cycle-preview-label">Period starts</span>
                        <span className="cycle-preview-value">
                          {dayjs(draftCycle.lastPeriodStart).format('MMM D')}
                        </span>
                      </div>
                      <div className="cycle-preview-item">
                        <span className="cycle-preview-label">Period ends</span>
                        <span className="cycle-preview-value">
                          {dayjs(draftCycle.lastPeriodStart).add(draftCycle.periodLength - 1, 'day').format('MMM D')}
                        </span>
                      </div>
                      <div className="cycle-preview-item">
                        <span className="cycle-preview-label">Ovulation</span>
                        <span className="cycle-preview-value">
                          {dayjs(draftCycle.lastPeriodStart).add(draftCycle.cycleLength - 14, 'day').format('MMM D')}
                        </span>
                      </div>
                      <div className="cycle-preview-item">
                        <span className="cycle-preview-label">Fertile window</span>
                        <span className="cycle-preview-value">
                          {dayjs(draftCycle.lastPeriodStart).add(draftCycle.cycleLength - 19, 'day').format('MMM D')}
                          {' – '}
                          {dayjs(draftCycle.lastPeriodStart).add(draftCycle.cycleLength - 13, 'day').format('MMM D')}
                        </span>
                      </div>
                      <div className="cycle-preview-item">
                        <span className="cycle-preview-label">Next period</span>
                        <span className="cycle-preview-value" style={{ color: '#C2527A' }}>
                          {dayjs(draftCycle.lastPeriodStart).add(draftCycle.cycleLength, 'day').format('MMM D, YYYY')}
                        </span>
                      </div>
                      <div className="cycle-preview-item">
                        <span className="cycle-preview-label">Days until</span>
                        <span className="cycle-preview-value" style={{ color: '#C2527A' }}>
                          {Math.max(0, dayjs(draftCycle.lastPeriodStart).add(draftCycle.cycleLength, 'day').diff(dayjs(), 'day'))} days
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="edit-actions">
                  <button className="edit-cancel" onClick={() => setShowCycleEditor(false)}>Cancel</button>
                  <button className="edit-save" onClick={() => {
                    setCycleSettings(prev => ({
                      ...prev,
                      cycleLength: draftCycle.cycleLength,
                      periodLength: draftCycle.periodLength,
                      lastPeriodStart: draftCycle.lastPeriodStart,
                    }))
                    const lps = dayjs(draftCycle.lastPeriodStart)
                    if (lps.format('YYYY-MM') === currentMonth.format('YYYY-MM')) {
                      setPeriodStart(lps.date())
                      setPeriodEnd(lps.date() + draftCycle.periodLength - 1)
                    }
                    setShowCycleEditor(false)
                  }}>
                    Save settings
                  </button>
                </div>

              </div>
            )}
          </div>

          {!editingPeriod && !showCycleEditor && (
            <p className="edit-hint-bar">✏️ Tap any day below to edit its mood and symptoms</p>
          )}

        </div>
      )}

      {/* Month Navigator */}
      <div className="month-nav">
        <button className="month-nav-btn" onClick={() => { setCurrentMonth(p => p.subtract(1, 'month')); setSelectedDay(null) }}>‹</button>
        <h3 className="month-name">{currentMonth.format('MMMM YYYY')}</h3>
        <button className="month-nav-btn" onClick={() => { setCurrentMonth(p => p.add(1, 'month')); setSelectedDay(null) }}>›</button>
      </div>

      {/* Day labels */}
      <div className="day-labels">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <span key={d} className="day-label">{d}</span>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="cal-grid">
        {[...Array(startDayOfWeek)].map((_, i) => (
          <div key={`empty-${i}`} className="cal-day empty" />
        ))}
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1
          const isToday = isCurrentMonth && today.date() === day
          const isSelected = selectedDay === day
          const isPeriodStart = viewMode === 'edit' && editingPeriod && day === periodStart
          const isPeriodEnd = viewMode === 'edit' && editingPeriod && day === periodEnd
          const log = getDayLog(day)
          const style = getDayStyle(day)
          const conception = getConceptionChance(day)

          return (
            <button
              key={day}
              className={`cal-day
                ${style.background ? 'has-type' : ''}
                ${isToday ? 'is-today' : ''}
                ${isSelected ? 'is-selected' : ''}
                ${viewMode === 'edit' ? 'edit-mode' : ''}
                ${isPeriodStart || isPeriodEnd ? 'period-anchor' : ''}
              `}
              style={style}
              onClick={() => handleDayClick(day)}
            >
              <span className={`day-num ${isToday && !style.background ? 'today-num' : ''}`}>
                {day}
              </span>
              {viewMode === 'cycle' && log && (
                <span className="day-dot">
                  {log.flow && log.flow !== 'none' ? '🩸' : log.moods?.length > 0 ? '·' : ''}
                </span>
              )}
              {viewMode === 'conception' && conception !== 'none' && (
                <span className="day-dot" style={{ fontSize: 7 }}>
                  {conception === 'high' ? '●●●' : conception === 'medium' ? '●●' : '●'}
                </span>
              )}
              {viewMode === 'edit' && !editingPeriod && <span className="edit-pencil">✎</span>}
              {viewMode === 'edit' && editingPeriod && (
                <span className="day-dot" style={{ fontSize: 8 }}>
                  {isPeriodStart ? '▲' : isPeriodEnd ? '▼' : ''}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Cycle Legend */}
      {viewMode === 'cycle' && (
        <div className="legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#C2527A' }} />
            <span>Period</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#FEF3C7', border: '1px solid #F59E0B' }} />
            <span>Ovulation</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#D1FAE5', border: '1px solid #10B981' }} />
            <span>Fertile</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot today-dot" />
            <span>Today</span>
          </div>
        </div>
      )}

      {/* Day detail */}
      {selectedDay && !editingPeriod && (() => {
        const log = getDayLog(selectedDay)
        const type = getDayType(selectedDay)
        const typeStyle = type ? typeColors[type] : null
        const conception = getConceptionPercent(selectedDay)
        const fullDate = currentMonth.date(selectedDay).format('dddd, MMMM D')
        const selectedDate = currentMonth.date(selectedDay)
        const cycleDay = selectedDate.diff(lpsDate, 'day') + 1

        return (
          <div className="day-detail">

            <div className="day-detail-header">
              <div>
                <p className="day-detail-fulldate">{fullDate}</p>
                <div className="day-detail-badges">
                  <span className="day-cycle-badge">
                    {cycleDay > 0 && cycleDay <= cycleLength ? `Cycle day ${cycleDay}` : 'Outside current cycle'}
                  </span>
                  {typeStyle && (
                    <span className="day-detail-badge" style={{ background: typeStyle.bg, color: typeStyle.text }}>
                      {typeStyle.label}
                    </span>
                  )}
                </div>
              </div>
              {viewMode !== 'edit' && (
                <button className="day-detail-edit" onClick={() => {
                  setViewMode('edit')
                  setEditingPeriod(false)
                  const existing = getDayLog(selectedDay)
                  setEditData({
                    flow: existing?.flow || null,
                    moods: existing?.moods || [],
                    symptoms: existing?.symptoms || [],
                  })
                }}>
                  ✏️ Edit
                </button>
              )}
            </div>

            <div
              className="day-conception-card"
              style={{ borderColor: conception.color + '40', background: conception.color + '10' }}
            >
              <div className="day-conception-top">
                <div>
                  <p className="day-conception-label">Chances of getting pregnant</p>
                  <p className="day-conception-level" style={{ color: conception.color }}>{conception.level}</p>
                </div>
                <div className="day-conception-circle" style={{ background: conception.color }}>
                  <span className="day-conception-percent">{conception.percent}%</span>
                </div>
              </div>

              <div className="day-conception-bar-wrap">
                <div className="day-conception-bar-track">
                  <div className="day-conception-bar-fill" style={{ width: `${conception.bar}%`, background: conception.color }} />
                </div>
                <div className="day-conception-bar-ends">
                  <span>Low</span>
                  <span style={{ color: conception.color, fontWeight: 600 }}>{getOvulationDistance(selectedDay)}</span>
                  <span>Peak</span>
                </div>
              </div>

              <p className="day-conception-tip">{getConceptionTip(selectedDay)}</p>
            </div>

            {log ? (
              <div className="day-log-summary">
                <p className="day-log-title">📋 Log for this day</p>
                <div className="day-detail-content">
                  {log.flow && log.flow !== 'none' && (
                    <div className="detail-row">
                      <span className="detail-label">Flow</span>
                      <span className="detail-value">{flowEmoji[log.flow]} {log.flow}</span>
                    </div>
                  )}
                  {log.moods?.length > 0 && (
                    <div className="detail-row">
                      <span className="detail-label">Mood</span>
                      <span className="detail-value">{log.moods.join(', ')}</span>
                    </div>
                  )}
                  {log.symptoms?.length > 0 && (
                    <div className="detail-row">
                      <span className="detail-label">Symptoms</span>
                      <span className="detail-value">{log.symptoms.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="day-detail-empty">No log for this day yet — tap Edit to add one.</p>
            )}

          </div>
        )
      })()}

      {/* Edit panel */}
      {viewMode === 'edit' && selectedDay && !editingPeriod && (
        <div className="edit-panel">
          <div className="edit-panel-header">
            <p className="edit-panel-title">✏️ Editing — {currentMonth.format('MMMM')} {selectedDay}</p>
            <button className="edit-close" onClick={() => setSelectedDay(null)}>✕</button>
          </div>

          <div className="edit-section">
            <p className="edit-section-title">🩸 Period flow</p>
            <div className="edit-flow-row">
              {flowOptions.map(option => (
                <button
                  key={option.id}
                  className={`edit-flow-btn ${editData.flow === option.id ? 'selected' : ''}`}
                  style={editData.flow === option.id ? {
                    borderColor: option.color, background: option.color + '20', color: option.color,
                  } : {}}
                  onClick={() => setEditData(prev => ({ ...prev, flow: option.id }))}
                >
                  <span>{option.emoji}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="edit-section">
            <p className="edit-section-title">😊 Mood</p>
            <div className="edit-tag-row">
              {moodOptions.map(option => (
                <button
                  key={option.id}
                  className={`edit-tag ${editData.moods.includes(option.id) ? 'selected' : ''}`}
                  onClick={() => toggleMood(option.id)}
                >
                  {option.emoji} {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="edit-section">
            <p className="edit-section-title">⚡ Symptoms</p>
            <div className="edit-tag-row">
              {symptomOptions.map(option => (
                <button
                  key={option.id}
                  className={`edit-tag ${editData.symptoms.includes(option.id) ? 'selected' : ''}`}
                  onClick={() => toggleSymptom(option.id)}
                >
                  {option.emoji} {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="edit-actions">
            <button className="edit-cancel" onClick={() => setSelectedDay(null)}>Cancel</button>
            <button className="edit-save" onClick={handleSaveEdit}>Save changes</button>
          </div>
        </div>
      )}

      {/* Cycle Summary */}
      {viewMode === 'cycle' && !selectedDay && (
        <div className="cycle-summary">
          <p className="summary-title">📊 This cycle summary</p>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-emoji">🩸</span>
              <p className="summary-label">Period</p>
              <p className="summary-value">{summary.periodStart} – {summary.periodEnd}</p>
            </div>
            <div className="summary-item">
              <span className="summary-emoji">✨</span>
              <p className="summary-label">Ovulation</p>
              <p className="summary-value">{summary.ovulation}</p>
            </div>
            <div className="summary-item">
              <span className="summary-emoji">🌱</span>
              <p className="summary-label">Fertile window</p>
              <p className="summary-value">{summary.fertileStart} – {summary.fertileEnd}</p>
            </div>
            <div className="summary-item">
              <span className="summary-emoji">🔄</span>
              <p className="summary-label">Cycle length</p>
              <p className="summary-value">{summary.cycleLength} days</p>
            </div>
            <div className="summary-item">
              <span className="summary-emoji">📅</span>
              <p className="summary-label">Period length</p>
              <p className="summary-value">{summary.periodLength} days</p>
            </div>
            <div className="summary-item">
              <span className="summary-emoji">⏭️</span>
              <p className="summary-label">Next period</p>
              <p className="summary-value" style={{ color: '#C2527A' }}>{summary.nextPeriod}</p>
            </div>
            <div className="summary-item" style={{ gridColumn: 'span 2' }}>
              <span className="summary-emoji">⏳</span>
              <p className="summary-label">Days until next period</p>
              <p className="summary-value" style={{ color: '#C2527A' }}>{summary.daysUntilNext} days</p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Calendar