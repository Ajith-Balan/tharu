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

  // Tabs to display: user's work only or all
  const displayedTabs = userWork
    ? options.filter((opt) => opt === userWork)
    : options;

  // Initialize selected category
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

  // derived values
  const reqq = trainDetails.totalcoach ? trainDetails.totalcoach * 6 : 0;
  const used = selectedWorkers.length;

  // Fetch all workers
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

  // Handle worker selection
  const handleSelectWorker = (worker) => {
    if (!selectedWorkers.find((w) => w._id === worker._id)) {
      const updated = [...selectedWorkers, worker];
      setSelectedWorkers(updated);
      setTrainDetails({
        ...trainDetails,
        workers: updated.map((w) => w._id),
      });
    }
    setSearchTerm("");
  };

  const handleRemoveWorker = (workerId) => {
    const updated = selectedWorkers.filter((w) => w._id !== workerId);
    setSelectedWorkers(updated);
    setTrainDetails({
      ...trainDetails,
      workers: updated.map((w) => w._id),
    });
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
    const { trainno, totalcoach, type, workers, supervisor, suppliedBedsheet } =
      trainDetails;

    // Validation
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
        {
          ...trainDetails,
          reqq,
          used,
          work: selectedCategory,
        }
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

  const InputField = ({ label, name, type = "text", value, onChange }) => (
    <div>
      <label className="block text-gray-700 mt-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-1/2 px-2 bg-gray-100 border border-gray-300"
      />
    </div>
  );

  return (
    <Layout title="Dashboard - Add MCC Train">
      <div className="flex min-h-screen bg-gray-100">
        <div className="w-64 bg-white shadow-md">
          <UserMenu />
        </div>

        <div className="flex-1 p-5">
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Add Work Details</h2>

            {/* Category buttons */}
            <div className="flex flex-wrap mb-6 gap-2">
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
              {/* MCC */}
              {selectedCategory === "mcc" && (
                <>
                <label className="block text-gray-700 mb-2">"Train Number</label>
                  <input
                    label="Train Number"
                    name="trainno"
                   className="w-1/2 px-2 bg-gray-100 border border-gray-300"

                    value={trainDetails.trainno}
                    onChange={handleTrainChange}
                    type="number"
                  />
                  <label className="block text-gray-700 mb-2">Total Coaches</label>
                  <input
                    label="Total Coaches"
                    name="totalcoach"
                className="w-1/2 px-2 bg-gray-100 border border-gray-300"
            
                    type="number"
                    value={trainDetails.totalcoach}
                    onChange={handleTrainChange}
                  />

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

                  <label className="block text-blue-700 mb-2 font-medium">
                    Required Staff Count:
                    <input
                      type="text"
                      value={reqq}
                      readOnly
                      className="ml-2 border rounded px-2 py-1 bg-gray-100"
                    />
                  </label>

                  <label className="block text-green-700 mb-2 font-medium">
                    Selected Staff Count:
                    <input
                      type="text"
                      value={used}
                      readOnly
                      className="ml-2 border rounded px-2 py-1 bg-gray-100"
                    />
                  </label>
                </>
              )}

              {/* BIO */}
              {selectedCategory === "bio" && (
                <>
                <label className="block text-gray-700 mb-2">Total Number</label>
                  <input
                    label="Train Number"
                    name="trainno"
                    className="w-1/2 px-2 bg-gray-100 border border-gray-300"
                    value={trainDetails.trainno}
                    onChange={handleTrainChange}
                  />
                  <label className="block text-gray-700 mb-2">Total Tank</label>
                  <input
                    label="Total Tank"
                    name="totalcoach"
                    className="w-1/2 px-2 bg-gray-100 border border-gray-300"
                    type="number"
                    value={trainDetails.totalcoach}
                    onChange={handleTrainChange}
                  />
                  <label className="block text-blue-700 mb-2 font-medium">
                    Required Staff Count:
                    <input
                      type="text"
                      value={reqq}
                      readOnly
                      className="ml-2 border rounded px-2 py-1 bg-gray-100"
                    />
                  </label>
                  <label className="block text-green-700 mb-2 font-medium">
                    Selected Staff Count:
                    <input
                      type="text"
                      value={used}
                      readOnly
                      className="ml-2 border rounded px-2 py-1 bg-gray-100"
                    />
                  </label>
                </>
              )}

              {/* ACCA */}
              {selectedCategory === "acca" && (
                <>
            <label className="block text-gray-700 mb-2">Total Number</label>

                  <input
                    label="Train Number"
                    name="trainno"
                    className="w-1/2 px-2 bg-gray-100 border border-gray-300"
                    value={trainDetails.trainno}
                    onChange={handleTrainChange}
                  />
                  <label className="block text-gray-700 mb-2">Total Coaches</label>
                  <input
                    label="Total Coaches"
                    name="totalcoach"
                    type="number"
                    className="w-1/2 px-2 bg-gray-100 border border-gray-300"
                    value={trainDetails.totalcoach}
                    onChange={handleTrainChange}
                  />
                  <label className="block text-blue-700 mb-2 font-medium">
                    Required Bedsheet Count:
                    <input
                      type="text"
                      value={trainDetails.totalcoach * 7 || 0}
                      readOnly
                      className="ml-2 border rounded px-2 py-1 bg-gray-100"
                    />
                  </label>
                  <label className="block text-green-700 mb-2 font-medium">
                    Supplied Bedsheet Count:
                    <input
                      name="suppliedBedsheet"
                      type="number"
                      value={trainDetails.suppliedBedsheet}
                      onChange={handleTrainChange}
                      className="ml-2 border rounded px-2 py-1 bg-gray-100"
                    />
                  </label>
                </>
              )}

              {/* Workers */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Workers
                </label>
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
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
