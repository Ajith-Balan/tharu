import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/Auth';

const UserMenu = () => {
  const [auth] = useAuth();

  return (
    <div className="flex flex-col space-y-4">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">User Menu</h2>
        <div className="space-y-4">
          {/* Add MCC Train Button */}
          <Link
            to="/dashboard/user/addmcctrain"
            className="inline-flex items-center justify-center w-full text-center bg-red-500 text-white py-3 rounded-md hover:bg-red-600 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Add MCC Train
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;

