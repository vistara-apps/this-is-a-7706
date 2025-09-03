import OpenAI from 'openai'

// Initialize OpenAI client
const apiKey = import.meta.env.VITE_OPENAI_API_KEY
const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true, // Note: In production, API calls should be made from a backend
})

// Convert file to base64 for OpenAI API
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

// Analyze a single photo with OpenAI Vision API
export const analyzePhotoContent = async (imageFile) => {
  try {
    // Convert file to base64
    const base64 = await fileToBase64(imageFile)
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this property damage photo. Identify the damage type (Water Damage, Fire Damage, Hail Damage, Wind Damage, or Structural), severity (minor, moderate, severe), and provide relevant tags. Return as JSON with damageType, severity, tags array, description, and confidence (0-1 scale)."
            },
            {
              type: "image_url",
              image_url: {
                url: base64
              }
            }
          ]
        }
      ],
      max_tokens: 300,
      response_format: { type: "json_object" }
    })
    
    // Parse the response
    const result = JSON.parse(response.choices[0].message.content)
    return result
  } catch (error) {
    console.error('AI analysis failed:', error)
    
    // Return fallback data in case of error
    return {
      damageType: 'Unknown',
      severity: 'unknown',
      tags: ['unprocessed'],
      description: 'Unable to analyze image',
      confidence: 0
    }
  }
}

// Check if an image is a duplicate of another
export const checkDuplicate = async (imageFile, existingImages) => {
  try {
    // Convert file to base64
    const base64 = await fileToBase64(imageFile)
    
    // Prepare existing images for comparison
    const existingImagesBase64 = await Promise.all(
      existingImages.slice(0, 5).map(async (img) => {
        if (img.file) {
          return await fileToBase64(img.file)
        }
        return img.processedUrl
      })
    )
    
    // If no existing images, it's not a duplicate
    if (existingImagesBase64.length === 0) {
      return { isDuplicate: false, confidence: 1, similarTo: null }
    }
    
    // Create a prompt with the new image and existing images
    const messages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "I'm going to show you a new property damage photo followed by existing photos. Tell me if the new photo is a duplicate or very similar to any of the existing photos. Return as JSON with isDuplicate (boolean), confidence (0-1), and similarTo (index of similar image or null)."
          },
          {
            type: "image_url",
            image_url: {
              url: base64
            }
          },
          {
            type: "text",
            text: "Now here are the existing photos to compare against:"
          }
        ]
      }
    ]
    
    // Add existing images to the prompt
    existingImagesBase64.forEach((img, index) => {
      messages[0].content.push({
        type: "image_url",
        image_url: {
          url: img
        }
      })
      messages[0].content.push({
        type: "text",
        text: `Existing photo #${index + 1}`
      })
    })
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages,
      max_tokens: 150,
      response_format: { type: "json_object" }
    })
    
    // Parse the response
    const result = JSON.parse(response.choices[0].message.content)
    return result
  } catch (error) {
    console.error('Duplicate check failed:', error)
    
    // Return fallback data in case of error
    return { isDuplicate: false, confidence: 0, similarTo: null }
  }
}

// Check image quality
export const checkImageQuality = async (imageFile) => {
  try {
    // Convert file to base64
    const base64 = await fileToBase64(imageFile)
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this property damage photo for quality issues. Check if it's blurry, poorly lit, obstructed, or otherwise unsuitable for insurance documentation. Return as JSON with isLowQuality (boolean), issues (array of strings describing problems), and qualityScore (0-1 scale where 1 is perfect quality)."
            },
            {
              type: "image_url",
              image_url: {
                url: base64
              }
            }
          ]
        }
      ],
      max_tokens: 150,
      response_format: { type: "json_object" }
    })
    
    // Parse the response
    const result = JSON.parse(response.choices[0].message.content)
    return result
  } catch (error) {
    console.error('Quality check failed:', error)
    
    // Return fallback data in case of error
    return { 
      isLowQuality: false, 
      issues: [], 
      qualityScore: 0.5 
    }
  }
}

// Process multiple photos with AI
export const processPhotosWithAI = async (photos) => {
  try {
    // Process each photo in parallel
    const processedPhotosPromises = photos.map(async (photo, index) => {
      try {
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, index * 100))
        
        // Analyze photo content
        const analysisResult = await analyzePhotoContent(photo.file)
        
        // Check for duplicates (only if we have more than one photo)
        let duplicateResult = { isDuplicate: false, confidence: 1, similarTo: null }
        if (photos.length > 1) {
          // Only check against photos that come before this one
          const previousPhotos = photos.slice(0, index)
          duplicateResult = await checkDuplicate(photo.file, previousPhotos)
        }
        
        // Check image quality
        const qualityResult = await checkImageQuality(photo.file)
        
        // Return processed photo with AI results
        return {
          ...photo,
          damageType: analysisResult.damageType,
          severity: analysisResult.severity,
          tags: analysisResult.tags,
          description: analysisResult.description,
          confidence: analysisResult.confidence,
          isDuplicate: duplicateResult.isDuplicate,
          duplicateConfidence: duplicateResult.confidence,
          duplicateSimilarTo: duplicateResult.similarTo,
          isLowQuality: qualityResult.isLowQuality,
          qualityIssues: qualityResult.issues,
          qualityScore: qualityResult.qualityScore,
          processedAt: new Date().toISOString()
        }
      } catch (error) {
        console.error(`Error processing photo ${index}:`, error)
        
        // Return original photo with error flag
        return {
          ...photo,
          processingError: true,
          errorMessage: error.message,
          processedAt: new Date().toISOString()
        }
      }
    })
    
    // Wait for all photos to be processed
    return await Promise.all(processedPhotosPromises)
  } catch (error) {
    console.error('Batch processing failed:', error)
    throw error
  }
}

// Fallback to mock processing if OpenAI API is not available
export const processPhotosWithMockAI = (photos) => {
  // Mock AI responses for demo
  const MOCK_AI_RESPONSES = [
    {
      damageType: 'Water Damage',
      severity: 'moderate',
      tags: ['ceiling', 'staining', 'interior'],
      description: 'Water damage on ceiling with visible staining',
      confidence: 0.89
    },
    {
      damageType: 'Fire Damage',
      severity: 'severe',
      tags: ['soot', 'charred', 'structural'],
      description: 'Severe fire damage with charred structural elements',
      confidence: 0.95
    },
    {
      damageType: 'Hail Damage',
      severity: 'minor',
      tags: ['roof', 'exterior', 'dents'],
      description: 'Minor hail damage on roof with small dents',
      confidence: 0.82
    },
    {
      damageType: 'Wind Damage',
      severity: 'moderate',
      tags: ['shingles', 'roof', 'debris'],
      description: 'Moderate wind damage with displaced shingles',
      confidence: 0.87
    },
    {
      damageType: 'Structural',
      severity: 'severe',
      tags: ['cracks', 'foundation', 'load-bearing'],
      description: 'Severe structural damage with foundation cracks',
      confidence: 0.91
    }
  ]

  // Process each photo with mock data
  return photos.map((photo, index) => {
    // Get mock response
    const mockResponse = MOCK_AI_RESPONSES[index % MOCK_AI_RESPONSES.length]
    
    // Simulate duplicate detection (mark every 7th photo as duplicate)
    const isDuplicate = index % 7 === 0 && index > 0
    
    // Simulate quality detection (mark every 11th photo as low quality)
    const isLowQuality = index % 11 === 0 && index > 0
    
    // Return processed photo with mock AI results
    return {
      ...photo,
      damageType: mockResponse.damageType,
      severity: mockResponse.severity,
      tags: mockResponse.tags,
      description: mockResponse.description,
      confidence: mockResponse.confidence,
      isDuplicate,
      duplicateConfidence: isDuplicate ? 0.95 : 0.1,
      duplicateSimilarTo: isDuplicate ? Math.max(0, index - 3) : null,
      isLowQuality,
      qualityIssues: isLowQuality ? ['blurry', 'poor lighting'] : [],
      qualityScore: isLowQuality ? 0.3 : 0.9,
      processedAt: new Date().toISOString()
    }
  })
}

// Determine whether to use real AI or mock AI based on API key availability
export const processPhotos = async (photos) => {
  // If OpenAI API key is available, use real AI
  if (apiKey) {
    return processPhotosWithAI(photos)
  }
  
  // Otherwise use mock AI
  return processPhotosWithMockAI(photos)
}

export default {
  analyzePhotoContent,
  checkDuplicate,
  checkImageQuality,
  processPhotos
}

