import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCar, FaSave, FaArrowLeft, FaUpload } from "react-icons/fa";

function NewBluebook() {
  // Main component for registering a new bluebook

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

  /**
   * Checks if the user is authenticated by verifying the access token.
   * Redirects to login page if not authenticated.
   */
  const checkAuth = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
    }
  };

  /**
   * Handles input changes for form fields and clears errors for the changed field.
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement>} e
   */
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

  /**
   * Validates the form fields and sets error messages if validation fails.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
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

  /**
   * Handles form submission for registering a new bluebook.
   * Validates the form, sends data to the API, and manages loading and navigation.
   * @param {React.FormEvent} e
   */
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-2 p-2 rounded-full bg-white shadow hover:bg-blue-100 transition-all duration-200"
              >
                <FaArrowLeft className="h-5 w-5 text-blue-500" />
              </button>
              <div>
                <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight animate-slide-down">
                  Register New Bluebook
                </h1>
                <p className="mt-1 text-base text-blue-600 animate-fade-in delay-100">
                  Enter vehicle details for bluebook registration
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <FaCar className="h-10 w-10 text-blue-500 drop-shadow-lg animate-bounce-slow" />
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/90 shadow-2xl backdrop-blur-md ring-1 ring-blue-100 overflow-hidden sm:rounded-2xl animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-8 p-8">
            {/* Vehicle Information */}
            <div>
              <h3 className="text-xl font-semibold text-blue-800 mb-6 border-l-4 border-blue-400 pl-3 animate-slide-right">
                Vehicle Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="transition-all duration-200 hover:scale-[1.02]">
                  <label className="block text-sm font-semibold text-blue-700 text-left mb-1">
                    Vehicle Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicleRegNo"
                    value={formData.vehicleRegNo}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-lg px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${
                      errors.vehicleRegNo ? 'border-red-400' : 'border-blue-200'
                    }`}
                    placeholder="Enter registration number"
                  />
                  {errors.vehicleRegNo && (
                    <p className="mt-1 text-xs text-red-500">{errors.vehicleRegNo}</p>
                  )}
                </div>

                <div className="transition-all duration-200 hover:scale-[1.02]">
                  <label className="block text-sm font-semibold text-blue-700 text-left mb-1">
                    Vehicle Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-lg px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${
                      errors.vehicleType ? 'border-red-400' : 'border-blue-200'
                    }`}
                  >
                    <option value="">Select vehicle type</option>
                    {vehicleTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.vehicleType && (
                    <p className="mt-1 text-xs text-red-500">{errors.vehicleType}</p>
                  )}
                </div>

                <div className="transition-all duration-200 hover:scale-[1.02]">
                  <label className="block text-sm font-semibold text-blue-700 text-left mb-1">
                    Vehicle Registration Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="VehicleRegistrationDate"
                    value={formData.VehicleRegistrationDate}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-lg px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${
                      errors.VehicleRegistrationDate ? 'border-red-400' : 'border-blue-200'
                    }`}
                  />
                  {errors.VehicleRegistrationDate && (
                    <p className="mt-1 text-xs text-red-500">{errors.VehicleRegistrationDate}</p>
                  )}
                </div>

                <div className="transition-all duration-200 hover:scale-[1.02]">
                  <label className="block text-sm font-semibold text-blue-700 text-left mb-1">
                    Vehicle Owner Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicleOwnerName"
                    value={formData.vehicleOwnerName}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-lg px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${
                      errors.vehicleOwnerName ? 'border-red-400' : 'border-blue-200'
                    }`}
                    placeholder="Enter owner name"
                  />
                  {errors.vehicleOwnerName && (
                    <p className="mt-1 text-xs text-red-500">{errors.vehicleOwnerName}</p>
                  )}
                </div>

                <div className="transition-all duration-200 hover:scale-[1.02]">
                  <label className="block text-sm font-semibold text-blue-700 text-left mb-1">
                    Vehicle Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-lg px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${
                      errors.vehicleModel ? 'border-red-400' : 'border-blue-200'
                    }`}
                    placeholder="e.g., Honda City, Toyota Corolla"
                  />
                  {errors.vehicleModel && (
                    <p className="mt-1 text-xs text-red-500">{errors.vehicleModel}</p>
                  )}
                </div>

                <div className="transition-all duration-200 hover:scale-[1.02]">
                  <label className="block text-sm font-semibold text-blue-700 text-left mb-1">
                    Manufacture Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="manufactureYear"
                    value={formData.manufactureYear}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-lg px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${
                      errors.manufactureYear ? 'border-red-400' : 'border-blue-200'
                    }`}
                    placeholder="e.g., 2020"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                  />
                  {errors.manufactureYear && (
                    <p className="mt-1 text-xs text-red-500">{errors.manufactureYear}</p>
                  )}
                </div>

                <div className="transition-all duration-200 hover:scale-[1.02]">
                  <label className="block text-sm font-semibold text-blue-700 text-left mb-1">
                    Chassis Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="chasisNumber"
                    value={formData.chasisNumber}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-lg px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${
                      errors.chasisNumber ? 'border-red-400' : 'border-blue-200'
                    }`}
                    placeholder="Enter chassis number"
                  />
                  {errors.chasisNumber && (
                    <p className="mt-1 text-xs text-red-500">{errors.chasisNumber}</p>
                  )}
                </div>

                <div className="transition-all duration-200 hover:scale-[1.02]">
                  <label className="block text-sm font-semibold text-blue-700 text-left mb-1">
                    Vehicle Color <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="vehicleColor"
                    value={formData.vehicleColor}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-lg px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${
                      errors.vehicleColor ? 'border-red-400' : 'border-blue-200'
                    }`}
                  >
                    <option value="">Select color</option>
                    {vehicleColors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                  {errors.vehicleColor && (
                    <p className="mt-1 text-xs text-red-500">{errors.vehicleColor}</p>
                  )}
                </div>

                <div className="transition-all duration-200 hover:scale-[1.02]">
                  <label className="block text-sm font-semibold text-blue-700 text-left mb-1">
                    Engine CC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="vehicleEngineCC"
                    value={formData.vehicleEngineCC}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-lg px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${
                      errors.vehicleEngineCC ? 'border-red-400' : 'border-blue-200'
                    }`}
                    placeholder="e.g., 1500"
                    min="50"
                    max="10000"
                  />
                  {errors.vehicleEngineCC && (
                    <p className="mt-1 text-xs text-red-500">{errors.vehicleEngineCC}</p>
                  )}
                </div>

                <div className="transition-all duration-200 hover:scale-[1.02]">
                  <label className="block text-sm font-semibold text-blue-700 text-left mb-1">
                    Vehicle Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-lg px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${
                      errors.vehicleNumber ? 'border-red-400' : 'border-blue-200'
                    }`}
                    placeholder="e.g., Ba 1 Pa 1234"
                  />
                  {errors.vehicleNumber && (
                    <p className="mt-1 text-xs text-red-500">{errors.vehicleNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Tax Information */}
            <div>
              <h3 className="text-xl font-semibold text-blue-800 mb-6 border-l-4 border-blue-400 pl-3 animate-slide-right">
                Tax Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="transition-all duration-200 hover:scale-[1.02]">
                  <label className="block text-sm font-semibold text-blue-700 text-left mb-1">
                    Tax Pay Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="taxPayDate"
                    value={formData.taxPayDate}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-lg px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${
                      errors.taxPayDate ? 'border-red-400' : 'border-blue-200'
                    }`}
                  />
                  {errors.taxPayDate && (
                    <p className="mt-1 text-xs text-red-500">{errors.taxPayDate}</p>
                  )}
                </div>

                <div className="transition-all duration-200 hover:scale-[1.02]">
                  <label className="block text-sm font-semibold text-blue-700 text-left mb-1">
                    Tax Expire Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="taxExpireDate"
                    value={formData.taxExpireDate}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-lg px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${
                      errors.taxExpireDate ? 'border-red-400' : 'border-blue-200'
                    }`}
                  />
                  {errors.taxExpireDate && (
                    <p className="mt-1 text-xs text-red-500">{errors.taxExpireDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-8 border-t border-blue-100">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2 border border-blue-200 rounded-lg text-sm font-semibold text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
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
      {/* Animations */}
      <style>
        {`
          .animate-fade-in { animation: fadeIn 0.7s ease; }
          .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(.39,.575,.565,1.000); }
          .animate-slide-down { animation: slideDown 0.7s cubic-bezier(.39,.575,.565,1.000); }
          .animate-slide-right { animation: slideRight 0.7s cubic-bezier(.39,.575,.565,1.000); }
          .animate-bounce-slow { animation: bounceSlow 2.5s infinite; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: none;} }
          @keyframes slideDown { from { opacity: 0; transform: translateY(-30px);} to { opacity: 1; transform: none;} }
          @keyframes slideRight { from { opacity: 0; transform: translateX(-30px);} to { opacity: 1; transform: none;} }
          @keyframes bounceSlow {
            0%, 100% { transform: translateY(0);}
            50% { transform: translateY(-10px);}
          }
        `}
      </style>
    </div>
  );
}

export default NewBluebook;