import React, { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: 'user_1',
    email: 'adjuster@example.com',
    subscriptionTier: 'pro',
    createdAt: new Date().toISOString()
  })

  const [isAuthenticated, setIsAuthenticated] = useState(true)

  const value = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}