import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { FaInstagram, FaWhatsapp, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../../context/Auth';
import { toast } from 'react-toastify';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsOpenDropdown(!isOpenDropdown);

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: '' });
    localStorage.removeItem('auth');
    toast.success('Logout successfully');
    setTimeout(() => navigate('/'), 1000);
  };

  return (
    <nav className="w-full bg-teal-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-white text-lg font-bold">
            <img
              className="h-12 w-auto rounded-lg"
              src="https://www.tharuandsons.in/wp-content/uploads/2023/04/logo-tagline-2.jpg"
              alt="Logo"
            />
          </Link>

          {/* Contact Info */}
          <div className="hidden sm:flex items-center space-x-4 text-white">
            <div className="flex items-center space-x-2">
              <FaPhoneAlt className="w-4 h-4" />
              <span>+91 907421 5454</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaEnvelope className="w-4 h-4" />
              <span>info@tharuandsons.in</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center space-x-6">
            {["Home", "About Us", "Our Services", "Contact Us"].map((item, index) => (
              <Link
                key={index}
                to={`/${item.replace(/\s+/g, "").toLowerCase()}`}
                className="text-white hover:text-gray-300 text-sm font-medium transition duration-300"
              >
                {item}
              </Link>
            ))}

            {!auth.user ? (
              <>
                <Link to="/register" className="text-white hover:text-gray-300 text-sm font-medium transition duration-300">
                  Register
                </Link>
                <Link to="/login" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
              </>
            ) : (
              <div className="relative">
                <button onClick={toggleDropdown} className="flex items-center px-4 py-2 text-sm font-medium text-white hover:text-gray-300">
                  {auth?.user?.name}
                  <svg className="h-5 w-5 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {isOpenDropdown && (
                  <div className="absolute z-50 right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <button
                      onClick={handleLogout}
                      className="block w-full  text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="sm:hidden text-white hover:text-gray-300"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="sm:hidden px-2 pt-2 pb-3 space-y-1 bg-teal-600">
            {["Home", "About Us", "Our Services", "Contact Us"].map((item, index) => (
              <Link
                key={index}
                to={`/${item.replace(/\s+/g, "").toLowerCase()}`}
                className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium"
              >
                {item}
              </Link>
            ))}
            {!auth.user ? (
              <>
                <Link to="/register" className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium">
                  Register
                </Link>
                <Link to="/login" className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium">
                  Login
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="block  text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium cursor-pointer">
                Logout
              </button>
            )}

            {/* Social Icons */}
            <div className="flex gap-4 mt-4 justify-center">
              <a href="https://www.instagram.com/cj_attire" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white hover:text-gray-400">
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="https://wa.me/qr/VIQQXSHMF7K4O1" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-white hover:text-gray-400">
                <FaWhatsapp className="h-6 w-6" />
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
