import { v4 as uuidv4 } from 'uuid'
import { processPhotos } from './aiService'
import { uploadPhoto } from '../hooks/useStorage'
import { compressImage, checkImageQualityBasic, extractExifData } from '../utils/imageProcessing'
import { createPhoto, updatePhoto } from './supabaseService'

// Process a batch of photos
export const processBatchPhotos = async (files, claimId, userId, onProgress) => {
  try {
    // Validate inputs
    if (!files || files.length === 0) {
      throw new Error('No files provided')
    }
    
    if (!claimId) {
      throw new Error('Claim ID is required')
    }
    
    if (!userId) {
      throw new Error('User ID is required')
    }
    
    // Update progress
    if (onProgress) onProgress(0, 'Starting photo processing')
    
    // Filter for image files only
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      throw new Error('No valid image files found')
    }
    
    // Create photo objects with initial data
    const photoPromises = imageFiles.map(async (file, index) => {
      // Update progress
      if (onProgress) onProgress((index / imageFiles.length) * 10, `Preparing photo ${index + 1} of ${imageFiles.length}`)
      
      // Generate unique ID
      const photoId = `photo_${uuidv4()}`
      
      // Create object URL for preview
      const url = URL.createObjectURL(file)
      
      // Extract EXIF data
      const exifData = await extractExifData(file)
      
      // Basic quality check
      const qualityCheck = await checkImageQualityBasic(file)
      
      return {
        photoId,
        claimId,
        userId,
        originalFilename: file.name,
        processedUrl: url,
        previewUrl: url,
        tags: [],
        damageType: 'pending',
        severity: 'pending',
        isDuplicate: false,
        isLowQuality: qualityCheck.isLowQuality,
        qualityIssues: qualityCheck.issues,
        qualityScore: qualityCheck.qualityScore,
        dimensions: qualityCheck.dimensions,
        exifData,
        uploadedAt: new Date().toISOString(),
        file
      }
    })
    
    // Wait for all photo objects to be created
    const photos = await Promise.all(photoPromises)
    
    // Update progress
    if (onProgress) onProgress(10, 'Analyzing photos with AI')
    
    // Process photos with AI
    const processedPhotos = await processPhotos(photos)
    
    // Update progress
    if (onProgress) onProgress(50, 'Uploading processed photos')
    
    // Upload photos to storage and save to database
    const uploadPromises = processedPhotos.map(async (photo, index) => {
      try {
        // Update progress
        if (onProgress) onProgress(50 + (index / processedPhotos.length) * 40, `Uploading photo ${index + 1} of ${processedPhotos.length}`)
        
        // Upload photo to storage
        const storageResult = await uploadPhoto(photo.file, claimId, {
          userId,
          claimId,
          photoId: photo.photoId,
          damageType: photo.damageType,
          severity: photo.severity,
          tags: photo.tags
        })
        
        // Create database record
        const photoData = {
          photoId: photo.photoId,
          claimId,
          userId,
          originalFilename: photo.originalFilename,
          processedUrl: storageResult.url,
          thumbnailUrl: storageResult.thumbnailUrl,
          ipfsHash: storageResult.ipfsHash,
          ipfsUrl: storageResult.ipfsUrl,
          tags: photo.tags,
          damageType: photo.damageType,
          severity: photo.severity,
          description: photo.description,
          confidence: photo.confidence,
          isDuplicate: photo.isDuplicate,
          duplicateConfidence: photo.duplicateConfidence,
          duplicateSimilarTo: photo.duplicateSimilarTo,
          isLowQuality: photo.isLowQuality,
          qualityIssues: photo.qualityIssues,
          qualityScore: photo.qualityScore,
          dimensions: photo.dimensions,
          exifData: photo.exifData,
          size: storageResult.size,
          type: storageResult.type,
          uploadedAt: photo.uploadedAt,
          processedAt: photo.processedAt
        }
        
        // Save to database
        const savedPhoto = await createPhoto(photoData)
        
        // Clean up object URL
        URL.revokeObjectURL(photo.processedUrl)
        
        return {
          ...savedPhoto,
          previewUrl: storageResult.url
        }
      } catch (error) {
        console.error(`Error uploading photo ${photo.photoId}:`, error)
        
        // Return photo with error flag
        return {
          ...photo,
          uploadError: true,
          errorMessage: error.message
        }
      }
    })
    
    // Wait for all uploads to complete
    const finalPhotos = await Promise.all(uploadPromises)
    
    // Update progress
    if (onProgress) onProgress(90, 'Finalizing')
    
    // Filter out photos with upload errors
    const successfulPhotos = finalPhotos.filter(photo => !photo.uploadError)
    const failedPhotos = finalPhotos.filter(photo => photo.uploadError)
    
    // Log failures if any
    if (failedPhotos.length > 0) {
      console.warn(`${failedPhotos.length} photos failed to upload`)
    }
    
    // Update progress
    if (onProgress) onProgress(100, 'Processing complete')
    
    return {
      success: true,
      photos: successfulPhotos,
      failedPhotos,
      totalProcessed: finalPhotos.length,
      successCount: successfulPhotos.length,
      failureCount: failedPhotos.length
    }
  } catch (error) {
    console.error('Photo batch processing failed:', error)
    
    // Update progress with error
    if (onProgress) onProgress(0, `Error: ${error.message}`)
    
    throw error
  }
}

// Update photo tags
export const updatePhotoTags = async (photoId, tags) => {
  try {
    return await updatePhoto(photoId, { tags })
  } catch (error) {
    console.error('Failed to update photo tags:', error)
    throw error
  }
}

// Update photo damage type
export const updatePhotoDamageType = async (photoId, damageType) => {
  try {
    return await updatePhoto(photoId, { damageType })
  } catch (error) {
    console.error('Failed to update photo damage type:', error)
    throw error
  }
}

// Update photo severity
export const updatePhotoSeverity = async (photoId, severity) => {
  try {
    return await updatePhoto(photoId, { severity })
  } catch (error) {
    console.error('Failed to update photo severity:', error)
    throw error
  }
}

// Update photo description
export const updatePhotoDescription = async (photoId, description) => {
  try {
    return await updatePhoto(photoId, { description })
  } catch (error) {
    console.error('Failed to update photo description:', error)
    throw error
  }
}

// Mark photo as duplicate or not
export const updatePhotoDuplicate = async (photoId, isDuplicate, similarToId = null) => {
  try {
    return await updatePhoto(photoId, { 
      isDuplicate, 
      duplicateSimilarTo: similarToId 
    })
  } catch (error) {
    console.error('Failed to update photo duplicate status:', error)
    throw error
  }
}

// Mark photo as low quality or not
export const updatePhotoQuality = async (photoId, isLowQuality, issues = []) => {
  try {
    return await updatePhoto(photoId, { 
      isLowQuality, 
      qualityIssues: issues 
    })
  } catch (error) {
    console.error('Failed to update photo quality status:', error)
    throw error
  }
}

export default {
  processBatchPhotos,
  updatePhotoTags,
  updatePhotoDamageType,
  updatePhotoSeverity,
  updatePhotoDescription,
  updatePhotoDuplicate,
  updatePhotoQuality
}

