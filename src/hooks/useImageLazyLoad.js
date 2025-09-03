import { useState, useEffect, useRef, useCallback } from 'react'

// Hook for lazy loading images
const useImageLazyLoad = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    root = null,
    placeholderSrc = null
  } = options
  
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [error, setError] = useState(null)
  const imgRef = useRef(null)
  const observerRef = useRef(null)
  
  // Callback for when the image is loaded
  const onLoad = useCallback(() => {
    setIsLoaded(true)
  }, [])
  
  // Callback for when there's an error loading the image
  const onError = useCallback((error) => {
    setError(error)
    setIsLoaded(true) // Mark as loaded even on error to stop loading state
  }, [])
  
  // Setup intersection observer
  useEffect(() => {
    // Disconnect previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect()
    }
    
    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        setIsVisible(entry.isIntersecting)
      },
      { threshold, rootMargin, root }
    )
    
    // Observe the image element
    const currentImgRef = imgRef.current
    if (currentImgRef) {
      observerRef.current.observe(currentImgRef)
    }
    
    // Cleanup
    return () => {
      if (observerRef.current && currentImgRef) {
        observerRef.current.unobserve(currentImgRef)
        observerRef.current.disconnect()
      }
    }
  }, [threshold, rootMargin, root])
  
  // Reset state when ref changes
  useEffect(() => {
    setIsLoaded(false)
    setError(null)
  }, [imgRef.current])
  
  return {
    imgRef,
    isVisible,
    isLoaded,
    error,
    onLoad,
    onError,
    placeholderSrc
  }
}

// Component for lazy loading images
export const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholderSrc = null,
  placeholderClassName = '',
  errorClassName = '',
  threshold = 0.1,
  rootMargin = '0px',
  root = null,
  ...props 
}) => {
  const {
    imgRef,
    isVisible,
    isLoaded,
    error,
    onLoad,
    onError
  } = useImageLazyLoad({
    threshold,
    rootMargin,
    root,
    placeholderSrc
  })
  
  return (
    <div className="relative">
      {/* Placeholder or loading state */}
      {(!isVisible || !isLoaded) && (
        <div 
          className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${placeholderClassName}`}
        >
          {placeholderSrc ? (
            <img 
              src={placeholderSrc} 
              alt={`${alt} placeholder`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 border-2 rounded-full border-b-transparent border-primary animate-spin" />
          )}
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div 
          className={`absolute inset-0 flex items-center justify-center bg-red-50 ${errorClassName}`}
        >
          <div className="text-center p-4">
            <svg 
              className="w-8 h-8 text-red-500 mx-auto mb-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <p className="text-sm text-red-600">Failed to load image</p>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      <img
        ref={imgRef}
        src={isVisible ? src : ''}
        alt={alt}
        className={`${className} ${!isLoaded ? 'invisible' : ''}`}
        onLoad={onLoad}
        onError={onError}
        {...props}
      />
    </div>
  )
}

export default useImageLazyLoad

