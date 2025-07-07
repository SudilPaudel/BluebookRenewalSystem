import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCar, FaSave, FaArrowLeft, FaUpload } from "react-icons/fa";

function NewBluebook() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicleRegNo: "",
    vehicleType: "",
    VehicleRegistrationDate: "",
    vehicleOwnerName: "",
    vehicleModel: "",
    manufactureYear: "",
    chasisNumber: "",
    vehicleColor: "",
    vehicleEngineCC: "",
    vehicleNumber: "",
    taxPayDate: "",
    taxExpireDate: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vehicleRegNo) newErrors.vehicleRegNo = "Vehicle registration number is required";
    if (!formData.vehicleType) newErrors.vehicleType = "Vehicle type is required";
    if (!formData.VehicleRegistrationDate) newErrors.VehicleRegistrationDate = "Vehicle registration date is required";
    if (!formData.vehicleOwnerName) newErrors.vehicleOwnerName = "Vehicle owner name is required";
    if (!formData.vehicleModel) newErrors.vehicleModel = "Vehicle model is required";
    if (!formData.manufactureYear) newErrors.manufactureYear = "Manufacture year is required";
    if (!formData.chasisNumber) newErrors.chasisNumber = "Chassis number is required";
    if (!formData.vehicleColor) newErrors.vehicleColor = "Vehicle color is required";
    if (!formData.vehicleEngineCC) newErrors.vehicleEngineCC = "Engine CC is required";
    if (!formData.vehicleNumber) newErrors.vehicleNumber = "Vehicle number is required";
    if (!formData.taxPayDate) newErrors.taxPayDate = "Tax pay date is required";
    if (!formData.taxExpireDate) newErrors.taxExpireDate = "Tax expire date is required";

    // Validate dates
    if (formData.taxExpireDate && formData.taxPayDate) {
      if (new Date(formData.taxExpireDate) <= new Date(formData.taxPayDate)) {
        newErrors.taxExpireDate = "Tax expire date must be after tax pay date";
      }
    }

    // Validate year
    if (formData.manufactureYear) {
      const year = parseInt(formData.manufactureYear);
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear + 1) {
        newErrors.manufactureYear = "Invalid manufacture year";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/bluebook`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Bluebook registered successfully!');
        navigate('/dashboard');
      } else {
        alert(data.message || 'Failed to register bluebook');
      }
    } catch (error) {
      console.error('Error registering bluebook:', error);
      alert('An error occurred while registering the bluebook');
    } finally {
      setLoading(false);
    }
  };

  const vehicleTypes = [
    "Motorcycle",
    "Car",
    "Jeep",
    "Van",
    "Bus",
    "Truck",
    "Tractor",
    "Other"
  ];

  const vehicleColors = [
    "White",
    "Black",
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Silver",
    "Gray",
    "Brown",
    "Orange",
    "Purple",
    "Pink",
    "Other"
  ];

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
                <h1 className="text-3xl font-bold text-gray-900">Register New Bluebook</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Enter vehicle details for bluebook registration
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <FaCar className="h-8 w-8 text-nepal-blue" />
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Vehicle Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">
                    Vehicle Registration Number <span className="text-nepal-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicleRegNo"
                    value={formData.vehicleRegNo}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-nepal-blue ${
                      errors.vehicleRegNo ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter registration number"
                  />
                  {errors.vehicleRegNo && (
                    <p className="mt-1 text-sm text-red-600">{errors.vehicleRegNo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">
                    Vehicle Type <span className="text-nepal-red">*</span>
                  </label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-nepal-blue ${
                      errors.vehicleType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select vehicle type</option>
                    {vehicleTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.vehicleType && (
                    <p className="mt-1 text-sm text-red-600">{errors.vehicleType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">
                    Vehicle Registration Date <span className="text-nepal-red">*</span>
                  </label>
                  <input
                    type="date"
                    name="VehicleRegistrationDate"
                    value={formData.VehicleRegistrationDate}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-nepal-blue ${
                      errors.VehicleRegistrationDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.VehicleRegistrationDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.VehicleRegistrationDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">
                    Vehicle Owner Name <span className="text-nepal-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicleOwnerName"
                    value={formData.vehicleOwnerName}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-nepal-blue ${
                      errors.vehicleOwnerName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter owner name"
                  />
                  {errors.vehicleOwnerName && (
                    <p className="mt-1 text-sm text-red-600">{errors.vehicleOwnerName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">
                    Vehicle Model <span className="text-nepal-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-nepal-blue ${
                      errors.vehicleModel ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Honda City, Toyota Corolla"
                  />
                  {errors.vehicleModel && (
                    <p className="mt-1 text-sm text-red-600">{errors.vehicleModel}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">
                    Manufacture Year <span className="text-nepal-red">*</span>
                  </label>
                  <input
                    type="number"
                    name="manufactureYear"
                    value={formData.manufactureYear}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-nepal-blue ${
                      errors.manufactureYear ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 2020"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                  />
                  {errors.manufactureYear && (
                    <p className="mt-1 text-sm text-red-600">{errors.manufactureYear}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">
                    Chassis Number <span className="text-nepal-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="chasisNumber"
                    value={formData.chasisNumber}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-nepal-blue ${
                      errors.chasisNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter chassis number"
                  />
                  {errors.chasisNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.chasisNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">
                    Vehicle Color <span className="text-nepal-red">*</span>
                  </label>
                  <select
                    name="vehicleColor"
                    value={formData.vehicleColor}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-nepal-blue ${
                      errors.vehicleColor ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select color</option>
                    {vehicleColors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                  {errors.vehicleColor && (
                    <p className="mt-1 text-sm text-red-600">{errors.vehicleColor}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">
                    Engine CC <span className="text-nepal-red">*</span>
                  </label>
                  <input
                    type="number"
                    name="vehicleEngineCC"
                    value={formData.vehicleEngineCC}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-nepal-blue ${
                      errors.vehicleEngineCC ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 1500"
                    min="50"
                    max="10000"
                  />
                  {errors.vehicleEngineCC && (
                    <p className="mt-1 text-sm text-red-600">{errors.vehicleEngineCC}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">
                    Vehicle Number <span className="text-nepal-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-nepal-blue ${
                      errors.vehicleNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Ba 1 Pa 1234"
                  />
                  {errors.vehicleNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.vehicleNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Tax Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tax Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">
                    Tax Pay Date <span className="text-nepal-red">*</span>
                  </label>
                  <input
                    type="date"
                    name="taxPayDate"
                    value={formData.taxPayDate}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-nepal-blue ${
                      errors.taxPayDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.taxPayDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.taxPayDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">
                    Tax Expire Date <span className="text-nepal-red">*</span>
                  </label>
                  <input
                    type="date"
                    name="taxExpireDate"
                    value={formData.taxExpireDate}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-nepal-blue ${
                      errors.taxExpireDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.taxExpireDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.taxExpireDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nepal-blue"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-nepal-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nepal-blue disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registering...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Register Bluebook
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewBluebook; 