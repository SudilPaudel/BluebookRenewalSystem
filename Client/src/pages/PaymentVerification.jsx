import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaArrowLeft } from "react-icons/fa";
import khaltiLogo from "../assets/khalti.png";

// Khalti Logo Component using PNG
const KhaltiLogo = ({ className = "h-8 w-8" }) => (
  <img src={khaltiLogo} alt="Khalti" className={className} />
);

function PaymentVerification() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'failed'
  const [error, setError] = useState(null);
  const [verificationData, setVerificationData] = useState(null);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const pidx = searchParams.get('pidx');
      if (!pidx) {
        setVerificationStatus('failed');
        setError('Payment verification failed: Missing transaction ID');
        return;
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/payment/verify/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pidx })
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationStatus('success');
        setVerificationData(data.result);
      } else {
        setVerificationStatus('failed');
        // Handle specific error messages
        let errorMessage = 'Payment verification failed';
        if (data.message) {
          if (data.message.includes('pidx')) {
            errorMessage = 'Payment verification failed: Missing transaction details. Please try again.';
          } else if (data.message.includes('not verified')) {
            errorMessage = 'Payment was not completed. Please try the payment again.';
          } else {
            errorMessage = data.message;
          }
        }
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setVerificationStatus('failed');
      setError('Network error. Please check your internet connection and try again.');
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleRetry = () => {
    setVerificationStatus('verifying');
    setError(null);
    verifyPayment();
  };

  if (verificationStatus === 'verifying') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-nepal-blue mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we verify your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <button
              onClick={handleBackToDashboard}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <FaArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Verification</h1>
              <p className="mt-1 text-sm text-gray-500">
                Payment verification result
              </p>
            </div>
          </div>
        </div>

        {/* Verification Result */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center">
              {verificationStatus === 'success' ? (
                <div className="flex items-center">
                  <FaCheckCircle className="h-8 w-8 text-green-500 mr-3" />
                  <KhaltiLogo className="h-6 w-6 mr-2" />
                </div>
              ) : (
                <FaTimesCircle className="h-8 w-8 text-red-500 mr-3" />
              )}
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {verificationStatus === 'success' ? 'Payment Successful' : 'Payment Failed'}
              </h3>
            </div>
          </div>

          <div className="border-t border-gray-200">
            {verificationStatus === 'success' ? (
              <div className="px-4 py-5 sm:px-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <FaCheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-green-800">Payment Verified Successfully</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Your vehicle tax has been renewed for another year.
                      </p>
                    </div>
                    <KhaltiLogo className="h-8 w-8" />
                  </div>
                </div>

                {verificationData && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Transaction Details</h4>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                        <dd className="mt-1 text-sm text-gray-900">Rs. {verificationData.totalAmount?.toLocaleString()}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
                        <dd className="mt-1 text-sm text-gray-900">{verificationData.transactionId}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Fee</dt>
                        <dd className="mt-1 text-sm text-gray-900">Rs. {verificationData.fee?.toLocaleString()}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Refunded</dt>
                        <dd className="mt-1 text-sm text-gray-900">{verificationData.refunded ? 'Yes' : 'No'}</dd>
                      </div>
                    </dl>
                  </div>
                )}

                <div className="mt-8">
                  <button
                    onClick={handleBackToDashboard}
                    className="w-full bg-nepal-blue hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 py-5 sm:px-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <FaTimesCircle className="h-5 w-5 text-red-400 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">Payment Verification Failed</h4>
                      <p className="text-sm text-red-700 mt-1">
                        {error || 'Unable to verify your payment. Please try again.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">What to do next?</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>Check if the payment was actually completed in your Khalti account</div>
                    <div>Wait a few minutes and try verifying again</div>
                    <div>Contact support if the issue persists</div>
                    <div>Make sure you have sufficient balance in your Khalti account</div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <button
                    onClick={handleRetry}
                    className="w-full bg-nepal-blue hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    <FaSpinner className="inline mr-2" />
                    Try Again
                  </button>
                  <button
                    onClick={handleBackToDashboard}
                    className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentVerification; 