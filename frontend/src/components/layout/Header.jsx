import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaInstagram, FaWhatsapp, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../../context/Auth';
import { toast } from 'react-toastify';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: '' });
    localStorage.removeItem('auth');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-black shadow-lg">
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

          {/* Contact Info (Desktop only) */}
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

          {/* Desktop Nav Links */}
          <div className="hidden sm:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-gray-300 text-sm font-medium">Home</Link>
            <Link to="/about" className="text-white hover:text-gray-300 text-sm font-medium">About</Link>

            {!auth.user ? (
              <>
                <Link to="/register" className="text-white hover:text-gray-300 text-sm font-medium">Register</Link>
                <Link to="/login" className="text-white hover:text-gray-300 text-sm font-medium">Login</Link>
              </>
            ) : (
              <>
                <span className="text-white text-sm">{auth.user.name}</span>
                <button onClick={handleLogout} className="text-white hover:text-red-400 text-sm font-medium">
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
     
          
        </div>

        {/* Mobile Menu */}
   
      </div>
    </nav>
  );
};

export default Header;
