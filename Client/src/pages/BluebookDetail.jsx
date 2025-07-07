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
                <h1 className="text-3xl font-bold text-gray-900">Bluebook Details</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Vehicle registration information
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge(bluebook.status)}
              {isExpired(bluebook.taxExpireDate) && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  <FaTimesCircle className="mr-2" />
                  Tax Expired
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bluebook Information */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Vehicle Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Registration number: {bluebook.vehicleRegNo}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownload(bluebook._id)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nepal-blue"
                >
                  <FaDownload className="mr-2" />
                  Download
                </button>
                {(isExpired(bluebook.taxExpireDate) || getDaysUntilExpiry(bluebook.taxExpireDate) <= 30) && (
                  <button
                    onClick={() => navigate(`/payment/${bluebook._id}`)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <FaCreditCard className="mr-2" />
                    Pay Tax
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Registration Number</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{bluebook.vehicleRegNo}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Vehicle Type</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{bluebook.vehicleType}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Registration Date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(bluebook.VehicleRegistrationDate)}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Owner Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{bluebook.vehicleOwnerName}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Vehicle Model</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{bluebook.vehicleModel}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Manufacture Year</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{bluebook.manufactureYear}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Chassis Number</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{bluebook.chasisNumber}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Vehicle Color</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{bluebook.vehicleColor}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Engine CC</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{bluebook.vehicleEngineCC} cc</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Vehicle Number</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{bluebook.vehicleNumber}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Tax Pay Date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(bluebook.taxPayDate)}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Tax Expire Date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className={isExpired(bluebook.taxExpireDate) ? 'text-red-600 font-medium' : ''}>
                    {formatDate(bluebook.taxExpireDate)}
                  </span>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Created Date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(bluebook.createdAt)}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(bluebook.updatedAt)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BluebookDetail; 