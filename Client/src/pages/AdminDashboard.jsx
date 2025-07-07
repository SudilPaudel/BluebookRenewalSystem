import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUsers, 
  FaCar, 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle, 
  FaShieldAlt, 
  FaChartBar, 
  FaEye, 
  FaEdit, 
  FaToggleOn, 
  FaToggleOff,
  FaDownload,
  FaSearch,
  FaFilter,
  FaMoneyBillWave,
  FaFileAlt,
  FaCog,
  FaTrash,
  FaBan,
  FaUserPlus,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaNewspaper,
  FaPlus,
  FaImage
} from "react-icons/fa";
import fallbackNews from "../assets/news1.jpeg"; 

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [bluebooks, setBluebooks] = useState([]);
  const [pendingBluebooks, setPendingBluebooks] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalBluebooks: 0,
    pendingBluebooks: 0,
    verifiedBluebooks: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [payments, setPayments] = useState([]);
  const [reports, setReports] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    citizenshipNo: '',
    role: 'user',
    status: 'active'
  });
  const [showEditBluebookModal, setShowEditBluebookModal] = useState(false);
  const [editingBluebook, setEditingBluebook] = useState(null);
  const [editBluebookFormData, setEditBluebookFormData] = useState({
    vehicleRegNo: '',
    vehicleOwnerName: '',
    vehicleType: '',
    vehicleModel: '',
    manufactureYear: '',
    chasisNumber: '',
    vehicleColor: '',
    vehicleEngineCC: '',
    vehicleNumber: '',
    status: 'pending',
    VehicleRegistrationDate: '',
    taxPayDate: '',
    taxExpireDate: ''
  });
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [createAdminForm, setCreateAdminForm] = useState({ name: '', email: '', password: '' });
  const [createAdminLoading, setCreateAdminLoading] = useState(false);
  const [createAdminError, setCreateAdminError] = useState('');
  const [createAdminSuccess, setCreateAdminSuccess] = useState('');
  
  // News management state
  const [news, setNews] = useState([]);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    status: 'draft',
    priority: 1,
    tags: []
  });
  const [newsImage, setNewsImage] = useState(null);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState('');
  const [newsSuccess, setNewsSuccess] = useState('');
  const [editingNews, setEditingNews] = useState(null);
  const [showDeleteNewsModal, setShowDeleteNewsModal] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);

  useEffect(() => {
    checkAuth();
    fetchDashboardData();
  }, []);

  const checkAuth = () => {
    const userDetail = localStorage.getItem('userDetail');
    const token = localStorage.getItem('accessToken');
    
    if (!userDetail || !token) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(userDetail);
      if (userData.role !== 'admin') {
        navigate('/dashboard');
        return;
      }
      setUser(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      // Fetch users
      const usersResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.result || []);
        setStats(prev => ({
          ...prev,
          totalUsers: usersData.meta?.total || 0,
          activeUsers: usersData.meta?.active || 0
        }));
      }

      // Fetch all bluebooks
      const bluebooksResponse = await fetch(`${import.meta.env.VITE_API_URL}/bluebook/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (bluebooksResponse.ok) {
        const bluebooksData = await bluebooksResponse.json();
        setBluebooks(bluebooksData.result || []);
        setStats(prev => ({
          ...prev,
          totalBluebooks: bluebooksData.meta?.total || 0,
          pendingBluebooks: bluebooksData.meta?.pending || 0,
          verifiedBluebooks: bluebooksData.meta?.verified || 0
        }));
      }

      // Fetch pending bluebooks
      const pendingResponse = await fetch(`${import.meta.env.VITE_API_URL}/bluebook/admin/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (pendingResponse.ok) {
        const pendingData = await pendingResponse.json();
        setPendingBluebooks(pendingData.result || []);
      }

      // Fetch payments
      const paymentsResponse = await fetch(`${import.meta.env.VITE_API_URL}/admin/payments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        setPayments(paymentsData.result || []);
      }

      // Fetch news
      const newsResponse = await fetch(`${import.meta.env.VITE_API_URL}/news`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (newsResponse.ok) {
        const newsData = await newsResponse.json();
        setNews(newsData.result || []);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyBluebook = async (bluebookId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/bluebook/${bluebookId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Bluebook verified successfully!');
        fetchDashboardData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to verify bluebook');
      }
    } catch (error) {
      console.error('Error verifying bluebook:', error);
      alert('An error occurred while verifying bluebook');
    }
  };

  const handleUpdateUserStatus = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        alert(`User status updated to ${newStatus} successfully!`);
        fetchDashboardData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('An error occurred while updating user status');
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
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <FaTimesCircle className="mr-1" />
          Rejected
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Unknown
        </span>;
    }
  };

  const getUserStatusBadge = (status) => {
    return status === 'active' ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <FaCheckCircle className="mr-1" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <FaTimesCircle className="mr-1" />
        Inactive
      </span>
    );
  };

  const getUserRoleBadge = (role) => {
    return role === 'admin' ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        <FaShieldAlt className="mr-1" />
        Admin
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <FaUsers className="mr-1" />
        User
      </span>
    );
  };

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      citizenshipNo: user.citizenshipNo,
      role: user.role,
      status: user.status
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/admin/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        alert('User updated successfully!');
        fetchDashboardData(); // Refresh data
        setShowEditModal(false);
        setEditingUser(null);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('An error occurred while updating user');
    }
  };

  const handleEditBluebook = (bluebook) => {
    setEditingBluebook(bluebook);
    setEditBluebookFormData({
      vehicleRegNo: bluebook.vehicleRegNo || '',
      vehicleOwnerName: bluebook.vehicleOwnerName || '',
      vehicleType: bluebook.vehicleType || '',
      vehicleModel: bluebook.vehicleModel || '',
      manufactureYear: bluebook.manufactureYear || '',
      chasisNumber: bluebook.chasisNumber || '',
      vehicleColor: bluebook.vehicleColor || '',
      vehicleEngineCC: bluebook.vehicleEngineCC || '',
      vehicleNumber: bluebook.vehicleNumber || '',
      status: bluebook.status || 'pending',
      VehicleRegistrationDate: bluebook.VehicleRegistrationDate ? bluebook.VehicleRegistrationDate.slice(0,10) : '',
      taxPayDate: bluebook.taxPayDate ? bluebook.taxPayDate.slice(0,10) : '',
      taxExpireDate: bluebook.taxExpireDate ? bluebook.taxExpireDate.slice(0,10) : ''
    });
    setShowEditBluebookModal(true);
  };

  const handleEditBluebookFormChange = (e) => {
    const { name, value } = e.target;
    setEditBluebookFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateBluebook = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/bluebook/admin/${editingBluebook._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editBluebookFormData)
      });

      if (response.ok) {
        alert('Bluebook updated successfully!');
        fetchDashboardData(); // Refresh data
        setShowEditBluebookModal(false);
        setEditingBluebook(null);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update bluebook');
      }
    } catch (error) {
      console.error('Error updating bluebook:', error);
      alert('An error occurred while updating bluebook');
    }
  };

  const confirmDeleteUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/admin/users/${userToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('User deleted successfully!');
        fetchDashboardData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting user');
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleRejectBluebook = async (bluebookId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/bluebook/${bluebookId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Bluebook rejected successfully!');
        fetchDashboardData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to reject bluebook');
      }
    } catch (error) {
      console.error('Error rejecting bluebook:', error);
      alert('An error occurred while rejecting bluebook');
    }
  };

  const generateReport = async (reportType) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/reports/${reportType}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        alert(`${reportType} report generated successfully!`);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('An error occurred while generating report. Please try again.');
    }
  };

  const handleCreateAdminFormChange = (e) => {
    const { name, value } = e.target;
    setCreateAdminForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateAdmin = async () => {
    setCreateAdminLoading(true);
    setCreateAdminError('');
    setCreateAdminSuccess('');
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/admin/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createAdminForm)
      });
      const data = await response.json();
      if (response.ok) {
        setCreateAdminSuccess('Admin created successfully!');
        setCreateAdminForm({ name: '', email: '', password: '' });
        fetchDashboardData();
        setTimeout(() => {
          setShowCreateAdminModal(false);
          setCreateAdminSuccess('');
        }, 1200);
      } else {
        setCreateAdminError(data.message || 'Failed to create admin');
      }
    } catch (error) {
      setCreateAdminError('An error occurred while creating admin');
    } finally {
      setCreateAdminLoading(false);
    }
  };

  // News management functions
  const handleNewsFormChange = (e) => {
    const { name, value } = e.target;
    setNewsForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewsImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewsImage(file);
    }
  };

  const handleCreateNews = async () => {
    setNewsLoading(true);
    setNewsError('');
    setNewsSuccess('');
    
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      
      // Append form data
      Object.keys(newsForm).forEach(key => {
        if (key === 'tags') {
          formData.append(key, JSON.stringify(newsForm[key]));
        } else {
          formData.append(key, newsForm[key]);
        }
      });
      
      // Append image if selected
      if (newsImage) {
        formData.append('image', newsImage);
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/news`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setNewsSuccess('News article created successfully!');
        setNewsForm({
          title: '',
          content: '',
          status: 'draft',
          priority: 1,
          tags: []
        });
        setNewsImage(null);
        fetchDashboardData();
        setTimeout(() => {
          setShowNewsModal(false);
          setNewsSuccess('');
        }, 1200);
      } else {
        setNewsError(data.message || 'Failed to create news article');
      }
    } catch (error) {
      setNewsError('An error occurred while creating news article');
    } finally {
      setNewsLoading(false);
    }
  };

  const handleEditNews = (newsItem) => {
    setEditingNews(newsItem);
    setNewsForm({
      title: newsItem.title,
      content: newsItem.content,
      status: newsItem.status,
      priority: newsItem.priority,
      tags: newsItem.tags || []
    });
    setShowNewsModal(true);
  };

  const handleUpdateNews = async () => {
    setNewsLoading(true);
    setNewsError('');
    setNewsSuccess('');
    
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      
      // Append form data
      Object.keys(newsForm).forEach(key => {
        if (key === 'tags') {
          formData.append(key, JSON.stringify(newsForm[key]));
        } else {
          formData.append(key, newsForm[key]);
        }
      });
      
      // Append image if selected
      if (newsImage) {
        formData.append('image', newsImage);
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/news/${editingNews._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setNewsSuccess('News article updated successfully!');
        setNewsForm({
          title: '',
          content: '',
          status: 'draft',
          priority: 1,
          tags: []
        });
        setNewsImage(null);
        setEditingNews(null);
        fetchDashboardData();
        setTimeout(() => {
          setShowNewsModal(false);
          setNewsSuccess('');
        }, 1200);
      } else {
        setNewsError(data.message || 'Failed to update news article');
      }
    } catch (error) {
      setNewsError('An error occurred while updating news article');
    } finally {
      setNewsLoading(false);
    }
  };

  const handleDeleteNews = (newsItem) => {
    setNewsToDelete(newsItem);
    setShowDeleteNewsModal(true);
  };

  const confirmDeleteNews = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/news/${newsToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setNewsSuccess('News article deleted successfully!');
        fetchDashboardData();
        setTimeout(() => {
          setShowDeleteNewsModal(false);
          setNewsToDelete(null);
          setNewsSuccess('');
        }, 1200);
      } else {
        const data = await response.json();
        setNewsError(data.message || 'Failed to delete news article');
      }
    } catch (error) {
      setNewsError('An error occurred while deleting news article');
    }
  };

  const handleUpdateNewsStatus = async (newsId, newStatus) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/news/${newsId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      console.log(response);
      if (response.ok) {
        fetchDashboardData();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update news status');
      }
    } catch (error) {
      alert('An error occurred while updating news status');
    }
  };

  const getNewsStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', text: 'Active' },
      inactive: { color: 'bg-red-100 text-red-800', text: 'Inactive' },
      draft: { color: 'bg-yellow-100 text-yellow-800', text: 'Draft' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nepal-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {user?.name || 'Admin'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <FaUsers className="mr-2" />
                User Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaUsers className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalUsers}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaCheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.activeUsers}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaCar className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Bluebooks</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalBluebooks}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaClock className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.pendingBluebooks}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaCheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Verified</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.verifiedBluebooks}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-nepal-blue text-nepal-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaChartBar className="inline mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-nepal-blue text-nepal-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaUsers className="inline mr-2" />
                Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-nepal-blue text-nepal-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaClock className="inline mr-2" />
                Pending Verification ({pendingBluebooks.length})
              </button>
              <button
                onClick={() => setActiveTab('bluebooks')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bluebooks'
                    ? 'border-nepal-blue text-nepal-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaCar className="inline mr-2" />
                All Bluebooks ({bluebooks.length})
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'payments'
                    ? 'border-nepal-blue text-nepal-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaMoneyBillWave className="inline mr-2" />
                Payments ({payments.length})
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reports'
                    ? 'border-nepal-blue text-nepal-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaFileAlt className="inline mr-2" />
                Reports
              </button>
              <button
                onClick={() => setActiveTab('news')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'news'
                    ? 'border-nepal-blue text-nepal-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaNewspaper className="inline mr-2" />
                News ({news.length})
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-nepal-blue text-nepal-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaCog className="inline mr-2" />
                Settings
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Pending Bluebooks</h3>
                    <div className="space-y-3">
                      {pendingBluebooks.slice(0, 5).map((bluebook) => (
                        <div key={bluebook._id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                          <div>
                            <p className="font-medium text-gray-900">{bluebook.vehicleRegNo}</p>
                            <p className="text-sm text-gray-500">{bluebook.vehicleOwnerName}</p>
                          </div>
                          <button
                            onClick={() => handleVerifyBluebook(bluebook._id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-nepal-blue hover:bg-blue-700"
                          >
                            <FaCheckCircle className="mr-1" />
                            Verify
                          </button>
                        </div>
                      ))}
                      {pendingBluebooks.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No pending bluebooks</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Users</h3>
                    <div className="space-y-3">
                      {users.slice(0, 5).map((user) => (
                        <div key={user._id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getUserStatusBadge(user.status)}
                            {getUserRoleBadge(user.role)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowCreateAdminModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-nepal-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nepal-blue"
                  >
                    <FaUserPlus className="mr-2" />
                    Create Admin
                  </button>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nepal-blue"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nepal-blue"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <li key={user._id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {user.image ? (
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={`${import.meta.env.VITE_API_URL}/public/uploads/users/${user.image}`}
                                  alt={user.name}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <FaUsers className="h-5 w-5 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              <div className="text-sm text-gray-500">Citizenship: {user.citizenshipNo}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              {getUserStatusBadge(user.status)}
                              {getUserRoleBadge(user.role)}
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewUserDetails(user)}
                                className="inline-flex items-center px-2 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                              >
                                <FaEye className="mr-1" />
                                View
                              </button>
                              <button
                                onClick={() => handleEditUser(user)}
                                className="inline-flex items-center px-2 py-1 border border-gray-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                              >
                                <FaEdit className="mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleUpdateUserStatus(user._id, user.status === 'active' ? 'inactive' : 'active')}
                                className={`inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md ${
                                  user.status === 'active'
                                    ? 'text-red-700 bg-red-100 hover:bg-red-200'
                                    : 'text-green-700 bg-green-100 hover:bg-green-200'
                                }`}
                              >
                                {user.status === 'active' ? <FaToggleOff className="mr-1" /> : <FaToggleOn className="mr-1" />}
                                {user.status === 'active' ? 'Deactivate' : 'Activate'}
                              </button>
                              {user.role !== 'admin' && (
                                <button
                                  onClick={() => handleDeleteUser(user)}
                                  className="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                                >
                                  <FaTrash className="mr-1" />
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Pending Bluebooks Tab */}
            {activeTab === 'pending' && (
              <div className="space-y-4">
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {pendingBluebooks.map((bluebook) => (
                      <li key={bluebook._id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                <FaCar className="h-6 w-6 text-yellow-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{bluebook.vehicleRegNo}</div>
                              <div className="text-sm text-gray-500">{bluebook.vehicleOwnerName}</div>
                              <div className="text-sm text-gray-500">{bluebook.vehicleType} - {bluebook.vehicleModel}</div>
                              <div className="text-sm text-gray-500">Created: {formatDate(bluebook.createdAt)}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            {getStatusBadge(bluebook.status)}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditBluebook(bluebook)}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                              >
                                <FaEdit className="mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleVerifyBluebook(bluebook._id)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-nepal-blue hover:bg-blue-700"
                              >
                                <FaCheckCircle className="mr-1" />
                                Verify
                              </button>
                              <button
                                onClick={() => handleRejectBluebook(bluebook._id)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                              >
                                <FaTimesCircle className="mr-1" />
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                    {pendingBluebooks.length === 0 && (
                      <li className="px-6 py-8 text-center text-gray-500">
                        No pending bluebooks to verify
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* All Bluebooks Tab */}
            {activeTab === 'bluebooks' && (
              <div className="space-y-4">
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {bluebooks.map((bluebook) => (
                      <li key={bluebook._id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                                bluebook.status === 'verified' ? 'bg-green-100' : 'bg-yellow-100'
                              }`}>
                                <FaCar className={`h-6 w-6 ${
                                  bluebook.status === 'verified' ? 'text-green-600' : 'text-yellow-600'
                                }`} />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{bluebook.vehicleRegNo}</div>
                              <div className="text-sm text-gray-500">{bluebook.vehicleOwnerName}</div>
                              <div className="text-sm text-gray-500">{bluebook.vehicleType} - {bluebook.vehicleModel}</div>
                              <div className="text-sm text-gray-500">Created: {formatDate(bluebook.createdAt)}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            {getStatusBadge(bluebook.status)}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditBluebook(bluebook)}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                              >
                                <FaEdit className="mr-1" />
                                Edit
                              </button>
                              {bluebook.status === 'pending' && (
                                <button
                                  onClick={() => handleVerifyBluebook(bluebook._id)}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-nepal-blue hover:bg-blue-700"
                                >
                                  <FaCheckCircle className="mr-1" />
                                  Verify
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Payment Transactions</h3>
                  <div className="flex items-center space-x-4">
                    <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nepal-blue">
                      <option value="all">All Payments</option>
                      <option value="successful">Successful</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-500">
                      <div>Transaction ID</div>
                      <div>User</div>
                      <div>Amount</div>
                      <div>Status</div>
                      <div>Date</div>
                      <div>Actions</div>
                    </div>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {payments.length > 0 ? (
                      payments.map((payment) => (
                        <li key={payment._id} className="px-6 py-4">
                          <div className="grid grid-cols-6 gap-4 items-center">
                            <div className="text-sm font-medium text-gray-900">{payment.transactionId}</div>
                            <div className="text-sm text-gray-500">{payment.userName}</div>
                            <div className="text-sm font-medium text-green-600">Rs. {payment.amount}</div>
                            <div className="text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                payment.status === 'successful' ? 'bg-green-100 text-green-800' :
                                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {payment.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">{formatDate(payment.createdAt)}</div>
                            <div className="flex items-center space-x-2">
                              <button className="text-nepal-blue hover:text-blue-700">
                                <FaEye className="h-4 w-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-700">
                                <FaDownload className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="px-6 py-8 text-center text-gray-500">
                        No payment transactions found
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FaUsers className="h-8 w-8 text-blue-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">User Report</h3>
                        <p className="text-sm text-gray-500">Generate comprehensive user statistics</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => generateReport('users')}
                        className="w-full bg-nepal-blue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                      >
                        Generate Report
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FaCar className="h-8 w-8 text-green-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Bluebook Report</h3>
                        <p className="text-sm text-gray-500">Generate bluebook application statistics</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => generateReport('bluebooks')}
                        className="w-full bg-nepal-blue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                      >
                        Generate Report
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FaMoneyBillWave className="h-8 w-8 text-yellow-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Payment Report</h3>
                        <p className="text-sm text-gray-500">Generate payment transaction reports</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => generateReport('payments')}
                        className="w-full bg-nepal-blue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                      >
                        Generate Report
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">System Analytics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
                      <div className="text-sm text-gray-600">Total Users</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.totalBluebooks}</div>
                      <div className="text-sm text-gray-600">Total Bluebooks</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{stats.pendingBluebooks}</div>
                      <div className="text-sm text-gray-600">Pending</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{payments.length}</div>
                      <div className="text-sm text-gray-600">Payments</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* News Tab */}
            {activeTab === 'news' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowNewsModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-nepal-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nepal-blue"
                  >
                    <FaPlus className="mr-2" />
                    Add News
                  </button>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {news.map((newsItem) => (
                      <li key={newsItem._id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 h-16 w-16">
                              {newsItem.image ? (
                                <img
                                  className="w-[400px] h-[250px] object-cover rounded-lg border border-gray-300"
                                  src={`${import.meta.env.VITE_API_URL}/public/uploads/news/${newsItem.image}`}
                                  alt={newsItem.title}
                                  onError={e => { e.target.onerror = null; e.target.src = fallbackNews; }}
                                />
                              ) : (
                                <img
                                  className="w-[400px] h-[250px] object-cover rounded-lg border border-gray-300"
                                  src="https://via.placeholder.com/400x250?text=No+Image"
                                  alt="No news image"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">{newsItem.title}</div>
                              <div className="text-sm text-gray-500 truncate">{newsItem.content.substring(0, 100)}...</div>
                              <div className="flex items-center space-x-2 mt-1">
                                {getNewsStatusBadge(newsItem.status)}
                                <span className="text-xs text-gray-500">Priority: {newsItem.priority}</span>
                                <span className="text-xs text-gray-500">Created: {formatDate(newsItem.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditNews(newsItem)}
                              className="inline-flex items-center px-2 py-1 border border-gray-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                            >
                              <FaEdit className="mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleUpdateNewsStatus(newsItem._id, newsItem.status === 'active' ? 'inactive' : 'active')}
                              className={`inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md ${
                                newsItem.status === 'active'
                                  ? 'text-red-700 bg-red-100 hover:bg-red-200'
                                  : 'text-green-700 bg-green-100 hover:bg-green-200'
                              }`}
                            >
                              {newsItem.status === 'active' ? <FaToggleOff className="mr-1" /> : <FaToggleOn className="mr-1" />}
                              {newsItem.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteNews(newsItem)}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                            >
                              <FaTrash className="mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                    {news.length === 0 && (
                      <li className="px-6 py-8 text-center text-gray-500">
                        No news articles found. Click "Add News" to create your first article.
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">System Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Auto-verify Bluebooks
                        </label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-nepal-blue focus:ring-nepal-blue border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-600">Enable automatic verification</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Notifications
                        </label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-nepal-blue focus:ring-nepal-blue border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-600">Send email notifications</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maintenance Mode
                        </label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-nepal-blue focus:ring-nepal-blue border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-600">Enable maintenance mode</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button className="bg-nepal-blue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
                        Save Settings
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                        <div className="flex items-center">
                          <FaUserPlus className="h-5 w-5 text-green-600 mr-3" />
                          <div>
                            <div className="font-medium text-gray-900">Create New Admin</div>
                            <div className="text-sm text-gray-500">Add a new administrator user</div>
                          </div>
                        </div>
                      </button>
                      <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                        <div className="flex items-center">
                          <FaExclamationTriangle className="h-5 w-5 text-yellow-600 mr-3" />
                          <div>
                            <div className="font-medium text-gray-900">System Backup</div>
                            <div className="text-sm text-gray-500">Create system backup</div>
                          </div>
                        </div>
                      </button>
                      <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                        <div className="flex items-center">
                          <FaCog className="h-5 w-5 text-blue-600 mr-3" />
                          <div>
                            <div className="font-medium text-gray-900">Database Maintenance</div>
                            <div className="text-sm text-gray-500">Optimize database performance</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Server Status</div>
                      <div className="text-sm text-green-600">Online</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Database Status</div>
                      <div className="text-sm text-green-600">Connected</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Last Backup</div>
                      <div className="text-sm text-gray-900">2 hours ago</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">System Version</div>
                      <div className="text-sm text-gray-900">v1.0.0</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">User Details</h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimesCircle className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  {selectedUser.image ? (
                    <img
                      className="h-16 w-16 rounded-full"
                      src={`${import.meta.env.VITE_API_URL}/public/uploads/users/${selectedUser.image}`}
                      alt={selectedUser.name}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                      <FaUsers className="h-8 w-8 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{selectedUser.name}</h4>
                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Citizenship: {selectedUser.citizenshipNo}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Joined: {formatDate(selectedUser.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <FaShieldAlt className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Role: {selectedUser.role}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCheckCircle className={`h-4 w-4 mr-2 ${selectedUser.status === 'active' ? 'text-green-400' : 'text-red-400'}`} />
                    <span className={`text-sm ${selectedUser.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                      Status: {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Bluebook Modal */}
      {showEditBluebookModal && editingBluebook && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-5 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Bluebook</h3>
                <button
                  onClick={() => setShowEditBluebookModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimesCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Registration No</label>
                  <input
                    type="text"
                    name="vehicleRegNo"
                    value={editBluebookFormData.vehicleRegNo}
                    onChange={handleEditBluebookFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nepal-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                  <input
                    type="text"
                    name="vehicleOwnerName"
                    value={editBluebookFormData.vehicleOwnerName}
                    onChange={handleEditBluebookFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nepal-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={editBluebookFormData.vehicleType}
                    onChange={handleEditBluebookFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nepal-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model</label>
                  <input
                    type="text"
                    name="vehicleModel"
                    value={editBluebookFormData.vehicleModel}
                    onChange={handleEditBluebookFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nepal-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacture Year</label>
                  <input
                    type="number"
                    name="manufactureYear"
                    value={editBluebookFormData.manufactureYear}
                    onChange={handleEditBluebookFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nepal-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chassis Number</label>
                  <input
                    type="text"
                    name="chasisNumber"
                    value={editBluebookFormData.chasisNumber}
                    onChange={handleEditBluebookFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nepal-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Color</label>
                  <input
                    type="text"
                    name="vehicleColor"
                    value={editBluebookFormData.vehicleColor}
                    onChange={handleEditBluebookFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nepal-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Engine CC</label>
                  <input
                    type="number"
                    name="vehicleEngineCC"
                    value={editBluebookFormData.vehicleEngineCC}
                    onChange={handleEditBluebookFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nepal-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={editBluebookFormData.vehicleNumber}
                    onChange={handleEditBluebookFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nepal-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
                  <input
                    type="date"
                    name="VehicleRegistrationDate"
                    value={editBluebookFormData.VehicleRegistrationDate}
                    onChange={handleEditBluebookFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nepal-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax Pay Date</label>
                  <input
                    type="date"
                    name="taxPayDate"
                    value={editBluebookFormData.taxPayDate}
                    onChange={handleEditBluebookFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nepal-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax Expire Date</label>
                  <input
                    type="date"
                    name="taxExpireDate"
                    value={editBluebookFormData.taxExpireDate}
                    onChange={handleEditBluebookFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nepal-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={editBluebookFormData.status}
                    onChange={handleEditBluebookFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nepal-blue"
                  >
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowEditBluebookModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateBluebook}
                  className="flex-1 bg-nepal-blue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                >
                  Update Bluebook
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit User</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimesCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nepal-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nepal-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Citizenship Number</label>
                  <input
                    type="text"
                    name="citizenshipNo"
                    value={editFormData.citizenshipNo}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nepal-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    name="role"
                    value={editFormData.role}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nepal-blue"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nepal-blue"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="flex-1 bg-nepal-blue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                >
                  Update User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-center mb-4">
                <FaExclamationTriangle className="h-12 w-12 text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Delete User</h3>
              <p className="text-sm text-gray-500 text-center mb-4">
                Are you sure you want to delete {userToDelete.name}? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Admin Modal */}
      {showCreateAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowCreateAdminModal(false)}
            >
              <FaTimesCircle className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">Create New Admin</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={createAdminForm.name}
                  onChange={handleCreateAdminFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-nepal-blue focus:border-nepal-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={createAdminForm.email}
                  onChange={handleCreateAdminFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-nepal-blue focus:border-nepal-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={createAdminForm.password}
                  onChange={handleCreateAdminFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-nepal-blue focus:border-nepal-blue"
                  required
                />
              </div>
              {createAdminError && <div className="text-red-600 text-sm">{createAdminError}</div>}
              {createAdminSuccess && <div className="text-green-600 text-sm">{createAdminSuccess}</div>}
              <button
                onClick={handleCreateAdmin}
                disabled={createAdminLoading}
                className="w-full mt-2 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-nepal-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nepal-blue disabled:opacity-50"
              >
                {createAdminLoading ? 'Creating...' : 'Create Admin'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* News Modal */}
      {showNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowNewsModal(false);
                setEditingNews(null);
                setNewsForm({
                  title: '',
                  content: '',
                  status: 'draft',
                  priority: 1,
                  tags: []
                });
                setNewsImage(null);
              }}
            >
              <FaTimesCircle className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editingNews ? 'Edit News Article' : 'Create News Article'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newsForm.title}
                  onChange={handleNewsFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-nepal-blue focus:border-nepal-blue"
                  placeholder="Enter news title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  name="content"
                  value={newsForm.content}
                  onChange={handleNewsFormChange}
                  rows={6}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-nepal-blue focus:border-nepal-blue"
                  placeholder="Enter news content"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={newsForm.status}
                    onChange={handleNewsFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-nepal-blue focus:border-nepal-blue"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    name="priority"
                    value={newsForm.priority}
                    onChange={handleNewsFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-nepal-blue focus:border-nepal-blue"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleNewsImageChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-nepal-blue focus:border-nepal-blue"
                />
                {newsImage && (
                  <p className="mt-1 text-sm text-gray-500">Selected: {newsImage.name}</p>
                )}
                {editingNews && editingNews.image && !newsImage && (
                  <p className="mt-1 text-sm text-gray-500">Current image: {editingNews.image}</p>
                )}
              </div>
              {newsError && <div className="text-red-600 text-sm">{newsError}</div>}
              {newsSuccess && <div className="text-green-600 text-sm">{newsSuccess}</div>}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowNewsModal(false);
                    setEditingNews(null);
                    setNewsForm({
                      title: '',
                      content: '',
                      status: 'draft',
                      priority: 1,
                      tags: []
                    });
                    setNewsImage(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={editingNews ? handleUpdateNews : handleCreateNews}
                  disabled={newsLoading}
                  className="flex-1 bg-nepal-blue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {newsLoading ? 'Saving...' : (editingNews ? 'Update News' : 'Create News')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete News Confirmation Modal */}
      {showDeleteNewsModal && newsToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-center mb-4">
                <FaExclamationTriangle className="h-12 w-12 text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Delete News Article</h3>
              <p className="text-sm text-gray-500 text-center mb-4">
                Are you sure you want to delete "{newsToDelete.title}"? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteNewsModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteNews}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard; 