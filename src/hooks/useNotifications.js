import { useState, useEffect, useCallback } from 'react'
import {
  requestNotificationPermission,
  getNotificationPermission,
  scheduleAllReminders,
  sendTestNotification,
  clearAllScheduled,
} from '../utils/notifications'
import { saveData, loadData } from '../utils/storage'

const DEFAULT_PREFS = {
  enabled: false,
  periodReminder: true,
  ovulationReminder: true,
  fertileReminder: true,
  dailyReminder: true,
  dailyReminderTime: 20, // 8pm
}

const useNotifications = (cycleSettings) => {
  const [permission, setPermission] = useState(getNotificationPermission())
  const [prefs, setPrefs] = useState(DEFAULT_PREFS)
  const [loading, setLoading] = useState(true)

  // Load saved prefs
  useEffect(() => {
    const load = async () => {
      const saved = await loadData('notification_prefs', DEFAULT_PREFS)
      setPrefs(saved)
      setPermission(getNotificationPermission())
      setLoading(false)
    }
    load()
  }, [])

  // Reschedule whenever prefs or cycleSettings change
  useEffect(() => {
    if (!loading && prefs.enabled && cycleSettings?.lastPeriodStart) {
      scheduleAllReminders(cycleSettings, prefs)
    }
  }, [prefs, cycleSettings, loading])

  const enableNotifications = useCallback(async () => {
    const granted = await requestNotificationPermission()
    setPermission(granted ? 'granted' : 'denied')
    if (granted) {
      const newPrefs = { ...prefs, enabled: true }
      setPrefs(newPrefs)
      await saveData('notification_prefs', newPrefs)
      scheduleAllReminders(cycleSettings, newPrefs)
      sendTestNotification()
    }
    return granted
  }, [prefs, cycleSettings])

  const disableNotifications = useCallback(async () => {
    const newPrefs = { ...prefs, enabled: false }
    setPrefs(newPrefs)
    await saveData('notification_prefs', newPrefs)
    clearAllScheduled()
  }, [prefs])

  const updatePref = useCallback(async (key, value) => {
    const newPrefs = { ...prefs, [key]: value }
    setPrefs(newPrefs)
    await saveData('notification_prefs', newPrefs)
    if (newPrefs.enabled && cycleSettings?.lastPeriodStart) {
      scheduleAllReminders(cycleSettings, newPrefs)
    }
  }, [prefs, cycleSettings])

  return {
    permission,
    prefs,
    loading,
    enableNotifications,
    disableNotifications,
    updatePref,
  }
}

export default useNotifications