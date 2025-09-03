import React, { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
    
    // You could also log to an error reporting service here
    // logErrorToService(error, errorInfo)
  }
  
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Something went wrong
              </h2>
              
              <p className="text-gray-600 mb-6">
                {this.props.fallbackMessage || 
                  "We're sorry, but an error occurred while rendering this component."}
              </p>
              
              {this.state.error && (
                <div className="w-full bg-gray-100 rounded p-4 mb-4 overflow-auto text-left">
                  <p className="text-red-600 font-mono text-sm">
                    {this.state.error.toString()}
                  </p>
                  {this.props.showStack && this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="text-sm text-gray-700 cursor-pointer">
                        Stack trace
                      </summary>
                      <pre className="mt-2 text-xs text-gray-600 overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
              
              <div className="flex space-x-4">
                <button
                  onClick={this.handleReset}
                  className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
                
                {this.props.resetAction && (
                  <button
                    onClick={this.props.resetAction}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    {this.props.resetActionText || 'Go Back'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }

    // If no error, render children normally
    return this.props.children
  }
}

export default ErrorBoundary

