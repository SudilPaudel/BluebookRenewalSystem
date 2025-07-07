import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCreditCard, FaShieldAlt, FaCheckCircle, FaClock, FaExclamationTriangle, FaCalculator, FaReceipt } from "react-icons/fa";
import khaltiLogo from "../assets/khalti.png";

// Khalti Logo Component using PNG
const KhaltiLogo = ({ className = "h-8 w-8" }) => (
  <img src={khaltiLogo} alt="Khalti" className={className} />
);

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bluebook, setBluebook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('khalti');
  const [taxDetails, setTaxDetails] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [currentPaymentId, setCurrentPaymentId] = useState(null);

  useEffect(() => {
    fetchBluebookDetail();
  }, [id]);

  const fetchBluebookDetail = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/bluebook/fetch/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setBluebook(data.result);
        calculateTaxDetails(data.result);
      } else {
        setError(data.message || 'Failed to fetch bluebook details');
      }
    } catch (error) {
      console.error('Error fetching bluebook:', error);
      setError('An error occurred while fetching bluebook details');
    } finally {
      setLoading(false);
    }
  };

  const calculateTaxDetails = (bluebookData) => {
    const now = new Date();
    const taxExpireDate = new Date(bluebookData.taxExpireDate);
    const diffInMs = taxExpireDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    let baseTax = 0;
    let renewalCharge = 0;
    let fineAmount = 0;
    let oldVehicleTax = 0;

    // Calculate base tax based on vehicle type and engine CC
    if (bluebookData.vehicleType === "Motorcycle") {
      renewalCharge = 300;
      if (bluebookData.vehicleEngineCC <= 125) {
        baseTax = 3000;
      } else if (bluebookData.vehicleEngineCC <= 150) {
        baseTax = 5000;
      } else if (bluebookData.vehicleEngineCC <= 225) {
        baseTax = 6500;
      } else if (bluebookData.vehicleEngineCC <= 400) {
        baseTax = 12000;
      } else if (bluebookData.vehicleEngineCC <= 650) {
        baseTax = 25000;
      } else {
        baseTax = 3600;
      }
    } else if (bluebookData.vehicleType === "Car") {
      renewalCharge = 500;
      if (bluebookData.vehicleEngineCC <= 1000) {
        baseTax = 22000;
      } else if (bluebookData.vehicleEngineCC <= 1500) {
        baseTax = 25000;
      } else if (bluebookData.vehicleEngineCC <= 2000) {
        baseTax = 27000;
      } else if (bluebookData.vehicleEngineCC <= 2500) {
        baseTax = 37000;
      } else if (bluebookData.vehicleEngineCC <= 3000) {
        baseTax = 50000;
      } else if (bluebookData.vehicleEngineCC <= 3500) {
        baseTax = 65000;
      } else if (bluebookData.vehicleEngineCC >= 3501) {
        baseTax = 70000;
      }
    }

    // Calculate fine if expired
    if (daysLeft < 1) {
      if (daysLeft <= -365) {
        fineAmount = 0.20 * baseTax;
      } else if (daysLeft <= -45) {
        fineAmount = 0.10 * baseTax;
      } else if (daysLeft <= -1) {
        fineAmount = 0.05 * baseTax;
      }
    }

    // Calculate old vehicle tax (10% for vehicles 15+ years old)
    const today = new Date();
    const registrationDate = new Date(bluebookData.VehicleRegistrationDate);
    const vehicleAgeInYears = today.getFullYear() - registrationDate.getFullYear();
    
    if (vehicleAgeInYears >= 15) {
      oldVehicleTax = 0.10 * (baseTax + renewalCharge + fineAmount);
    }

    const totalTaxAmount = baseTax + renewalCharge + fineAmount + oldVehicleTax;

    setTaxDetails({
      baseTax,
      renewalCharge,
      fineAmount,
      oldVehicleTax,
      totalTaxAmount,
      daysLeft,
      vehicleAgeInYears,
      canPay: daysLeft < 30
    });
  };

  const handlePayment = async () => {
    if (!taxDetails.canPay) {
      setError('Tax payment is not due yet. You can pay when there are less than 30 days remaining.');
      return;
    }

    // Prevent multiple clicks
    if (paymentLoading) {
      return;
    }

    setPaymentLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payment/bluebook/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentMethod: paymentMethod
        })
      });

      const data = await response.json();

      if (response.status === 200) {
        // Store payment ID for OTP verification
        setCurrentPaymentId(data.result.paymentData._id);
        setPaymentUrl(data.payment.paymentURl);
        setShowOtpModal(true); // Show OTP modal instead of payment modal
      } else {
        // Handle specific error messages
        let errorMessage = 'Failed to initiate payment';
        if (data.message) {
          if (data.message.includes('already have a pending payment')) {
            errorMessage = 'You already have a payment in progress. Please complete or wait a few minutes before trying again.';
          } else if (data.message.includes('not verified')) {
            errorMessage = 'Your bluebook needs to be verified by admin before you can pay tax.';
          } else if (data.message.includes('time to pay')) {
            errorMessage = 'Tax payment is not due yet. You can pay when there are less than 30 days remaining.';
          } else {
            errorMessage = data.message;
          }
        }
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      setError('Network error. Please check your internet connection and try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setOtpLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payment/verify-otp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentId: currentPaymentId,
          otp: otp
        })
      });

      const data = await response.json();

      if (response.ok) {
        setShowOtpModal(false);
        setShowPaymentModal(true); // Now show the payment modal
        setOtp('');
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Network error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysLeftStatus = (daysLeft) => {
    if (daysLeft > 30) {
      return { color: 'text-green-600', icon: <FaCheckCircle />, text: 'Tax is valid' };
    } else if (daysLeft > 0) {
      return { color: 'text-yellow-600', icon: <FaClock />, text: `${daysLeft} days left` };
    } else {
      return { color: 'text-red-600', icon: <FaExclamationTriangle />, text: `${Math.abs(daysLeft)} days expired` };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nepal-blue"></div>
      </div>
    );
  }

  if (error && !bluebook) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="mr-4 p-2 text-gray-400 hover:text-gray-600"
                >
                  <FaArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Error</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!bluebook) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="mr-4 p-2 text-gray-400 hover:text-gray-600"
                >
                  <FaArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Bluebook Not Found</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">The requested bluebook could not be found.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <FaArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Vehicle Tax Payment</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Pay your vehicle tax online
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaReceipt className="h-8 w-8 text-nepal-blue" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl">
            <div className="flex items-center">
              <FaExclamationTriangle className="h-5 w-5 text-red-400 mr-3" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vehicle Information */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <FaCreditCard className="mr-2" />
                Vehicle Information
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Registration Number</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">{bluebook.vehicleRegNo}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Vehicle Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{bluebook.vehicleType}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Engine CC</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{bluebook.vehicleEngineCC} cc</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Owner Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{bluebook.vehicleOwnerName}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Tax Expire Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(bluebook.taxExpireDate)}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDaysLeftStatus(taxDetails?.daysLeft || 0).color.replace('text-', 'bg-').replace('-600', '-100')} ${getDaysLeftStatus(taxDetails?.daysLeft || 0).color}`}>
                      {getDaysLeftStatus(taxDetails?.daysLeft || 0).icon}
                      <span className="ml-2">{getDaysLeftStatus(taxDetails?.daysLeft || 0).text}</span>
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Tax Calculation */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <FaCalculator className="mr-2" />
                Tax Calculation
              </h3>
            </div>
            <div className="border-t border-gray-200">
              {taxDetails ? (
                <div className="px-4 py-5 sm:px-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Base Tax</span>
                      <span className="text-sm font-medium">Rs. {taxDetails.baseTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Renewal Charge</span>
                      <span className="text-sm font-medium">Rs. {taxDetails.renewalCharge.toLocaleString()}</span>
                    </div>
                    {taxDetails.fineAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-red-600">Fine Amount</span>
                        <span className="text-sm font-medium text-red-600">Rs. {taxDetails.fineAmount.toLocaleString()}</span>
                      </div>
                    )}
                    {taxDetails.oldVehicleTax > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-orange-600">Old Vehicle Tax (10%)</span>
                        <span className="text-sm font-medium text-orange-600">Rs. {taxDetails.oldVehicleTax.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                        <span className="text-lg font-bold text-nepal-blue">Rs. {taxDetails.totalTaxAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Payment Method</h4>
                    <div className="flex space-x-4">
                      <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-nepal-blue hover:bg-blue-50 cursor-pointer transition-colors">
                        <KhaltiLogo className="h-8 w-8" />
                      </div>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <div className="mt-6">
                    {taxDetails.canPay ? (
                      <button
                        onClick={handlePayment}
                        disabled={paymentLoading}
                        className="w-full bg-nepal-blue hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                      >
                        {paymentLoading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <>
                            Pay Rs. {taxDetails.totalTaxAmount.toLocaleString()}
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-600">
                          Tax payment is not due yet. You can pay when there are less than 30 days remaining.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="px-4 py-5 sm:px-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* OTP Modal */}
        {showOtpModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="flex justify-center mb-4">
                  <KhaltiLogo className="h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Enter OTP</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Please check your email for the OTP and enter it below to confirm your payment.
                </p>
                
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <div className="mb-4">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue focus:border-transparent text-center text-lg font-mono"
                    maxLength={6}
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleOtpVerification}
                    disabled={otpLoading || otp.length !== 6}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
                  >
                    {otpLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      'Verify OTP'
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowOtpModal(false);
                      setOtp('');
                      setError(null);
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  Didn't receive OTP? Check your email or try again.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && paymentUrl && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="flex justify-center mb-4">
                  <KhaltiLogo className="h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Complete Payment</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Your payment has been confirmed. You will be redirected to Khalti to complete your payment securely.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => window.open(paymentUrl, '_blank')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
                  >
                    <KhaltiLogo className="h-4 w-4 mr-2" />
                    Proceed to Payment
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  After payment, you can verify your transaction using the transaction ID.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payment; 