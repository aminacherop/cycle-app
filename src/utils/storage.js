import localforage from 'localforage'

// Configure localforage
localforage.config({
  name: 'CycleApp',
  storeName: 'cycleapp_data',
  description: 'Period tracker data',
})

// ── KEYS ──────────────────────────────────────────
const KEYS = {
  ONBOARDED: 'onboarded',
  PROFILE: 'profile',
  CYCLE_SETTINGS: 'cycle_settings',
  DAILY_LOGS: 'daily_logs',
  SAVED_EDITS: 'saved_edits',
  NOTIFICATIONS: 'notifications',
}

// ── GENERIC HELPERS ───────────────────────────────
export const saveData = async (key, value) => {
  try {
    await localforage.setItem(key, value)
    return true
  } catch (err) {
    console.error(`Error saving ${key}:`, err)
    return false
  }
}

export const loadData = async (key, defaultValue = null) => {
  try {
    const value = await localforage.getItem(key)
    return value !== null ? value : defaultValue
  } catch (err) {
    console.error(`Error loading ${key}:`, err)
    return defaultValue
  }
}

export const deleteData = async (key) => {
  try {
    await localforage.removeItem(key)
    return true
  } catch (err) {
    console.error(`Error deleting ${key}:`, err)
    return false
  }
}

export const clearAllData = async () => {
  try {
    await localforage.clear()
    return true
  } catch (err) {
    console.error('Error clearing data:', err)
    return false
  }
}

// ── ONBOARDING ────────────────────────────────────
export const saveOnboarded = (value) => saveData(KEYS.ONBOARDED, value)
export const loadOnboarded = () => loadData(KEYS.ONBOARDED, false)

// ── PROFILE ───────────────────────────────────────
export const saveProfile = (profile) => saveData(KEYS.PROFILE, profile)
export const loadProfile = () => loadData(KEYS.PROFILE, {
  name: '',
  dob: '',
  condition: 'none',
  email: '',
  phone: '',
})

// ── CYCLE SETTINGS ────────────────────────────────
export const saveCycleSettings = (settings) =>
  saveData(KEYS.CYCLE_SETTINGS, settings)

export const loadCycleSettings = () => loadData(KEYS.CYCLE_SETTINGS, {
  cycleLength: 28,
  periodLength: 5,
  lastPeriodStart: null,
})

// ── DAILY LOGS ────────────────────────────────────
// Each log is keyed by date: 'YYYY-MM-DD'
export const saveDailyLog = async (date, log) => {
  const all = await loadAllLogs()
  all[date] = { ...all[date], ...log, date, updatedAt: new Date().toISOString() }
  return saveData(KEYS.DAILY_LOGS, all)
}

export const loadDailyLog = async (date) => {
  const all = await loadAllLogs()
  return all[date] || null
}

export const loadAllLogs = async () => {
  return loadData(KEYS.DAILY_LOGS, {})
}

export const deleteDailyLog = async (date) => {
  const all = await loadAllLogs()
  delete all[date]
  return saveData(KEYS.DAILY_LOGS, all)
}

// ── CALENDAR EDITS ────────────────────────────────
export const saveCalendarEdits = (edits) =>
  saveData(KEYS.SAVED_EDITS, edits)

export const loadCalendarEdits = () =>
  loadData(KEYS.SAVED_EDITS, {})

// ── EXPORT ALL DATA ───────────────────────────────
export const exportAllData = async () => {
  const profile = await loadProfile()
  const cycleSettings = await loadCycleSettings()
  const logs = await loadAllLogs()
  return {
    exportDate: new Date().toISOString(),
    profile,
    cycleSettings,
    logs,
  }
}