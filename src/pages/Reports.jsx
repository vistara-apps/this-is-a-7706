import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  Filter,
  Plus
} from 'lucide-react'
import { usePhotos } from '../contexts/PhotoContext'

const Reports = () => {
  const { reports, claims } = usePhotos()
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock reports data
  const mockReports = [
    {
      reportId: 'report_1',
      claimId: 'claim_1',
      generatedAt: '2024-01-15T10:30:00Z',
      reportType: 'PDF',
      status: 'completed',
      photoCount: 24
    }
  ]

  const allReports = [...reports, ...mockReports]

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Reports</h1>
            <p className="text-text-secondary mt-1">
              View and manage generated claim reports
            </p>
          </div>
          <Link
            to="/claims"
            className="mt-4 sm:mt-0 btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Report</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex items-center space-x-4">
            <Filter className="w-4 h-4 text-text-secondary" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Reports</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Reports List */}
        {allReports.length > 0 ? (
          <div className="space-y-4">
            {allReports.map((report) => {
              const claim = claims.find(c => c.claimId === report.claimId)
              
              return (
                <div key={report.reportId} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary rounded-lg">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-text-primary">
                          {claim?.claimNumber || 'Unknown Claim'}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-text-secondary">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(report.generatedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <span>{report.reportType}</span>
                          <span>{report.photoCount} photos</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${report.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : report.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                        }
                      `}>
                        {report.status}
                      </span>
                      
                      <Link
                        to={`/claims/${report.claimId}`}
                        className="btn-secondary inline-flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Link>
                      
                      <button className="btn-primary inline-flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="card text-center py-12">
            <FileText className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No reports generated yet
            </h3>
            <p className="text-text-secondary mb-6">
              Upload and process photos to generate your first report
            </p>
            <Link to="/claims" className="btn-primary">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports