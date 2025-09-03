import axios from 'axios'
import { uploadFile, deleteFile } from './supabaseService'

// Pinata API configuration
const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY
const pinataSecretApiKey = import.meta.env.VITE_PINATA_SECRET_API_KEY
const pinataGateway = import.meta.env.VITE_PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs/'

// Check if Pinata is configured
const isPinataConfigured = () => {
  return pinataApiKey && pinataSecretApiKey
}

// Upload file to Pinata (IPFS)
export const uploadToPinata = async (file, metadata = {}) => {
  if (!isPinataConfigured()) {
    throw new Error('Pinata API keys not configured')
  }

  try {
    // Create form data
    const formData = new FormData()
    formData.append('file', file)
    
    // Add metadata
    const metadataJson = JSON.stringify({
      name: file.name,
      keyvalues: {
        ...metadata,
        timestamp: Date.now()
      }
    })
    formData.append('pinataMetadata', metadataJson)
    
    // Add options
    const optionsJson = JSON.stringify({
      cidVersion: 1
    })
    formData.append('pinataOptions', optionsJson)
    
    // Upload to Pinata
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': `multipart/form-data;`,
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretApiKey
        }
      }
    )
    
    // Return IPFS hash and gateway URL
    const ipfsHash = response.data.IpfsHash
    const gatewayUrl = `${pinataGateway}${ipfsHash}`
    
    return {
      ipfsHash,
      gatewayUrl
    }
  } catch (error) {
    console.error('Pinata upload failed:', error)
    throw error
  }
}

// Upload JSON data to Pinata
export const uploadJsonToPinata = async (jsonData, name = 'data.json') => {
  if (!isPinataConfigured()) {
    throw new Error('Pinata API keys not configured')
  }

  try {
    // Prepare request
    const data = JSON.stringify({
      pinataOptions: {
        cidVersion: 1
      },
      pinataMetadata: {
        name,
        keyvalues: {
          timestamp: Date.now()
        }
      },
      pinataContent: jsonData
    })
    
    // Upload to Pinata
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretApiKey
        }
      }
    )
    
    // Return IPFS hash and gateway URL
    const ipfsHash = response.data.IpfsHash
    const gatewayUrl = `${pinataGateway}${ipfsHash}`
    
    return {
      ipfsHash,
      gatewayUrl
    }
  } catch (error) {
    console.error('Pinata JSON upload failed:', error)
    throw error
  }
}

// Unpin file from Pinata
export const unpinFromPinata = async (ipfsHash) => {
  if (!isPinataConfigured()) {
    throw new Error('Pinata API keys not configured')
  }

  try {
    // Unpin from Pinata
    await axios.delete(
      `https://api.pinata.cloud/pinning/unpin/${ipfsHash}`,
      {
        headers: {
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretApiKey
        }
      }
    )
    
    return true
  } catch (error) {
    console.error('Pinata unpin failed:', error)
    throw error
  }
}

// Upload file to storage (Supabase or Pinata based on configuration)
export const uploadToStorage = async (file, bucket, path, metadata = {}, usePinata = true) => {
  try {
    // If Pinata is configured and requested, upload to IPFS first
    let ipfsData = null
    if (usePinata && isPinataConfigured()) {
      ipfsData = await uploadToPinata(file, metadata)
    }
    
    // Always upload to Supabase for faster access
    const supabaseUrl = await uploadFile(bucket, path, file)
    
    return {
      url: supabaseUrl,
      ipfsHash: ipfsData?.ipfsHash,
      ipfsUrl: ipfsData?.gatewayUrl
    }
  } catch (error) {
    console.error('Storage upload failed:', error)
    throw error
  }
}

// Upload JSON data to storage
export const uploadJsonToStorage = async (jsonData, bucket, path, name = 'data.json', usePinata = true) => {
  try {
    // If Pinata is configured and requested, upload to IPFS first
    let ipfsData = null
    if (usePinata && isPinataConfigured()) {
      ipfsData = await uploadJsonToPinata(jsonData, name)
    }
    
    // Convert JSON to Blob for Supabase upload
    const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' })
    const file = new File([blob], name, { type: 'application/json' })
    
    // Upload to Supabase
    const supabaseUrl = await uploadFile(bucket, path, file)
    
    return {
      url: supabaseUrl,
      ipfsHash: ipfsData?.ipfsHash,
      ipfsUrl: ipfsData?.gatewayUrl
    }
  } catch (error) {
    console.error('JSON storage upload failed:', error)
    throw error
  }
}

// Delete file from storage
export const deleteFromStorage = async (bucket, path, ipfsHash = null) => {
  try {
    // Delete from Supabase
    await deleteFile(bucket, path)
    
    // If IPFS hash is provided and Pinata is configured, unpin from IPFS
    if (ipfsHash && isPinataConfigured()) {
      await unpinFromPinata(ipfsHash)
    }
    
    return true
  } catch (error) {
    console.error('Storage delete failed:', error)
    throw error
  }
}

export default {
  uploadToStorage,
  uploadJsonToStorage,
  deleteFromStorage,
  uploadToPinata,
  uploadJsonToPinata,
  unpinFromPinata
}

