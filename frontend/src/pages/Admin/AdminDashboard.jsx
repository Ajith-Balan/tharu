import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/Auth";
import { Link } from "react-router-dom";
import useStates from '../../hooks/useStates.jsx'
import AdminMenu from '../../components/layout/AdminMenu'; 

const AdminDashboard = () => {
  const states = useStates();

  const [auth] = useAuth();




  

 

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

              <div className="bg-white rounded-lg  p-6">
          <h2 className="text-xl font-bold text-center text-gray-700 mb-4">States</h2> <br /> <br />
      <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-4 ">

{
          states.map((state , index) => (
      <div
        key={state._id}
        className="hover:bg-gray-100 border-2 border-teal-100 p-2 text-center rounded shadow grid col-4 border-gray-300"
      >
        
          <Link
            to={`/dashboard/admin/states/${state._id}`}
            className="  hover:text-blue-500"
          >
            <h5 className="font-semibold">
            {state.name.toUpperCase()}
            </h5>
           
          </Link>
      </div>
    ))
    
  }
        </div>


  </div>
        <hr />
 

     
      </div>
    </Layout>
  );
};

export default AdminDashboard;
