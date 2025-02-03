import React from 'react';
import { Link } from 'react-router-dom';

const AdminMenu = () => {
  return (
    <nav className="bg-gray-200 rounded w-full text-black-800 shadow-md">
      <div className="container mx-auto px-4">
        <ul className="flex flex-wrap justify-center md:justify-start space-x-4 py-3">
          <li>
            <Link 
              to="/dashboard/admin/create-states" 
              className="hover:bg-gray-700 px-4 py-2 rounded transition duration-200"
            >
              State +
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard/admin/create-site" 
              className="hover:bg-gray-700 px-4 py-2 rounded transition duration-200"
            >
           Site Place +
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard/admin/create-type" 
              className="hover:bg-gray-700 px-4 py-2 rounded transition duration-200"
            >
              Type +
            </Link>
          </li>
      
        </ul>
      </div>
    </nav>
  );
};

export default AdminMenu;
