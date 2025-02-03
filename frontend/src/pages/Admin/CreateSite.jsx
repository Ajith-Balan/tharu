import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import AdminMenu from '../../components/layout/AdminMenu'; 
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateSite = () => {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [site, setSite] = useState({
    name: '',
  
    state: '',
  });

  // Fetch all categories
  const getAllStates = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_APP_BACKEND}/api/v1/states/get-states`);
      if (data?.success) {
        setStates(data?.state);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong in getting categories');
    }
  };

  useEffect(() => {
    getAllStates();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSite((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // Create product
  const handleCreate = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!site.name || !site.state) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_APP_BACKEND}/api/v1/site/create-site`, site);
      if (data?.success) {
        toast.success(data?.message);
      setSite({
         name: '',
   
    state: '',
      })
      } else {
        toast.error(data?.message || 'Product creation failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while creating the product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={"Dashboard - Create site"}>
      <div className="container mx-auto my-6 p-6 bg-white shadow-lg rounded-lg">
      <AdminMenu />

        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 mb-6 md:mb-0">
          </div>
          <div className="md:w-3/4">
            <h1 className="text-3xl font-bold mb-6">Create Site place</h1>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">State</label>
                <select
                  name="state"
                  value={site.state}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                >
                  <option value="" disabled>Select a State</option>
                  {states.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <input
                  type="text"
                  name="name"
                  value={site.name}
                  placeholder="Site place name"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                  required
                />
              </div>
         
     

              

           

              <div>
                <button
                  className={`w-full py-2 ${loading ? 'bg-gray-400' : 'bg-blue-600'} text-white rounded-lg hover:bg-blue-700 transition duration-300`}
                  onClick={handleCreate}
                  disabled={loading} // Disable button during loading
                >
                  {loading ? 'Creating...' : 'CREATE SITE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateSite;
