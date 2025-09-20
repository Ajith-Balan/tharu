import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Auth';
import { toast } from 'react-toastify';

const UserMenu = () => {
  const [auth, setAuth] = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: '' });
    localStorage.removeItem('auth');
    toast.success('Logged out successfully');
    setTimeout(() => navigate('/'), 1000);
  };

  const links = [
     { name: 'Home', path: '/dashboard/user/', icon: '⌂' },
    { name: 'Add Duty', path: '/dashboard/user/addduty', icon: '🚆' },
    { name: 'Live Duty', path: '/dashboard/user', icon: '📡' },
    { name: 'Completed Duty', path: '/dashboard/user/completedduty', icon: '✅' },
   
  ];

  return (
    <aside className="w-full md:w-64 bg-white h-full p-6 shadow-md sticky top-0">
      <h2 className="text-xl font-semibold text-blue-600 mb-6 border-b pb-2">Quick Links</h2>
      <nav className="space-y-3">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`block py-2 px-4 rounded-lg text-gray-700 hover:bg-blue-100 transition 
            ${location.pathname === link.path ? 'bg-blue-100 font-semibold text-blue-600' : ''}`}
          >
            <span className="mr-2">{link.icon}</span> {link.name}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="w-full text-left py-2 px-4 rounded-lg text-red-600 hover:bg-red-100 transition"
        >
          🚪 Logout
        </button>
      </nav>
    </aside>
  );
};

export default UserMenu;
