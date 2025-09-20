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
            <h1 className="text-2xl font-bold text-red-700">
              Hi, {auth?.user?.name || "Admin"}!
            </h1>
            <p className="text-gray-900">Welcome to the Admin Dashboard</p>
          </div>
         
        </div>
        <hr />
      
  {/* <AdminMenu/> */}

              <div className="bg-white rounded-lg  p-6">
 <br /> 
 <br />
      


  </div>
        <hr />
 

     
      </div>
    </Layout>
  );
};

export default AdminDashboard;
