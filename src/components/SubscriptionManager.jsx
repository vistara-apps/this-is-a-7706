import React, { useState, useEffect } from 'react'
import { CreditCard, Check, AlertTriangle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { 
  getSubscriptionPlans, 
  getUserSubscription, 
  createCheckoutSession, 
  createCustomerPortalSession 
} from '../services/stripeService'

const SubscriptionManager = () => {
  const { user, profile, updateSubscription } = useAuth()
  const [plans, setPlans] = useState([])
  const [currentSubscription, setCurrentSubscription] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch subscription plans and user subscription
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch subscription plans
        const plansData = await getSubscriptionPlans()
        setPlans(plansData)
        
        // Fetch user subscription if user is logged in
        if (user) {
          const subscriptionData = await getUserSubscription(user.id)
          setCurrentSubscription(subscriptionData)
          
          // Update subscription in auth context
          updateSubscription({
            isActive: subscriptionData.status === 'active',
            tier: subscriptionData.planName.toLowerCase(),
            expiresAt: subscriptionData.currentPeriodEnd
          })
        }
      } catch (err) {
        console.error('Failed to fetch subscription data:', err)
        setError('Failed to load subscription information. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [user, updateSubscription])

  // Handle subscription checkout
  const handleSubscribe = async (planId) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Create checkout session
      const successUrl = `${window.location.origin}/settings?subscription=success`
      const cancelUrl = `${window.location.origin}/settings?subscription=canceled`
      
      await createCheckoutSession(user.id, planId, successUrl, cancelUrl)
      
      // Note: The user will be redirected to Stripe Checkout
    } catch (err) {
      console.error('Failed to create checkout session:', err)
      setError('Failed to start checkout process. Please try again.')
      setIsLoading(false)
    }
  }

  // Handle customer portal
  const handleManageSubscription = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Create customer portal session
      const returnUrl = `${window.location.origin}/settings`
      
      await createCustomerPortalSession(user.id, returnUrl)
      
      // Note: The user will be redirected to Stripe Customer Portal
    } catch (err) {
      console.error('Failed to create customer portal session:', err)
      setError('Failed to open billing portal. Please try again.')
      setIsLoading(false)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Get current plan
  const getCurrentPlan = () => {
    if (!currentSubscription) return null
    return plans.find(plan => plan.id === currentSubscription.planId)
  }

  // Check if plan is current
  const isPlanCurrent = (planId) => {
    return currentSubscription?.planId === planId
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      {currentSubscription && (
        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Current Subscription
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary">
                  {getCurrentPlan()?.name || currentSubscription.planName} Plan
                </p>
                <p className="text-sm text-text-secondary">
                  {currentSubscription.status === 'active' ? 'Active' : 'Inactive'}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-text-secondary">
                  Renews on {formatDate(currentSubscription.currentPeriodEnd)}
                </p>
                {currentSubscription.cancelAtPeriodEnd && (
                  <p className="text-sm text-red-600">
                    Cancels at period end
                  </p>
                )}
              </div>
            </div>
            
            <button
              onClick={handleManageSubscription}
              className="btn-secondary w-full"
              disabled={isLoading}
            >
              Manage Billing
            </button>
          </div>
        </div>
      )}
      
      {/* Subscription Plans */}
      <div className="card">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Subscription Plans
        </h3>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`
                  border rounded-lg p-6 transition-all
                  ${isPlanCurrent(plan.id) 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-semibold text-text-primary">
                      {plan.name}
                    </h4>
                    <p className="text-text-secondary mt-1">
                      {plan.description}
                    </p>
                  </div>
                  
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-text-primary">
                      ${plan.price}
                    </span>
                    <span className="text-text-secondary ml-1">
                      /{plan.interval}
                    </span>
                  </div>
                  
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-accent mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-text-primary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    className={`
                      w-full py-2 px-4 rounded-md font-medium transition-colors
                      ${isPlanCurrent(plan.id)
                        ? 'bg-gray-100 text-text-secondary cursor-default'
                        : 'btn-primary'
                      }
                    `}
                    disabled={isPlanCurrent(plan.id) || isLoading}
                  >
                    {isPlanCurrent(plan.id) ? 'Current Plan' : 'Subscribe'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SubscriptionManager

