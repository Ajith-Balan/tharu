import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Auth';
import { toast } from "react-toastify";
const AdminMenu = () => {
  
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();

   const handleLogout = () => {
      setAuth({ ...auth, user: null, token: '' });
      localStorage.removeItem('auth');
      toast.success('Logout successfully');
      setTimeout(() => navigate('/'), 1000);
    };
  return (
    <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
      <h2 className="text-xl font-semibold text-red-600 mb-6">Quick Links</h2>
      <nav className="space-y-4">
        <Link to="/dashboard/manager" className="block text-gray-700 hover:text-red-500">
          ⌂ Home
        </Link>
         <Link to="/dashboard/manager/bills" className="block text-gray-700 hover:text-red-500">
           Bill Details
        </Link>

         <Link to="/dashboard/manager/addworkers" className="block text-gray-700 hover:text-red-500">
          ➕ Add Worker
        </Link>
           <Link to="/dashboard/manager/attendance" className="block text-gray-700 hover:text-red-500">
          🧑 Attendance
        </Link>
        <Link to="/dashboard/manager/addsupervisors" className="block text-gray-700 hover:text-red-500">
      🧑 Add Supervisor
        </Link>
         <Link to="/dashboard/manager/livework" className="block text-gray-700 hover:text-red-500">
          📡 Live Works
        </Link> 

        <Link to="/dashboard/manager/completed" className="block text-gray-700 hover:text-red-500">
          📡 Completed Works
        </Link> 
       
        <Link to="/dashboard/manager/staffdetails" className="block text-gray-700 hover:text-red-500">
          🧑 Staff Details
        </Link>

          <Link to="/dashboard/user/" className="block text-gray-700 hover:text-red-500">
          🚆 Supervisor Tab 
        </Link>
                            <button
  onClick={handleLogout}
 className="block text-gray-700 hover:text-red-500"
>
  Logout
</button>
      
        {/* Add more links as needed */}
      </nav>
    </aside>
  );
};

export default AdminMenu;
