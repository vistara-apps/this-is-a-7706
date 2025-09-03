import OpenAI from 'openai'

// Mock OpenAI service for demo
const MOCK_AI_RESPONSES = [
  {
    damageType: 'Water Damage',
    severity: 'moderate',
    tags: ['ceiling', 'staining', 'interior'],
    confidence: 0.89
  },
  {
    damageType: 'Fire Damage',
    severity: 'severe',
    tags: ['soot', 'charred', 'structural'],
    confidence: 0.95
  },
  {
    damageType: 'Hail Damage',
    severity: 'minor',
    tags: ['roof', 'exterior', 'dents'],
    confidence: 0.82
  },
  {
    damageType: 'Wind Damage',
    severity: 'moderate',
    tags: ['shingles', 'roof', 'debris'],
    confidence: 0.87
  },
  {
    damageType: 'Structural',
    severity: 'severe',
    tags: ['cracks', 'foundation', 'load-bearing'],
    confidence: 0.91
  }
]

// Simulate AI processing delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const processPhotosWithAI = async (photos) => {
  // Simulate processing time
  await delay(2000)

  return photos.map((photo, index) => {
    // Simulate random AI analysis
    const mockResponse = MOCK_AI_RESPONSES[index % MOCK_AI_RESPONSES.length]
    
    // Simulate duplicate detection (mark every 7th photo as duplicate)
    const isDuplicate = index % 7 === 0 && index > 0
    
    // Simulate quality detection (mark every 11th photo as low quality)
    const isLowQuality = index % 11 === 0 && index > 0

    return {
      ...photo,
      damageType: mockResponse.damageType,
      severity: mockResponse.severity,
      tags: mockResponse.tags,
      isDuplicate,
      isLowQuality,
      confidence: mockResponse.confidence,
      processedAt: new Date().toISOString()
    }
  })
}

export const analyzePhotoContent = async (imageFile) => {
  // In a real implementation, this would call OpenAI Vision API
  // For demo purposes, we'll return mock data
  
  await delay(1000)
  
  const mockResponse = MOCK_AI_RESPONSES[Math.floor(Math.random() * MOCK_AI_RESPONSES.length)]
  
  return {
    damageType: mockResponse.damageType,
    severity: mockResponse.severity,
    description: `AI detected ${mockResponse.damageType.toLowerCase()} with ${mockResponse.severity} severity. Confidence: ${(mockResponse.confidence * 100).toFixed(1)}%`,
    tags: mockResponse.tags,
    confidence: mockResponse.confidence
  }
}

// Real OpenAI implementation (commented out for demo)
/*
const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
})

export const analyzePhotoContent = async (imageFile) => {
  try {
    // Convert file to base64
    const base64 = await fileToBase64(imageFile)
    
    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this property damage photo. Identify the damage type (Water Damage, Fire Damage, Hail Damage, Wind Damage, or Structural), severity (minor, moderate, severe), and provide relevant tags. Return as JSON with damageType, severity, tags array, and description."
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
      max_tokens: 300
    })
    
    const result = JSON.parse(response.choices[0].message.content)
    return result
  } catch (error) {
    console.error('AI analysis failed:', error)
    throw error
  }
}

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
*/