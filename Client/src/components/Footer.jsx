import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaShieldAlt, FaCar, FaFileAlt, FaUsers, FaClock } from "react-icons/fa";

function Footer() {
  const navigate = useNavigate();

  const handleProtectedLink = (path) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please login to access this feature');
      navigate('/login');
      return;
    }
    navigate(path);
  };

  const handleLink = (path) => {
    navigate(path);
  };

  return (
    <footer className="bg-gradient-to-br from-nepal-blue via-blue-800 to-nepal-blue text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Department Information */}
          <div className="lg:col-span-2">
            <div className="flex items-start mb-6">
              <FaShieldAlt className="h-10 w-10 text-yellow-400 mr-4 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Department of Transport Management</h3>
                <p className="text-blue-100 text-lg font-medium mb-3">Government of Nepal</p>
                <p className="text-blue-100 leading-relaxed text-base">
                  The Department of Transport Management is responsible for regulating and managing 
                  all aspects of road transport in Nepal, including vehicle registration, licensing, 
                  and ensuring road safety standards across the country.
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <FaInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <FaFileAlt className="mr-2" />
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleLink('/')}
                  className="text-blue-200 hover:text-white transition-colors flex items-center w-full text-left"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleProtectedLink('/dashboard')}
                  className="text-blue-200 hover:text-white transition-colors flex items-center w-full text-left"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleProtectedLink('/bluebook/new')}
                  className="text-blue-200 hover:text-white transition-colors flex items-center w-full text-left"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  New Bluebook
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleProtectedLink('/profile')}
                  className="text-blue-200 hover:text-white transition-colors flex items-center w-full text-left"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  My Profile
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLink('/login')}
                  className="text-blue-200 hover:text-white transition-colors flex items-center w-full text-left"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  Login
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <FaPhone className="mr-2" />
              Contact Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <FaMapMarkerAlt className="h-4 w-4 text-yellow-400 mt-1 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-blue-100 text-sm">
                    Transport Management Office<br />
                    Babar Mahal, Kathmandu<br />
                    Nepal
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <FaPhone className="h-4 w-4 text-yellow-400 mr-3 flex-shrink-0" />
                <a href="tel:+977-1-4221234" className="text-blue-200 hover:text-white transition-colors text-sm">
                  +977-1-4221234
                </a>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="h-4 w-4 text-yellow-400 mr-3 flex-shrink-0" />
                <a href="mailto:info@dotm.gov.np" className="text-blue-200 hover:text-white transition-colors text-sm">
                  info@dotm.gov.np
                </a>
              </div>
              <div className="flex items-center">
                <FaGlobe className="h-4 w-4 text-yellow-400 mr-3 flex-shrink-0" />
                <a href="https://dotm.gov.np" className="text-blue-200 hover:text-white transition-colors text-sm">
                  www.dotm.gov.np
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mt-12 pt-8 border-t border-blue-600">
          <h4 className="text-lg font-semibold mb-6 text-center flex items-center justify-center">
            <FaCar className="mr-2" />
            Our Services
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-blue-800/30 rounded-lg hover:bg-blue-800/50 transition-colors">
              <FaCar className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm">Vehicle Registration</p>
            </div>
            <div className="text-center p-4 bg-blue-800/30 rounded-lg hover:bg-blue-800/50 transition-colors">
              <FaFileAlt className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm">License Renewal</p>
            </div>
            <div className="text-center p-4 bg-blue-800/30 rounded-lg hover:bg-blue-800/50 transition-colors">
              <FaUsers className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm">Driver Training</p>
            </div>
            <div className="text-center p-4 bg-blue-800/30 rounded-lg hover:bg-blue-800/50 transition-colors">
              <FaShieldAlt className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm">Safety Standards</p>
            </div>
            <div className="text-center p-4 bg-blue-800/30 rounded-lg hover:bg-blue-800/50 transition-colors">
              <FaClock className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm">24/7 Support</p>
            </div>
            <div className="text-center p-4 bg-blue-800/30 rounded-lg hover:bg-blue-800/50 transition-colors">
              <FaGlobe className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm">Online Services</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-blue-900/50 border-t border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-blue-200 text-sm">
              &copy; {new Date().getFullYear()} Department of Transport Management, Government of Nepal. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-blue-200 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-blue-200 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="/accessibility" className="text-blue-200 hover:text-white transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
