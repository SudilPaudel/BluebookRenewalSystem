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
import { toast } from "react-toastify";

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

  // Checks authentication and redirects user if not admin or not logged in.
  const checkAuth = () => {
    // Checks localStorage for user details and token, parses user, and redirects if not admin.
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

  // Fetches all dashboard data: users, bluebooks, pending bluebooks, payments, and news.
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

  // Handles bluebook verification by sending a request to the backend and refreshing data.
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
        toast.success('Bluebook verified successfully!');
        fetchDashboardData(); // Refresh data
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to verify bluebook');
      }
    } catch (error) {
      console.error('Error verifying bluebook:', error);
      toast.error('An error occurred while verifying bluebook');
    }
  };

  // Updates a user's status (active/inactive) and refreshes dashboard data.
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
        toast.success(`User status updated to ${newStatus} successfully!`);
        fetchDashboardData(); // Refresh data
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('An error occurred while updating user status');
    }
  };

  // Formats a date string into a readable format.
  const formatDate = (dateString) => {
    // Converts a date string to a human-readable format or returns 'N/A' if not present.
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Returns a badge component for bluebook status.
  const getStatusBadge = (status) => {
    // Returns a styled badge based on bluebook status (verified, pending, rejected, unknown).
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

  // Returns a badge component for user status.
  const getUserStatusBadge = (status) => {
    // Returns a styled badge for user status (active/inactive).
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

  // Returns a badge component for user role.
  const getUserRoleBadge = (role) => {
    // Returns a styled badge for user role (admin/user).
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

  // Opens the user details modal for the selected user.
  const handleViewUserDetails = (user) => {
    // Sets selected user and shows the user modal.
    setSelectedUser(user);
    setShowUserModal(true);
  };

  // Opens the delete confirmation modal for the selected user.
  const handleDeleteUser = (user) => {
    // Sets user to delete and shows the delete modal.
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Opens the edit modal and sets the selected user's data for editing.
  const handleEditUser = (user) => {
    // Sets editing user and populates edit form data, then shows edit modal.
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

  // Handles changes in the edit user form fields.
  const handleEditFormChange = (e) => {
    // Updates edit form data state as user types in the edit modal.
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Sends updated user data to the backend and refreshes dashboard data.
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
        toast.success('User updated successfully!');
        fetchDashboardData(); // Refresh data
        setShowEditModal(false);
        setEditingUser(null);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('An error occurred while updating user');
    }
  };

  // Opens the edit bluebook modal and sets the selected bluebook's data.
  const handleEditBluebook = (bluebook) => {
    // Sets editing bluebook and populates edit bluebook form data, then shows modal.
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
      VehicleRegistrationDate: bluebook.VehicleRegistrationDate ? bluebook.VehicleRegistrationDate.slice(0, 10) : '',
      taxPayDate: bluebook.taxPayDate ? bluebook.taxPayDate.slice(0, 10) : '',
      taxExpireDate: bluebook.taxExpireDate ? bluebook.taxExpireDate.slice(0, 10) : ''
    });
    setShowEditBluebookModal(true);
  };

  // Handles changes in the edit bluebook form fields.
  const handleEditBluebookFormChange = (e) => {
    // Updates edit bluebook form data state as user types in the modal.
    const { name, value } = e.target;
    setEditBluebookFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Sends updated bluebook data to the backend and refreshes dashboard data.
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
        toast.success('Bluebook updated successfully!');
        fetchDashboardData(); // Refresh data
        setShowEditBluebookModal(false);
        setEditingBluebook(null);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update bluebook');
      }
    } catch (error) {
      console.error('Error updating bluebook:', error);
      toast.error('An error occurred while updating bluebook');
    }
  };

  // Confirms and deletes a user, then refreshes dashboard data.
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
        toast.success('User deleted successfully!');
        fetchDashboardData(); // Refresh data
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('An error occurred while deleting user');
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  // Rejects a bluebook by sending a request to the backend and refreshes data.
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
        toast.success('Bluebook rejected successfully!');
        fetchDashboardData(); // Refresh data
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to reject bluebook');
      }
    } catch (error) {
      console.error('Error rejecting bluebook:', error);
      toast.error('An error occurred while rejecting bluebook');
    }
  };

  // Generates a report PDF for users, bluebooks, or payments.
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
        toast.success(`${reportType} report generated successfully!`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('An error occurred while generating report. Please try again.');
    }
  };

  // Handles changes in the create admin form fields.
  const handleCreateAdminFormChange = (e) => {
    // Updates create admin form state as user types.
    const { name, value } = e.target;
    setCreateAdminForm(prev => ({ ...prev, [name]: value }));
  };

  // Sends a request to create a new admin and refreshes dashboard data.
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

  // Handles changes in the news form fields.
  const handleNewsFormChange = (e) => {
    // Updates news form state as user types.
    const { name, value } = e.target;
    setNewsForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handles image file selection for news.
  const handleNewsImageChange = (e) => {
    // Sets selected image file for news article.
    const file = e.target.files[0];
    if (file) {
      setNewsImage(file);
    }
  };

  // Sends a request to create a news article and refreshes dashboard data.
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

  // Opens the news modal for editing and sets the selected news data.
  const handleEditNews = (newsItem) => {
    // Sets editing news and populates news form, then shows modal.
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

  // Sends updated news data to the backend and refreshes dashboard data.
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

  // Opens the delete confirmation modal for the selected news article.
  const handleDeleteNews = (newsItem) => {
    // Sets news to delete and shows delete modal.
    setNewsToDelete(newsItem);
    setShowDeleteNewsModal(true);
  };

  // Confirms and deletes a news article, then refreshes dashboard data.
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

  // Updates the status of a news article (active/inactive/draft).
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
        toast.error(data.message || 'Failed to update news status');
      }
    } catch (error) {
      toast.error('An error occurred while updating news status');
    }
  };

  // Returns a badge component for news status.
  const getNewsStatusBadge = (status) => {
    // Returns a styled badge for news status (active/inactive/draft).
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <div className="bg-white/90 shadow-lg border-b sticky top-0 z-30 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-4xl font-extrabold text-nepal-blue tracking-tight animate-fade-in-down">Admin Dashboard</h1>
              <p className="mt-2 text-base text-gray-500 animate-fade-in">{`Welcome back, ${user?.name || 'Admin'}`}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-5 py-2 border border-gray-200 text-base font-semibold rounded-lg text-nepal-blue bg-white hover:bg-blue-50 shadow transition-all duration-200 animate-fade-in"
              >
                <FaUsers className="mr-2" />
                User Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 shadow-xl rounded-2xl p-6 flex items-center gap-4 animate-fade-in-up">
            <div className="flex-shrink-0 bg-white rounded-full p-3 shadow">
              <FaUsers className="h-7 w-7 text-nepal-blue" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500">Total Users</div>
              <div className="text-2xl font-bold text-nepal-blue">{stats.totalUsers}</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-green-200 shadow-xl rounded-2xl p-6 flex items-center gap-4 animate-fade-in-up delay-75">
            <div className="flex-shrink-0 bg-white rounded-full p-3 shadow">
              <FaCheckCircle className="h-7 w-7 text-green-500" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500">Active Users</div>
              <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl rounded-2xl p-6 flex items-center gap-4 animate-fade-in-up delay-100">
            <div className="flex-shrink-0 bg-white rounded-full p-3 shadow">
              <FaCar className="h-7 w-7 text-gray-500" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500">Total Bluebooks</div>
              <div className="text-2xl font-bold text-gray-700">{stats.totalBluebooks}</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-xl rounded-2xl p-6 flex items-center gap-4 animate-fade-in-up delay-150">
            <div className="flex-shrink-0 bg-white rounded-full p-3 shadow">
              <FaClock className="h-7 w-7 text-yellow-500" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingBluebooks}</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-200 to-green-300 shadow-xl rounded-2xl p-6 flex items-center gap-4 animate-fade-in-up delay-200">
            <div className="flex-shrink-0 bg-white rounded-full p-3 shadow">
              <FaCheckCircle className="h-7 w-7 text-green-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500">Verified</div>
              <div className="text-2xl font-bold text-green-700">{stats.verifiedBluebooks}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/90 shadow-2xl rounded-2xl animate-fade-in-up">
          <div className="border-b border-gray-100">
            <nav className="-mb-px flex flex-wrap space-x-4 px-8 py-2">
              {[
                { key: 'overview', icon: <FaChartBar className="inline mr-2" />, label: 'Overview' },
                { key: 'users', icon: <FaUsers className="inline mr-2" />, label: `Users (${users.length})` },
                { key: 'pending', icon: <FaClock className="inline mr-2" />, label: `Pending Verification (${pendingBluebooks.length})` },
                { key: 'bluebooks', icon: <FaCar className="inline mr-2" />, label: `All Bluebooks (${bluebooks.length})` },
                { key: 'payments', icon: <FaMoneyBillWave className="inline mr-2" />, label: `Payments (${payments.length})` },
                { key: 'reports', icon: <FaFileAlt className="inline mr-2" />, label: 'Reports' },
                { key: 'news', icon: <FaNewspaper className="inline mr-2" />, label: `News (${news.length})` },
                { key: 'settings', icon: <FaCog className="inline mr-2" />, label: 'Settings' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-3 px-4 border-b-4 font-semibold text-base transition-all duration-200 ${activeTab === tab.key
                    ? 'border-nepal-blue text-nepal-blue bg-blue-50 shadow'
                    : 'border-transparent text-gray-500 hover:text-nepal-blue hover:border-nepal-blue'
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg animate-fade-in-up">
                    <h3 className="text-xl font-bold text-nepal-blue mb-6">Recent Pending Bluebooks</h3>
                    <div className="space-y-4">
                      {pendingBluebooks.slice(0, 5).map((bluebook, idx) => (
                        <div
                          key={bluebook._id}
                          className="flex items-center justify-between bg-white p-4 rounded-xl shadow hover:scale-[1.02] transition-transform duration-200 animate-fade-in-up"
                          style={{ animationDelay: `${idx * 60}ms` }}
                        >
                          <div>
                            <p className="font-semibold text-gray-900">{bluebook.vehicleRegNo}</p>
                            <p className="text-sm text-gray-500">{bluebook.vehicleOwnerName}</p>
                          </div>
                          <button
                            onClick={() => handleVerifyBluebook(bluebook._id)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-semibold rounded-lg text-white bg-nepal-blue hover:bg-blue-700 shadow transition"
                          >
                            <FaCheckCircle className="mr-1" />
                            Verify
                          </button>
                        </div>
                      ))}
                      {pendingBluebooks.length === 0 && (
                        <p className="text-gray-400 text-center py-6">No pending bluebooks</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 shadow-lg animate-fade-in-up delay-100">
                    <h3 className="text-xl font-bold text-green-700 mb-6">Recent Users</h3>
                    <div className="space-y-4">
                      {users.slice(0, 5).map((user, idx) => (
                        <div
                          key={user._id}
                          className="flex items-center justify-between bg-white p-4 rounded-xl shadow hover:scale-[1.02] transition-transform duration-200 animate-fade-in-up"
                          style={{ animationDelay: `${idx * 60}ms` }}
                        >
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
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
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* <button
                    onClick={() => setShowCreateAdminModal(true)}
                    className="inline-flex items-center px-5 py-2 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-r from-nepal-blue to-blue-500 hover:from-blue-700 hover:to-nepal-blue shadow transition"
                  >
                    <FaUserPlus className="mr-2" />
                    Create Admin
                  </button> */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50 shadow"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50 shadow"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white/90 shadow-xl overflow-hidden sm:rounded-2xl animate-fade-in-up">
                  <ul className="divide-y divide-gray-100">
                    {filteredUsers.map((user, idx) => (
                      <li key={user._id} className="px-8 py-5 hover:bg-blue-50 transition animate-fade-in-up" style={{ animationDelay: `${idx * 30}ms` }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              {user.image ? (
                                <img
                                  className="h-12 w-12 rounded-full border-2 border-nepal-blue shadow"
                                  src={`${import.meta.env.VITE_API_URL}/public/uploads/users/${user.image}`}
                                  alt={user.name}
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                                  <FaUsers className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-5">
                              <div className="text-base font-semibold text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              <div className="text-xs text-gray-400">Citizenship: {user.citizenshipNo}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              {getUserStatusBadge(user.status)}
                              {getUserRoleBadge(user.role)}
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewUserDetails(user)}
                                className="inline-flex items-center px-3 py-1 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-100 shadow"
                              >
                                <FaEye className="mr-1" />
                                View
                              </button>
                              <button
                                onClick={() => handleEditUser(user)}
                                className="inline-flex items-center px-3 py-1 border border-gray-200 text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 shadow"
                              >
                                <FaEdit className="mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleUpdateUserStatus(user._id, user.status === 'active' ? 'inactive' : 'active')}
                                className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-lg shadow ${user.status === 'active'
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
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 shadow"
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
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white/90 shadow-xl overflow-hidden sm:rounded-2xl animate-fade-in-up">
                  <ul className="divide-y divide-gray-100">
                    {pendingBluebooks.map((bluebook, idx) => (
                      <li key={bluebook._id} className="px-8 py-5 hover:bg-yellow-50 transition animate-fade-in-up" style={{ animationDelay: `${idx * 30}ms` }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-14 w-14">
                              <div className="h-14 w-14 rounded-full bg-yellow-100 flex items-center justify-center border-2 border-yellow-300 shadow">
                                <FaCar className="h-7 w-7 text-yellow-600" />
                              </div>
                            </div>
                            <div className="ml-5">
                              <div className="text-base font-semibold text-gray-900">{bluebook.vehicleRegNo}</div>
                              <div className="text-sm text-gray-500">{bluebook.vehicleOwnerName}</div>
                              <div className="text-xs text-gray-400">{bluebook.vehicleType} - {bluebook.vehicleModel}</div>
                              <div className="text-xs text-gray-400">Created: {formatDate(bluebook.createdAt)}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getStatusBadge(bluebook.status)}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditBluebook(bluebook)}
                                className="inline-flex items-center px-3 py-1 border border-gray-200 text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 shadow"
                              >
                                <FaEdit className="mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleVerifyBluebook(bluebook._id)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-lg text-white bg-nepal-blue hover:bg-blue-700 shadow"
                              >
                                <FaCheckCircle className="mr-1" />
                                Verify
                              </button>
                              <button
                                onClick={() => handleRejectBluebook(bluebook._id)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 shadow"
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
                      <li className="px-8 py-12 text-center text-gray-400 animate-fade-in">
                        No pending bluebooks to verify
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* All Bluebooks Tab */}
            {activeTab === 'bluebooks' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white/90 shadow-xl overflow-hidden sm:rounded-2xl animate-fade-in-up">
                  <ul className="divide-y divide-gray-100">
                    {bluebooks.map((bluebook, idx) => (
                      <li key={bluebook._id} className="px-8 py-5 hover:bg-green-50 transition animate-fade-in-up" style={{ animationDelay: `${idx * 30}ms` }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-14 w-14">
                              <div className={`h-14 w-14 rounded-full flex items-center justify-center border-2 shadow ${bluebook.status === 'verified' ? 'bg-green-100 border-green-300' : 'bg-yellow-100 border-yellow-300'
                                }`}>
                                <FaCar className={`h-7 w-7 ${bluebook.status === 'verified' ? 'text-green-600' : 'text-yellow-600'
                                  }`} />
                              </div>
                            </div>
                            <div className="ml-5">
                              <div className="text-base font-semibold text-gray-900">{bluebook.vehicleRegNo}</div>
                              <div className="text-sm text-gray-500">{bluebook.vehicleOwnerName}</div>
                              <div className="text-xs text-gray-400">{bluebook.vehicleType} - {bluebook.vehicleModel}</div>
                              <div className="text-xs text-gray-400">Created: {formatDate(bluebook.createdAt)}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getStatusBadge(bluebook.status)}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditBluebook(bluebook)}
                                className="inline-flex items-center px-3 py-1 border border-gray-200 text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 shadow"
                              >
                                <FaEdit className="mr-1" />
                                Edit
                              </button>
                              {bluebook.status === 'pending' && (
                                <button
                                  onClick={() => handleVerifyBluebook(bluebook._id)}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-lg text-white bg-nepal-blue hover:bg-blue-700 shadow"
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
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-nepal-blue">Payment Transactions</h3>
                  <div className="flex items-center space-x-4">
                    <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50 shadow">
                      <option value="all">All Payments</option>
                      <option value="successful">Successful</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white/90 shadow-xl overflow-hidden sm:rounded-2xl animate-fade-in-up">
                  <div className="px-8 py-5 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-100 rounded-t-2xl">
                    <div className="grid grid-cols-6 gap-4 text-base font-semibold text-nepal-blue">
                      <div>Transaction ID</div>
                      <div>User</div>
                      <div>Amount</div>
                      <div>Status</div>
                      <div>Date</div>
                      <div>Actions</div>
                    </div>
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {payments.length > 0 ? (
                      payments.map((payment, idx) => (
                        <li key={payment._id} className="px-8 py-5 animate-fade-in-up" style={{ animationDelay: `${idx * 30}ms` }}>
                          <div className="grid grid-cols-6 gap-4 items-center">
                            <div className="text-base font-semibold text-gray-900">{payment.transactionId}</div>
                            <div className="text-base text-gray-500">{payment.userName}</div>
                            <div className="text-base font-bold text-green-600">Rs. {payment.amount}</div>
                            <div className="text-base">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow ${payment.status === 'successful' ? 'bg-green-100 text-green-800' :
                                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                {payment.status}
                              </span>
                            </div>
                            <div className="text-base text-gray-400">{formatDate(payment.createdAt)}</div>
                            <div className="flex items-center space-x-2">
                              <button className="text-nepal-blue hover:text-blue-700 transition">
                                <FaEye className="h-5 w-5" />
                              </button>
                              <button className="text-green-600 hover:text-green-700 transition">
                                <FaDownload className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="px-8 py-12 text-center text-gray-400 animate-fade-in">
                        No payment transactions found
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg animate-fade-in-up">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-white rounded-full p-4 shadow">
                        <FaUsers className="h-8 w-8 text-nepal-blue" />
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-bold text-nepal-blue">User Report</h3>
                        <p className="text-sm text-gray-500">Generate comprehensive user statistics</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => generateReport('users')}
                        className="w-full bg-gradient-to-r from-nepal-blue to-blue-500 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-nepal-blue shadow transition"
                      >
                        Generate Report
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-lg animate-fade-in-up delay-75">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-white rounded-full p-4 shadow">
                        <FaCar className="h-8 w-8 text-green-500" />
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-bold text-green-700">Bluebook Report</h3>
                        <p className="text-sm text-gray-500">Generate bluebook application statistics</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => generateReport('bluebooks')}
                        className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-green-500 shadow transition"
                      >
                        Generate Report
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl shadow-lg animate-fade-in-up delay-150">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-white rounded-full p-4 shadow">
                        <FaMoneyBillWave className="h-8 w-8 text-yellow-500" />
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-bold text-yellow-700">Payment Report</h3>
                        <p className="text-sm text-gray-500">Generate payment transaction reports</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => generateReport('payments')}
                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-2 px-4 rounded-lg hover:from-yellow-600 hover:to-yellow-400 shadow transition"
                      >
                        Generate Report
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 p-8 rounded-2xl shadow-xl animate-fade-in-up">
                  <h3 className="text-xl font-bold text-nepal-blue mb-6">System Analytics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-blue-50 rounded-xl shadow">
                      <div className="text-3xl font-extrabold text-nepal-blue">{stats.totalUsers}</div>
                      <div className="text-base text-gray-600">Total Users</div>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-xl shadow">
                      <div className="text-3xl font-extrabold text-green-600">{stats.totalBluebooks}</div>
                      <div className="text-base text-gray-600">Total Bluebooks</div>
                    </div>
                    <div className="text-center p-6 bg-yellow-50 rounded-xl shadow">
                      <div className="text-3xl font-extrabold text-yellow-600">{stats.pendingBluebooks}</div>
                      <div className="text-base text-gray-600">Pending</div>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-xl shadow">
                      <div className="text-3xl font-extrabold text-purple-600">{payments.length}</div>
                      <div className="text-base text-gray-600">Payments</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* News Tab */}
            {activeTab === 'news' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowNewsModal(true)}
                    className="inline-flex items-center px-5 py-2 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-r from-nepal-blue to-blue-500 hover:from-blue-700 hover:to-nepal-blue shadow transition"
                  >
                    <FaPlus className="mr-2" />
                    Add News
                  </button>
                </div>

                <div className="bg-white/90 shadow-xl overflow-hidden sm:rounded-2xl animate-fade-in-up">
                  <ul className="divide-y divide-gray-100">
                    {news.map((newsItem, idx) => (
                      <li key={newsItem._id} className="px-8 py-6 animate-fade-in-up" style={{ animationDelay: `${idx * 30}ms` }}>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                          <div className="flex items-center space-x-6 w-full md:w-auto">
                            <div className="flex-shrink-0">
                              {newsItem.image ? (
                                <img
                                  className="w-[220px] h-[140px] object-cover rounded-xl border border-gray-200 shadow"
                                  src={`${import.meta.env.VITE_API_URL}/public/uploads/news/${newsItem.image}`}
                                  alt={newsItem.title}
                                  onError={e => { e.target.onerror = null; e.target.src = fallbackNews; }}
                                />
                              ) : (
                                <img
                                  className="w-[220px] h-[140px] object-cover rounded-xl border border-gray-200 shadow"
                                  src="https://via.placeholder.com/400x250?text=No+Image"
                                  alt="No news image"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-lg font-bold text-gray-900 truncate">{newsItem.title}</div>
                              <div className="text-base text-gray-500 truncate">{newsItem.content.substring(0, 100)}...</div>
                              <div className="flex items-center space-x-3 mt-2">
                                {getNewsStatusBadge(newsItem.status)}
                                <span className="text-xs text-gray-400">Priority: {newsItem.priority}</span>
                                <span className="text-xs text-gray-400">Created: {formatDate(newsItem.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditNews(newsItem)}
                              className="inline-flex items-center px-3 py-1 border border-gray-200 text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 shadow"
                            >
                              <FaEdit className="mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleUpdateNewsStatus(newsItem._id, newsItem.status === 'active' ? 'inactive' : 'active')}
                              className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-lg shadow ${newsItem.status === 'active'
                                ? 'text-red-700 bg-red-100 hover:bg-red-200'
                                : 'text-green-700 bg-green-100 hover:bg-green-200'
                                }`}
                            >
                              {newsItem.status === 'active' ? <FaToggleOff className="mr-1" /> : <FaToggleOn className="mr-1" />}
                              {newsItem.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteNews(newsItem)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 shadow"
                            >
                              <FaTrash className="mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                    {news.length === 0 && (
                      <li className="px-8 py-12 text-center text-gray-400 animate-fade-in">
                        No news articles found. Click "Add News" to create your first article.
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg animate-fade-in-up">
                    <h3 className="text-xl font-bold text-nepal-blue mb-6">System Settings</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-base font-semibold text-gray-700 mb-2">
                          Auto-verify Bluebooks
                        </label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-5 w-5 text-nepal-blue focus:ring-nepal-blue border-gray-300 rounded transition"
                          />
                          <span className="ml-3 text-base text-gray-600">Enable automatic verification</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-base font-semibold text-gray-700 mb-2">
                          Email Notifications
                        </label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-5 w-5 text-nepal-blue focus:ring-nepal-blue border-gray-300 rounded transition"
                          />
                          <span className="ml-3 text-base text-gray-600">Send email notifications</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-base font-semibold text-gray-700 mb-2">
                          Maintenance Mode
                        </label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-5 w-5 text-nepal-blue focus:ring-nepal-blue border-gray-300 rounded transition"
                          />
                          <span className="ml-3 text-base text-gray-600">Enable maintenance mode</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8">
                      <button className="bg-gradient-to-r from-nepal-blue to-blue-500 text-white py-2 px-6 rounded-lg hover:from-blue-700 hover:to-nepal-blue shadow transition">
                        Save Settings
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-lg animate-fade-in-up delay-100">
                    <h3 className="text-xl font-bold text-green-700 mb-6">Admin Actions</h3>
                    <div className="space-y-4">
                      <button className="w-full text-left p-4 border border-gray-100 rounded-xl hover:bg-green-50 transition flex items-center gap-4 shadow">
                        <FaUserPlus className="h-6 w-6 text-green-600" />
                        <div>
                          <div className="font-semibold text-gray-900">Create New Admin</div>
                          <div className="text-sm text-gray-500">Add a new administrator user</div>
                        </div>
                      </button>
                      <button className="w-full text-left p-4 border border-gray-100 rounded-xl hover:bg-yellow-50 transition flex items-center gap-4 shadow">
                        <FaExclamationTriangle className="h-6 w-6 text-yellow-600" />
                        <div>
                          <div className="font-semibold text-gray-900">System Backup</div>
                          <div className="text-sm text-gray-500">Create system backup</div>
                        </div>
                      </button>
                      <button className="w-full text-left p-4 border border-gray-100 rounded-xl hover:bg-blue-50 transition flex items-center gap-4 shadow">
                        <FaCog className="h-6 w-6 text-blue-600" />
                        <div>
                          <div className="font-semibold text-gray-900">Database Maintenance</div>
                          <div className="text-sm text-gray-500">Optimize database performance</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 p-8 rounded-2xl shadow-xl animate-fade-in-up">
                  <h3 className="text-xl font-bold text-nepal-blue mb-6">System Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-base font-semibold text-gray-500">Server Status</div>
                      <div className="text-base text-green-600 font-bold">Online</div>
                    </div>
                    <div>
                      <div className="text-base font-semibold text-gray-500">Database Status</div>
                      <div className="text-base text-green-600 font-bold">Connected</div>
                    </div>
                    <div>
                      <div className="text-base font-semibold text-gray-500">Last Backup</div>
                      <div className="text-base text-gray-900">2 hours ago</div>
                    </div>
                    <div>
                      <div className="text-base font-semibold text-gray-500">System Version</div>
                      <div className="text-base text-gray-900">v1.0.0</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modals remain unchanged */}
      {/* ... */}
      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in-up">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
              onClick={() => setShowUserModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center">
              {selectedUser.image ? (
                <img
                  className="h-24 w-24 rounded-full border-4 border-nepal-blue shadow mb-4"
                  src={`${import.meta.env.VITE_API_URL}/public/uploads/users/${selectedUser.image}`}
                  alt={selectedUser.name}
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300 mb-4">
                  <FaUsers className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <h2 className="text-2xl font-bold text-nepal-blue mb-1">{selectedUser.name}</h2>
              <div className="flex items-center space-x-2 mb-2">
                {getUserStatusBadge(selectedUser.status)}
                {getUserRoleBadge(selectedUser.role)}
              </div>
              <div className="w-full mt-4 space-y-2">
                <div className="flex items-center text-gray-700">
                  <FaEnvelope className="mr-2 text-nepal-blue" />
                  <span>{selectedUser.email}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaNewspaper className="mr-2 text-nepal-blue" />
                  <span>Citizenship No: {selectedUser.citizenshipNo || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaCalendarAlt className="mr-2 text-nepal-blue" />
                  <span>Joined: {formatDate(selectedUser.createdAt)}</span>
                </div>
                {/* Add more fields as needed */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in-up">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
              onClick={() => setShowEditModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-nepal-blue mb-6">Edit User</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleUpdateUser();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50"
                  required
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50"
                  required
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1">Citizenship No</label>
                <input
                  type="text"
                  name="citizenshipNo"
                  value={editFormData.citizenshipNo}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={editFormData.role}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-nepal-blue text-white font-semibold hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete User Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in-up">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
              onClick={() => setShowDeleteModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center">
              <FaExclamationTriangle className="text-red-500 text-4xl mb-4" />
              <h2 className="text-2xl font-bold text-nepal-blue mb-2">Delete User</h2>
              <p className="text-gray-700 mb-6 text-center">
                Are you sure you want to delete <span className="font-semibold">{userToDelete.name}</span>? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3 w-full">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteUser}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit Bluebook Modal */}
      {showEditBluebookModal && editingBluebook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 relative animate-fade-in-up">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
              onClick={() => setShowEditBluebookModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-nepal-blue mb-6">Edit Bluebook</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleUpdateBluebook();
              }}
              className="grid grid-cols-2 gap-6"
            >
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1">Vehicle Reg. No</label>
                <input
                  type="text"
                  name="vehicleRegNo"
                  value={editBluebookFormData.vehicleRegNo}
                  onChange={handleEditBluebookFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50"
                  required
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1">Owner Name</label>
                <input
                  type="text"
                  name="vehicleOwnerName"
                  value={editBluebookFormData.vehicleOwnerName}
                  onChange={handleEditBluebookFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50"
                  required
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1">Vehicle Type</label>
                <input
                  type="text"
                  name="vehicleType"
                  value={editBluebookFormData.vehicleType}
                  onChange={handleEditBluebookFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1">Vehicle Model</label>
                <input
                  type="text"
                  name="vehicleModel"
                  value={editBluebookFormData.vehicleModel}
                  onChange={handleEditBluebookFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1">Manufacture Year</label>
                <input
                  type="text"
                  name="manufactureYear"
                  value={editBluebookFormData.manufactureYear}
                  onChange={handleEditBluebookFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1">Chasis Number</label>
                <input
                  type="text"
                  name="chasisNumber"
                  value={editBluebookFormData.chasisNumber}
                  onChange={handleEditBluebookFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1">Vehicle Color</label>
                <input
                  type="text"
                  name="vehicleColor"
                  value={editBluebookFormData.vehicleColor}
                  onChange={handleEditBluebookFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1">Engine CC</label>
                <input
                  type="text"
                  name="vehicleEngineCC"
                  value={editBluebookFormData.vehicleEngineCC}
                  onChange={handleEditBluebookFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1">Vehicle Number</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={editBluebookFormData.vehicleNumber}
                  onChange={handleEditBluebookFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={editBluebookFormData.status}
                  onChange={handleEditBluebookFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50"
                >
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1">Vehicle Registration Date</label>
                <input
                  type="date"
                  name="VehicleRegistrationDate"
                  value={editBluebookFormData.VehicleRegistrationDate}
                  onChange={handleEditBluebookFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1">Tax Pay Date</label>
                <input
                  type="date"
                  name="taxPayDate"
                  value={editBluebookFormData.taxPayDate}
                  onChange={handleEditBluebookFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1">Tax Expire Date</label>
                <input
                  type="date"
                  name="taxExpireDate"
                  value={editBluebookFormData.taxExpireDate}
                  onChange={handleEditBluebookFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50"
                />
              </div>
              {/* Empty div to align buttons to right side on last row */}
              <div></div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditBluebookModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-nepal-blue text-white font-semibold hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showNewsModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 animate-fade-in">
    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-10 relative animate-fade-in-up scale-95 sm:scale-100 transition-transform duration-300">
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold transition-colors duration-200"
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
        aria-label="Close"
      >
        &times;
      </button>
      <h2 className="text-3xl font-extrabold text-nepal-blue mb-8 text-center tracking-tight animate-fade-in-down">
        {editingNews ? 'Edit News' : 'Add News'}
      </h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          editingNews ? handleUpdateNews() : handleCreateNews();
        }}
        className="space-y-6"
      >
        <div className="space-y-2 animate-fade-in-up">
          <label className="block text-base font-semibold text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={newsForm.title}
            onChange={handleNewsFormChange}
            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50 text-lg shadow-sm transition"
            required
            placeholder="Enter news title..."
          />
        </div>
        <div className="space-y-2 animate-fade-in-up delay-75">
          <label className="block text-base font-semibold text-gray-700">Content</label>
          <textarea
            name="content"
            value={newsForm.content}
            onChange={handleNewsFormChange}
            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50 text-lg shadow-sm transition"
            rows={5}
            required
            placeholder="Write your news content here..."
          />
        </div>
        <div className="space-y-2 animate-fade-in-up delay-100">
          <label className="block text-base font-semibold text-gray-700">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleNewsImageChange}
            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-nepal-blue file:text-white hover:file:bg-blue-700 transition"
          />
          {/* Image preview */}
          {(newsImage || (editingNews && editingNews.image)) && (
            <div className="mt-2 flex justify-center animate-fade-in-up">
              <img
                src={newsImage ? URL.createObjectURL(newsImage) : `${import.meta.env.VITE_API_URL}/public/uploads/news/${editingNews.image}`}
                alt="Preview"
                className="w-48 h-32 object-cover rounded-xl border border-gray-200 shadow-md"
              />
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 animate-fade-in-up delay-150">
          <div>
            <label className="block text-base font-semibold text-gray-700">Status</label>
            <select
              name="status"
              value={newsForm.status}
              onChange={handleNewsFormChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50 text-lg shadow-sm transition"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-700">Priority</label>
            <input
              type="number"
              name="priority"
              value={newsForm.priority}
              onChange={handleNewsFormChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nepal-blue bg-gray-50 text-lg shadow-sm transition"
              min={1}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-6 animate-fade-in-up delay-200">
          <button
            type="button"
            onClick={() => setShowNewsModal(false)}
            className="px-6 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-semibold hover:bg-gray-100 transition shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-nepal-blue to-blue-500 text-white font-bold shadow-lg hover:from-blue-700 hover:to-nepal-blue transition disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={newsLoading}
          >
            {newsLoading ? (
              <span className="flex items-center"><svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Saving...</span>
            ) : (
              editingNews ? 'Save Changes' : 'Add News'
            )}
          </button>
        </div>
        {newsError && <div className="text-red-500 text-center animate-fade-in-up mt-2">{newsError}</div>}
        {newsSuccess && <div className="text-green-500 text-center animate-fade-in-up mt-2">{newsSuccess}</div>}
      </form>
    </div>
  </div>
)}
    </div>
  );
}


export default AdminDashboard;