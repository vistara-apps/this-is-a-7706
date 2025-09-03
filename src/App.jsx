import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Claims from './pages/Claims'
import ClaimDetail from './pages/ClaimDetail'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import { PhotoProvider } from './contexts/PhotoContext'
import { UserProvider } from './contexts/UserContext'

function App() {
  return (
    <UserProvider>
      <PhotoProvider>
        <div className="flex h-screen bg-bg">
          <Sidebar />
          <main className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/claims" element={<Claims />} />
              <Route path="/claims/:claimId" element={<ClaimDetail />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </PhotoProvider>
    </UserProvider>
  )
}

export default App