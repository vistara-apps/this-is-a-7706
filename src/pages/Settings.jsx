import React, { useState } from 'react'
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard,
  Settings as SettingsIcon,
  Save
} from 'lucide-react'
import { useUser } from '../contexts/UserContext'

const Settings = () => {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('profile')
  const [settings, setSettings] = useState({
    emailNotifications: true,
    processingAlerts: true,
    reportReady: true,
    autoBackup: false,
    dataRetention: '12months'
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ]

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto p-6">
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
            {activeTab === 'profile' && (
              <div className="card">
                <h2 className="text-xl font-semibold text-text-primary mb-6">
                  Profile Information
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue="John"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Adjuster"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      defaultValue="ABC Insurance"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <button className="btn-primary inline-flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="card">
                <h2 className="text-xl font-semibold text-text-primary mb-6">
                  Notification Preferences
                </h2>
                
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
                  <h2 className="text-xl font-semibold text-text-primary mb-6">
                    Data & Privacy
                  </h2>
                  
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
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="card">
                <h2 className="text-xl font-semibold text-text-primary mb-6">
                  Billing & Subscription
                </h2>
                
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
                  
                  <div className="flex space-x-4">
                    <button className="btn-secondary">Change Plan</button>
                    <button className="btn-secondary">Update Payment</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings