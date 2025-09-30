import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth";
import { toast } from "react-toastify";
import {
  FaHome,
  FaFileInvoiceDollar,
  FaUserPlus,
  FaClipboardList,
  FaUsers,
  FaUserTie,
  FaBroadcastTower,
  FaCheckCircle,
  FaTrain,
  FaSignOutAlt,
} from "react-icons/fa";

import { BsChatText } from "react-icons/bs";

const ManagerMenu = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logout successfully");
    setTimeout(() => navigate("/"), 1000);
  };

    // Fetch chats
    const fetchChats = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND}/api/v1/chat/getchats`
        );
  
        let allChats = res.data.chats || res.data.chat || [];
        allChats = allChats.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setChats(allChats);
      } catch (err) {
        console.error("Error fetching chats:", err);
      } finally {
        setLoading(false);
      }
    };

  const menuItems = [
    { to: "/dashboard/manager", label: "Home", icon: <FaHome /> },
     { to: "/dashboard/manager/connect", label: "Connect", icon: <BsChatText /> },
    { to: "/dashboard/manager/bills", label: "Bill Details", icon: <FaFileInvoiceDollar /> },
    { to: "/dashboard/manager/addworkers", label: "Add Worker", icon: <FaUserPlus /> },
    { to: "/dashboard/manager/attendance", label: "Attendance", icon: <FaClipboardList /> },
    { to: "/dashboard/manager/addsupervisors", label: "Add Supervisor", icon: <FaUserTie /> },
    { to: "/dashboard/manager/livework", label: "Live Works", icon: <FaBroadcastTower /> },
    { to: "/dashboard/manager/completed", label: "Completed Works", icon: <FaCheckCircle /> },
    { to: "/dashboard/manager/staffdetails", label: "Staff Details", icon: <FaUsers /> },
    { to: "/dashboard/user", label: "Supervisor Tab", icon: <FaTrain /> },

  ];

  return (
    <aside className="w-64 bg-white shadow-lg rounded-2xl p-6 hidden md:block transition-all duration-300">
      <h2 className="text-2xl font-bold text-red-600 mb-6 border-b pb-2">Quick Links</h2>
      <nav className="space-y-3">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default ManagerMenu;
