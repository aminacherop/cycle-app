import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './NotificationSettings.css'
import useNotifications from '../hooks/useNotifications'
import dayjs from 'dayjs'

const NotificationSettings = ({ cycleSettings }) => {
  const navigate = useNavigate()
  const {
    permission,
    prefs,
    loading,
    enableNotifications,
    disableNotifications,
    updatePref,
  } = useNotifications(cycleSettings)

  const [enabling, setEnabling] = useState(false)

  const handleToggleMain = async () => {
    if (prefs.enabled) {
      await disableNotifications()
    } else {
      setEnabling(true)
      await enableNotifications()
      setEnabling(false)
    }
  }

  const reminderOptions = [
    {
      key: 'periodReminder',
      label: '🩸 Period reminder',
      desc: '2 days before, 1 day before, and on the day',
    },
    {
      key: 'ovulationReminder',
      label: '✨ Ovulation reminder',
      desc: 'Day before and on ovulation day',
    },
    {
      key: 'fertileReminder',
      label: '🌱 Fertile window alert',
      desc: 'When your fertile window starts',
    },
    {
      key: 'dailyReminder',
      label: '📝 Daily log reminder',
      desc: 'Reminder to log mood and symptoms',
    },
  ]

  const timeOptions = [
    { value: 7, label: '7:00 AM' },
    { value: 8, label: '8:00 AM' },
    { value: 9, label: '9:00 AM' },
    { value: 12, label: '12:00 PM' },
    { value: 18, label: '6:00 PM' },
    { value: 20, label: '8:00 PM' },
    { value: 21, label: '9:00 PM' },
    { value: 22, label: '10:00 PM' },
  ]

  // Calculate upcoming reminders
  const getUpcomingReminders = () => {
    if (!cycleSettings?.lastPeriodStart) return []
    const lps = dayjs(cycleSettings.lastPeriodStart)
    const cycleLength = cycleSettings.cycleLength || 28
    const today = dayjs()

    let nextPeriod = lps.add(cycleLength, 'day')
    while (nextPeriod.isBefore(today, 'day')) {
      nextPeriod = nextPeriod.add(cycleLength, 'day')
    }

    const ovulation = lps.add(cycleLength - 14, 'day')
    const fertileStart = ovulation.subtract(5, 'day')

    return [
      {
        label: '🩸 Period reminder',
        date: nextPeriod.subtract(2, 'day').format('MMM D'),
        daysUntil: nextPeriod.subtract(2, 'day').diff(today, 'day'),
        active: prefs.periodReminder,
      },
      {
        label: '✨ Ovulation',
        date: ovulation.format('MMM D'),
        daysUntil: ovulation.diff(today, 'day'),
        active: prefs.ovulationReminder,
      },
      {
        label: '🌱 Fertile window',
        date: fertileStart.format('MMM D'),
        daysUntil: fertileStart.diff(today, 'day'),
        active: prefs.fertileReminder,
      },
    ].filter(r => r.daysUntil >= 0).sort((a, b) => a.daysUntil - b.daysUntil)
  }

  const upcoming = getUpcomingReminders()

  if (loading) return null

  return (
    <div className="notif-screen">
      <div className="notif-header">
        <button className="notif-back" onClick={() => navigate(-1)}>← Back</button>
        <h2 className="notif-title">Notifications</h2>
      </div>

      {/* Main toggle */}
      <div className="notif-main-card">
        <div className="notif-main-top">
          <div className="notif-main-icon">🔔</div>
          <div className="notif-main-info">
            <p className="notif-main-title">Push notifications</p>
            <p className="notif-main-desc">
              {permission === 'denied'
                ? 'Blocked — enable in browser settings'
                : permission === 'granted' && prefs.enabled
                ? 'Active — reminders are scheduled'
                : 'Get reminders for your cycle'}
            </p>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={prefs.enabled}
              onChange={handleToggleMain}
              disabled={enabling || permission === 'denied'}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        {permission === 'denied' && (
          <div className="notif-blocked">
            ⚠️ Notifications are blocked. Go to your browser settings
            and allow notifications for this site, then come back here.
          </div>
        )}

        {enabling && (
          <div className="notif-enabling">
            Requesting permission...
          </div>
        )}
      </div>

      {/* Individual reminders */}
      {prefs.enabled && (
        <>
          <div className="notif-section">
            <p className="notif-section-title">Reminder types</p>
            {reminderOptions.map(option => (
              <div key={option.key} className="notif-item">
                <div className="notif-item-info">
                  <p className="notif-item-label">{option.label}</p>
                  <p className="notif-item-desc">{option.desc}</p>
                </div>
                <label className="toggle small">
                  <input
                    type="checkbox"
                    checked={prefs[option.key]}
                    onChange={e => updatePref(option.key, e.target.checked)}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
            ))}
          </div>

          {/* Daily reminder time */}
          {prefs.dailyReminder && (
            <div className="notif-section">
              <p className="notif-section-title">Daily reminder time</p>
              <div className="time-grid">
                {timeOptions.map(t => (
                  <button
                    key={t.value}
                    className={`time-btn ${prefs.dailyReminderTime === t.value ? 'selected' : ''}`}
                    onClick={() => updatePref('dailyReminderTime', t.value)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming reminders */}
          {upcoming.length > 0 && (
            <div className="notif-section">
              <p className="notif-section-title">Upcoming reminders</p>
              <div className="upcoming-list">
                {upcoming.map((r, i) => (
                  <div
                    key={i}
                    className={`upcoming-item ${!r.active ? 'inactive' : ''}`}
                  >
                    <div className="upcoming-info">
                      <p className="upcoming-label">{r.label}</p>
                      <p className="upcoming-date">{r.date}</p>
                    </div>
                    <div className="upcoming-right">
                      <span className="upcoming-days">
                        {r.daysUntil === 0
                          ? 'Today'
                          : `In ${r.daysUntil} day${r.daysUntil === 1 ? '' : 's'}`}
                      </span>
                      {!r.active && (
                        <span className="upcoming-off">off</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Note */}
      <div className="notif-note">
        <p>💡 Notifications only fire while the app is open or installed
          as a PWA on your phone. For background notifications, install
          the app to your home screen.</p>
      </div>

    </div>
  )
}

export default NotificationSettings