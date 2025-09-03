// Utility functions for duplicate photo detection

// Calculate image hash (simplified perceptual hash)
export const calculateImageHash = async (imageFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(imageFile)
    
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      
      img.onload = () => {
        try {
          // Create a small canvas (8x8) for the hash
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const size = 8
          
          canvas.width = size
          canvas.height = size
          
          // Draw the image in grayscale
          ctx.filter = 'grayscale(1)'
          ctx.drawImage(img, 0, 0, size, size)
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, size, size).data
          
          // Calculate average value
          let sum = 0
          for (let i = 0; i < imageData.length; i += 4) {
            sum += imageData[i] // Just use red channel since it's grayscale
          }
          const avg = sum / (size * size)
          
          // Generate hash (1 for pixels above average, 0 for below)
          let hash = ''
          for (let i = 0; i < imageData.length; i += 4) {
            hash += imageData[i] >= avg ? '1' : '0'
          }
          
          resolve(hash)
        } catch (error) {
          reject(error)
        }
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

// Calculate image hash from URL
export const calculateImageHashFromUrl = async (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous' // Handle CORS
    img.src = imageUrl
    
    img.onload = () => {
      try {
        // Create a small canvas (8x8) for the hash
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const size = 8
        
        canvas.width = size
        canvas.height = size
        
        // Draw the image in grayscale
        ctx.filter = 'grayscale(1)'
        ctx.drawImage(img, 0, 0, size, size)
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, size, size).data
        
        // Calculate average value
        let sum = 0
        for (let i = 0; i < imageData.length; i += 4) {
          sum += imageData[i] // Just use red channel since it's grayscale
        }
        const avg = sum / (size * size)
        
        // Generate hash (1 for pixels above average, 0 for below)
        let hash = ''
        for (let i = 0; i < imageData.length; i += 4) {
          hash += imageData[i] >= avg ? '1' : '0'
        }
        
        resolve(hash)
      } catch (error) {
        reject(error)
      }
    }
    
    img.onerror = (error) => {
      reject(error)
    }
  })
}

// Calculate Hamming distance between two hashes
export const calculateHammingDistance = (hash1, hash2) => {
  if (hash1.length !== hash2.length) {
    throw new Error('Hashes must be of the same length')
  }
  
  let distance = 0
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) {
      distance++
    }
  }
  
  return distance
}

// Check if two images are similar based on hash distance
export const areImagesSimilar = (hash1, hash2, threshold = 10) => {
  const distance = calculateHammingDistance(hash1, hash2)
  return distance <= threshold
}

// Find duplicates in a list of photos
export const findDuplicates = async (photos, threshold = 10) => {
  // Calculate hashes for all photos
  const photoHashes = await Promise.all(
    photos.map(async (photo) => {
      try {
        let hash
        if (photo.file) {
          hash = await calculateImageHash(photo.file)
        } else if (photo.processedUrl) {
          hash = await calculateImageHashFromUrl(photo.processedUrl)
        } else {
          throw new Error('No image source available')
        }
        
        return {
          photoId: photo.photoId,
          hash
        }
      } catch (error) {
        console.error(`Failed to calculate hash for photo ${photo.photoId}:`, error)
        return {
          photoId: photo.photoId,
          hash: null,
          error: error.message
        }
      }
    })
  )
  
  // Find duplicates
  const duplicates = []
  
  for (let i = 0; i < photoHashes.length; i++) {
    const photo1 = photoHashes[i]
    
    // Skip photos with hash errors
    if (!photo1.hash) continue
    
    for (let j = i + 1; j < photoHashes.length; j++) {
      const photo2 = photoHashes[j]
      
      // Skip photos with hash errors
      if (!photo2.hash) continue
      
      // Calculate similarity
      const distance = calculateHammingDistance(photo1.hash, photo2.hash)
      const isSimilar = distance <= threshold
      
      if (isSimilar) {
        duplicates.push({
          photoId1: photo1.photoId,
          photoId2: photo2.photoId,
          distance,
          similarity: 1 - (distance / 64) // 64 is max possible distance for 8x8 hash
        })
      }
    }
  }
  
  return duplicates
}

// Check if a new photo is a duplicate of any existing photos
export const checkForDuplicates = async (newPhoto, existingPhotos, threshold = 10) => {
  try {
    // Calculate hash for new photo
    let newPhotoHash
    if (newPhoto.file) {
      newPhotoHash = await calculateImageHash(newPhoto.file)
    } else if (newPhoto.processedUrl) {
      newPhotoHash = await calculateImageHashFromUrl(newPhoto.processedUrl)
    } else {
      throw new Error('No image source available for new photo')
    }
    
    // Calculate hashes for existing photos
    const existingPhotoHashes = await Promise.all(
      existingPhotos.map(async (photo) => {
        try {
          let hash
          if (photo.file) {
            hash = await calculateImageHash(photo.file)
          } else if (photo.processedUrl) {
            hash = await calculateImageHashFromUrl(photo.processedUrl)
          } else {
            throw new Error('No image source available')
          }
          
          return {
            photoId: photo.photoId,
            hash
          }
        } catch (error) {
          console.error(`Failed to calculate hash for photo ${photo.photoId}:`, error)
          return {
            photoId: photo.photoId,
            hash: null,
            error: error.message
          }
        }
      })
    )
    
    // Check for duplicates
    const duplicates = []
    
    for (const existingPhoto of existingPhotoHashes) {
      // Skip photos with hash errors
      if (!existingPhoto.hash) continue
      
      // Calculate similarity
      const distance = calculateHammingDistance(newPhotoHash, existingPhoto.hash)
      const isSimilar = distance <= threshold
      
      if (isSimilar) {
        duplicates.push({
          photoId: existingPhoto.photoId,
          distance,
          similarity: 1 - (distance / 64) // 64 is max possible distance for 8x8 hash
        })
      }
    }
    
    // Sort duplicates by similarity (highest first)
    duplicates.sort((a, b) => b.similarity - a.similarity)
    
    return {
      isDuplicate: duplicates.length > 0,
      duplicates,
      mostSimilar: duplicates.length > 0 ? duplicates[0] : null
    }
  } catch (error) {
    console.error('Duplicate check failed:', error)
    return {
      isDuplicate: false,
      duplicates: [],
      mostSimilar: null,
      error: error.message
    }
  }
}

export default {
  calculateImageHash,
  calculateImageHashFromUrl,
  calculateHammingDistance,
  areImagesSimilar,
  findDuplicates,
  checkForDuplicates
}

