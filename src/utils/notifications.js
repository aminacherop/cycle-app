import dayjs from 'dayjs'

// ── REQUEST PERMISSION ────────────────────────────
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Browser does not support notifications')
    return false
  }
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export const getNotificationPermission = () => {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission // 'granted' | 'denied' | 'default'
}

// ── SHOW NOTIFICATION ─────────────────────────────
export const showNotification = (title, options = {}) => {
  if (Notification.permission !== 'granted') return
  try {
    new Notification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      ...options,
    })
  } catch (err) {
    console.error('Notification error:', err)
  }
}

// ── SCHEDULE WITH SETTIMEOUT ──────────────────────
// For PWA without service worker — fires while app is open
const scheduledTimers = new Map()

export const clearAllScheduled = () => {
  scheduledTimers.forEach(timer => clearTimeout(timer))
  scheduledTimers.clear()
}

const scheduleAt = (id, date, title, body, options = {}) => {
  const msUntil = dayjs(date).diff(dayjs(), 'millisecond')
  if (msUntil < 0) return // already passed
  if (scheduledTimers.has(id)) clearTimeout(scheduledTimers.get(id))
  const timer = setTimeout(() => {
    showNotification(title, { body, ...options })
    scheduledTimers.delete(id)
  }, msUntil)
  scheduledTimers.set(id, timer)
}

// ── SCHEDULE ALL REMINDERS ─────────────────────────
export const scheduleAllReminders = (cycleSettings, notificationPrefs) => {
  if (Notification.permission !== 'granted') return
  if (!notificationPrefs?.enabled) return

  clearAllScheduled()

  const {
    cycleLength = 28,
    periodLength = 5,
    lastPeriodStart,
  } = cycleSettings

  if (!lastPeriodStart) return

  const lpsDate = dayjs(lastPeriodStart)
  const today = dayjs()

  // Find next period
  let nextPeriod = lpsDate.add(cycleLength, 'day')
  while (nextPeriod.isBefore(today, 'day')) {
    nextPeriod = nextPeriod.add(cycleLength, 'day')
  }

  const ovulationDate = lpsDate.add(cycleLength - 14, 'day')
  const fertileStart = ovulationDate.subtract(5, 'day')

  // 1. Period reminder — 2 days before
  if (notificationPrefs?.periodReminder) {
    const twoDaysBefore = nextPeriod.subtract(2, 'day').hour(8).minute(0)
    scheduleAt(
      'period-2days',
      twoDaysBefore,
      '🩸 Period coming soon',
      `Your period is expected in 2 days on ${nextPeriod.format('MMMM D')}. Be prepared!`,
    )

    // 1 day before
    const oneDayBefore = nextPeriod.subtract(1, 'day').hour(8).minute(0)
    scheduleAt(
      'period-1day',
      oneDayBefore,
      '🩸 Period tomorrow',
      `Your period is expected tomorrow. Stock up on pads or tampons!`,
    )

    // Day of period
    scheduleAt(
      'period-today',
      nextPeriod.hour(7).minute(0),
      '🩸 Period expected today',
      `Today is your expected period start date. Log your flow when it starts.`,
    )
  }

  // 2. Ovulation reminder
  if (notificationPrefs?.ovulationReminder) {
    const dayBeforeOvulation = ovulationDate.subtract(1, 'day').hour(8).minute(0)
    if (dayBeforeOvulation.isAfter(today)) {
      scheduleAt(
        'ovulation-tomorrow',
        dayBeforeOvulation,
        '✨ Ovulation tomorrow',
        `Tomorrow is your estimated ovulation day — your most fertile day of the cycle.`,
      )
    }

    const ovulationDay = ovulationDate.hour(7).minute(30)
    if (ovulationDay.isAfter(today)) {
      scheduleAt(
        'ovulation-today',
        ovulationDay,
        '✨ Ovulation day!',
        `Today is your estimated ovulation day. Peak fertility — highest chance of conception.`,
      )
    }
  }

  // 3. Fertile window reminder
  if (notificationPrefs?.fertileReminder) {
    const fertileStartReminder = fertileStart.hour(8).minute(0)
    if (fertileStartReminder.isAfter(today)) {
      scheduleAt(
        'fertile-start',
        fertileStartReminder,
        '🌱 Fertile window starts today',
        `Your fertile window has started. It lasts until ${ovulationDate.add(1, 'day').format('MMMM D')}.`,
      )
    }
  }

  // 4. Daily log reminder
  if (notificationPrefs?.dailyReminder) {
    const reminderHour = notificationPrefs?.dailyReminderTime || 20
    const todayReminder = today.hour(reminderHour).minute(0).second(0)
    const reminderTime = todayReminder.isAfter(today)
      ? todayReminder
      : todayReminder.add(1, 'day')

    scheduleAt(
      'daily-log',
      reminderTime,
      '📝 Daily log reminder',
      `Don't forget to log your mood and symptoms today!`,
    )
  }
}
// ── MEDICATION REMINDERS ──────────────────────────
export const scheduleMedicationReminders = (medications) => {
  if (Notification.permission !== 'granted') return

  medications.forEach(med => {
    if (!med.active || !med.reminderTime) return

    const [hour, minute] = med.reminderTime.split(':').map(Number)
    const today = dayjs()
    let reminderTime = today.hour(hour).minute(minute).second(0)

    if (reminderTime.isBefore(today)) {
      reminderTime = reminderTime.add(1, 'day')
    }

    const id = `med-${med.id}`
    scheduleAt(
      id,
      reminderTime,
      `💊 Time for your ${med.name}`,
      `Don't forget to take your ${med.name} today!`,
    )
  })
}

// ── SEND IMMEDIATE TEST NOTIFICATION ─────────────
export const sendTestNotification = () => {
  showNotification('🌸 CycleApp notifications enabled!', {
    body: 'You will now receive period reminders, ovulation alerts, and daily log reminders.',
  })
}
