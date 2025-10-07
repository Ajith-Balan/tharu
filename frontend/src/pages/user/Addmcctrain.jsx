import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import UserMenu from "../../components/layout/UserMenu";
import { useAuth } from "../../context/Auth";

const Addmcctrain = () => {
  const [auth] = useAuth();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allWorkers, setAllWorkers] = useState([]);
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const options = ["mcc", "acca", "bio", "laundry", "pftr", "pit & yard"];
  const userWork = auth?.user?.work?.toLowerCase() || "";

  const displayedTabs = userWork ? options.filter((opt) => opt === userWork) : options;

  useEffect(() => {
    if (userWork && options.includes(userWork)) {
      setSelectedCategory(userWork);
    }
  }, [userWork]);

  const [trainDetails, setTrainDetails] = useState({
    work: selectedCategory,
    trainno: "",
    supervisor: auth?.user?._id || "",
    totalcoach: "",
    type: "",
    workers: [],
    status: "processing",
    suppliedBedsheet: "",
  });

  const reqq = trainDetails.totalcoach ? trainDetails.totalcoach * 0.6 : 0;
  const used = selectedWorkers.length;

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND}/api/v1/worker/get-workers`
        );
        setAllWorkers(res.data);
      } catch (error) {
        console.error("Failed to fetch workers:", error);
      }
    };
    fetchWorkers();
  }, []);

  const handleSelectWorker = (worker) => {
    if (!selectedWorkers.find((w) => w._id === worker._id)) {
      const updated = [...selectedWorkers, worker];
      setSelectedWorkers(updated);
      setTrainDetails({ ...trainDetails, workers: updated.map((w) => w._id) });
    }
    setSearchTerm("");
  };

  const handleRemoveWorker = (workerId) => {
    const updated = selectedWorkers.filter((w) => w._id !== workerId);
    setSelectedWorkers(updated);
    setTrainDetails({ ...trainDetails, workers: updated.map((w) => w._id) });
  };

  const filteredWorkers = allWorkers.filter(
    (w) =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedWorkers.some((sel) => sel._id === w._id)
  );

  const handleTrainChange = (e) => {
    const { name, value } = e.target;
    setTrainDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTrain = async () => {
    const { trainno, totalcoach, type, workers, supervisor, suppliedBedsheet } = trainDetails;

    if (["mcc", "bio", "acca"].includes(selectedCategory)) {
      if (!workers || !supervisor) {
        toast.error("Please fill all required fields.");
        return;
      }

      if (selectedCategory === "acca" && !suppliedBedsheet) {
        toast.error("Please enter supplied bedsheet count.");
        return;
      }
    } else {
      if (!workers) {
        toast.error("Please select at least one worker.");
        return;
      }
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/create-mcctrain`,
        { ...trainDetails, reqq, used, work: selectedCategory }
      );

      if (data?.success) {
        toast.success("Train details added successfully!");
        setTrainDetails({
          work: selectedCategory,
          trainno: "",
          supervisor: auth?.user?._id || "",
          totalcoach: "",
          type: "",
          workers: [],
          status: "processing",
          suppliedBedsheet: "",
        });
        setSelectedWorkers([]);
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
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white shadow-md md:h-auto">
          <UserMenu />
        </div>

        {/* Form */}
        <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <div className="max-w-3xl mx-auto bg-white p-4 md:p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Add Work Details</h2>

            {/* Category Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              {displayedTabs.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedCategory(opt)}
                  className={`px-4 py-2 border rounded transition ${
                    selectedCategory === opt
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {opt.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {/* Dynamic fields based on category */}
              {(selectedCategory === "mcc" || selectedCategory === "bio" || selectedCategory === "acca") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Train Number</label>
                    <input
                      name="trainno"
                      type="text"
                      value={trainDetails.trainno}
                      onChange={handleTrainChange}
                      className="w-full px-2 py-1 bg-gray-100 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      {selectedCategory === "bio" ? "Total Tank" : "Total Coaches"}
                    </label>
                    <input
                      name="totalcoach"
                      type="number"
                      value={trainDetails.totalcoach}
                      onChange={handleTrainChange}
                      className="w-full px-2 py-1 bg-gray-100 border border-gray-300 rounded"
                    />
                  </div>
                  {selectedCategory !== "bio" && (
                    <div>
                      <label className="block text-gray-700 mb-2">Type</label>
                      <select
                        name="type"
                        value={trainDetails.type}
                        onChange={handleTrainChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        <option value="" disabled>
                          Select type
                        </option>
                        <option value="Primary">Primary</option>
                        <option value="Secondary">Secondary</option>
                      </select>
                    </div>
                  )}
                  {selectedCategory === "acca" && (
                    <div>
                      <label className="block text-gray-700 mb-2">Supplied Bedsheet</label>
                      <input
                        type="number"
                        name="suppliedBedsheet"
                        value={trainDetails.suppliedBedsheet}
                        onChange={handleTrainChange}
                        className="w-full px-2 py-1 bg-gray-100 border border-gray-300 rounded"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-blue-700 mb-2 font-medium">
                      Required Staff: <span>{reqq}</span>
                    </label>
                    <label className="block text-green-700 mb-2 font-medium">
                      Selected Staff: <span>{used}</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Workers Selection */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Workers</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedWorkers.map((worker) => (
                    <div
                      key={worker._id}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      {worker.name}
                      <button
                        onClick={() => handleRemoveWorker(worker._id)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Search and add workers"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {searchTerm && filteredWorkers.length > 0 && (
                  <ul className="mt-2 border border-gray-300 rounded-lg bg-white shadow max-h-40 overflow-y-auto z-10 relative">
                    {filteredWorkers.map((worker) => (
                      <li
                        key={worker._id}
                        onClick={() => handleSelectWorker(worker)}
                        className="p-2 hover:bg-blue-100 cursor-pointer"
                      >
                        {worker.name}
                      </li>
                    ))}
                  </ul>
                )}
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
