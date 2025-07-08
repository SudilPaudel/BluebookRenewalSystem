import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCar, FaFileAlt, FaClock, FaCheckCircle, FaTimesCircle, FaPlus, FaSearch, FaDownload, FaEdit, FaTrash, FaMotorcycle } from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bluebooks, setBluebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    expired: 0
  });

  useEffect(() => {
    checkAuth();
    fetchUserBluebooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = () => {
    const userDetail = localStorage.getItem('userDetail');
    const token = localStorage.getItem('accessToken');
    
    if (!userDetail || !token) {
      navigate('/login');
      return;
    }

    try {
      setUser(JSON.parse(userDetail));
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  };

  const fetchUserBluebooks = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/bluebook/my-bluebooks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBluebooks(data.result || []);
        
        // Calculate stats
        const total = data.result?.length || 0;
        const pending = data.result?.filter(bb => bb.status === 'pending').length || 0;
        const verified = data.result?.filter(bb => bb.status === 'verified').length || 0;
        const expired = data.result?.filter(bb => {
          if (bb.taxExpireDate) {
            return new Date(bb.taxExpireDate) < new Date();
          }
          return false;
        }).length || 0;

        setStats({ total, pending, verified, expired });
      }
    } catch (error) {
      console.error('Error fetching bluebooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/bluebook/${id}/download`, {
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
        console.error('Failed to download bluebook');
      }
    } catch (error) {
      console.error('Error downloading bluebook:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FaCheckCircle className="mr-1" />
          Verified
        </span>;
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <FaClock className="mr-1" />
          Pending
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Unknown
        </span>;
    }
  };

  const isExpired = (expireDate) => {
    if (!expireDate) return false;
    return new Date(expireDate) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nepal-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur shadow-md border-b sticky top-0 z-10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8 animate-fade-in-down">
            <div>
              <h1 className="text-4xl font-extrabold text-nepal-blue tracking-tight drop-shadow-sm">Dashboard</h1>
              <p className="mt-2 text-base text-gray-500 font-medium">
                Welcome back, <span className="text-nepal-blue font-semibold">{user?.name || 'User'}</span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/bluebook/new')}
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-semibold rounded-lg shadow-lg text-white bg-gradient-to-r from-nepal-blue to-blue-500 hover:scale-105 hover:from-blue-700 hover:to-nepal-blue transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nepal-blue"
              >
                <FaPlus className="mr-2 animate-bounce" />
                New Bluebook
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="bg-white/90 shadow-xl rounded-2xl p-6 flex items-center space-x-4 hover:scale-105 transition-transform duration-200 animate-fade-in-up">
            <div className="flex-shrink-0 bg-nepal-blue/10 rounded-full p-3">
              <FaCar className="h-7 w-7 text-nepal-blue" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500">Total Bluebooks</div>
              <div className="text-2xl font-bold text-nepal-blue">{stats.total}</div>
            </div>
          </div>
          <div className="bg-white/90 shadow-xl rounded-2xl p-6 flex items-center space-x-4 hover:scale-105 transition-transform duration-200 animate-fade-in-up delay-75">
            <div className="flex-shrink-0 bg-yellow-400/10 rounded-full p-3">
              <FaClock className="h-7 w-7 text-yellow-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500">Pending</div>
              <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
            </div>
          </div>
          <div className="bg-white/90 shadow-xl rounded-2xl p-6 flex items-center space-x-4 hover:scale-105 transition-transform duration-200 animate-fade-in-up delay-150">
            <div className="flex-shrink-0 bg-green-400/10 rounded-full p-3">
              <FaCheckCircle className="h-7 w-7 text-green-500" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500">Verified</div>
              <div className="text-2xl font-bold text-green-500">{stats.verified}</div>
            </div>
          </div>
          <div className="bg-white/90 shadow-xl rounded-2xl p-6 flex items-center space-x-4 hover:scale-105 transition-transform duration-200 animate-fade-in-up delay-200">
            <div className="flex-shrink-0 bg-red-400/10 rounded-full p-3">
              <FaTimesCircle className="h-7 w-7 text-red-500" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500">Expired</div>
              <div className="text-2xl font-bold text-red-500">{stats.expired}</div>
            </div>
          </div>
        </div>

        {/* Bluebooks Table */}
        <div className="bg-white/90 shadow-2xl rounded-2xl overflow-hidden animate-fade-in-up">
          <div className="px-6 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-nepal-blue">My Bluebooks</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Manage your vehicle bluebook registrations
                </p>
              </div>
              <div className="flex space-x-2"></div>
            </div>
          </div>

          {bluebooks.length === 0 ? (
            <div className="text-center py-16 animate-fade-in-up">
              <FaFileAlt className="mx-auto h-14 w-14 text-gray-300 animate-pulse" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No bluebooks</h3>
              <p className="mt-2 text-base text-gray-500">
                Get started by creating a new bluebook registration.
              </p>
              <div className="mt-8">
                <button
                  onClick={() => navigate('/bluebook/new')}
                  className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-lg text-base font-semibold rounded-lg text-white bg-gradient-to-r from-nepal-blue to-blue-500 hover:scale-105 hover:from-blue-700 hover:to-nepal-blue transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nepal-blue"
                >
                  <FaPlus className="mr-2 animate-bounce" />
                  New Bluebook
                </button>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {bluebooks.map((bluebook, idx) => (
                <li
                  key={bluebook._id}
                  className="px-6 py-6 hover:bg-blue-50/60 transition-colors duration-200 group animate-fade-in-up"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {bluebook.vehicleType === "Car" ? (
                          <FaCar className="h-10 w-10 text-nepal-blue drop-shadow group-hover:scale-110 transition-transform duration-200" />
                        ) : (
                          <FaMotorcycle className="h-10 w-10 text-nepal-blue drop-shadow group-hover:scale-110 transition-transform duration-200" />
                        )}
                      </div>
                      <div className="ml-6">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-lg font-bold text-gray-900 group-hover:text-nepal-blue transition-colors duration-200">
                            {bluebook.vehicleOwnerName}
                          </h4>
                          {getStatusBadge(bluebook.status)}
                          {isExpired(bluebook.taxExpireDate) && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 animate-pulse">
                              Expired
                            </span>
                          )}
                        </div>
                        <div className="mt-2 text-sm text-gray-500 space-x-2">
                          <span className="font-medium">Reg No:</span> {bluebook.vehicleRegNo}
                          <span className="font-medium">| Model:</span> {bluebook.vehicleModel}
                          <span className="font-medium">| Number:</span> {bluebook.vehicleNumber}
                        </div>
                        <div className="mt-1 text-sm text-gray-400">
                          <span className="font-medium">Tax Expires:</span> {formatDate(bluebook.taxExpireDate)}
                          <span className="font-medium ml-2">| Created:</span> {formatDate(bluebook.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/bluebook/${bluebook._id}`)}
                        className="inline-flex items-center px-4 py-2 border border-gray-200 shadow-sm text-sm font-semibold rounded-lg text-nepal-blue bg-white hover:bg-nepal-blue hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nepal-blue"
                      >
                        <FaEdit className="mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleDownload(bluebook._id)}
                        className="inline-flex items-center px-4 py-2 border border-gray-200 shadow-sm text-sm font-semibold rounded-lg text-nepal-blue bg-white hover:bg-nepal-blue hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nepal-blue"
                      >
                        <FaDownload className="mr-1" />
                        Download
                      </button>
                      {isExpired(bluebook.taxExpireDate) && (
                        <button
                          onClick={() => navigate(`/payment/${bluebook._id}`)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <FaFileAlt className="mr-1" />
                          Pay Tax
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white/90 shadow-xl rounded-2xl overflow-hidden animate-fade-in-up">
          <div className="px-6 py-6 bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
            <h3 className="text-xl font-bold text-nepal-blue">Quick Actions</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Common tasks and shortcuts
            </p>
          </div>
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => navigate('/bluebook/new')}
                className="flex items-center justify-center px-6 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-nepal-blue to-blue-500 shadow-lg hover:scale-105 hover:from-blue-700 hover:to-nepal-blue transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nepal-blue"
              >
                <FaPlus className="mr-2 animate-bounce" />
                Register New Bluebook
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center justify-center px-6 py-4 border border-gray-200 text-base font-semibold rounded-xl text-nepal-blue bg-white shadow-lg hover:bg-nepal-blue hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nepal-blue"
              >
                <FaFileAlt className="mr-2" />
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          .animate-fade-in-up {
            animation: fadeInUp 0.7s cubic-bezier(0.23, 1, 0.32, 1) both;
          }
          .animate-fade-in-down {
            animation: fadeInDown 0.7s cubic-bezier(0.23, 1, 0.32, 1) both;
          }
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(40px);}
            100% { opacity: 1; transform: translateY(0);}
          }
          @keyframes fadeInDown {
            0% { opacity: 0; transform: translateY(-40px);}
            100% { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
}

export default Dashboard; 