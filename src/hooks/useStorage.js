import { useState, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { uploadToStorage, uploadJsonToStorage, deleteFromStorage } from '../services/storageService'
import { compressImage, generateThumbnail } from '../utils/imageProcessing'

// Hook for file uploads with progress tracking
const useStorage = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const { isAuthenticated, user, subscription } = useAuth()

  // Check if user can use IPFS storage based on subscription
  const canUseIpfs = useCallback(() => {
    if (!isAuthenticated || !subscription) return false
    return ['pro', 'enterprise'].includes(subscription.tier)
  }, [isAuthenticated, subscription])

  // Upload a photo with compression and thumbnail generation
  const uploadPhoto = useCallback(async (file, claimId, metadata = {}) => {
    if (!isAuthenticated || !user) {
      setError(new Error('User not authenticated'))
      return null
    }

    try {
      setIsUploading(true)
      setProgress(0)
      setError(null)

      // Generate a unique path
      const timestamp = Date.now()
      const fileName = `${user.id}_${claimId}_${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
      const path = `photos/${fileName}`

      // Compress the image
      setProgress(10)
      const compressedFile = await compressImage(file)
      
      // Generate thumbnail
      setProgress(20)
      const thumbnail = await generateThumbnail(file)
      const thumbnailPath = `thumbnails/${fileName}`
      
      // Upload thumbnail
      setProgress(30)
      const thumbnailResult = await uploadToStorage(
        thumbnail, 
        'photos', 
        thumbnailPath, 
        { ...metadata, type: 'thumbnail' },
        false // Don't use IPFS for thumbnails
      )
      
      // Upload main photo
      setProgress(50)
      const useIpfs = canUseIpfs()
      const result = await uploadToStorage(
        compressedFile, 
        'photos', 
        path, 
        { ...metadata, type: 'photo', thumbnailUrl: thumbnailResult.url },
        useIpfs
      )
      
      setProgress(100)
      
      return {
        ...result,
        thumbnailUrl: thumbnailResult.url,
        fileName,
        originalName: file.name,
        size: compressedFile.size,
        type: compressedFile.type
      }
    } catch (err) {
      console.error('Photo upload failed:', err)
      setError(err)
      return null
    } finally {
      setIsUploading(false)
    }
  }, [isAuthenticated, user, canUseIpfs])

  // Upload a report as JSON
  const uploadReport = useCallback(async (reportData, claimId, name = 'report.json') => {
    if (!isAuthenticated || !user) {
      setError(new Error('User not authenticated'))
      return null
    }

    try {
      setIsUploading(true)
      setProgress(0)
      setError(null)

      // Generate a unique path
      const timestamp = Date.now()
      const fileName = `${user.id}_${claimId}_${timestamp}_${name}`
      const path = `reports/${fileName}`

      // Upload report
      setProgress(50)
      const useIpfs = canUseIpfs()
      const result = await uploadJsonToStorage(
        reportData, 
        'reports', 
        path, 
        fileName,
        useIpfs
      )
      
      setProgress(100)
      
      return {
        ...result,
        fileName,
        timestamp
      }
    } catch (err) {
      console.error('Report upload failed:', err)
      setError(err)
      return null
    } finally {
      setIsUploading(false)
    }
  }, [isAuthenticated, user, canUseIpfs])

  // Delete a file from storage
  const deleteFile = useCallback(async (bucket, path, ipfsHash = null) => {
    if (!isAuthenticated) {
      setError(new Error('User not authenticated'))
      return false
    }

    try {
      setIsUploading(true)
      setError(null)

      await deleteFromStorage(bucket, path, ipfsHash)
      
      return true
    } catch (err) {
      console.error('File deletion failed:', err)
      setError(err)
      return false
    } finally {
      setIsUploading(false)
    }
  }, [isAuthenticated])

  return {
    uploadPhoto,
    uploadReport,
    deleteFile,
    isUploading,
    progress,
    error,
    canUseIpfs
  }
}

export default useStorage

