import supabase, { 
  signIn, 
  signUp, 
  signOut, 
  getUser, 
  getUserProfile, 
  resetPassword 
} from './supabaseService'

// Check if user is authenticated
export const checkAuth = async () => {
  try {
    const user = await getUser()
    if (!user) return { isAuthenticated: false, user: null, profile: null }
    
    // Get user profile
    const profile = await getUserProfile(user.id)
    
    return {
      isAuthenticated: true,
      user,
      profile
    }
  } catch (error) {
    console.error('Auth check failed:', error)
    return { isAuthenticated: false, user: null, profile: null }
  }
}

// Login with email and password
export const login = async (email, password) => {
  try {
    const { user } = await signIn(email, password)
    if (!user) throw new Error('Login failed')
    
    // Get user profile
    const profile = await getUserProfile(user.id)
    
    return {
      isAuthenticated: true,
      user,
      profile
    }
  } catch (error) {
    console.error('Login failed:', error)
    throw error
  }
}

// Register new user
export const register = async (email, password, userData) => {
  try {
    const { user } = await signUp(email, password, userData)
    if (!user) throw new Error('Registration failed')
    
    // Get user profile
    const profile = await getUserProfile(user.id)
    
    return {
      isAuthenticated: true,
      user,
      profile
    }
  } catch (error) {
    console.error('Registration failed:', error)
    throw error
  }
}

// Logout user
export const logout = async () => {
  try {
    await signOut()
    return { isAuthenticated: false, user: null, profile: null }
  } catch (error) {
    console.error('Logout failed:', error)
    throw error
  }
}

// Reset password
export const forgotPassword = async (email) => {
  try {
    await resetPassword(email)
    return true
  } catch (error) {
    console.error('Password reset failed:', error)
    throw error
  }
}

// Check subscription status
export const checkSubscription = async (userId) => {
  try {
    const profile = await getUserProfile(userId)
    
    // Check if subscription is active
    const isSubscriptionActive = profile.subscriptionTier !== 'free'
    
    // Check if user is within usage limits
    const isWithinLimits = await checkUsageLimits(userId, profile.subscriptionTier)
    
    return {
      isActive: isSubscriptionActive,
      tier: profile.subscriptionTier,
      isWithinLimits,
      expiresAt: profile.subscriptionExpiresAt
    }
  } catch (error) {
    console.error('Subscription check failed:', error)
    throw error
  }
}

// Check if user is within usage limits
const checkUsageLimits = async (userId, tier) => {
  try {
    // Get current month's usage
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    
    // Get claims count for current month
    const { count, error } = await supabase
      .from('claims')
      .select('claimId', { count: 'exact' })
      .eq('userId', userId)
      .gte('dateFiled', startOfMonth.toISOString())
    
    if (error) throw error
    
    // Check against tier limits
    const limits = {
      free: 5,
      basic: 50,
      pro: 150,
      enterprise: Infinity
    }
    
    return count < (limits[tier] || 0)
  } catch (error) {
    console.error('Usage check failed:', error)
    return false
  }
}

export default {
  checkAuth,
  login,
  register,
  logout,
  forgotPassword,
  checkSubscription
}

