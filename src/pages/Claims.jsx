import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  FileText,
  Camera,
  MoreVertical
} from 'lucide-react'
import { usePhotos } from '../contexts/PhotoContext'
import UploadDropzone from '../components/UploadDropzone'
import ImageCard from '../components/ImageCard'

const Claims = () => {
  const { claims, photos, isProcessing } = usePhotos()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClaim, setSelectedClaim] = useState('claim_1')
  const [showUpload, setShowUpload] = useState(photos.length === 0)

  const filteredPhotos = photos.filter(photo => 
    photo.claimId === selectedClaim &&
    (photo.originalFilename.toLowerCase().includes(searchTerm.toLowerCase()) ||
     photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  )

  const claimPhotos = photos.filter(photo => photo.claimId === selectedClaim)
  const processedPhotos = claimPhotos.filter(photo => photo.damageType !== 'pending')

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-surface px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Claims</h1>
            <p className="text-text-secondary mt-1">
              Manage and organize property damage photos by claim
            </p>
          </div>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="mt-4 sm:mt-0 btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Photos</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 bg-surface p-4 overflow-y-auto">
          <div className="space-y-4">
            <h3 className="font-semibold text-text-primary">Active Claims</h3>
            
            {claims.map((claim) => {
              const claimPhotoCount = photos.filter(p => p.claimId === claim.claimId).length
              const processedCount = photos.filter(p => 
                p.claimId === claim.claimId && p.damageType !== 'pending'
              ).length
              
              return (
                <div
                  key={claim.claimId}
                  onClick={() => setSelectedClaim(claim.claimId)}
                  className={`
                    p-4 rounded-lg border cursor-pointer transition-all
                    ${selectedClaim === claim.claimId
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-text-primary">
                      {claim.claimNumber}
                    </h4>
                    <button className="text-text-secondary hover:text-text-primary">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-text-secondary">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(claim.dateFiled).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-text-secondary">
                      <Camera className="w-4 h-4" />
                      <span>{claimPhotoCount} photos</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`
                        px-2 py-1 rounded text-xs font-medium
                        ${claim.status === 'processing' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                        }
                      `}>
                        {claim.status}
                      </span>
                      
                      {claimPhotoCount > 0 && (
                        <span className="text-xs text-text-secondary">
                          {processedCount}/{claimPhotoCount} processed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {showUpload && (
            <div className="p-6 border-b border-gray-200 bg-surface">
              <UploadDropzone onUpload={() => setShowUpload(false)} />
            </div>
          )}

          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-200 bg-surface">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search photos by filename or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <button className="btn-secondary inline-flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              
              <Link
                to={`/claims/${selectedClaim}`}
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Report</span>
              </Link>
            </div>
          </div>

          {/* Photo Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {isProcessing && (
              <div className="mb-6 card">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="text-text-secondary">Processing photos with AI...</span>
                </div>
              </div>
            )}

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
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  No photos found
                </h3>
                <p className="text-text-secondary mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Upload photos to get started with AI analysis'
                  }
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowUpload(true)}
                    className="btn-primary"
                  >
                    Upload Photos
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Claims