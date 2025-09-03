import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  ArrowLeft, 
  CreditCard, 
  Download, 
  FileText, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import SubscriptionManager from '../components/SubscriptionManager'
import { getUserInvoices } from '../services/stripeService'

const Billing = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [invoices, setInvoices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Check for success or error messages in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const subscription = params.get('subscription')
    
    if (subscription === 'success') {
      setSuccessMessage('Your subscription has been updated successfully!')
    } else if (subscription === 'canceled') {
      setError('The subscription process was canceled.')
    }
  }, [location])

  // Fetch user invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return
      
      try {
        setIsLoading(true)
        const data = await getUserInvoices(user.id)
        setInvoices(data)
      } catch (err) {
        console.error('Failed to fetch invoices:', err)
        setError('Failed to load invoice history. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchInvoices()
  }, [user])

  // Format currency
  const formatCurrency = (amount, currency = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100)
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link
            to="/settings"
            className="text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Billing</h1>
            <p className="text-text-secondary mt-1">
              Manage your subscription and billing information
            </p>
          </div>
        </div>
        
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <p className="text-green-700">{successMessage}</p>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && !successMessage && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {/* Subscription Manager */}
        <SubscriptionManager />
        
        {/* Invoice History */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Invoice History
          </h3>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-sm font-medium text-text-secondary">
                      Invoice
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-text-secondary">
                      Date
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-text-secondary">
                      Amount
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-text-secondary">
                      Status
                    </th>
                    <th className="py-3 px-4 text-right text-sm font-medium text-text-secondary">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-200">
                      <td className="py-4 px-4 text-text-primary">
                        {invoice.number}
                      </td>
                      <td className="py-4 px-4 text-text-primary">
                        {formatDate(invoice.created)}
                      </td>
                      <td className="py-4 px-4 text-text-primary">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${invoice.status === 'paid' 
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'open'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                          }
                        `}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <a
                          href={invoice.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 inline-flex items-center"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          <span>PDF</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <h4 className="text-lg font-medium text-text-primary">
                No invoices yet
              </h4>
              <p className="text-text-secondary mt-1">
                Your invoice history will appear here once you have an active subscription.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Billing

