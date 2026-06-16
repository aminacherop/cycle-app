import { NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './BottomNav.css'
import { useLanguage } from '../context/LanguageContext'

const BottomNav = ({ todayLogged, hasNotification }) => {
  const location = useLocation()
  const [prevPath, setPrevPath] = useState(location.pathname)
  const { t } = useLanguage()

  useEffect(() => {
    if (location.pathname !== prevPath) {
      setPrevPath(location.pathname)
    }
  }, [location.pathname, prevPath])

  const navItems = [
    {
      path: '/',
      label: t('nav_home'),
      icon: '🏠',
      exact: true,
    },
    {
      path: '/calendar',
      label: t('nav_calendar'),
      icon: '📅',
    },
    {
      path: '/log',
      label: t('nav_log'),
      icon: '+',
      isCenter: true,
      badge: !todayLogged,
    },
    {
      path: '/insights',
      label: t('nav_insights'),
      icon: '📊',
    },
    {
      path: '/profile',
      label: t('nav_profile'),
      icon: '👤',
      badge: hasNotification,
    },
  ]

  return (
    <nav className="bottom-nav">
      {navItems.map(item => {
        const isActive = item.exact
          ? location.pathname === item.path
          : location.pathname === item.path

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={`nav-item ${item.isCenter ? 'nav-center' : ''} ${isActive ? 'active' : ''}`}
          >
            {item.isCenter ? (
              <div className={`log-btn ${isActive ? 'log-btn-active' : ''}`}>
                <span className="log-plus">+</span>
                {item.badge && <span className="log-badge" />}
              </div>
            ) : (
              <div className="nav-icon-wrap">
                <span className={`nav-icon ${isActive ? 'nav-icon-active' : ''}`}>
                  {item.icon}
                </span>
                {item.badge && <span className="nav-badge">●</span>}
                {isActive && <span className="nav-active-dot" />}
              </div>
            )}
            <span className={`nav-label ${isActive ? 'nav-label-active' : ''}`}>
              {item.label}
            </span>
          </NavLink>
        )
      })}
    </nav>
  )
}

export default BottomNav