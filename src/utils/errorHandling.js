// Error handling utilities

// Format error message for display
export const formatErrorMessage = (error) => {
  if (!error) {
    return 'An unknown error occurred'
  }
  
  // Handle different error types
  if (typeof error === 'string') {
    return error
  }
  
  if (error.message) {
    return error.message
  }
  
  if (error.error && error.error.message) {
    return error.error.message
  }
  
  return 'An unexpected error occurred'
}

// Format API error response
export const formatApiError = (error) => {
  if (!error) {
    return {
      message: 'An unknown error occurred',
      code: 'unknown_error',
      status: 500
    }
  }
  
  // Handle Supabase errors
  if (error.code && error.message) {
    return {
      message: error.message,
      code: error.code,
      status: error.status || 400
    }
  }
  
  // Handle Axios errors
  if (error.response) {
    const { data, status } = error.response
    
    return {
      message: data.message || data.error || 'API request failed',
      code: data.code || `error_${status}`,
      status,
      data: data
    }
  }
  
  // Handle network errors
  if (error.request) {
    return {
      message: 'Network error. Please check your connection.',
      code: 'network_error',
      status: 0
    }
  }
  
  // Handle other errors
  return {
    message: error.message || 'An unexpected error occurred',
    code: error.code || 'unknown_error',
    status: error.status || 500
  }
}

// Check if error is a network error
export const isNetworkError = (error) => {
  if (!error) return false
  
  // Check for common network error patterns
  if (error.message && (
    error.message.includes('Network Error') ||
    error.message.includes('Failed to fetch') ||
    error.message.includes('Network request failed')
  )) {
    return true
  }
  
  // Check for Axios network errors
  if (error.isAxiosError && error.code === 'ECONNABORTED') {
    return true
  }
  
  // Check for fetch API network errors
  if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
    return true
  }
  
  return false
}

// Check if error is an authentication error
export const isAuthError = (error) => {
  if (!error) return false
  
  // Check for common auth error patterns
  if (error.status === 401 || error.status === 403) {
    return true
  }
  
  // Check for Supabase auth errors
  if (error.code && (
    error.code.includes('auth') ||
    error.code === 'invalid_credentials' ||
    error.code === 'invalid_token'
  )) {
    return true
  }
  
  return false
}

// Check if error is a validation error
export const isValidationError = (error) => {
  if (!error) return false
  
  // Check for common validation error patterns
  if (error.status === 422 || error.status === 400) {
    return true
  }
  
  // Check for specific validation error codes
  if (error.code && (
    error.code.includes('validation') ||
    error.code === 'invalid_parameter'
  )) {
    return true
  }
  
  return false
}

// Extract validation errors from API response
export const extractValidationErrors = (error) => {
  if (!error) return {}
  
  // Handle Supabase validation errors
  if (error.details && typeof error.details === 'object') {
    return error.details
  }
  
  // Handle standard API validation errors
  if (error.response && error.response.data && error.response.data.errors) {
    const { errors } = error.response.data
    
    if (Array.isArray(errors)) {
      // Convert array of errors to object
      return errors.reduce((acc, curr) => {
        if (curr.field) {
          acc[curr.field] = curr.message
        }
        return acc
      }, {})
    }
    
    if (typeof errors === 'object') {
      return errors
    }
  }
  
  return {}
}

// Log error to console with context
export const logError = (error, context = {}) => {
  console.error('Error:', error)
  console.error('Context:', context)
  
  // In a real app, you would send this to an error tracking service
  // Example: Sentry.captureException(error, { extra: context })
}

// Retry a function with exponential backoff
export const retryWithBackoff = async (fn, maxRetries = 3, initialDelay = 1000) => {
  let retries = 0
  
  while (retries < maxRetries) {
    try {
      return await fn()
    } catch (error) {
      retries++
      
      if (retries >= maxRetries) {
        throw error
      }
      
      // Calculate delay with exponential backoff and jitter
      const delay = initialDelay * Math.pow(2, retries) * (0.9 + Math.random() * 0.2)
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

export default {
  formatErrorMessage,
  formatApiError,
  isNetworkError,
  isAuthError,
  isValidationError,
  extractValidationErrors,
  logError,
  retryWithBackoff
}

