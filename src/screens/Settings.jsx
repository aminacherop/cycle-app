import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Settings.css'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import usePWAInstall from '../hooks/usePWAInstall'

const Settings = ({ resetAllData, userProfile, cycleSettings }) => {
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)
  const [resetting, setResetting] = useState(false)
  const { language, changeLanguage, t } = useLanguage()
  const { theme, changeTheme, isDark } = useTheme()
  const { isInstallable, isInstalled, install } = usePWAInstall()

  const handleReset = async () => {
    setResetting(true)
    await resetAllData()
    setResetting(false)
    navigate('/onboarding')
  }

  return (
    <div className="settings-screen">

      {/* Header */}
      <div className="settings-header">
        <h2 className="settings-title">{t('settings')}</h2>
      </div>

      {/* Language banner at top */}
      <div className="lang-banner">
        <span className="lang-banner-label">🌍 Language / Lugha</span>
        <div className="lang-banner-btns">
          <button
            className={`lang-banner-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => changeLanguage('en')}
          >
            🇬🇧 EN
          </button>
          <button
            className={`lang-banner-btn ${language === 'sw' ? 'active' : ''}`}
            onClick={() => changeLanguage('sw')}
          >
            🇰🇪 SW
          </button>
        </div>
      </div>

      {/* Account */}
      <div className="settings-section">
        <p className="settings-section-title">{t('account')}</p>
        <div className="settings-item" onClick={() => navigate('/profile')}>
          <span>👤</span>
          <span>{t('edit_profile')}</span>
          <span className="settings-arrow">→</span>
        </div>
        <div className="settings-item" onClick={() => navigate('/calendar')}>
          <span>🔄</span>
          <span>{t('cycle_settings')}</span>
          <span className="settings-arrow">→</span>
        </div>
        <div className="settings-item" onClick={() => navigate('/notifications')}>
          <span>🔔</span>
          <span>{t('notifications_settings')}</span>
          <span className="settings-arrow">→</span>
        </div>
      </div>
      <div className="settings-item" onClick={() => navigate('/medications')}>
        <span>💊</span>
        <span>Pills & supplements</span>
        <span className="settings-arrow">→</span>
      </div>

      {/* Language */}
      <div className="settings-section">
        <p className="settings-section-title">
          🌍 {t('language')} / Lugha
        </p>
        <div className="language-toggle">
          <button
            className={`lang-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => changeLanguage('en')}
          >
            🇬🇧 English
          </button>
          <button
            className={`lang-btn ${language === 'sw' ? 'active' : ''}`}
            onClick={() => changeLanguage('sw')}
          >
            🇰🇪 Kiswahili
          </button>
        </div>
      </div>

      {/* Theme */}
      <div className="settings-section">
        <p className="settings-section-title">
          {isDark ? '🌙 Dark mode' : '☀️ Light mode'}
        </p>
        <div className="theme-toggle-row">
          <button
            className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
            onClick={() => changeTheme('light')}
          >
            ☀️ Light
          </button>
          <button
            className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => changeTheme('dark')}
          >
            🌙 Dark
          </button>
          <button
            className={`theme-btn ${theme === 'system' ? 'active' : ''}`}
            onClick={() => changeTheme('system')}
          >
            📱 System
          </button>
        </div>
      </div>

      {/* Install app */}
      {(isInstallable || isInstalled) && (
        <div className="settings-section">
          <p className="settings-section-title">📲 App</p>
          {isInstalled ? (
            <div className="settings-item">
              <span>✅</span>
              <span>App installed on this device</span>
              <span className="settings-check">✓</span>
            </div>
          ) : (
            <div className="settings-item" onClick={install}>
              <span>📲</span>
              <span>Install app to home screen</span>
              <span className="settings-arrow">→</span>
            </div>
          )}
        </div>
      )}

      {/* Privacy & data */}
      <div className="settings-section">
        <p className="settings-section-title">{t('privacy_data')}</p>
        <div className="settings-item">
          <span>🔒</span>
          <span>{t('data_on_device')}</span>
          <span className="settings-check">✓</span>
        </div>
        <div className="settings-item">
          <span>📤</span>
          <span>{t('export_data')}</span>
          <span className="settings-arrow">→</span>
        </div>
        <div
          className="settings-item danger"
          onClick={() => setShowConfirm(true)}
        >
          <span>🗑️</span>
          <span>{t('delete_all')}</span>
          <span className="settings-arrow">→</span>
        </div>
      </div>

      {/* App info */}
      <div className="settings-section">
        <p className="settings-section-title">{t('app_info')}</p>
        <div className="settings-item">
          <span>📱</span>
          <span>{t('version')}</span>
          <span className="settings-value">1.0.0</span>
        </div>
        <div className="settings-item">
          <span>🌸</span>
          <span>{t('app_name')}</span>
          <span className="settings-value">CycleApp Kenya</span>
        </div>
        <div
          className="settings-item"
          onClick={() => navigate('/articles')}
        >
          <span>📚</span>
          <span>Health articles</span>
          <span className="settings-arrow">→</span>
        </div>
      </div>

      {/* Confirm reset modal */}
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-card">
            <p className="confirm-title">⚠️ {t('delete_confirm_title')}</p>
            <p className="confirm-desc">{t('delete_confirm_desc')}</p>
            <div className="confirm-actions">
              <button
                className="confirm-cancel"
                onClick={() => setShowConfirm(false)}
              >
                {t('cancel')}
              </button>
              <button
                className="confirm-delete"
                onClick={handleReset}
                disabled={resetting}
              >
                {resetting ? t('deleting') : t('yes_delete')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Settings