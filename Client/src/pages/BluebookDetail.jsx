import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCar, FaArrowLeft, FaDownload, FaCheckCircle, FaClock, FaTimesCircle, FaCreditCard } from "react-icons/fa";

function BluebookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bluebook, setBluebook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBluebookDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <FaCheckCircle className="mr-2" />
          Verified
        </span>;
      case 'pending':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <FaClock className="mr-2" />
          Pending Verification
        </span>;
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
          Unknown
        </span>;
    }
  };

  const isExpired = (expireDate) => {
    if (!expireDate) return false;
    return new Date(expireDate) < new Date();
  };

  const getDaysUntilExpiry = (expireDate) => {
    if (!expireDate) return Infinity;
    const expiryDate = new Date(expireDate);
    const today = new Date();
    const diffTime = Math.abs(expiryDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleDownload = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/bluebook/download/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `bluebook_${id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(link.href);
      } else {
        setError('Failed to download bluebook');
      }
    } catch (error) {
      console.error('Error downloading bluebook:', error);
      setError('An error occurred while downloading bluebook');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nepal-blue"></div>
      </div>
    );
  }

  if (error) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 p-2 rounded-full bg-white shadow hover:bg-blue-100 transition-colors duration-200"
              >
                <FaArrowLeft className="h-5 w-5 text-blue-500" />
              </button>
              <div>
                <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight animate-fade-in">
                  Bluebook Details
                </h1>
                <p className="mt-1 text-base text-blue-500 animate-fade-in delay-100">
                  Vehicle registration information
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="animate-fade-in-up">{getStatusBadge(bluebook.status)}</div>
              {isExpired(bluebook.taxExpireDate) && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-200 text-red-800 shadow animate-pulse">
                  <FaTimesCircle className="mr-2" />
                  Tax Expired
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bluebook Information */}
        <div className="bg-white/80 shadow-xl rounded-2xl overflow-hidden border border-blue-100 animate-fade-in-up">
          <div className="px-6 py-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
                  <FaCar className="text-blue-400" />
                  Vehicle Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-blue-500">
                  Registration number: <span className="font-semibold text-blue-700">{bluebook.vehicleRegNo}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownload(bluebook._id)}
                  className="inline-flex items-center px-4 py-2 border border-blue-200 shadow-sm text-sm font-semibold rounded-lg text-blue-700 bg-white hover:bg-blue-50 hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                >
                  <FaDownload className="mr-2" />
                  Download
                </button>
                {(isExpired(bluebook.taxExpireDate) || getDaysUntilExpiry(bluebook.taxExpireDate) <= 30) && (
                  <button
                    onClick={() => navigate(`/payment/${bluebook._id}`)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 animate-bounce"
                  >
                    <FaCreditCard className="mr-2" />
                    Pay Tax
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="divide-y divide-blue-50">
            <dl className="grid grid-cols-1 sm:grid-cols-2">
              <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-5 animate-fade-in-up">
                <dt className="text-sm font-semibold text-blue-500">Registration Number</dt>
                <dd className="mt-1 text-lg text-blue-900 font-medium">{bluebook.vehicleRegNo}</dd>
              </div>
              <div className="bg-white px-6 py-5 animate-fade-in-up delay-50">
                <dt className="text-sm font-semibold text-blue-500">Vehicle Type</dt>
                <dd className="mt-1 text-lg text-blue-900 font-medium">{bluebook.vehicleType}</dd>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-5 animate-fade-in-up delay-100">
                <dt className="text-sm font-semibold text-blue-500">Registration Date</dt>
                <dd className="mt-1 text-lg text-blue-900 font-medium">{formatDate(bluebook.VehicleRegistrationDate)}</dd>
              </div>
              <div className="bg-white px-6 py-5 animate-fade-in-up delay-150">
                <dt className="text-sm font-semibold text-blue-500">Owner Name</dt>
                <dd className="mt-1 text-lg text-blue-900 font-medium">{bluebook.vehicleOwnerName}</dd>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-5 animate-fade-in-up delay-200">
                <dt className="text-sm font-semibold text-blue-500">Vehicle Model</dt>
                <dd className="mt-1 text-lg text-blue-900 font-medium">{bluebook.vehicleModel}</dd>
              </div>
              <div className="bg-white px-6 py-5 animate-fade-in-up delay-250">
                <dt className="text-sm font-semibold text-blue-500">Manufacture Year</dt>
                <dd className="mt-1 text-lg text-blue-900 font-medium">{bluebook.manufactureYear}</dd>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-5 animate-fade-in-up delay-300">
                <dt className="text-sm font-semibold text-blue-500">Chassis Number</dt>
                <dd className="mt-1 text-lg text-blue-900 font-medium">{bluebook.chasisNumber}</dd>
              </div>
              <div className="bg-white px-6 py-5 animate-fade-in-up delay-350">
                <dt className="text-sm font-semibold text-blue-500">Vehicle Color</dt>
                <dd className="mt-1 text-lg text-blue-900 font-medium">{bluebook.vehicleColor}</dd>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-5 animate-fade-in-up delay-400">
                <dt className="text-sm font-semibold text-blue-500">Engine CC</dt>
                <dd className="mt-1 text-lg text-blue-900 font-medium">{bluebook.vehicleEngineCC} cc</dd>
              </div>
              <div className="bg-white px-6 py-5 animate-fade-in-up delay-450">
                <dt className="text-sm font-semibold text-blue-500">Vehicle Number</dt>
                <dd className="mt-1 text-lg text-blue-900 font-medium">{bluebook.vehicleNumber}</dd>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-5 animate-fade-in-up delay-500">
                <dt className="text-sm font-semibold text-blue-500">Tax Pay Date</dt>
                <dd className="mt-1 text-lg text-blue-900 font-medium">{formatDate(bluebook.taxPayDate)}</dd>
              </div>
              <div className="bg-white px-6 py-5 animate-fade-in-up delay-550">
                <dt className="text-sm font-semibold text-blue-500">Tax Expire Date</dt>
                <dd className="mt-1 text-lg font-medium">
                  <span className={isExpired(bluebook.taxExpireDate) ? 'text-red-600 font-bold' : 'text-blue-900'}>
                    {formatDate(bluebook.taxExpireDate)}
                  </span>
                </dd>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-5 animate-fade-in-up delay-600">
                <dt className="text-sm font-semibold text-blue-500">Created Date</dt>
                <dd className="mt-1 text-lg text-blue-900 font-medium">{formatDate(bluebook.createdAt)}</dd>
              </div>
              <div className="bg-white px-6 py-5 animate-fade-in-up delay-650">
                <dt className="text-sm font-semibold text-blue-500">Last Updated</dt>
                <dd className="mt-1 text-lg text-blue-900 font-medium">{formatDate(bluebook.updatedAt)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      {/* Animations */}
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both;
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.8s cubic-bezier(.4,0,.2,1) both;
          }
          .animate-fade-in-up.delay-50 { animation-delay: .05s; }
          .animate-fade-in-up.delay-100 { animation-delay: .1s; }
          .animate-fade-in-up.delay-150 { animation-delay: .15s; }
          .animate-fade-in-up.delay-200 { animation-delay: .2s; }
          .animate-fade-in-up.delay-250 { animation-delay: .25s; }
          .animate-fade-in-up.delay-300 { animation-delay: .3s; }
          .animate-fade-in-up.delay-350 { animation-delay: .35s; }
          .animate-fade-in-up.delay-400 { animation-delay: .4s; }
          .animate-fade-in-up.delay-450 { animation-delay: .45s; }
          .animate-fade-in-up.delay-500 { animation-delay: .5s; }
          .animate-fade-in-up.delay-550 { animation-delay: .55s; }
          .animate-fade-in-up.delay-600 { animation-delay: .6s; }
          .animate-fade-in-up.delay-650 { animation-delay: .65s; }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
}

export default BluebookDetail; 