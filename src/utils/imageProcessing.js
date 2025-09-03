// Image processing utilities

// Compress an image file to reduce size
export const compressImage = async (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        // Scale down if needed
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw image on canvas
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convert to blob
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas to Blob conversion failed'))
            return
          }
          
          // Create new file from blob
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          })
          
          resolve(compressedFile)
        }, 'image/jpeg', quality)
      }
      
      img.onerror = (error) => {
        reject(error)
      }
    }
    
    reader.onerror = (error) => {
      reject(error)
    }
  })
}

// Generate a thumbnail from an image file
export const generateThumbnail = async (file, maxWidth = 300, quality = 0.7) => {
  return compressImage(file, maxWidth, quality)
}

// Extract EXIF data from an image file
export const extractExifData = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    
    reader.onload = (event) => {
      try {
        const buffer = event.target.result
        const view = new DataView(buffer)
        
        // Check for EXIF marker
        if (view.getUint16(0, false) !== 0xFFD8) {
          // Not a JPEG
          resolve({})
          return
        }
        
        let offset = 2
        let length = buffer.byteLength
        let exifData = {}
        
        // Look for the EXIF APP1 marker (0xFFE1)
        while (offset < length) {
          if (view.getUint16(offset, false) === 0xFFE1) {
            // Found EXIF APP1 marker
            const exifLength = view.getUint16(offset + 2, false)
            
            // Extract basic metadata
            exifData = {
              hasExif: true,
              dateTime: extractDateTime(view, offset, exifLength),
              gpsCoordinates: extractGPS(view, offset, exifLength),
              orientation: extractOrientation(view, offset, exifLength),
              make: extractMake(view, offset, exifLength),
              model: extractModel(view, offset, exifLength)
            }
            
            break
          }
          
          offset += 2 + view.getUint16(offset + 2, false)
        }
        
        resolve(exifData)
      } catch (error) {
        console.error('EXIF extraction failed:', error)
        resolve({})
      }
    }
    
    reader.onerror = (error) => {
      reject(error)
    }
  })
}

// Helper functions for EXIF extraction
const extractDateTime = (view, offset, length) => {
  // Simplified implementation - in a real app, you would parse the EXIF structure properly
  return null
}

const extractGPS = (view, offset, length) => {
  // Simplified implementation - in a real app, you would parse the EXIF structure properly
  return null
}

const extractOrientation = (view, offset, length) => {
  // Simplified implementation - in a real app, you would parse the EXIF structure properly
  return 1 // Default orientation
}

const extractMake = (view, offset, length) => {
  // Simplified implementation - in a real app, you would parse the EXIF structure properly
  return null
}

const extractModel = (view, offset, length) => {
  // Simplified implementation - in a real app, you would parse the EXIF structure properly
  return null
}

// Check if an image meets minimum quality requirements
export const checkImageQualityBasic = async (file, minWidth = 800, minHeight = 600) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      
      img.onload = () => {
        const width = img.width
        const height = img.height
        
        const issues = []
        
        // Check dimensions
        if (width < minWidth || height < minHeight) {
          issues.push(`Resolution too low (${width}x${height}), minimum ${minWidth}x${minHeight} required`)
        }
        
        // Calculate aspect ratio
        const aspectRatio = width / height
        if (aspectRatio > 3 || aspectRatio < 0.33) {
          issues.push('Unusual aspect ratio, image may be distorted')
        }
        
        // Calculate quality score (simplified)
        const qualityScore = Math.min(1, Math.max(0, 
          ((width / minWidth) + (height / minHeight)) / 4 + 0.5
        ))
        
        resolve({
          isLowQuality: issues.length > 0,
          issues,
          qualityScore,
          dimensions: { width, height }
        })
      }
      
      img.onerror = (error) => {
        reject(error)
      }
    }
    
    reader.onerror = (error) => {
      reject(error)
    }
  })
}

// Create a data URL from a file
export const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

// Create an object URL from a file
export const fileToObjectUrl = (file) => {
  return URL.createObjectURL(file)
}

// Revoke an object URL to free memory
export const revokeObjectUrl = (url) => {
  URL.revokeObjectURL(url)
}

export default {
  compressImage,
  generateThumbnail,
  extractExifData,
  checkImageQualityBasic,
  fileToDataUrl,
  fileToObjectUrl,
  revokeObjectUrl
}

