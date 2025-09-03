import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Calendar,
  Camera,
  BarChart3,
  Filter
} from 'lucide-react'
import { usePhotos } from '../contexts/PhotoContext'
import ImageCard from '../components/ImageCard'
import ReportViewer from '../components/ReportViewer'

const ClaimDetail = () => {
  const { claimId } = useParams()
  const { claims, photos } = usePhotos()
  const [activeTab, setActiveTab] = useState('photos')
  const [filterBy, setFilterBy] = useState('all')

  const claim = claims.find(c => c.claimId === claimId)
  const claimPhotos = photos.filter(p => p.claimId === claimId)

  const filteredPhotos = claimPhotos.filter(photo => {
    if (filterBy === 'all') return true
    if (filterBy === 'processed') return photo.damageType !== 'pending'
    if (filterBy === 'duplicates') return photo.isDuplicate
    if (filterBy === 'low-quality') return photo.isLowQuality
    return photo.damageType === filterBy
  })

  const damageTypes = [...new Set(claimPhotos.map(p => p.damageType).filter(d => d !== 'pending'))]
  const stats = {
    total: claimPhotos.length,
    processed: claimPhotos.filter(p => p.damageType !== 'pending').length,
    duplicates: claimPhotos.filter(p => p.isDuplicate).length,
    lowQuality: claimPhotos.filter(p => p.isLowQuality).length
  }

  if (!claim) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-text-primary">Claim not found</h2>
          <Link to="/claims" className="text-primary hover:underline mt-2 inline-block">
            ← Back to claims
          </Link>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'photos', label: 'Photos', icon: Camera },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'report', label: 'Report', icon: FileText }
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-surface px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/claims"
              className="text-text-secondary hover:text-text-primary"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                {claim.claimNumber}
              </h1>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center space-x-1 text-sm text-text-secondary">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(claim.dateFiled).toLocaleDateString()}</span>
                </div>
                <span className={`
                  px-2 py-1 rounded text-xs font-medium
                  ${claim.status === 'processing' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                  }
                `}>
                  {claim.status}
                </span>
              </div>
            </div>
          </div>
          
          <button className="btn-primary inline-flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 mt-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 pb-2 border-b-2 transition-colors
                ${activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'photos' && (
          <div className="h-full flex flex-col">
            {/* Filters */}
            <div className="border-b border-gray-200 bg-surface px-6 py-4">
              <div className="flex items-center space-x-4">
                <Filter className="w-4 h-4 text-text-secondary" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  <option value="all">All Photos ({stats.total})</option>
                  <option value="processed">Processed ({stats.processed})</option>
                  <option value="duplicates">Duplicates ({stats.duplicates})</option>
                  <option value="low-quality">Low Quality ({stats.lowQuality})</option>
                  {damageTypes.map(type => (
                    <option key={type} value={type}>
                      {type} ({claimPhotos.filter(p => p.damageType === type).length})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Photo Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredPhotos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredPhotos.map((photo) => (
                    <ImageCard
                      key={photo.photoId}
                      photo={photo}
                      variant={
                        photo.damageType === 'pending' ? 'processing' :
                        photo.isLowQuality || photo.isDuplicate ? 'error' : 'success'
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Camera className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary">
                    No photos match the current filter
                  </h3>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="p-6 overflow-y-auto">
            <div className="max-w-4xl space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card">
                  <h3 className="text-sm font-medium text-text-secondary">Total Photos</h3>
                  <p className="text-2xl font-bold text-text-primary mt-1">{stats.total}</p>
                </div>
                <div className="card">
                  <h3 className="text-sm font-medium text-text-secondary">Processed</h3>
                  <p className="text-2xl font-bold text-accent mt-1">{stats.processed}</p>
                </div>
                <div className="card">
                  <h3 className="text-sm font-medium text-text-secondary">Duplicates</h3>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.duplicates}</p>
                </div>
                <div className="card">
                  <h3 className="text-sm font-medium text-text-secondary">Low Quality</h3>
                  <p className="text-2xl font-bold text-red-600 mt-1">{stats.lowQuality}</p>
                </div>
              </div>

              {/* Damage Type Breakdown */}
              <div className="card">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Damage Type Distribution
                </h3>
                <div className="space-y-3">
                  {damageTypes.map(type => {
                    const count = claimPhotos.filter(p => p.damageType === type).length
                    const percentage = Math.round((count / stats.total) * 100)
                    
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-text-primary">{type}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-text-secondary w-12 text-right">
                            {count} ({percentage}%)
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="h-full">
            <ReportViewer claim={claim} photos={claimPhotos} />
          </div>
        )}
      </div>
    </div>
  )
}

export default ClaimDetail