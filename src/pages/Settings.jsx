import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard,
  Settings as SettingsIcon,
  BarChart,
  Save,
  ExternalLink
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import ProfileManager from '../components/ProfileManager'
import { getUserActivity, getUserUsageStats, updateNotificationPreferences, updateSecuritySettings } from '../services/userService'
import ErrorBoundary from '../components/ErrorBoundary'
import { PageLoader } from '../components/LoadingIndicator'

const Settings = () => {
  const { user, profile } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [settings, setSettings] = useState({
    emailNotifications: true,
    processingAlerts: true,
    reportReady: true,
    autoBackup: false,
    dataRetention: '12months'
  })
  const [activity, setActivity] = useState(null)
  const [usageStats, setUsageStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch user activity and usage stats
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch user activity
        const activityData = await getUserActivity(user.id)
        setActivity(activityData)
        
        // Fetch usage stats
        const statsData = await getUserUsageStats(user.id)
        setUsageStats(statsData)
        
        // Set notification preferences from profile
        if (profile && profile.notificationPreferences) {
          setSettings(prev => ({
            ...prev,
            ...profile.notificationPreferences
          }))
        }
        
        // Set security settings from profile
        if (profile && profile.securitySettings) {
          setSettings(prev => ({
            ...prev,
            ...profile.securitySettings
          }))
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err)
        setError('Failed to load user data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [user, profile])

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'usage', label: 'Usage', icon: BarChart }
  ]

  const handleSettingChange = async (key, value) => {
    try {
      setSettings(prev => ({ ...prev, [key]: value }))
      
      // Update notification preferences
      if (['emailNotifications', 'processingAlerts', 'reportReady'].includes(key)) {
        await updateNotificationPreferences(user.id, {
          ...settings,
          [key]: value
        })
      }
      
      // Update security settings
      if (['autoBackup', 'dataRetention'].includes(key)) {
        await updateSecuritySettings(user.id, {
          ...settings,
          [key]: value
        })
      }
    } catch (err) {
      console.error('Failed to update settings:', err)
      // Revert setting change on error
      setSettings(prev => ({ ...prev }))
    }
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString()
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
          <p className="text-text-secondary mt-1">
            Manage your account preferences and configuration
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors
                    ${activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'
                    }
                  `}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {isLoading ? (
              <PageLoader message="Loading settings..." />
            ) : error ? (
              <div className="card">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 text-primary hover:underline"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <ErrorBoundary>
                {activeTab === 'profile' && (
                  <ProfileManager />
                )}

                {activeTab === 'notifications' && (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-text-primary mb-6">
                      Notification Preferences
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-text-primary">Email Notifications</h3>
                          <p className="text-sm text-text-secondary">
                            Receive email updates about your account
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.emailNotifications}
                            onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-text-primary">Processing Alerts</h3>
                          <p className="text-sm text-text-secondary">
                            Get notified when photo processing is complete
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.processingAlerts}
                            onChange={(e) => handleSettingChange('processingAlerts', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-text-primary">Report Ready</h3>
                          <p className="text-sm text-text-secondary">
                            Be notified when reports are ready for download
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.reportReady}
                            onChange={(e) => handleSettingChange('reportReady', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div className="card">
                      <h3 className="text-lg font-semibold text-text-primary mb-6">
                        Data & Privacy
                      </h3>
                      
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-text-primary">Auto Backup</h3>
                            <p className="text-sm text-text-secondary">
                              Automatically backup processed photos to cloud storage
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.autoBackup}
                              onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                          </label>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Data Retention Period
                          </label>
                          <select
                            value={settings.dataRetention}
                            onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="3months">3 Months</option>
                            <option value="6months">6 Months</option>
                            <option value="12months">12 Months</option>
                            <option value="24months">24 Months</option>
                            <option value="indefinite">Indefinite</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card">
                      <h3 className="text-lg font-semibold text-text-primary mb-6">
                        Password
                      </h3>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        
                        <button className="btn-primary inline-flex items-center space-x-2">
                          <Save className="w-4 h-4" />
                          <span>Update Password</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'billing' && (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-text-primary mb-6">
                      Billing & Subscription
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-text-primary">Pro Plan</h3>
                            <p className="text-sm text-text-secondary">
                              Up to 150 claims per month
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-text-primary">$99</p>
                            <p className="text-sm text-text-secondary">per month</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-text-primary mb-3">Payment Method</h3>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                              VISA
                            </div>
                            <span className="text-text-primary">•••• •••• •••• 4242</span>
                            <span className="text-text-secondary">Expires 12/25</span>
                          </div>
                        </div>
                      </div>
                      
                      <Link to="/billing" className="btn-primary inline-flex items-center space-x-2">
                        <CreditCard className="w-4 h-4" />
                        <span>Manage Billing</span>
                      </Link>
                    </div>
                  </div>
                )}

                {activeTab === 'usage' && (
                  <div className="space-y-6">
                    {usageStats && (
                      <div className="card">
                        <h3 className="text-lg font-semibold text-text-primary mb-6">
                          Current Usage
                        </h3>
                        
                        <div className="space-y-6">
                          <div>
                            <div className="flex justify-between text-sm text-text-secondary mb-1">
                              <span>Claims ({usageStats.claims.total}/{usageStats.claims.limit})</span>
                              <span>{usageStats.claims.percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${usageStats.claims.percentage}%` }}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm text-text-secondary mb-1">
                              <span>Photos Processed ({usageStats.photos.processed}/{usageStats.photos.total})</span>
                              <span>{usageStats.photos.percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-accent h-2 rounded-full"
                                style={{ width: `${usageStats.photos.percentage}%` }}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm text-text-secondary mb-1">
                              <span>Storage ({usageStats.storage.used} MB/{usageStats.storage.limit} MB)</span>
                              <span>{usageStats.storage.percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: `${usageStats.storage.percentage}%` }}
                              />
                            </div>
                          </div>
                          
                          <div className="text-sm text-text-secondary">
                            <p>Current billing period: {formatDate(usageStats.currentPeriod.start)} - {formatDate(usageStats.currentPeriod.end)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activity && (
                      <div className="card">
                        <h3 className="text-lg font-semibold text-text-primary mb-6">
                          Recent Activity
                        </h3>
                        
                        <div className="space-y-4">
                          <p className="text-sm text-text-secondary">
                            Last login: {formatDate(activity.lastLogin)} at {formatTime(activity.lastLogin)}
                          </p>
                          
                          <div>
                            <h4 className="font-medium text-text-primary mb-2">Recent Claims</h4>
                            {activity.recentClaims.length > 0 ? (
                              <ul className="space-y-2">
                                {activity.recentClaims.map((claim, index) => (
                                  <li key={index} className="text-sm">
                                    <span className="text-text-secondary">{formatDate(claim.dateFiled)}:</span>{' '}
                                    <span className="text-text-primary">{claim.action}</span>{' '}
                                    <Link to={`/claims/${claim.claimId}`} className="text-primary hover:underline">
                                      {claim.claimNumber}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-text-secondary">No recent claim activity</p>
                            )}
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-text-primary mb-2">Recent Reports</h4>
                            {activity.recentReports.length > 0 ? (
                              <ul className="space-y-2">
                                {activity.recentReports.map((report, index) => (
                                  <li key={index} className="text-sm">
                                    <span className="text-text-secondary">{formatDate(report.generatedAt)}:</span>{' '}
                                    <span className="text-text-primary">{report.action} report for</span>{' '}
                                    <Link to={`/claims/${report.claimId}`} className="text-primary hover:underline">
                                      {report.claimNumber}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-text-secondary">No recent report activity</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ErrorBoundary>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

