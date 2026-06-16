import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './PartnerInvite.css'
import {
  createPairingCode,
  loadPairingCode,
  getDaysRemaining,
} from '../utils/partnerCode'
import dayjs from 'dayjs'

const PartnerInvite = ({ cycleSettings, userProfile }) => {
  const navigate = useNavigate()
  const [pairingData, setPairingData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [step, setStep] = useState('main')
  // steps: main | code | howto

  useEffect(() => {
    const load = async () => {
      const existing = await loadPairingCode()
      setPairingData(existing)
      if (existing) setStep('code')
      setLoading(false)
    }
    load()
  }, [])

  const handleGenerate = async () => {
    setGenerating(true)
    const data = await createPairingCode(cycleSettings, userProfile)
    setPairingData(data)
    setStep('code')
    setGenerating(false)
  }

  const handleCopy = () => {
    navigator.clipboard?.writeText(pairingData.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

//   const handleShare = (method) => {
//     const message = `Hey! I'm using CycleApp to track my cycle. Download the app and enter this partner code to see my cycle updates: ${pairingData.code} — Valid for ${getDaysRemaining(pairingData.expiresAt)} days.`

//     if (method === 'whatsapp') {
//       window.open(`https://wa.me/?text=${encodeURIComponent(message)}`)
//     } else if (method === 'sms') {
//       window.open(`sms:?body=${encodeURIComponent(message)}`)
//     } else if (method === 'copy') {
//       navigator.clipboard?.writeText(message)
//       setCopied(true)
//       setTimeout(() => setCopied(false), 2000)
//     }
const handleShare = (method) => {
  const daysLeft = getDaysRemaining(pairingData.expiresAt)
  const expiry = dayjs(pairingData.expiresAt).format('MMMM D, YYYY')

  const message =
`🌸 *CycleApp Partner Invitation*

Hey! I'm using CycleApp to share my cycle updates with you.

*Your pairing code:*
*${pairingData.code}*

*Steps to connect:*
1. Download CycleApp
2. Open the app
3. Tap "I have a partner code"
4. Enter: *${pairingData.code}*

⏰ Code expires: ${expiry} (${daysLeft} days left)

Once paired, you will see my current cycle phase, mood, and tips for supporting me — nothing sensitive is shared.

Download: https://cycleapp.co.ke`

  if (method === 'whatsapp') {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      '_blank'
    )
  } else if (method === 'sms') {
    // SMS plain text version
    const smsMessage =
`CycleApp Partner Code: ${pairingData.code}
Valid until ${expiry}.
1. Download CycleApp
2. Tap "I have a partner code"
3. Enter: ${pairingData.code}`

    window.open(
      `sms:?body=${encodeURIComponent(smsMessage)}`,
      '_blank'
    )
  } else if (method === 'copy') {
    navigator.clipboard?.writeText(pairingData.code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
}

  

  if (loading) return null

  return (
    <div className="partner-screen">

      <div className="partner-header">
        <button className="partner-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h2 className="partner-title">Invite Partner</h2>
      </div>

      {/* Step: main */}
      {step === 'main' && (
        <div className="partner-content">
          <div className="partner-hero">
            <div className="partner-hero-icon">👫</div>
            <h3 className="partner-hero-title">
              Share your cycle with your partner
            </h3>
            <p className="partner-hero-desc">
              Generate a pairing code and share it with your partner.
              They will see a safe summary of your cycle — no sensitive
              details ever shared.
            </p>
          </div>

          <div className="partner-privacy-card">
            <p className="partner-privacy-title">🔒 What your partner sees</p>
            <div className="partner-privacy-row">
              <span className="privacy-yes">✅</span>
              <span>Current cycle phase</span>
            </div>
            <div className="partner-privacy-row">
              <span className="privacy-yes">✅</span>
              <span>General mood (Happy, Tired, Calm etc)</span>
            </div>
            <div className="partner-privacy-row">
              <span className="privacy-yes">✅</span>
              <span>Days until next period</span>
            </div>
            <div className="partner-privacy-row">
              <span className="privacy-yes">✅</span>
              <span>Tips for how to support you</span>
            </div>
            <div className="partner-privacy-row">
              <span className="privacy-no">❌</span>
              <span>Flow details or symptoms</span>
            </div>
            <div className="partner-privacy-row">
              <span className="privacy-no">❌</span>
              <span>Intercourse or test logs</span>
            </div>
            <div className="partner-privacy-row">
              <span className="privacy-no">❌</span>
              <span>Health notes or personal data</span>
            </div>
          </div>

          <button
            className="partner-btn primary"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? 'Generating...' : '🔑 Generate pairing code'}
          </button>

          <button
            className="partner-btn secondary"
            onClick={() => navigate('/partner/enter')}
          >
            I have a partner code →
          </button>
        </div>
      )}

      {/* Step: code */}
      {step === 'code' && pairingData && (
        <div className="partner-content">

          <div className="code-card">
            <p className="code-card-label">Your pairing code</p>
            <div className="code-display">
              <span className="code-text">{pairingData.code}</span>
            </div>
            <div className="code-expiry">
              <span className="code-expiry-icon">⏰</span>
              <span>
                Expires in{' '}
                <strong>{getDaysRemaining(pairingData.expiresAt)} days</strong>
                {' '}·{' '}
                {dayjs(pairingData.expiresAt).format('MMM D, YYYY')}
              </span>
            </div>
            <div className="code-progress">
              <div
                className="code-progress-fill"
                style={{
                  width: `${(getDaysRemaining(pairingData.expiresAt) / 7) * 100}%`
                }}
              />
            </div>
          </div>

          <div className="code-instructions">
            <p className="code-instructions-title">📱 Share this with your partner:</p>
            <div className="code-step">
              <span className="code-step-num">1</span>
              <span>Share the code <strong>{pairingData.code}</strong> with your partner</span>
            </div>
            <div className="code-step">
              <span className="code-step-num">2</span>
              <span>Partner downloads <strong>CycleApp</strong> on their phone</span>
            </div>
            <div className="code-step">
              <span className="code-step-num">3</span>
              <span>Partner taps <strong>"I have a partner code"</strong> and enters it</span>
            </div>
            <div className="code-step">
              <span className="code-step-num">4</span>
              <span>Pairing complete! Partner can view your cycle summary</span>
            </div>
          </div>

          <div className="share-options">
            <p className="share-options-title">Share code via:</p>
            <div className="share-btns">
              <button
                className="share-btn whatsapp"
                onClick={() => handleShare('whatsapp')}
              >
                💬 WhatsApp
              </button>
              <button
                className="share-btn sms"
                onClick={() => handleShare('sms')}
              >
                📱 SMS
              </button>
              <button
                className={`share-btn copy ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
              >
                {copied ? '✅ Copied!' : '📋 Copy code'}
              </button>
            </div>
          </div>

          <button
            className="partner-btn secondary"
            onClick={handleGenerate}
          >
            🔄 Generate new code
          </button>

          <button
            className="partner-btn secondary"
            onClick={() => navigate('/partner/enter')}
          >
            I have a partner code →
          </button>

        </div>
      )}

    </div>
  )
}

export default PartnerInvite