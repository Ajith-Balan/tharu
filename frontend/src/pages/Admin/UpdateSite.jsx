import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout.jsx';
import AdminMenu from '../../components/layout/AdminMenu.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateSite = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Fix destructuring here
  
  const [siteData, setsiteData] = useState({
    
  });

  const [categories, setCategories] = useState([]);

  // Get single site
  const getSinglesite = async () => {
    try {
      const  res  = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/site/getone-site/${id}`
      );
      setsiteData({ ...res.data }); // Correct destructuring
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching the site details");
    }
  };

  useEffect(() => {
    getSinglesite();
  }, []);

  // Get all categories
  const getAllstate = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_APP_BACKEND}/api/v1/states/get-states`);
      if (data?.success) {
        setCategories(data?.state);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting categories");
    }
  };

  useEffect(() => {
    getAllstate();
  }, []);

  // Update site function
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {


      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/site/update-site/${id}`, // Use the id from the URL
        siteData
      );
      if (data?.success) {
        toast.error(data?.message);
      } else {
        toast.success("site Updated Successfully");
       }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while updating the site");
    }
  };

  // Delete a site
  const handleDelete = async () => {
    try {
      let answer = window.prompt("Are you sure you want to delete this site?");
      if (!answer) return;
      const { data } = await axios.delete(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/site/delete-site/${id}` // Use the id from the URL
      );
      toast.success("site Deleted Successfully");
      setTimeout(() => {
      navigate("/dashboard/admin/sites");
    }, 1000);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while deleting the site");
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setsiteData({ ...siteData, [e.target.name]: e.target.value });
  };

  return (
    <Layout title={"Dashboard - Update site"}>

      <div className="container mx-auto my-6 p-6 bg-white shadow-lg rounded-lg">
      <AdminMenu />

        <div className="flex justify-center">
         
          <div className="w-3/4">
            <h1 className="text-2xl font-bold mb-6">Update Site</h1>
            <div className="space-y-4 w-full">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">State</label>
                <select
                  name="state"
                  className="block w-full p-2 border border-gray-300 rounded-md"
                  onChange={(e) => setsiteData({ ...siteData, state: e.target.value })}
                  value={siteData.state}
                >
                  <option value="">Select a state</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
      
            



           




              









              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Site name</label>
                <input
                  type="text"
                  name="name"
                  value={siteData.name}
                  placeholder="Write a name"
                  className="block w-full p-2 border border-gray-300 rounded-md"
                  onChange={handleInputChange}
                />
              </div>
         
        

             
            
              <div>
                <button
                  className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={handleUpdate}
                >
                  UPDATE SITE
                </button>
              </div>
              <div>
                <button
                  className="w-full p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  onClick={handleDelete}
                >
                  DELETE SITE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateSite;
