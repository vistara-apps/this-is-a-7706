import React, { createContext, useContext, useState } from 'react'

const PhotoContext = createContext()

export const usePhotos = () => {
  const context = useContext(PhotoContext)
  if (!context) {
    throw new Error('usePhotos must be used within a PhotoProvider')
  }
  return context
}

export const PhotoProvider = ({ children }) => {
  const [photos, setPhotos] = useState([])
  const [claims, setClaims] = useState([
    {
      claimId: 'claim_1',
      userId: 'user_1',
      claimNumber: 'CLM-2024-001',
      dateFiled: '2024-01-15',
      status: 'processing',
      description: 'Property Damage Photos'
    }
  ])
  const [reports, setReports] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)

  const addPhotos = (newPhotos) => {
    setPhotos(prev => [...prev, ...newPhotos])
  }

  const updatePhoto = (photoId, updates) => {
    setPhotos(prev => 
      prev.map(photo => 
        photo.photoId === photoId ? { ...photo, ...updates } : photo
      )
    )
  }

  const removePhoto = (photoId) => {
    setPhotos(prev => prev.filter(photo => photo.photoId !== photoId))
  }

  const value = {
    photos,
    setPhotos,
    claims,
    setClaims,
    reports,
    setReports,
    isProcessing,
    setIsProcessing,
    addPhotos,
    updatePhoto,
    removePhoto
  }

  return (
    <PhotoContext.Provider value={value}>
      {children}
    </PhotoContext.Provider>
  )
}