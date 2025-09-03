import React, { createContext, useContext, useState, useEffect } from 'react'
import { checkAuth, login, register, logout, forgotPassword, checkSubscription } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [subscription, setSubscription] = useState(null)
  const [error, setError] = useState(null)

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true)
        const { isAuthenticated, user, profile } = await checkAuth()
        
        setIsAuthenticated(isAuthenticated)
        setUser(user)
        setProfile(profile)
        
        // If authenticated, check subscription
        if (isAuthenticated && user) {
          const subscriptionData = await checkSubscription(user.id)
          setSubscription(subscriptionData)
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    
    initAuth()
  }, [])

  // Login function
  const handleLogin = async (email, password) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const { isAuthenticated, user, profile } = await login(email, password)
      
      setIsAuthenticated(isAuthenticated)
      setUser(user)
      setProfile(profile)
      
      // Check subscription
      if (isAuthenticated && user) {
        const subscriptionData = await checkSubscription(user.id)
        setSubscription(subscriptionData)
      }
      
      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const handleRegister = async (email, password, userData) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const { isAuthenticated, user, profile } = await register(email, password, userData)
      
      setIsAuthenticated(isAuthenticated)
      setUser(user)
      setProfile(profile)
      
      // Check subscription
      if (isAuthenticated && user) {
        const subscriptionData = await checkSubscription(user.id)
        setSubscription(subscriptionData)
      }
      
      return { success: true }
    } catch (error) {
      console.error('Registration failed:', error)
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const handleLogout = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      await logout()
      
      setIsAuthenticated(false)
      setUser(null)
      setProfile(null)
      setSubscription(null)
      
      return { success: true }
    } catch (error) {
      console.error('Logout failed:', error)
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  // Reset password function
  const handleForgotPassword = async (email) => {
    try {
      setIsLoading(true)
      setError(null)
      
      await forgotPassword(email)
      
      return { success: true }
    } catch (error) {
      console.error('Password reset failed:', error)
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  // Update profile function
  const updateProfile = (newProfile) => {
    setProfile(prev => ({ ...prev, ...newProfile }))
  }

  // Update subscription function
  const updateSubscription = (newSubscription) => {
    setSubscription(prev => ({ ...prev, ...newSubscription }))
  }

  // Check if user can perform an action based on subscription
  const canPerformAction = (action) => {
    if (!isAuthenticated || !subscription) return false
    
    // Define actions allowed for each tier
    const allowedActions = {
      free: ['view_claims', 'upload_photos', 'basic_processing'],
      basic: ['view_claims', 'upload_photos', 'basic_processing', 'generate_reports', 'export_pdf'],
      pro: ['view_claims', 'upload_photos', 'basic_processing', 'advanced_processing', 'generate_reports', 'export_pdf', 'export_csv', 'bulk_upload'],
      enterprise: ['view_claims', 'upload_photos', 'basic_processing', 'advanced_processing', 'generate_reports', 'export_pdf', 'export_csv', 'bulk_upload', 'api_access', 'custom_branding']
    }
    
    return allowedActions[subscription.tier]?.includes(action) || false
  }

  const value = {
    user,
    profile,
    isAuthenticated,
    isLoading,
    subscription,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    forgotPassword: handleForgotPassword,
    updateProfile,
    updateSubscription,
    canPerformAction
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

