import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaInstagram,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../context/Auth";
import { toast } from "react-toastify";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Container */}
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              className="h-10 sm:h-12 w-auto rounded-md"
              src="https://www.tharuandsons.in/wp-content/uploads/2023/04/logo-tagline-2.jpg"
              alt="Tharu & Sons Logo"
            />
          </Link>

          {/* Desktop Contact Info */}
          <div className="hidden lg:flex items-center space-x-6 text-gray-800 text-sm">
            <div className="flex items-center space-x-2">
              <FaPhoneAlt className="text-teal-400" />
              <span>+91 907421 5454</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaEnvelope className="text-teal-400" />
              <span>info@tharuandsons.in</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {["Home", "About", "Services", "Contact"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="text-gray-800 hover:text-teal-400 transition text-sm font-medium"
              >
                {item}
              </Link>
            ))}

            {!auth.user ? (
              <>
                <Link
                  to="/register"
                  className="text-gray-800 hover:text-teal-400 text-sm font-medium"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="text-gray-800 hover:text-teal-400 text-sm font-medium"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                <span className="text-gray-800 text-sm">{auth.user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-100 hover:text-red-400 text-sm font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-black focus:outline-none transition-transform duration-300 hover:scale-110"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        ref={menuRef}
        className={`md:hidden fixed top-[60px] left-0 w-full bg-white text-gray-500 transition-all duration-500 ease-in-out ${
          isOpen
            ? "max-h-[500px] opacity-100 shadow-lg"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col items-center py-4 space-y-4">
          {/* Menu Links */}
          {["Home", "About", "Services", "Contact"].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className="hover:text-teal-400 transition text-base font-medium"
            >
              {item}
            </Link>
          ))}

          {!auth.user ? (
            <>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="hover:text-teal-400 text-base font-medium"
              >
                Register
              </Link>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="hover:text-teal-400 text-base font-medium"
              >
                Login
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm">{auth.user.name}</span>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="hover:text-red-400 text-base font-medium"
              >
                Logout
              </button>
            </>
          )}

          {/* Divider */}
          <div className="w-3/4 border-t border-gray-700"></div>

          {/* Social Icons */}
          <div className="flex items-center justify-center space-x-6 pt-2">
            <a
              href="https://wa.me/919074215454"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400"
            >
              <FaWhatsapp size={20} />
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400"
            >
              <FaInstagram size={20} />
            </a>
            <a href="tel:+919074215454" className="hover:text-blue-400">
              <FaPhoneAlt size={18} />
            </a>
            <a
              href="mailto:info@tharuandsons.in"
              className="hover:text-yellow-400"
            >
              <FaEnvelope size={18} />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
