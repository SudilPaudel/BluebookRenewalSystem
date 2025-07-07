import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaIdCard, FaEdit, FaSave, FaTimes, FaCamera, FaArrowLeft, FaShieldAlt, FaUserTag } from "react-icons/fa";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    citizenshipNo: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.result);
        setFormData({
          name: data.result.name,
          email: data.result.email,
          citizenshipNo: data.result.citizenshipNo
        });
      } else {
        setError(data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('An error occurred while fetching profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: user.name,
      email: user.email,
      citizenshipNo: user.citizenshipNo
    });
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.result);
        setEditing(false);
        setSuccess('Profile updated successfully!');
        setError("");
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('An error occurred while updating profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-nepal-blue border-t-transparent"></div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Error</h3>
                <p className="text-gray-600">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-6 p-3 text-gray-500 hover:text-gray-700 hover:bg-white rounded-full transition-all duration-200 shadow-sm"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
                <p className="text-gray-600 text-lg">
                  Manage your account information and preferences
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {!editing ? (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-nepal-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nepal-blue transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FaEdit className="mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <FaSave className="mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nepal-blue transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <FaTimes className="mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaSave className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{success}</p>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaTimes className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header with Picture */}
          <div className="bg-gradient-to-r from-nepal-blue to-blue-600 px-8 py-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {user?.image ? (
                  <img 
                    src={`${import.meta.env.VITE_API_URL}/public/uploads/users/${user.image}`}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center border-4 border-white shadow-lg">
                    <FaUser className="h-12 w-12 text-white" />
                  </div>
                )}
              </div>
              <div className="ml-6">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {user?.name || 'User Name'}
                </h2>
                <p className="text-blue-100 text-lg">{user?.email}</p>
                <div className="flex items-center mt-3 space-x-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    user?.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <FaShieldAlt className="mr-1" />
                    {user?.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <FaUserTag className="mr-1" />
                    {user?.role?.toUpperCase() || 'USER'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="px-8 py-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h3>
            
            <div className="space-y-6">
              {/* Full Name */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <FaUser className="h-5 w-5 text-nepal-blue mr-3" />
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Full Name
                  </label>
                </div>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue focus:border-transparent text-gray-900 bg-white"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-lg text-gray-900 font-medium">{user?.name || 'N/A'}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <FaEnvelope className="h-5 w-5 text-nepal-blue mr-3" />
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Email Address
                  </label>
                </div>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue focus:border-transparent text-gray-900 bg-white"
                    placeholder="Enter your email address"
                  />
                ) : (
                  <p className="text-lg text-gray-900 font-medium">{user?.email || 'N/A'}</p>
                )}
              </div>

              {/* Citizenship Number */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <FaIdCard className="h-5 w-5 text-nepal-blue mr-3" />
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Citizenship Number
                  </label>
                </div>
                {editing ? (
                  <input
                    type="text"
                    name="citizenshipNo"
                    value={formData.citizenshipNo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue focus:border-transparent text-gray-900 bg-white"
                    placeholder="Enter your citizenship number"
                  />
                ) : (
                  <p className="text-lg text-gray-900 font-medium">{user?.citizenshipNo || 'N/A'}</p>
                )}
              </div>

              {/* Passport Size Photo Section */}
              {user?.image ? (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <FaCamera className="h-6 w-6 text-nepal-blue mr-3" />
                    <label className="text-lg font-bold text-gray-800">
                      Passport Size Photo
                    </label>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    {/* Photo Display */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img 
                          src={`${import.meta.env.VITE_API_URL}/public/uploads/users/${user.image}`}
                          alt="Passport Size Photo"
                          className="h-32 w-24 rounded-lg object-cover border-4 border-white shadow-lg"
                          style={{ aspectRatio: '3/4' }}
                          onError={(e) => {
                            console.error('Image failed to load:', e.target.src);
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div 
                          className="h-32 w-24 rounded-lg border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center text-gray-500 text-xs"
                          style={{ display: 'none', aspectRatio: '3/4' }}
                        >
                          Image Failed to Load
                        </div>
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          ✓ Verified
                        </div>
                      </div>
                    </div>
                    
                    {/* Photo Information */}
                    <div className="flex-1">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Photo Details</h4>
                          <p className="text-sm text-gray-600">
                            This passport-size photo was uploaded during your account registration and meets our requirements.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Format</p>
                            <p className="text-sm font-semibold text-gray-900">Passport Size (3:4)</p>
                          </div>
                          
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Upload Date</p>
                            <p className="text-sm font-semibold text-gray-900">Registration</p>
                          </div>
                          
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</p>
                            <p className="text-sm font-semibold text-green-600">✓ Approved</p>
                          </div>
                          
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Usage</p>
                            <p className="text-sm font-semibold text-gray-900">Account Profile</p>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <p className="text-xs font-medium text-blue-800 mb-1">Photo Requirements Met:</p>
                          <ul className="text-xs text-blue-700 space-y-1">
                            <li>• Passport-size dimensions (3:4 aspect ratio)</li>
                            <li>• Clear, high-quality image</li>
                            <li>• Proper lighting and background</li>
                            <li>• File size under 2MB</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <FaCamera className="h-6 w-6 text-gray-500 mr-3" />
                    <label className="text-lg font-bold text-gray-600">
                      No Passport Photo Uploaded
                    </label>
                  </div>
                  <div className="text-center py-8">
                    <div className="h-32 w-24 mx-auto rounded-lg border-4 border-gray-300 bg-gray-100 flex items-center justify-center">
                      <FaUser className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mt-4">No passport-size photo has been uploaded yet.</p>
                    <p className="text-sm text-gray-500">Photos are uploaded during account registration.</p>
                  </div>
                </div>
              )}

              {/* Profile Picture Section - Show for both cases */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <FaCamera className="h-5 w-5 text-nepal-blue mr-3" />
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Profile Picture
                  </label>
                </div>
                <div className="flex items-center space-x-4">
                  {user?.image ? (
                    <img 
                      src={`${import.meta.env.VITE_API_URL}/public/uploads/users/${user.image}`}
                      alt="Profile"
                      className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
                      onError={(e) => {
                        console.error('Profile image failed to load:', e.target.src);
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`h-20 w-20 rounded-full border-2 border-gray-200 bg-gray-100 flex items-center justify-center ${user?.image ? 'hidden' : ''}`}
                  >
                    <FaUser className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {user?.image ? 'Uploaded during registration' : 'No profile picture uploaded'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.image ? 'This image was uploaded when you created your account' : 'Profile pictures are uploaded during account registration'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 