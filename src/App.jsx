import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Dashboard from './screens/Dashboard'
import Calendar from './screens/Calendar'
import LogToday from './screens/LogToday'
import Insights from './screens/Insights'
import Profile from './screens/Profile'
import Settings from './screens/Settings'
import PregnancyMode from './screens/PregnancyMode'
import Intercourse from './screens/Intercourse'
import Onboarding from './screens/Onboarding'
import NotificationSettings from './screens/NotificationSettings'
import useAppData from './hooks/useAppData'
import { useState, useCallback } from 'react'
import SplashScreen from './components/SplashScreen'
import Articles from './screens/Articles'
import ArticleDetail from './screens/ArticleDetail'
import PartnerInvite from './screens/PartnerInvite'
import PartnerEnterCode from './screens/PartnerEnterCode'
import PartnerView from './screens/PartnerView'

const App = () => {
  const {
    loading,
    isOnboarded,
    userProfile,
    cycleSettings,
    dailyLogs,
    calendarEdits,
    completeOnboarding,
    updateProfile,
    updateCycleSettings,
    saveLog,
    getLog,
    getTodayLog,
    updateCalendarEdits,
    resetAllData,
  } = useAppData()
  const [showSplash, setShowSplash] = useState(true)
  const handleSplashComplete = useCallback(() => setShowSplash(false), [])

  // Show loading spinner while data loads from localforage
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FDF8F8',
        gap: '16px',
      }}>
        <div style={{ fontSize: '52px', animation: 'pulse 1.5s infinite' }}>🌸</div>
        <p style={{ fontSize: '16px', color: '#C2527A', fontWeight: 600 }}>
          CycleApp
        </p>
        <p style={{ fontSize: '13px', color: '#6B7280' }}>Loading your data...</p>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* Onboarding */}
        <Route
          path="/onboarding"
          element={
            isOnboarded
              ? <Navigate to="/" replace />
              : <Onboarding onComplete={completeOnboarding} />
          }
        />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
        <Route path="/partner/invite" element={<PartnerInvite cycleSettings={cycleSettings} userProfile={userProfile}/>} />
        <Route path="/partner/enter" element={<PartnerEnterCode />} />
        <Route path="/partner/view" element={<PartnerView />} />


        {/* Main app */}
        <Route path="*" element={
          !isOnboarded
            ? <Navigate to="/onboarding" replace />
            : (
              <>
                <div style={{ paddingBottom: '80px' }}>
                  <Routes>
                    <Route path="/" element={
                      <Dashboard
                        cycleSettings={cycleSettings}
                        userProfile={userProfile}
                        todayLog={getTodayLog()}
                        saveLog={saveLog}
                      />
                    } />
                    <Route path="/calendar" element={
                      <Calendar
                        cycleSettings={cycleSettings}
                        setCycleSettings={updateCycleSettings}
                        dailyLogs={dailyLogs}
                        calendarEdits={calendarEdits}
                        updateCalendarEdits={updateCalendarEdits}
                      />
                    } />
                    <Route path="/log" element={
                      <LogToday
                        saveLog={saveLog}
                        getLog={getLog}
                        todayLog={getTodayLog()}
                      />
                    } />
                    <Route path="/insights" element={
                      <Insights
                        cycleSettings={cycleSettings}
                        dailyLogs={dailyLogs}
                      />
                    } />
                    <Route path="/profile" element={
                      <Profile
                        cycleSettings={cycleSettings}
                        setCycleSettings={updateCycleSettings}
                        userProfile={userProfile}
                        setUserProfile={updateProfile}
                      />
                    } />
                    <Route path="/settings" element={
                      <Settings
                        resetAllData={resetAllData}
                        userProfile={userProfile}
                        cycleSettings={cycleSettings}
                      />
                    } />
                    <Route path="/pregnancy" element={<PregnancyMode />} />
                    <Route path="/intercourse" element={<Intercourse />} />
                    <Route path="/notifications" element={<NotificationSettings cycleSettings={cycleSettings} />} /> 
                  </Routes>
                </div>
                <BottomNav todayLogged={!!getTodayLog()} />
                {/* <BottomNav /> */}
              </>
            )
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App