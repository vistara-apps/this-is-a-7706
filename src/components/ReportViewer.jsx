import React, { useState } from 'react'
import { Download, FileText, Printer, Share } from 'lucide-react'

const ReportViewer = ({ claim, photos }) => {
  const [reportFormat, setReportFormat] = useState('pdf')

  const generateReportContent = () => {
    const processedPhotos = photos.filter(p => p.damageType !== 'pending')
    const damageTypes = [...new Set(processedPhotos.map(p => p.damageType))]
    
    return {
      summary: {
        totalPhotos: photos.length,
        processedPhotos: processedPhotos.length,
        uniqueDamageTypes: damageTypes.length,
        duplicatesRemoved: photos.filter(p => p.isDuplicate).length,
        lowQualityFlagged: photos.filter(p => p.isLowQuality).length
      },
      damageBreakdown: damageTypes.map(type => ({
        type,
        count: processedPhotos.filter(p => p.damageType === type).length,
        severity: processedPhotos
          .filter(p => p.damageType === type)
          .map(p => p.severity)
          .reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1
            return acc
          }, {})
      })),
      recommendations: [
        'Immediate attention required for severe structural damage',
        'Water damage areas should be dried within 24-48 hours',
        'Consider professional assessment for fire damage restoration'
      ]
    }
  }

  const reportData = generateReportContent()

  const handleExport = (format) => {
    // In a real implementation, this would generate and download the report
    alert(`Exporting report as ${format.toUpperCase()}`)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Report Header */}
      <div className="border-b border-gray-200 bg-surface px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              Claim Report - {claim.claimNumber}
            </h2>
            <p className="text-text-secondary">
              Generated on {new Date().toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={reportFormat}
              onChange={(e) => setReportFormat(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="pdf">PDF Format</option>
              <option value="csv">CSV Format</option>
              <option value="json">JSON Format</option>
            </select>
            
            <button
              onClick={() => handleExport(reportFormat)}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Executive Summary */}
          <div className="card">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Executive Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-text-secondary">Total Photos</p>
                <p className="text-2xl font-bold text-text-primary">
                  {reportData.summary.totalPhotos}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-text-secondary">Processed Photos</p>
                <p className="text-2xl font-bold text-accent">
                  {reportData.summary.processedPhotos}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-text-secondary">Damage Types</p>
                <p className="text-2xl font-bold text-primary">
                  {reportData.summary.uniqueDamageTypes}
                </p>
              </div>
            </div>
          </div>

          {/* Damage Analysis */}
          <div className="card">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Damage Type Analysis
            </h3>
            <div className="space-y-4">
              {reportData.damageBreakdown.map((damage, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-text-primary">{damage.type}</h4>
                    <span className="bg-primary text-white px-2 py-1 rounded text-sm">
                      {damage.count} photos
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-text-secondary">Minor</p>
                      <p className="font-medium">{damage.severity.minor || 0}</p>
                    </div>
                    <div>
                      <p className="text-text-secondary">Moderate</p>
                      <p className="font-medium">{damage.severity.moderate || 0}</p>
                    </div>
                    <div>
                      <p className="text-text-secondary">Severe</p>
                      <p className="font-medium">{damage.severity.severe || 0}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="card">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Representative Photos
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.slice(0, 8).map((photo) => (
                <div key={photo.photoId} className="space-y-2">
                  <img
                    src={photo.processedUrl}
                    alt={photo.originalFilename}
                    className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                  />
                  <div className="text-xs">
                    <p className="font-medium text-text-primary truncate">
                      {photo.originalFilename}
                    </p>
                    {photo.damageType !== 'pending' && (
                      <p className="text-text-secondary">
                        {photo.damageType} - {photo.severity}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="card">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Recommendations
            </h3>
            <ul className="space-y-2">
              {reportData.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-text-primary">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 text-center text-sm text-text-secondary">
            <p>
              This report was generated automatically by ClaimSnap AI on{' '}
              {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
            <p className="mt-1">
              For questions about this report, contact your insurance adjuster.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportViewer