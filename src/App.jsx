import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Claims from './pages/Claims'
import ClaimDetail from './pages/ClaimDetail'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Billing from './pages/Billing'
import { PhotoProvider } from './contexts/PhotoContext'
import { UserProvider } from './contexts/UserContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import { FullScreenLoader } from './components/LoadingIndicator'
import KeyboardShortcuts, { defaultShortcuts } from './components/KeyboardShortcuts'
import { startCacheCleanup, stopCacheCleanup } from './utils/cacheManager'

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return <FullScreenLoader message="Authenticating..." />
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Main application component
function App() {
  // Start cache cleanup on mount and stop on unmount
  useEffect(() => {
    startCacheCleanup()
    return () => stopCacheCleanup()
  }, [])
  
  return (
    <ErrorBoundary>
      <AuthProvider>
        <UserProvider>
          <PhotoProvider>
            <KeyboardShortcuts shortcuts={defaultShortcuts}>
              <AppContent />
            </KeyboardShortcuts>
          </PhotoProvider>
        </UserProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

// Application content component
function AppContent() {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return <FullScreenLoader message="Loading application..." />
  }
  
  // For demo purposes, we'll skip the login page and assume the user is authenticated
  // In a real implementation, we would have a login page and proper authentication flow
  
  return (
    <div className="flex h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/claims" element={<Claims />} />
            <Route path="/claims/:claimId" element={<ClaimDetail />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  )
}

export default App

