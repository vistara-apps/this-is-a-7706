import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FolderOpen, 
  FileText, 
  Settings, 
  Camera 
} from 'lucide-react'

const Sidebar = () => {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/claims', icon: FolderOpen, label: 'Claims' },
    { to: '/reports', icon: FileText, label: 'Reports' },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ]

  return (
    <div className="w-64 bg-surface border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">ClaimSnap</h1>
            <p className="text-sm text-text-secondary">Property Damage AI</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              Adjuster Pro
            </p>
            <p className="text-xs text-text-secondary truncate">
              Pro Plan
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar