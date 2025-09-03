import axios from 'axios'

// Stripe API configuration
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.claimsnap.com'

// Check if Stripe is configured
const isStripeConfigured = () => {
  return !!stripePublicKey
}

// Load Stripe.js dynamically
const loadStripe = async () => {
  if (!isStripeConfigured()) {
    throw new Error('Stripe public key not configured')
  }
  
  if (!window.Stripe) {
    // Load Stripe.js script
    const script = document.createElement('script')
    script.src = 'https://js.stripe.com/v3/'
    script.async = true
    
    await new Promise((resolve, reject) => {
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
  
  return window.Stripe(stripePublicKey)
}

// Create a checkout session for subscription
export const createCheckoutSession = async (userId, priceId, successUrl, cancelUrl) => {
  try {
    // In a real implementation, this would call your backend API
    // For demo purposes, we'll simulate the response
    
    if (!isStripeConfigured()) {
      throw new Error('Stripe not configured')
    }
    
    // Simulate API call
    // const response = await axios.post(`${apiBaseUrl}/create-checkout-session`, {
    //   userId,
    //   priceId,
    //   successUrl,
    //   cancelUrl
    // })
    
    // Simulate response
    const sessionId = `cs_test_${Math.random().toString(36).substring(2, 15)}`
    
    // Load Stripe.js
    const stripe = await loadStripe()
    
    // Redirect to checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId
    })
    
    if (error) {
      throw error
    }
    
    return { success: true, sessionId }
  } catch (error) {
    console.error('Checkout session creation failed:', error)
    throw error
  }
}

// Create a customer portal session
export const createCustomerPortalSession = async (userId, returnUrl) => {
  try {
    // In a real implementation, this would call your backend API
    // For demo purposes, we'll simulate the response
    
    if (!isStripeConfigured()) {
      throw new Error('Stripe not configured')
    }
    
    // Simulate API call
    // const response = await axios.post(`${apiBaseUrl}/create-customer-portal-session`, {
    //   userId,
    //   returnUrl
    // })
    
    // Simulate response
    const url = `https://billing.stripe.com/p/session/${Math.random().toString(36).substring(2, 15)}`
    
    // Redirect to customer portal
    window.location.href = url
    
    return { success: true, url }
  } catch (error) {
    console.error('Customer portal session creation failed:', error)
    throw error
  }
}

// Get subscription plans
export const getSubscriptionPlans = async () => {
  try {
    // In a real implementation, this would call your backend API
    // For demo purposes, we'll return mock data
    
    // Simulate API call
    // const response = await axios.get(`${apiBaseUrl}/subscription-plans`)
    
    // Mock subscription plans
    const plans = [
      {
        id: 'price_basic',
        name: 'Basic',
        description: 'Up to 50 claims per month',
        price: 49,
        interval: 'month',
        currency: 'usd',
        features: [
          'Up to 50 claims per month',
          'Basic AI photo analysis',
          'PDF report generation',
          'Email support'
        ]
      },
      {
        id: 'price_pro',
        name: 'Pro',
        description: 'Up to 150 claims per month',
        price: 99,
        interval: 'month',
        currency: 'usd',
        features: [
          'Up to 150 claims per month',
          'Advanced AI photo analysis',
          'PDF & CSV report generation',
          'Duplicate detection',
          'Quality assessment',
          'Priority email support'
        ]
      },
      {
        id: 'price_enterprise',
        name: 'Enterprise',
        description: 'Unlimited claims',
        price: 299,
        interval: 'month',
        currency: 'usd',
        features: [
          'Unlimited claims',
          'Advanced AI photo analysis',
          'All report formats',
          'Custom branding',
          'API access',
          'Dedicated support',
          'Custom integrations'
        ]
      }
    ]
    
    return plans
  } catch (error) {
    console.error('Subscription plans fetch failed:', error)
    throw error
  }
}

// Get user subscription
export const getUserSubscription = async (userId) => {
  try {
    // In a real implementation, this would call your backend API
    // For demo purposes, we'll return mock data
    
    // Simulate API call
    // const response = await axios.get(`${apiBaseUrl}/user-subscription/${userId}`)
    
    // Mock subscription data
    const subscription = {
      id: 'sub_123456',
      status: 'active',
      planId: 'price_pro',
      planName: 'Pro',
      currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false
    }
    
    return subscription
  } catch (error) {
    console.error('User subscription fetch failed:', error)
    throw error
  }
}

// Get user invoice history
export const getUserInvoices = async (userId) => {
  try {
    // In a real implementation, this would call your backend API
    // For demo purposes, we'll return mock data
    
    // Simulate API call
    // const response = await axios.get(`${apiBaseUrl}/user-invoices/${userId}`)
    
    // Mock invoice data
    const invoices = [
      {
        id: 'in_123456',
        number: 'INV-001',
        amount: 9900, // in cents
        currency: 'usd',
        status: 'paid',
        created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        pdfUrl: '#'
      },
      {
        id: 'in_123457',
        number: 'INV-002',
        amount: 9900, // in cents
        currency: 'usd',
        status: 'paid',
        created: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        pdfUrl: '#'
      }
    ]
    
    return invoices
  } catch (error) {
    console.error('User invoices fetch failed:', error)
    throw error
  }
}

// Update subscription
export const updateSubscription = async (userId, newPriceId) => {
  try {
    // In a real implementation, this would call your backend API
    // For demo purposes, we'll simulate the response
    
    // Simulate API call
    // const response = await axios.post(`${apiBaseUrl}/update-subscription`, {
    //   userId,
    //   newPriceId
    // })
    
    // Simulate response
    return { success: true }
  } catch (error) {
    console.error('Subscription update failed:', error)
    throw error
  }
}

// Cancel subscription
export const cancelSubscription = async (userId, cancelImmediately = false) => {
  try {
    // In a real implementation, this would call your backend API
    // For demo purposes, we'll simulate the response
    
    // Simulate API call
    // const response = await axios.post(`${apiBaseUrl}/cancel-subscription`, {
    //   userId,
    //   cancelImmediately
    // })
    
    // Simulate response
    return { success: true }
  } catch (error) {
    console.error('Subscription cancellation failed:', error)
    throw error
  }
}

export default {
  createCheckoutSession,
  createCustomerPortalSession,
  getSubscriptionPlans,
  getUserSubscription,
  getUserInvoices,
  updateSubscription,
  cancelSubscription,
  isStripeConfigured
}

