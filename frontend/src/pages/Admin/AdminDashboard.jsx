import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/Auth";
import { Link } from "react-router-dom";
import useStates from '../../hooks/useStates.jsx'
import AdminMenu from '../../components/layout/AdminMenu'; 

const AdminDashboard = () => {
  const states = useStates();

  const [auth] = useAuth();




  const renderTableRows = () =>
    states.map((state , index) => (
      <tr
        key={state._id}
        className="hover:bg-gray-100 border-t border-gray-300"
      >
        <td className="px-4 py-2 text-gray-700">{index+1}</td>
        <td className="px-4 py-2 text-gray-700">{state.name}</td>
        <td className="px-4 py-2">
          <Link
            to={`/dashboard/admin/states/${state._id}`}
            className="text-blue-500 hover:underline"
          >
            View Details
          </Link>
        </td>
      </tr>
    ));

 

  return (
    <Layout title="Dashboard - Admin">
      <div className="container mx-auto mt-7 p-4 space-y-8">
           <div className="flex justify-between items-center p-6 ">
          <div>
            <h1 className="text-2xl font-bold text-red-600">
              Hi, {auth?.user?.name || "Admin"}!
            </h1>
            <p className="text-gray-600">Welcome to the Admin Dashboard</p>
          </div>
         
        </div>
        <hr />
      
  {/* <AdminMenu/> */}

              <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">States</h2>
          <table className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                  State ID
                </th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                  State Name
                </th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
        </div>
        <hr />
 

     
      </div>
    </Layout>
  );
};

export default AdminDashboard;
