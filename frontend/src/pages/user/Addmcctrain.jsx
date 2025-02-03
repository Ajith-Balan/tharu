import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import UserMenu from "../../components/layout/UserMenu";
import { useAuth } from "../../context/Auth";
const Addmcctrain = ( ) => {
  const [auth] = useAuth()
  const [loading, setLoading] = useState(false);
  const [trainDetails, setTrainDetails] = useState({
    trainno: "",
    supervisor: auth?.user?._id || "",
    totalcoach: "",
    type: "",
    workers: "",
    site: auth?.user?.type || "",
    status: "processing",
  });

  const handleTrainChange = (e) => {
    const { name, value } = e.target;
    setTrainDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTrain = async () => {
    if (
      !trainDetails.trainno ||
      !trainDetails.totalcoach ||
      !trainDetails.type ||
      !trainDetails.workers ||
      !trainDetails.supervisor
    ) {
      toast.error("Please fill all the required fields.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/create-mcctrain`,
        trainDetails
      );
      if (data?.success) {
        toast.success("Train details added successfully!");
        setTrainDetails({
          trainno: "",
          supervisor: auth?.user?.id || "",
          totalcoach: "",
          type: "",
          workers: "",
          site: auth?.user?.type || "",
          status: "processing",
        });
      } else {
        toast.error(data?.message || "Failed to add train details.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Dashboard - Add MCC Train">
      <div className="container mx-auto my-6 p-6 bg-white shadow-lg rounded-lg">
        <UserMenu />
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 mb-6 md:mb-0"></div>
          <div className="md:w-3/4">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Add Train Details</h2>

              <div>
                <label className="block text-gray-700 mb-2">Train Number</label>
                <input
                  type="text"
                  name="trainno"
                  value={trainDetails.trainno}
                  onChange={handleTrainChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter train number"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Total Coaches</label>
                <input
                  type="number"
                  name="totalcoach"
                  value={trainDetails.totalcoach}
                  onChange={handleTrainChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter total coaches"
                />
              </div>

              <div>
  <label className="block text-gray-700 mb-2">Type</label>
  <select
    name="type"
    value={trainDetails.type}
    onChange={handleTrainChange}
    className="w-full p-2 border border-gray-300 rounded-lg"
  >
    <option value="" disabled>
      Select train type
    </option>
    <option value="Primary">Primary</option>
    <option value="Secondary">Secondary</option>
  </select>
</div>


              <div>
                <label className="block text-gray-700 mb-2">Workers</label>
                <input
                  type="number"
                  name="workers"
                  value={trainDetails.workers}
                  onChange={handleTrainChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter workers count"
                />
              </div>

              <button
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                onClick={handleAddTrain}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Add Train Details"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Addmcctrain;
