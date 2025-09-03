import React, { useCallback, useState } from 'react'
import { Upload, X, AlertCircle } from 'lucide-react'
import { usePhotos } from '../contexts/PhotoContext'
import { processPhotosWithAI } from '../services/aiService'

const UploadDropzone = ({ onUpload }) => {
  const [isDragActive, setIsDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { addPhotos, setIsProcessing } = usePhotos()

  const onDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }, [])

  const onDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }, [])

  const onDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const onDrop = useCallback(async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    await handleFiles(files)
  }, [])

  const onFileSelect = useCallback(async (e) => {
    const files = Array.from(e.target.files)
    await handleFiles(files)
  }, [])

  const handleFiles = async (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      alert('Please select only image files')
      return
    }

    setIsProcessing(true)
    setUploadProgress(0)

    try {
      // Create photo objects
      const photoPromises = imageFiles.map(async (file, index) => {
        // Simulate upload progress
        setTimeout(() => {
          setUploadProgress((index + 1) / imageFiles.length * 50)
        }, index * 100)

        const photoId = `photo_${Date.now()}_${index}`
        const url = URL.createObjectURL(file)
        
        return {
          photoId,
          claimId: 'claim_1',
          originalFilename: file.name,
          processedUrl: url,
          tags: [],
          damageType: 'pending',
          severity: 'pending',
          isDuplicate: false,
          isLowQuality: false,
          uploadedAt: new Date().toISOString(),
          file: file
        }
      })

      const newPhotos = await Promise.all(photoPromises)
      addPhotos(newPhotos)

      // Process with AI
      setUploadProgress(60)
      const processedPhotos = await processPhotosWithAI(newPhotos)
      
      // Update photos with AI results
      processedPhotos.forEach(photo => {
        addPhotos([photo])
      })

      setUploadProgress(100)
      
      if (onUpload) {
        onUpload(processedPhotos)
      }

    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsProcessing(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="w-full">
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all
          ${isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center
              ${isDragActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}
            `}>
              <Upload className="w-6 h-6" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-text-primary">
              {isDragActive ? 'Drop photos here' : 'Upload property damage photos'}
            </h3>
            <p className="text-text-secondary mt-1">
              Drag & drop photos or click to select files
            </p>
            <p className="text-sm text-text-secondary mt-2">
              Supports: JPG, PNG, GIF (Max 10MB each)
            </p>
          </div>
        </div>

        {uploadProgress > 0 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-text-secondary mt-2">
              Processing photos... {Math.round(uploadProgress)}%
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UploadDropzone