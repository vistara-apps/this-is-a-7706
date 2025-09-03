import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Upload, 
  FolderOpen, 
  FileText, 
  TrendingUp,
  Camera,
  Clock,
  CheckCircle
} from 'lucide-react'
import { usePhotos } from '../contexts/PhotoContext'

const Dashboard = () => {
  const { photos, claims, reports } = usePhotos()

  const stats = [
    {
      title: 'Total Photos',
      value: photos.length,
      icon: Camera,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Claims',
      value: claims.filter(c => c.status === 'processing').length,
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Completed Reports',
      value: reports.length,
      icon: CheckCircle,
      color: 'text-accent',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Processing Time Saved',
      value: '47%',
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ]

  const recentPhotos = photos.slice(-6)

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
            <p className="text-text-secondary mt-1">
              Welcome back! Here's an overview of your claim processing.
            </p>
          </div>
          <Link
            to="/claims"
            className="mt-4 sm:mt-0 btn-primary inline-flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photos</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-text-secondary">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-text-primary">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/claims"
            className="card hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary rounded-lg">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                  Upload New Photos
                </h3>
                <p className="text-sm text-text-secondary">
                  Start processing property damage photos
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/claims"
            className="card hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-accent rounded-lg">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                  Manage Claims
                </h3>
                <p className="text-sm text-text-secondary">
                  View and organize your claims
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/reports"
            className="card hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary group-hover:text-purple-500 transition-colors">
                  Generate Reports
                </h3>
                <p className="text-sm text-text-secondary">
                  Create standardized photo reports
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Photos */}
        {recentPhotos.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-primary">
                Recent Photos
              </h2>
              <Link
                to="/claims"
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                View all →
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {recentPhotos.map((photo) => (
                <div key={photo.photoId} className="aspect-square">
                  <img
                    src={photo.processedUrl}
                    alt={photo.originalFilename}
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Getting Started */}
        {photos.length === 0 && (
          <div className="card text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Get Started with ClaimSnap
              </h3>
              <p className="text-text-secondary mb-6">
                Upload your first batch of property damage photos to experience 
                AI-powered organization and tagging.
              </p>
              <Link to="/claims" className="btn-primary">
                Upload Your First Photos
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard