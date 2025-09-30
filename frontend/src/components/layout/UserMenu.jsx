import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth";
import { toast } from "react-toastify";
import {
  FaHome,
  FaPlusCircle,
  FaBroadcastTower,
  FaCheckCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const UserMenu = () => {
  const [auth, setAuth] = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logged out successfully");
    setTimeout(() => navigate("/"), 1000);
  };

  const links = [
    { name: "Home", path: "/dashboard/user/", icon: <FaHome /> },
    { name: "Add Duty", path: "/dashboard/user/addduty", icon: <FaPlusCircle /> },
    { name: "Live Duty", path: "/dashboard/user", icon: <FaBroadcastTower /> },
    { name: "Completed Duty", path: "/dashboard/user/completedduty", icon: <FaCheckCircle /> },
  ];

  return (
    <aside className="w-full md:w-64 bg-white h-full p-6 shadow-lg rounded-2xl sticky top-0 transition-all duration-300">
      <h2 className="text-xl font-bold text-blue-600 mb-6 border-b pb-2">
        Quick Links
      </h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 transition-all duration-200
              ${
                location.pathname === link.path
                  ? "bg-blue-100 font-semibold text-blue-600"
                  : "hover:bg-blue-50 hover:text-blue-600"
              }`}
          >
            <span className="text-lg">{link.icon}</span>
            <span className="text-sm">{link.name}</span>
          </Link>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="text-sm">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default UserMenu;
