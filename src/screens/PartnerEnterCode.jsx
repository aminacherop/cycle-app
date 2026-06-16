import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validatePairingCode, savePartnerPairing } from '../utils/partnerCode'

const PartnerEnterCode = () => {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [partnerName, setPartnerName] = useState('')

  const handleValidate = async () => {
    if (!code.trim()) {
      setError('Please enter the pairing code')
      return
    }
    setLoading(true)
    setError('')

    const result = await validatePairingCode(code.trim())

    if (result.valid) {
      await savePartnerPairing(result.data)
      setPartnerName(result.data.userName)
      setSuccess(true)
    } else {
      setError(
        result.reason === 'Code has expired'
          ? '⏰ This code has expired. Ask your partner to generate a new one.'
          : '❌ Invalid code. Please check and try again.'
      )
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div style={{
        padding: '2rem 1.2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '16px',
        minHeight: '100vh',
        background: 'var(--background)',
      }}>
        <div style={{ fontSize: 72, animation: 'pulse 1.5s infinite' }}>🎉</div>
        <h2 style={{
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.5px',
        }}>
          Paired successfully!
        </h2>
        <p style={{
          fontSize: 14,
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
        }}>
          You are now connected with <strong>{partnerName}</strong>.
          You can view their cycle summary in the Partner View.
        </p>
        <div style={{
          background: 'var(--white)',
          border: '1px solid var(--border)',
          borderRadius: 18,
          padding: 16,
          width: '100%',
          textAlign: 'left',
        }}>
          <p style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>
            You will see:
          </p>
          {['Current cycle phase', 'General mood', 'Days until next period', 'Tips to support your partner'].map(item => (
            <div key={item} style={{
              display: 'flex', gap: 10, marginBottom: 8,
              fontSize: 13, color: 'var(--text-secondary)',
            }}>
              <span style={{ color: '#10B981' }}>✅</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate('/partner/view')}
          style={{
            width: '100%',
            padding: 16,
            background: 'linear-gradient(135deg, #C2527A, #9A3A5C)',
            color: 'white',
            border: 'none',
            borderRadius: 16,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(194,82,122,0.35)',
          }}
        >
          View partner's cycle →
        </button>
      </div>
    )
  }

  return (
    <div style={{
      padding: '1.5rem 1.2rem 6rem',
      minHeight: '100vh',
      background: 'var(--background)',
    }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none', border: 'none',
          fontSize: 14, color: 'var(--text-secondary)',
          cursor: 'pointer', marginBottom: 16, display: 'block',
        }}
      >
        ← Back
      </button>

      <h2 style={{
        fontSize: 22, fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: 6, letterSpacing: '-0.5px',
      }}>
        Enter partner code
      </h2>
      <p style={{
        fontSize: 14, color: 'var(--text-secondary)',
        lineHeight: 1.6, marginBottom: 24,
      }}>
        Ask your partner for their 6-digit CycleApp pairing code.
        It looks like <strong>CYC-847291</strong>.
      </p>

      <div style={{
        background: 'var(--white)',
        border: '1px solid var(--border)',
        borderRadius: 18,
        padding: 20,
        marginBottom: 16,
        boxShadow: '0 2px 8px var(--shadow)',
      }}>
        <label style={{
          fontSize: 13, fontWeight: 600,
          color: 'var(--text-primary)', marginBottom: 8,
          display: 'block',
        }}>
          Pairing code
        </label>
        <input
          type="text"
          placeholder="e.g. CYC-847291"
          value={code}
          onChange={e => {
            setCode(e.target.value.toUpperCase())
            setError('')
          }}
          maxLength={10}
          style={{
            width: '100%',
            padding: '16px',
            border: `2px solid ${error ? '#EF4444' : 'var(--border)'}`,
            borderRadius: 12,
            fontSize: 22,
            fontWeight: 700,
            textAlign: 'center',
            letterSpacing: 4,
            fontFamily: 'monospace',
            color: '#C2527A',
            background: 'var(--input-bg)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {error && (
          <p style={{
            fontSize: 13, color: '#EF4444',
            marginTop: 8, lineHeight: 1.5,
          }}>
            {error}
          </p>
        )}
        <p style={{
          fontSize: 12, color: 'var(--text-secondary)',
          marginTop: 8,
        }}>
          Code is valid for 7 days from when it was generated
        </p>
      </div>

      <button
        onClick={handleValidate}
        disabled={loading || !code.trim()}
        style={{
          width: '100%',
          padding: 16,
          background: code.trim()
            ? 'linear-gradient(135deg, #C2527A, #9A3A5C)'
            : '#D1D5DB',
          color: 'white',
          border: 'none',
          borderRadius: 16,
          fontSize: 15,
          fontWeight: 700,
          cursor: code.trim() ? 'pointer' : 'not-allowed',
          boxShadow: code.trim()
            ? '0 6px 20px rgba(194,82,122,0.35)'
            : 'none',
          transition: 'all 0.2s',
          marginBottom: 12,
        }}
      >
        {loading ? 'Checking code...' : 'Pair with partner ✓'}
      </button>

      <button
        onClick={() => navigate('/partner/invite')}
        style={{
          width: '100%',
          padding: 14,
          background: 'var(--white)',
          color: 'var(--text-secondary)',
          border: '1.5px solid var(--border)',
          borderRadius: 16,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        I want to invite my partner instead →
      </button>
    </div>
  )
}

export default PartnerEnterCode