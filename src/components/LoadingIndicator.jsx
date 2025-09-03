import React from 'react'

const LoadingIndicator = ({ 
  size = 'medium', 
  message = 'Loading...', 
  fullScreen = false,
  progress = null,
  className = ''
}) => {
  // Size classes
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-2',
    large: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4'
  }
  
  // Container classes
  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'
    : 'flex flex-col items-center justify-center'
  
  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center">
        <div 
          className={`
            ${sizeClasses[size] || sizeClasses.medium} 
            rounded-full border-b-transparent border-primary animate-spin
          `}
        />
        
        {message && (
          <p className={`
            mt-3 text-center
            ${fullScreen ? 'text-white' : 'text-text-primary'}
          `}>
            {message}
          </p>
        )}
        
        {progress !== null && (
          <div className="w-48 mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className={`
              text-xs mt-1 text-center
              ${fullScreen ? 'text-white' : 'text-text-secondary'}
            `}>
              {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Specialized loading indicators
export const FullScreenLoader = (props) => (
  <LoadingIndicator fullScreen={true} {...props} />
)

export const PageLoader = (props) => (
  <LoadingIndicator 
    size="large" 
    className="h-full w-full py-12" 
    {...props} 
  />
)

export const ButtonLoader = ({ loading, children, ...props }) => {
  return (
    <button 
      disabled={loading} 
      className="relative btn-primary disabled:opacity-70"
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 rounded-full border-b-transparent border-white animate-spin" />
        </span>
      )}
      <span className={loading ? 'invisible' : ''}>
        {children}
      </span>
    </button>
  )
}

export const InlineLoader = (props) => (
  <LoadingIndicator 
    size="small" 
    className="inline-flex items-center" 
    {...props} 
  />
)

export default LoadingIndicator

