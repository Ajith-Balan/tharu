import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout.jsx';
import AdminMenu from '../../components/layout/AdminMenu.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateStates = () => {
  const [states, setStates] = useState([]);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("")

  // Handle form submission (Create)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_APP_BACKEND}/api/v1/states/create-states`, {
        name
      });
      if (data?.success) {
        toast.success(`${name} is created`);
        setName("");
        getAllStates()
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in the input form");
    }
  };

  // Get all categories
  const getAllStates = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_APP_BACKEND}/api/v1/states/get-states`);
      if (data?.success) {
        setStates(data.state);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in getting States");
    }
  };

  useEffect(() => {
    getAllStates();
  }, []);

  // Update category
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/states/update-states/${selected._id}`,
        { name: updatedName,  }
      );
      if (data?.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        getAllStates();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong during update");
    }
  };

  // Delete category
  const handleDelete = async (pId) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/states/delete-states/${pId}`
      );
      if (data.success) {
        toast.success("State is deleted");
        getAllStates();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };


  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container mx-auto my-6 p-6 bg-white shadow-lg rounded-lg">
      <AdminMenu />

        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 mb-4 md:mb-0">
          </div>
          <div className="md:w-3/4">
            <h1 className="text-3xl font-semibold mb-6">Manage All State</h1>

            {/* Create category form */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-6 w-full md:w-1/2">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
                    State Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="category"
                    name='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter category name"
                    required
                  />
                </div>


                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Create
                </button>
              </form>
            </div>

            {/* Display categories */}
            <div className="overflow-x-auto w-full">
              <table className="table-auto w-full bg-white shadow-md rounded-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {states?.map((c) => (
                    <tr key={c._id} className="border-b">
                      <td className="px-4 py-2">{c.name}</td>
                      <td className="px-4 py-2">
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 mr-2"
                          onClick={() => {
                            setUpdatedName(c.name);
                            setSelected(c);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                          onClick={() => handleDelete(c._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Edit category form */}
            {selected && (
              <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-lg w-full md:w-1/2">
                <h3 className="text-xl font-semibold mb-4">Edit State</h3>
                <form onSubmit={handleUpdate}>
                  <div className="mb-4">
                    <label htmlFor="editCategory" className="block text-gray-700 font-medium mb-2">
                      Updated State Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      id="editCategory"
                      value={updatedName}
                      onChange={(e) => setUpdatedName(e.target.value)}
                      required
                    />
                  </div>

               

                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                  >
                    Update
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateStates;
