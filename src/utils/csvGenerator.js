// CSV generation utilities

// Convert array of objects to CSV string
export const objectsToCSV = (data) => {
  if (!data || !data.length) {
    return ''
  }
  
  // Get headers from first object
  const headers = Object.keys(data[0])
  
  // Create CSV header row
  const headerRow = headers.join(',')
  
  // Create data rows
  const rows = data.map(obj => {
    return headers.map(header => {
      const value = obj[header]
      
      // Handle different value types
      if (value === null || value === undefined) {
        return ''
      } else if (typeof value === 'object') {
        // Convert objects/arrays to JSON strings
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`
      } else if (typeof value === 'string') {
        // Escape quotes and wrap in quotes
        return `"${value.replace(/"/g, '""')}"`
      } else {
        // Numbers, booleans, etc.
        return value
      }
    }).join(',')
  })
  
  // Combine header and rows
  return [headerRow, ...rows].join('\n')
}

// Generate a CSV from report data
export const generateCsv = (reportData) => {
  try {
    // Prepare photo data for CSV
    const photoData = reportData.photos.map(photo => ({
      PhotoID: photo.photoId,
      Filename: photo.originalFilename,
      DamageType: photo.damageType,
      Severity: photo.severity,
      Tags: photo.tags.join('; '),
      Description: photo.description,
      Confidence: photo.confidence,
      IsDuplicate: photo.isDuplicate ? 'Yes' : 'No',
      IsLowQuality: photo.isLowQuality ? 'Yes' : 'No',
      URL: photo.processedUrl
    }))
    
    // Generate CSV string
    const csvString = objectsToCSV(photoData)
    
    // Create a blob
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    
    return {
      blob,
      filename: `${reportData.reportId}.csv`,
      contentType: 'text/csv'
    }
  } catch (error) {
    console.error('CSV generation failed:', error)
    throw error
  }
}

// Generate a summary CSV from report data
export const generateSummaryCsv = (reportData) => {
  try {
    // Prepare damage type summary data
    const summaryData = reportData.damageTypeStats.map(stat => ({
      DamageType: stat.type,
      Count: stat.count,
      Percentage: `${stat.percentage}%`,
      MinorCount: stat.severityCounts.minor || 0,
      ModerateCount: stat.severityCounts.moderate || 0,
      SevereCount: stat.severityCounts.severe || 0,
      AvgConfidence: stat.avgConfidence.toFixed(2)
    }))
    
    // Generate CSV string
    const csvString = objectsToCSV(summaryData)
    
    // Create a blob
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    
    return {
      blob,
      filename: `${reportData.reportId}_summary.csv`,
      contentType: 'text/csv'
    }
  } catch (error) {
    console.error('Summary CSV generation failed:', error)
    throw error
  }
}

// Download a CSV file
export const downloadCsv = (csvData) => {
  try {
    // Create a download link
    const url = URL.createObjectURL(csvData.blob)
    const link = document.createElement('a')
    link.href = url
    link.download = csvData.filename
    
    // Trigger download
    document.body.appendChild(link)
    link.click()
    
    // Clean up
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    return true
  } catch (error) {
    console.error('CSV download failed:', error)
    throw error
  }
}

export default {
  objectsToCSV,
  generateCsv,
  generateSummaryCsv,
  downloadCsv
}

