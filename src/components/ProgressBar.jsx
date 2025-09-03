import React from 'react'

const ProgressBar = ({ progress, variant = 'default', label }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'upload':
        return 'bg-blue-500'
      case 'processing':
        return 'bg-purple-500'
      default:
        return 'bg-primary'
    }
  }

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm text-text-secondary mb-1">
          <span>{label}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getVariantStyles()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar