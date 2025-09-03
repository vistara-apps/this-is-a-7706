// Cache manager for optimizing API calls and data fetching

// In-memory cache
const memoryCache = new Map()

// Cache item with expiration
class CacheItem {
  constructor(value, ttl = 5 * 60 * 1000) { // Default TTL: 5 minutes
    this.value = value
    this.expiry = Date.now() + ttl
  }
  
  isExpired() {
    return Date.now() > this.expiry
  }
}

// Set cache item
export const setCacheItem = (key, value, ttl) => {
  memoryCache.set(key, new CacheItem(value, ttl))
}

// Get cache item
export const getCacheItem = (key) => {
  const item = memoryCache.get(key)
  
  if (!item) {
    return null
  }
  
  if (item.isExpired()) {
    memoryCache.delete(key)
    return null
  }
  
  return item.value
}

// Remove cache item
export const removeCacheItem = (key) => {
  memoryCache.delete(key)
}

// Clear all cache
export const clearCache = () => {
  memoryCache.clear()
}

// Clear expired cache items
export const clearExpiredCache = () => {
  for (const [key, item] of memoryCache.entries()) {
    if (item.isExpired()) {
      memoryCache.delete(key)
    }
  }
}

// Cached fetch function
export const cachedFetch = async (url, options = {}, ttl) => {
  const cacheKey = `fetch:${url}:${JSON.stringify(options)}`
  const cachedResponse = getCacheItem(cacheKey)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  const response = await fetch(url, options)
  const data = await response.json()
  
  setCacheItem(cacheKey, data, ttl)
  
  return data
}

// Cached function execution
export const cachedFunction = async (fn, args = [], cacheKey = null, ttl) => {
  // Generate cache key if not provided
  const key = cacheKey || `fn:${fn.name}:${JSON.stringify(args)}`
  const cachedResult = getCacheItem(key)
  
  if (cachedResult) {
    return cachedResult
  }
  
  const result = await fn(...args)
  
  setCacheItem(key, result, ttl)
  
  return result
}

// Local storage cache
export const localStorageCache = {
  // Set item with expiration
  setItem: (key, value, ttl = 24 * 60 * 60 * 1000) => { // Default TTL: 24 hours
    const item = {
      value,
      expiry: Date.now() + ttl
    }
    
    localStorage.setItem(key, JSON.stringify(item))
  },
  
  // Get item
  getItem: (key) => {
    const itemStr = localStorage.getItem(key)
    
    if (!itemStr) {
      return null
    }
    
    try {
      const item = JSON.parse(itemStr)
      
      if (Date.now() > item.expiry) {
        localStorage.removeItem(key)
        return null
      }
      
      return item.value
    } catch (error) {
      console.error('Error parsing cached item:', error)
      localStorage.removeItem(key)
      return null
    }
  },
  
  // Remove item
  removeItem: (key) => {
    localStorage.removeItem(key)
  },
  
  // Clear all items
  clear: () => {
    localStorage.clear()
  },
  
  // Clear expired items
  clearExpired: () => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      
      if (key.startsWith('cache:')) {
        const itemStr = localStorage.getItem(key)
        
        try {
          const item = JSON.parse(itemStr)
          
          if (Date.now() > item.expiry) {
            localStorage.removeItem(key)
          }
        } catch (error) {
          // Invalid cache item, remove it
          localStorage.removeItem(key)
        }
      }
    }
  }
}

// Initialize cache cleanup interval
let cleanupInterval = null

// Start cache cleanup interval
export const startCacheCleanup = (interval = 5 * 60 * 1000) => { // Default: 5 minutes
  if (cleanupInterval) {
    clearInterval(cleanupInterval)
  }
  
  cleanupInterval = setInterval(() => {
    clearExpiredCache()
    localStorageCache.clearExpired()
  }, interval)
  
  return cleanupInterval
}

// Stop cache cleanup interval
export const stopCacheCleanup = () => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval)
    cleanupInterval = null
  }
}

// Initialize cache cleanup on module load
startCacheCleanup()

export default {
  setCacheItem,
  getCacheItem,
  removeCacheItem,
  clearCache,
  clearExpiredCache,
  cachedFetch,
  cachedFunction,
  localStorageCache,
  startCacheCleanup,
  stopCacheCleanup
}

