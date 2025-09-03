import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// User related functions
export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export const signUp = async (email, password, userData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  })
  if (error) throw error
  
  // Create user profile in the users table
  if (data.user) {
    await createUserProfile(data.user.id, {
      email,
      subscriptionTier: 'free',
      createdAt: new Date().toISOString(),
      ...userData
    })
  }
  
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) throw error
}

// User profile functions
export const createUserProfile = async (userId, userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{ userId, ...userData }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('userId', userId)
    .single()
  
  if (error) throw error
  return data
}

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('userId', userId)
    .select()
  
  if (error) throw error
  return data[0]
}

// Claim related functions
export const getClaims = async (userId) => {
  const { data, error } = await supabase
    .from('claims')
    .select('*')
    .eq('userId', userId)
    .order('dateFiled', { ascending: false })
  
  if (error) throw error
  return data
}

export const getClaim = async (claimId) => {
  const { data, error } = await supabase
    .from('claims')
    .select('*')
    .eq('claimId', claimId)
    .single()
  
  if (error) throw error
  return data
}

export const createClaim = async (claimData) => {
  const { data, error } = await supabase
    .from('claims')
    .insert([claimData])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateClaim = async (claimId, updates) => {
  const { data, error } = await supabase
    .from('claims')
    .update(updates)
    .eq('claimId', claimId)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteClaim = async (claimId) => {
  // First delete all photos associated with this claim
  await deleteClaimPhotos(claimId)
  
  // Then delete all reports associated with this claim
  await deleteClaimReports(claimId)
  
  // Finally delete the claim itself
  const { error } = await supabase
    .from('claims')
    .delete()
    .eq('claimId', claimId)
  
  if (error) throw error
}

// Photo related functions
export const getPhotos = async (claimId) => {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('claimId', claimId)
    .order('uploadedAt', { ascending: false })
  
  if (error) throw error
  return data
}

export const getPhoto = async (photoId) => {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('photoId', photoId)
    .single()
  
  if (error) throw error
  return data
}

export const createPhoto = async (photoData) => {
  const { data, error } = await supabase
    .from('photos')
    .insert([photoData])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updatePhoto = async (photoId, updates) => {
  const { data, error } = await supabase
    .from('photos')
    .update(updates)
    .eq('photoId', photoId)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deletePhoto = async (photoId) => {
  // First get the photo to get the storage path
  const photo = await getPhoto(photoId)
  
  // Delete the photo from storage if it exists
  if (photo.processedUrl) {
    const path = photo.processedUrl.split('/').pop()
    const { error: storageError } = await supabase.storage
      .from('photos')
      .remove([path])
    
    if (storageError) throw storageError
  }
  
  // Delete the photo record
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('photoId', photoId)
  
  if (error) throw error
}

export const deleteClaimPhotos = async (claimId) => {
  // Get all photos for this claim
  const photos = await getPhotos(claimId)
  
  // Delete each photo from storage
  const storagePaths = photos
    .filter(photo => photo.processedUrl)
    .map(photo => photo.processedUrl.split('/').pop())
  
  if (storagePaths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from('photos')
      .remove(storagePaths)
    
    if (storageError) throw storageError
  }
  
  // Delete all photo records
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('claimId', claimId)
  
  if (error) throw error
}

// Report related functions
export const getReports = async (userId) => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('userId', userId)
    .order('generatedAt', { ascending: false })
  
  if (error) throw error
  return data
}

export const getClaimReports = async (claimId) => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('claimId', claimId)
    .order('generatedAt', { ascending: false })
  
  if (error) throw error
  return data
}

export const getReport = async (reportId) => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('reportId', reportId)
    .single()
  
  if (error) throw error
  return data
}

export const createReport = async (reportData) => {
  const { data, error } = await supabase
    .from('reports')
    .insert([reportData])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateReport = async (reportId, updates) => {
  const { data, error } = await supabase
    .from('reports')
    .update(updates)
    .eq('reportId', reportId)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteReport = async (reportId) => {
  // First get the report to get the storage path
  const report = await getReport(reportId)
  
  // Delete the report from storage if it exists
  if (report.reportUrl) {
    const path = report.reportUrl.split('/').pop()
    const { error: storageError } = await supabase.storage
      .from('reports')
      .remove([path])
    
    if (storageError) throw storageError
  }
  
  // Delete the report record
  const { error } = await supabase
    .from('reports')
    .delete()
    .eq('reportId', reportId)
  
  if (error) throw error
}

export const deleteClaimReports = async (claimId) => {
  // Get all reports for this claim
  const reports = await getClaimReports(claimId)
  
  // Delete each report from storage
  const storagePaths = reports
    .filter(report => report.reportUrl)
    .map(report => report.reportUrl.split('/').pop())
  
  if (storagePaths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from('reports')
      .remove(storagePaths)
    
    if (storageError) throw storageError
  }
  
  // Delete all report records
  const { error } = await supabase
    .from('reports')
    .delete()
    .eq('claimId', claimId)
  
  if (error) throw error
}

// File storage functions
export const uploadFile = async (bucket, path, file) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    })
  
  if (error) throw error
  
  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return publicUrl
}

export const deleteFile = async (bucket, path) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])
  
  if (error) throw error
}

export default supabase

