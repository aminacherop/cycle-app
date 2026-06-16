import { useEffect, useState } from 'react'
import './SplashScreen.css'

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState('loading')
  // phases: loading → ready → fadeout

  useEffect(() => {
    // Animate progress bar
    const steps = [
      { target: 30, delay: 200 },
      { target: 60, delay: 500 },
      { target: 85, delay: 800 },
      { target: 100, delay: 1200 },
    ]

    const timers = steps.map(({ target, delay }) =>
      setTimeout(() => setProgress(target), delay)
    )

    // Show ready state
    const readyTimer = setTimeout(() => setPhase('ready'), 1400)

    // Start fade out
    const fadeTimer = setTimeout(() => setPhase('fadeout'), 1900)

    // Complete
    const completeTimer = setTimeout(() => onComplete(), 2400)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(readyTimer)
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  const loadingMessages = [
    'Loading your cycle data...',
    'Calculating your phase...',
    'Preparing your insights...',
    'Almost ready...',
  ]

  const messageIndex = Math.floor((progress / 100) * loadingMessages.length)
  const message = loadingMessages[Math.min(messageIndex, loadingMessages.length - 1)]

  return (
    <div className={`splash ${phase === 'fadeout' ? 'fade-out' : ''}`}>

      {/* Background decoration */}
      <div className="splash-bg">
        <div className="splash-circle c1" />
        <div className="splash-circle c2" />
        <div className="splash-circle c3" />
      </div>

      {/* Main content */}
      <div className="splash-content">

        {/* Logo */}
        <div className={`splash-logo ${phase === 'ready' ? 'ready' : ''}`}>
          <div className="splash-icon-wrap">
            <span className="splash-icon">🌸</span>
            <div className="splash-icon-ring ring1" />
            <div className="splash-icon-ring ring2" />
          </div>
        </div>

        {/* App name */}
        <div className="splash-name-wrap">
          <h1 className="splash-name">CycleApp</h1>
          <p className="splash-tagline">Your body. Your data. Your privacy.</p>
        </div>

        {/* Loading section */}
        <div className="splash-loading">
          {phase === 'ready' ? (
            <div className="splash-ready">
              <span className="splash-check">✓</span>
              <span>Ready</span>
            </div>
          ) : (
            <>
              <p className="splash-message">{message}</p>
              <div className="splash-progress-track">
                <div
                  className="splash-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="splash-percent">{progress}%</p>
            </>
          )}
        </div>

        {/* Feature pills */}
        <div className="splash-pills">
          <span className="splash-pill">🔒 Private</span>
          <span className="splash-pill">📡 Offline</span>
          <span className="splash-pill">🇰🇪 Made for Kenya</span>
        </div>

      </div>

      {/* Bottom */}
      <div className="splash-bottom">
        <p className="splash-version">Version 1.0.0</p>
      </div>

    </div>
  )
}

export default SplashScreen