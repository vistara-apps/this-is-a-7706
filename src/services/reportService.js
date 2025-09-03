import { v4 as uuidv4 } from 'uuid'
import { createReport, updateReport } from './supabaseService'
import { uploadJsonToStorage } from './storageService'

// Generate a report for a claim
export const generateReport = async (claimId, userId, photos, options = {}) => {
  try {
    // Validate inputs
    if (!claimId) {
      throw new Error('Claim ID is required')
    }
    
    if (!userId) {
      throw new Error('User ID is required')
    }
    
    if (!photos || photos.length === 0) {
      throw new Error('No photos provided')
    }
    
    // Generate unique ID
    const reportId = `report_${uuidv4()}`
    
    // Default options
    const defaultOptions = {
      format: 'pdf',
      includeDuplicates: false,
      includeLowQuality: false,
      includeAllPhotos: false,
      maxPhotos: 20,
      title: 'Property Damage Report',
      subtitle: `Claim ${claimId}`,
      logo: null,
      branding: {
        primaryColor: '#3B82F6',
        accentColor: '#10B981',
        fontFamily: 'Arial, sans-serif'
      }
    }
    
    // Merge options
    const reportOptions = { ...defaultOptions, ...options }
    
    // Filter photos based on options
    let filteredPhotos = [...photos]
    
    if (!reportOptions.includeDuplicates) {
      filteredPhotos = filteredPhotos.filter(photo => !photo.isDuplicate)
    }
    
    if (!reportOptions.includeLowQuality) {
      filteredPhotos = filteredPhotos.filter(photo => !photo.isLowQuality)
    }
    
    // Limit number of photos if not including all
    if (!reportOptions.includeAllPhotos && filteredPhotos.length > reportOptions.maxPhotos) {
      filteredPhotos = filteredPhotos.slice(0, reportOptions.maxPhotos)
    }
    
    // Group photos by damage type
    const photosByDamageType = filteredPhotos.reduce((acc, photo) => {
      const damageType = photo.damageType || 'Unknown'
      if (!acc[damageType]) {
        acc[damageType] = []
      }
      acc[damageType].push(photo)
      return acc
    }, {})
    
    // Calculate damage type statistics
    const damageTypeStats = Object.entries(photosByDamageType).map(([type, photos]) => {
      // Count severity levels
      const severityCounts = photos.reduce((acc, photo) => {
        const severity = photo.severity || 'unknown'
        acc[severity] = (acc[severity] || 0) + 1
        return acc
      }, {})
      
      // Calculate average confidence
      const totalConfidence = photos.reduce((sum, photo) => sum + (photo.confidence || 0), 0)
      const avgConfidence = photos.length > 0 ? totalConfidence / photos.length : 0
      
      return {
        type,
        count: photos.length,
        percentage: Math.round((photos.length / filteredPhotos.length) * 100),
        severityCounts,
        avgConfidence
      }
    })
    
    // Sort damage types by count (descending)
    damageTypeStats.sort((a, b) => b.count - a.count)
    
    // Generate recommendations based on damage types
    const recommendations = generateRecommendations(damageTypeStats)
    
    // Create report data
    const reportData = {
      reportId,
      claimId,
      userId,
      title: reportOptions.title,
      subtitle: reportOptions.subtitle,
      generatedAt: new Date().toISOString(),
      format: reportOptions.format,
      totalPhotos: photos.length,
      includedPhotos: filteredPhotos.length,
      excludedDuplicates: photos.filter(p => p.isDuplicate).length,
      excludedLowQuality: photos.filter(p => p.isLowQuality).length,
      damageTypeStats,
      recommendations,
      photos: filteredPhotos.map(photo => ({
        photoId: photo.photoId,
        originalFilename: photo.originalFilename,
        processedUrl: photo.processedUrl,
        thumbnailUrl: photo.thumbnailUrl,
        damageType: photo.damageType,
        severity: photo.severity,
        tags: photo.tags,
        description: photo.description,
        confidence: photo.confidence,
        isDuplicate: photo.isDuplicate,
        isLowQuality: photo.isLowQuality
      })),
      options: reportOptions
    }
    
    // Upload report data to storage
    const storageResult = await uploadJsonToStorage(
      reportData,
      'reports',
      `reports/${reportId}.json`,
      `${reportId}.json`,
      true // Use IPFS if available
    )
    
    // Create database record
    const reportRecord = {
      reportId,
      claimId,
      userId,
      title: reportOptions.title,
      format: reportOptions.format,
      photoCount: filteredPhotos.length,
      reportUrl: storageResult.url,
      ipfsHash: storageResult.ipfsHash,
      ipfsUrl: storageResult.ipfsUrl,
      generatedAt: reportData.generatedAt,
      status: 'completed'
    }
    
    // Save to database
    const savedReport = await createReport(reportRecord)
    
    return {
      ...savedReport,
      data: reportData
    }
  } catch (error) {
    console.error('Report generation failed:', error)
    throw error
  }
}

// Generate recommendations based on damage types
const generateRecommendations = (damageTypeStats) => {
  const recommendations = []
  
  // Add general recommendation
  recommendations.push({
    title: 'General Recommendation',
    description: 'Document all damage thoroughly with additional photos if needed before repairs begin.'
  })
  
  // Add recommendations based on damage types
  damageTypeStats.forEach(stat => {
    const type = stat.type
    const hasSevere = stat.severityCounts.severe > 0
    
    switch (type) {
      case 'Water Damage':
        recommendations.push({
          title: 'Water Damage Mitigation',
          description: hasSevere 
            ? 'Immediate professional water extraction and drying is required to prevent mold growth and structural damage.'
            : 'Ensure affected areas are properly dried within 24-48 hours to prevent mold growth.'
        })
        break
        
      case 'Fire Damage':
        recommendations.push({
          title: 'Fire Damage Restoration',
          description: hasSevere
            ? 'Professional restoration required for structural integrity assessment and smoke/soot removal.'
            : 'Clean soot and smoke residue promptly to prevent further damage to surfaces.'
        })
        break
        
      case 'Hail Damage':
        recommendations.push({
          title: 'Hail Damage Repair',
          description: hasSevere
            ? 'Roof inspection recommended to assess structural integrity and prevent water infiltration.'
            : 'Repair damaged shingles or siding to prevent water infiltration.'
        })
        break
        
      case 'Wind Damage':
        recommendations.push({
          title: 'Wind Damage Repair',
          description: hasSevere
            ? 'Secure any loose structural elements immediately and assess roof integrity.'
            : 'Replace damaged shingles or siding to prevent water infiltration.'
        })
        break
        
      case 'Structural':
        recommendations.push({
          title: 'Structural Assessment',
          description: hasSevere
            ? 'Professional structural engineer assessment required before occupancy.'
            : 'Monitor cracks or structural issues for any changes or expansion.'
        })
        break
        
      default:
        // No specific recommendation for unknown damage types
        break
    }
  })
  
  return recommendations
}

// Generate PDF report
export const generatePdfReport = async (reportData) => {
  try {
    // In a real implementation, this would generate a PDF file
    // For demo purposes, we'll just return a success message
    
    console.log('Generating PDF report:', reportData.reportId)
    
    // Simulate PDF generation delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update report status
    await updateReport(reportData.reportId, {
      status: 'completed',
      pdfUrl: `${reportData.reportUrl.replace('.json', '.pdf')}`
    })
    
    return {
      success: true,
      message: 'PDF report generated successfully',
      reportId: reportData.reportId
    }
  } catch (error) {
    console.error('PDF generation failed:', error)
    
    // Update report status
    await updateReport(reportData.reportId, {
      status: 'failed',
      error: error.message
    })
    
    throw error
  }
}

// Generate CSV report
export const generateCsvReport = async (reportData) => {
  try {
    // In a real implementation, this would generate a CSV file
    // For demo purposes, we'll just return a success message
    
    console.log('Generating CSV report:', reportData.reportId)
    
    // Simulate CSV generation delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Update report status
    await updateReport(reportData.reportId, {
      status: 'completed',
      csvUrl: `${reportData.reportUrl.replace('.json', '.csv')}`
    })
    
    return {
      success: true,
      message: 'CSV report generated successfully',
      reportId: reportData.reportId
    }
  } catch (error) {
    console.error('CSV generation failed:', error)
    
    // Update report status
    await updateReport(reportData.reportId, {
      status: 'failed',
      error: error.message
    })
    
    throw error
  }
}

export default {
  generateReport,
  generatePdfReport,
  generateCsvReport
}

