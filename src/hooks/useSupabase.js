import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'

// Generic hook for Supabase data fetching with authentication
const useSupabase = (fetchFn, dependencies = []) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isAuthenticated } = useAuth()

  const fetchData = useCallback(async (...args) => {
    if (!isAuthenticated) {
      setError(new Error('User not authenticated'))
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const result = await fetchFn(...args)
      setData(result)
      return result
    } catch (err) {
      console.error('Supabase operation failed:', err)
      setError(err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [fetchFn, isAuthenticated])

  useEffect(() => {
    // Only fetch data if dependencies change and we have a fetch function
    if (fetchFn) {
      fetchData()
    }
  }, [fetchData, ...dependencies])

  return { data, isLoading, error, fetchData, setData }
}

// Specialized hooks for common operations
export const useClaims = (userId) => {
  const { isAuthenticated } = useAuth()
  const [claims, setClaims] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchClaims = useCallback(async () => {
    if (!isAuthenticated || !userId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      // Import dynamically to avoid circular dependencies
      const { getClaims } = await import('../services/supabaseService')
      const data = await getClaims(userId)
      
      setClaims(data)
      return data
    } catch (err) {
      console.error('Failed to fetch claims:', err)
      setError(err)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, userId])

  useEffect(() => {
    fetchClaims()
  }, [fetchClaims])

  return { claims, isLoading, error, fetchClaims, setClaims }
}

export const usePhotos = (claimId) => {
  const { isAuthenticated } = useAuth()
  const [photos, setPhotos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPhotos = useCallback(async () => {
    if (!isAuthenticated || !claimId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      // Import dynamically to avoid circular dependencies
      const { getPhotos } = await import('../services/supabaseService')
      const data = await getPhotos(claimId)
      
      setPhotos(data)
      return data
    } catch (err) {
      console.error('Failed to fetch photos:', err)
      setError(err)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, claimId])

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos])

  return { photos, isLoading, error, fetchPhotos, setPhotos }
}

export const useReports = (userId, claimId = null) => {
  const { isAuthenticated } = useAuth()
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchReports = useCallback(async () => {
    if (!isAuthenticated || (!userId && !claimId)) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      // Import dynamically to avoid circular dependencies
      const { getReports, getClaimReports } = await import('../services/supabaseService')
      
      let data
      if (claimId) {
        data = await getClaimReports(claimId)
      } else {
        data = await getReports(userId)
      }
      
      setReports(data)
      return data
    } catch (err) {
      console.error('Failed to fetch reports:', err)
      setError(err)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, userId, claimId])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  return { reports, isLoading, error, fetchReports, setReports }
}

export default useSupabase

