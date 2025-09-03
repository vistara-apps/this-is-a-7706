import { getUserProfile, updateUserProfile } from './supabaseService'

// Get user profile
export const getProfile = async (userId) => {
  try {
    return await getUserProfile(userId)
  } catch (error) {
    console.error('Failed to get user profile:', error)
    throw error
  }
}

// Update user profile
export const updateProfile = async (userId, updates) => {
  try {
    return await updateUserProfile(userId, updates)
  } catch (error) {
    console.error('Failed to update user profile:', error)
    throw error
  }
}

// Update user notification preferences
export const updateNotificationPreferences = async (userId, preferences) => {
  try {
    return await updateUserProfile(userId, { notificationPreferences: preferences })
  } catch (error) {
    console.error('Failed to update notification preferences:', error)
    throw error
  }
}

// Update user security settings
export const updateSecuritySettings = async (userId, settings) => {
  try {
    return await updateUserProfile(userId, { securitySettings: settings })
  } catch (error) {
    console.error('Failed to update security settings:', error)
    throw error
  }
}

// Update user UI preferences
export const updateUiPreferences = async (userId, preferences) => {
  try {
    return await updateUserProfile(userId, { uiPreferences: preferences })
  } catch (error) {
    console.error('Failed to update UI preferences:', error)
    throw error
  }
}

// Get user activity
export const getUserActivity = async (userId) => {
  try {
    // In a real implementation, this would fetch from a database
    // For demo purposes, we'll return mock data
    
    return {
      lastLogin: new Date().toISOString(),
      recentClaims: [
        {
          claimId: 'claim_1',
          claimNumber: 'CLM-2024-001',
          dateFiled: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          action: 'created'
        },
        {
          claimId: 'claim_1',
          claimNumber: 'CLM-2024-001',
          dateFiled: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          action: 'updated'
        }
      ],
      recentReports: [
        {
          reportId: 'report_1',
          claimId: 'claim_1',
          claimNumber: 'CLM-2024-001',
          generatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          action: 'generated'
        }
      ],
      usageStats: {
        claimsThisMonth: 1,
        photosProcessed: 24,
        reportsGenerated: 1
      }
    }
  } catch (error) {
    console.error('Failed to get user activity:', error)
    throw error
  }
}

// Get user usage statistics
export const getUserUsageStats = async (userId) => {
  try {
    // In a real implementation, this would fetch from a database
    // For demo purposes, we'll return mock data
    
    return {
      currentPeriod: {
        start: new Date(new Date().setDate(1)).toISOString(),
        end: new Date(new Date().setMonth(new Date().getMonth() + 1, 0)).toISOString()
      },
      claims: {
        total: 1,
        limit: 50,
        percentage: 2
      },
      photos: {
        total: 24,
        processed: 24,
        percentage: 48
      },
      reports: {
        total: 1,
        pdf: 1,
        csv: 0,
        percentage: 2
      },
      storage: {
        used: 12.5, // MB
        limit: 1000, // MB
        percentage: 1.25
      }
    }
  } catch (error) {
    console.error('Failed to get user usage stats:', error)
    throw error
  }
}

export default {
  getProfile,
  updateProfile,
  updateNotificationPreferences,
  updateSecuritySettings,
  updateUiPreferences,
  getUserActivity,
  getUserUsageStats
}

