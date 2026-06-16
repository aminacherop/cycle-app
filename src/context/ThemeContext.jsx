import { createContext, useContext, useState, useEffect } from 'react'
import { saveData, loadData } from '../utils/storage'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const load = async () => {
      const saved = await loadData('app_theme', 'light')
      setTheme(saved)
      applyTheme(saved)
    }
    load()
  }, [])

  const applyTheme = (t) => {
    const root = document.documentElement
    if (t === 'dark') {
      root.setAttribute('data-theme', 'dark')
    } else if (t === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
    } else {
      root.setAttribute('data-theme', 'light')
    }
  }

  const changeTheme = async (newTheme) => {
    setTheme(newTheme)
    applyTheme(newTheme)
    await saveData('app_theme', newTheme)
  }

  const isDark = theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
