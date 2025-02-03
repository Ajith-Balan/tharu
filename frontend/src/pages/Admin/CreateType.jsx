import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import AdminMenu from '../../components/layout/AdminMenu';
import { toast } from 'react-toastify';
import axios from 'axios';

const CreateType = () => {
  const [states, setStates] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState({
    state: '',
    site: '',
  });
  const [names, setNames] = useState(['']); // Array of names, initially one empty input

  // Fetch all states
  const getAllStates = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_APP_BACKEND}/api/v1/states/get-states`);
      if (data?.success) {
        setStates(data?.state);
      } else {
        toast.error('Failed to fetch States');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong in getting States');
    }
  };

  // Fetch sites for the selected state
  const getSitesByStates = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/site/site-states/${types.state}`
      );
      if (data?.success) {
        setSites(data?.sites);
      } else {
        toast.error('Failed to fetch sites');
        setSites([]);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong in getting sites');
      setSites([]);
    }
  };

  useEffect(() => {
    getAllStates();
  }, []);

  useEffect(() => {
    if (types.state) {
      getSitesByStates();
    } else {
      setSites([]);
    }
  }, [types.state]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTypes((prevTypes) => ({
      ...prevTypes,
      [name]: value,
    }));
  };

  // Handle name input changes
  const handleNameChange = (index, value) => {
    const updatedNames = [...names];
    updatedNames[index] = value;
    setNames(updatedNames);
  };

  // Add new name input
  const addNameField = () => {
    setNames([...names, '']);
  };

  // Add site for all names
  const handleAddType = async (e) => {
    e.preventDefault();

    if (!types.state || !types.site) {
      toast.error('Please select a state and a site');
      return;
    }

    setLoading(true);

    for (const name of names) {
      if (!name.trim()) continue; // Skip empty names
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_APP_BACKEND}/api/v1/types/create-worktype`,
          {
            name,
            state: types.state,
            site: types.site,
          }
        );
        if (data?.success) {
          toast.success(`Work type "${name}" added successfully!`);
        } else {
          toast.error(data?.message || `Failed to add "${name}"`);
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || `Something went wrong while adding "${name}"`);
      }
    }

    setLoading(false);
    setNames(['']); // Reset name fields after submission
  };

  return (
    <Layout title="Dashboard - Create Work Type">
      <div className="container mx-auto my-6 p-6 bg-white shadow-lg rounded-lg">
        <AdminMenu />

        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 mb-6 md:mb-0"></div>
          <div className="md:w-3/4">
            <h1 className="text-3xl font-bold mb-6">Create Work Type</h1>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">State</label>
                <select
                  name="state"
                  value={types.state}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select a State
                  </option>
                  {states.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Site</label>
                <select
                  name="site"
                  value={types.site}
                  className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none ${
                    types.state
                      ? 'focus:ring-2 focus:ring-blue-500'
                      : 'bg-gray-100 cursor-not-allowed'
                  }`}
                  onChange={handleChange}
                  disabled={!types.state}
                >
                  <option value="" disabled>
                    {types.state ? 'Select a Site' : 'Select a State first'}
                  </option>
                  {sites.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Work Type</label>
                {names.map((name, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      placeholder="Enter work type name"
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {index === names.length - 1 && (
                      <button
                        type="button"
                        onClick={addNameField}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:ring focus:ring-green-300"
                        aria-label="Add another work type"
                      >
                        +
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <button
                  className={`w-full py-2 text-white rounded-lg ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring focus:ring-blue-500'
                  }`}
                  onClick={handleAddType}
                  disabled={
                    loading || !types.state || !types.site || names.every((name) => !name.trim())
                  }
                >
                  {loading ? 'Adding...' : 'ADD WORK TYPE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateType;
