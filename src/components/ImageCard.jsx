import React, { useState } from 'react'
import { X, Tag, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { usePhotos } from '../contexts/PhotoContext'

const ImageCard = ({ photo, variant = 'default' }) => {
  const [showFullImage, setShowFullImage] = useState(false)
  const { updatePhoto, removePhoto } = usePhotos()

  const getStatusIcon = () => {
    switch (variant) {
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-accent" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (variant) {
      case 'processing':
        return 'border-yellow-200 bg-yellow-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'success':
        return 'border-green-200 bg-green-50'
      default:
        return 'border-gray-200 bg-surface'
    }
  }

  const handleTagAdd = (newTag) => {
    if (newTag && !photo.tags.includes(newTag)) {
      updatePhoto(photo.photoId, {
        tags: [...photo.tags, newTag]
      })
    }
  }

  const handleTagRemove = (tagToRemove) => {
    updatePhoto(photo.photoId, {
      tags: photo.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const damageTypeColors = {
    'Water Damage': 'bg-blue-100 text-blue-800',
    'Fire Damage': 'bg-red-100 text-red-800',
    'Hail Damage': 'bg-purple-100 text-purple-800',
    'Wind Damage': 'bg-gray-100 text-gray-800',
    'Structural': 'bg-orange-100 text-orange-800',
    'pending': 'bg-yellow-100 text-yellow-800'
  }

  return (
    <>
      <div className={`
        relative group rounded-lg border-2 overflow-hidden transition-all hover:shadow-lg
        ${getStatusColor()}
      `}>
        {/* Status indicator */}
        <div className="absolute top-2 left-2 z-10 flex items-center space-x-1">
          {getStatusIcon()}
          {photo.isDuplicate && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">
              Duplicate
            </span>
          )}
          {photo.isLowQuality && (
            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">
              Low Quality
            </span>
          )}
        </div>

        {/* Remove button */}
        <button
          onClick={() => removePhoto(photo.photoId)}
          className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Image */}
        <div 
          className="aspect-square cursor-pointer"
          onClick={() => setShowFullImage(true)}
        >
          <img
            src={photo.processedUrl}
            alt={photo.originalFilename}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Photo info */}
        <div className="p-3 space-y-2">
          <h4 className="font-medium text-sm text-text-primary truncate">
            {photo.originalFilename}
          </h4>
          
          {/* Damage type */}
          {photo.damageType && photo.damageType !== 'pending' && (
            <span className={`
              inline-block px-2 py-1 rounded text-xs font-medium
              ${damageTypeColors[photo.damageType] || damageTypeColors.pending}
            `}>
              {photo.damageType}
            </span>
          )}

          {/* Severity */}
          {photo.severity && photo.severity !== 'pending' && (
            <div className="flex items-center space-x-1">
              <span className="text-xs text-text-secondary">Severity:</span>
              <span className="text-xs font-medium capitalize">{photo.severity}</span>
            </div>
          )}

          {/* Tags */}
          {photo.tags && photo.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {photo.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                >
                  <Tag className="w-3 h-3" />
                  <span>{tag}</span>
                  <button
                    onClick={() => handleTagRemove(tag)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full image modal */}
      {showFullImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={photo.processedUrl}
              alt={photo.originalFilename}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-4 right-4 bg-white text-black rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ImageCard