import { useState, useCallback, useEffect } from 'react'

// Hook for handling async operations with loading and error states
const useAsync = (asyncFunction, immediate = false, ...args) => {
  const [status, setStatus] = useState('idle')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  // Function to execute the async function
  const execute = useCallback(async (...executeArgs) => {
    setStatus('pending')
    setData(null)
    setError(null)
    
    try {
      const result = await asyncFunction(...(executeArgs.length ? executeArgs : args))
      setData(result)
      setStatus('success')
      return result
    } catch (error) {
      setError(error)
      setStatus('error')
      throw error
    }
  }, [asyncFunction, ...args])

  // Function to retry the async function
  const retry = useCallback(() => {
    setRetryCount(count => count + 1)
    return execute(...args)
  }, [execute, ...args])

  // Function to reset the state
  const reset = useCallback(() => {
    setStatus('idle')
    setData(null)
    setError(null)
    setRetryCount(0)
  }, [])

  // Execute the async function if immediate is true
  useEffect(() => {
    if (immediate) {
      execute(...args)
    }
  }, [immediate, execute, retryCount, ...args])

  return {
    execute,
    retry,
    reset,
    status,
    data,
    error,
    isIdle: status === 'idle',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
    retryCount
  }
}

// Hook for handling async operations with automatic retries
export const useAsyncWithRetry = (asyncFunction, options = {}) => {
  const {
    immediate = false,
    maxRetries = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
    retryCondition = () => true
  } = options
  
  const [retries, setRetries] = useState(0)
  const [retryTimeout, setRetryTimeout] = useState(null)
  
  const {
    execute: originalExecute,
    status,
    data,
    error,
    reset,
    ...rest
  } = useAsync(asyncFunction, false)
  
  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout)
      }
    }
  }, [retryTimeout])
  
  // Handle success callback
  useEffect(() => {
    if (status === 'success' && onSuccess) {
      onSuccess(data)
    }
  }, [status, data, onSuccess])
  
  // Handle error and retry logic
  useEffect(() => {
    if (status === 'error') {
      if (onError) {
        onError(error)
      }
      
      if (retries < maxRetries && retryCondition(error)) {
        const timeout = setTimeout(() => {
          setRetries(r => r + 1)
          originalExecute()
        }, retryDelay * Math.pow(2, retries)) // Exponential backoff
        
        setRetryTimeout(timeout)
      }
    }
  }, [status, error, retries, maxRetries, retryDelay, retryCondition, onError, originalExecute])
  
  // Execute with retry state reset
  const execute = useCallback(async (...args) => {
    setRetries(0)
    if (retryTimeout) {
      clearTimeout(retryTimeout)
      setRetryTimeout(null)
    }
    return originalExecute(...args)
  }, [originalExecute, retryTimeout])
  
  // Reset with retry state reset
  const fullReset = useCallback(() => {
    setRetries(0)
    if (retryTimeout) {
      clearTimeout(retryTimeout)
      setRetryTimeout(null)
    }
    reset()
  }, [reset, retryTimeout])
  
  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate, execute])
  
  return {
    execute,
    reset: fullReset,
    status,
    data,
    error,
    retries,
    isIdle: status === 'idle',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error' && retries >= maxRetries,
    isRetrying: status === 'error' && retries < maxRetries,
    ...rest
  }
}

export default useAsync

