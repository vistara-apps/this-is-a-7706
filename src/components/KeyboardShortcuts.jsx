import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// Keyboard shortcuts component
const KeyboardShortcuts = ({ children, shortcuts = [] }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showHelp, setShowHelp] = useState(false)
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Show help dialog on ? key
      if (event.key === '?' && !event.ctrlKey && !event.metaKey) {
        setShowHelp(prev => !prev)
        return
      }
      
      // Check if target is an input, textarea, or has contentEditable
      const target = event.target
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }
      
      // Check for shortcuts
      for (const shortcut of shortcuts) {
        const { key, ctrlKey, metaKey, shiftKey, altKey, action } = shortcut
        
        if (
          event.key === key &&
          !!event.ctrlKey === !!ctrlKey &&
          !!event.metaKey === !!metaKey &&
          !!event.shiftKey === !!shiftKey &&
          !!event.altKey === !!altKey
        ) {
          event.preventDefault()
          
          if (typeof action === 'function') {
            action(event)
          } else if (typeof action === 'string') {
            navigate(action)
          }
          
          break
        }
      }
    }
    
    // Add event listener
    window.addEventListener('keydown', handleKeyDown)
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [navigate, location.pathname, shortcuts])
  
  // Format shortcut for display
  const formatShortcut = (shortcut) => {
    const parts = []
    
    if (shortcut.ctrlKey) parts.push('Ctrl')
    if (shortcut.metaKey) parts.push('⌘')
    if (shortcut.altKey) parts.push('Alt')
    if (shortcut.shiftKey) parts.push('Shift')
    
    parts.push(shortcut.key.toUpperCase())
    
    return parts.join(' + ')
  }
  
  return (
    <>
      {children}
      
      {/* Help dialog */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-text-primary mb-4">
              Keyboard Shortcuts
            </h2>
            
            <div className="space-y-2">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-text-primary">{shortcut.description}</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-text-secondary font-mono text-sm">
                    {formatShortcut(shortcut)}
                  </kbd>
                </div>
              ))}
              
              <div className="flex justify-between">
                <span className="text-text-primary">Show/hide this help</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-text-secondary font-mono text-sm">
                  ?
                </kbd>
              </div>
            </div>
            
            <button
              onClick={() => setShowHelp(false)}
              className="mt-6 w-full btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// Default shortcuts
export const defaultShortcuts = [
  {
    key: 'd',
    description: 'Go to Dashboard',
    action: '/'
  },
  {
    key: 'c',
    description: 'Go to Claims',
    action: '/claims'
  },
  {
    key: 'r',
    description: 'Go to Reports',
    action: '/reports'
  },
  {
    key: 's',
    description: 'Go to Settings',
    action: '/settings'
  },
  {
    key: 'u',
    description: 'Upload Photos',
    action: () => {
      window.location.href = '/claims?upload=true'
    }
  },
  {
    key: 'f',
    ctrlKey: true,
    description: 'Search',
    action: () => {
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i]')
      if (searchInput) {
        searchInput.focus()
      }
    }
  },
  {
    key: 'Escape',
    description: 'Close modal or cancel',
    action: () => {
      // Find and click the first close button
      const closeButton = document.querySelector('[aria-label="Close"], button:contains("Cancel"), button:contains("Close")')
      if (closeButton) {
        closeButton.click()
      }
    }
  }
]

export default KeyboardShortcuts

