import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Profile.css'
import dayjs from 'dayjs'


const Profile = ({ cycleSettings, setCycleSettings, userProfile, setUserProfile }) => {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('profile')
  // tabs: profile | history | partner

  const [isEditing, setIsEditing] = useState(false)
//   const [profile, setProfile] = useState({
//     name: 'Sarah',
//     dob: '1998-03-15',
//     email: 'sarah@email.com',
//     phone: '',
//     condition: 'none',
//   })
const [profile, setProfile] = useState({
  name: userProfile?.name || '',
  dob: userProfile?.dob || '',
  email: userProfile?.email || '',
  phone: userProfile?.phone || '',
  condition: userProfile?.condition || 'none',
})
//   const [draftProfile, setDraftProfile] = useState({ ...profile })
const [draftProfile, setDraftProfile] = useState({
  name: userProfile?.name || '',
  dob: userProfile?.dob || '',
  email: userProfile?.email || '',
  phone: userProfile?.phone || '',
  condition: userProfile?.condition || 'none',
})

  const [partnerEmail, setPartnerEmail] = useState('')
  const [inviteSent, setInviteSent] = useState(false)

  const cycleLength = cycleSettings?.cycleLength || 26
  const periodLength = cycleSettings?.periodLength || 4
  const lastPeriodStart = cycleSettings?.lastPeriodStart || dayjs().format('YYYY-MM-DD')

  const lpsDate = dayjs(lastPeriodStart)
  

  
  const generateHistory = () => {
    const history = []
    for (let i = 5; i >= 0; i--) {
      const start = lpsDate.subtract(i * cycleLength, 'day')
      const end = start.add(periodLength - 1, 'day')
      const nextStart = start.add(cycleLength, 'day')
      history.push({
        cycleNum: 6 - i,
        periodStart: start.format('MMM D, YYYY'),
        periodEnd: end.format('MMM D, YYYY'),
        periodLength,
        cycleLength,
        ovulation: start.add(cycleLength - 14, 'day').format('MMM D'),
        fertileStart: start.add(cycleLength - 19, 'day').format('MMM D'),
        fertileEnd: start.add(cycleLength - 13, 'day').format('MMM D'),
        nextPeriod: nextStart.format('MMM D, YYYY'),
      })
    }
    return history
  }

  const history = generateHistory()

  const avgCycleLength = Math.round(
    history.reduce((sum, h) => sum + h.cycleLength, 0) / history.length
  )
  const avgPeriodLength = Math.round(
    history.reduce((sum, h) => sum + h.periodLength, 0) / history.length
  )

  const nextPeriodDate = lpsDate.add(cycleLength, 'day')
  const daysUntilNext = Math.max(0, nextPeriodDate.diff(dayjs(), 'day'))

  const conditionOptions = [
    { id: 'none', label: 'None' },
    { id: 'pcos', label: 'PCOS' },
    { id: 'endo', label: 'Endometriosis' },
    { id: 'peri', label: 'Perimenopause' },
    { id: 'postpill', label: 'Post-pill' },
    { id: 'other', label: 'Other' },
  ]

  const handleSaveProfile = () => {
    setProfile({ ...draftProfile })
    if (setUserProfile) {
    setUserProfile({ ...draftProfile })
  }
    setIsEditing(false)
  }

  const handleInvitePartner = () => {
    if (!partnerEmail) return
    setInviteSent(true)
    setTimeout(() => setInviteSent(false), 3000)
    setPartnerEmail('')
  }

  const age = profile.dob
    ? dayjs().diff(dayjs(profile.dob), 'year')
    : null

  return (
    <div className="profile-screen">

      {/* Header */}
      {/* Header */}
<div className="profile-header">
  <div className="profile-avatar">
    <span className="profile-avatar-text">
      {profile.name.charAt(0).toUpperCase()}
    </span>
  </div>
  <div className="profile-header-info">
    <h2 className="profile-name">{profile.name}</h2>
    <p className="profile-sub">
      {age ? `${age} years old` : ''}
      {profile.condition !== 'none' && ` · ${conditionOptions.find(c => c.id === profile.condition)?.label}`}
    </p>
  </div>
  <div style={{ display: 'flex', gap: 8 }}>
    <button
      className="profile-edit-btn"
      onClick={() => navigate('/settings')}
      title="Settings"
    >
      ⚙️
    </button>
    <button
      className="profile-edit-btn"
      onClick={() => { setIsEditing(!isEditing); setDraftProfile({ ...profile }) }}
    >
      {isEditing ? '✕' : '✏️'}
    </button>
  </div>
</div>
      

      {/* Quick stats */}
      <div className="profile-stats-row">
        <div className="profile-stat">
          <span className="profile-stat-value">{avgCycleLength}</span>
          <span className="profile-stat-label">Avg cycle</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-value">{avgPeriodLength}</span>
          <span className="profile-stat-label">Avg period</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-value">{daysUntilNext}</span>
          <span className="profile-stat-label">Days until next</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-value">{history.length}</span>
          <span className="profile-stat-label">Cycles logged</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        {[
          { id: 'profile', label: '👤 Profile' },
          { id: 'history', label: '📋 History' },
          { id: 'partner', label: '👫 Partner' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {activeTab === 'profile' && (
        <div className="profile-content">

          {isEditing ? (
            <div className="profile-form">
              <p className="profile-form-title">Edit profile</p>

              <div className="form-row">
                <label className="form-label">Full name</label>
                <input
                  className="form-input"
                  value={draftProfile.name}
                  onChange={e => setDraftProfile(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your name"
                />
              </div>

              <div className="form-row">
                <label className="form-label">Date of birth</label>
                <input
                  type="date"
                  className="form-input"
                  value={draftProfile.dob}
                  max={dayjs().format('YYYY-MM-DD')}
                  onChange={e => setDraftProfile(prev => ({ ...prev, dob: e.target.value }))}
                />
              </div>

              <div className="form-row">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={draftProfile.email}
                  onChange={e => setDraftProfile(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-row">
                <label className="form-label">Phone (optional)</label>
                <input
                  type="tel"
                  className="form-input"
                  value={draftProfile.phone}
                  onChange={e => setDraftProfile(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+254 7XX XXX XXX"
                />
              </div>

              <div className="form-row">
                <label className="form-label">Health condition</label>
                <div className="condition-grid">
                  {conditionOptions.map(c => (
                    <button
                      key={c.id}
                      className={`condition-btn ${draftProfile.condition === c.id ? 'selected' : ''}`}
                      onClick={() => setDraftProfile(prev => ({ ...prev, condition: c.id }))}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button className="form-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="form-save" onClick={handleSaveProfile}>Save profile</button>
              </div>
            </div>
          ) : (
            <div className="profile-details">

              <div className="detail-card">
                <p className="detail-card-title">👤 Personal info</p>
                <div className="detail-row">
                  <span className="detail-label">Name</span>
                  <span className="detail-value">{profile.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Age</span>
                  <span className="detail-value">{age ? `${age} years` : '—'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{profile.email || '—'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{profile.phone || '—'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Condition</span>
                  <span className="detail-value">
                    {conditionOptions.find(c => c.id === profile.condition)?.label || 'None'}
                  </span>
                </div>
              </div>

              <div className="detail-card">
                <p className="detail-card-title">🔄 Cycle settings</p>
                <div className="detail-row">
                  <span className="detail-label">Cycle length</span>
                  <span className="detail-value">{cycleLength} days</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Period length</span>
                  <span className="detail-value">{periodLength} days</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Last period</span>
                  <span className="detail-value">{lpsDate.format('MMM D, YYYY')}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Next period</span>
                  <span className="detail-value" style={{ color: '#C2527A' }}>
                    {nextPeriodDate.format('MMM D, YYYY')}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Ovulation</span>
                  <span className="detail-value">
                    {lpsDate.add(cycleLength - 14, 'day').format('MMM D, YYYY')}
                  </span>
                </div>
                <button
                  className="edit-cycle-btn"
                  onClick={() => navigate('/calendar')}
                >
                  Edit cycle settings →
                </button>
              </div>

            </div>
          )}
        </div>
      )}

      {/* ── HISTORY TAB ── */}
      {activeTab === 'history' && (
        <div className="profile-content">

          {/* Averages summary */}
          <div className="history-averages">
            <p className="history-avg-title">📊 Your averages</p>
            <div className="history-avg-grid">
              <div className="history-avg-item">
                <span className="history-avg-emoji">🔄</span>
                <span className="history-avg-value">{avgCycleLength} days</span>
                <span className="history-avg-label">Avg cycle length</span>
              </div>
              <div className="history-avg-item">
                <span className="history-avg-emoji">🩸</span>
                <span className="history-avg-value">{avgPeriodLength} days</span>
                <span className="history-avg-label">Avg period length</span>
              </div>
              <div className="history-avg-item">
                <span className="history-avg-emoji">✨</span>
                <span className="history-avg-value">
                  Day {cycleLength - 14}
                </span>
                <span className="history-avg-label">Avg ovulation day</span>
              </div>
              <div className="history-avg-item">
                <span className="history-avg-emoji">🌱</span>
                <span className="history-avg-value">7 days</span>
                <span className="history-avg-label">Avg fertile window</span>
              </div>
            </div>
          </div>

          {/* Cycle history list */}
          <p className="history-list-title">📅 Last {history.length} cycles</p>
          <div className="history-list">
            {[...history].reverse().map((h, i) => (
              <div key={i} className="history-card">
                <div className="history-card-header">
                  <span className="history-cycle-num">Cycle {h.cycleNum}</span>
                  <span className="history-cycle-length">{h.cycleLength} day cycle</span>
                </div>
                <div className="history-card-body">
                  <div className="history-detail-row">
                    <span className="history-label">🩸 Period</span>
                    <span className="history-value">
                      {h.periodStart} – {h.periodEnd}
                      <span className="history-badge">{h.periodLength} days</span>
                    </span>
                  </div>
                  <div className="history-detail-row">
                    <span className="history-label">✨ Ovulation</span>
                    <span className="history-value">{h.ovulation}</span>
                  </div>
                  <div className="history-detail-row">
                    <span className="history-label">🌱 Fertile</span>
                    <span className="history-value">{h.fertileStart} – {h.fertileEnd}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PARTNER TAB ── */}
      {activeTab === 'partner' && (
        <div className="profile-content">

          <div className="partner-hero">
            <div className="partner-icon">👫</div>
            <h3 className="partner-title">Invite your partner</h3>
            <p className="partner-desc">
              Share a summary of your cycle phases with your partner.
              They will only see your current phase and mood — never
              your detailed logs or personal data.
            </p>
          </div>
          <button
      className="partner-action-btn primary"
      onClick={() => navigate('/partner/invite')}
    >
      🔑 Generate pairing code
    </button>

    <button
      className="partner-action-btn secondary"
      onClick={() => navigate('/partner/enter')}
    >
      I have a partner code →
    </button>

    <button
      className="partner-action-btn secondary"
      onClick={() => navigate('/partner/view')}
    >
      👫 View partner's cycle →
    </button>


          <div className="partner-privacy-card">
            <p className="partner-privacy-title">🔒 What your partner sees</p>
            <div className="partner-privacy-row">
              <span className="privacy-yes">✅</span>
              <span>Current cycle phase (follicular, ovulation etc)</span>
            </div>
            <div className="partner-privacy-row">
              <span className="privacy-yes">✅</span>
              <span>General mood summary</span>
            </div>
            <div className="partner-privacy-row">
              <span className="privacy-yes">✅</span>
              <span>Days until next period</span>
            </div>
            <div className="partner-privacy-row">
              <span className="privacy-no">❌</span>
              <span>Detailed symptoms or logs</span>
            </div>
            <div className="partner-privacy-row">
              <span className="privacy-no">❌</span>
              <span>Intercourse logs</span>
            </div>
            <div className="partner-privacy-row">
              <span className="privacy-no">❌</span>
              <span>Test results or health notes</span>
            </div>
          </div>

          <div className="partner-invite-card">
            <p className="partner-invite-title">📧 Send invite</p>
            <div className="partner-input-row">
              <input
                type="email"
                className="partner-input"
                placeholder="Partner's email address"
                value={partnerEmail}
                onChange={e => setPartnerEmail(e.target.value)}
              />
              <button
                className={`partner-send-btn ${inviteSent ? 'sent' : ''}`}
                onClick={handleInvitePartner}
              >
                {inviteSent ? '✅ Sent!' : 'Send'}
              </button>
            </div>
            <p className="partner-input-hint">
              Your partner will receive an email with a link to view
              your shared cycle summary.
            </p>
          </div>

          <div className="partner-share-card">
            <p className="partner-share-title">📱 Share via link</p>
            <button className="partner-share-btn" onClick={() => {
              navigator.clipboard?.writeText('https://cycleapp.co.ke/share/abc123')
            }}>
              📋 Copy share link
            </button>
            <p className="partner-input-hint">
              Or share via WhatsApp, SMS, or any messaging app.
            </p>
            <div className="partner-app-btns">
              <button className="partner-app-btn whatsapp">
                💬 Share via WhatsApp
              </button>
              <button className="partner-app-btn sms">
                📱 Share via SMS
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  )
}

export default Profile