import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/Auth";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import UserMenu from "../../components/layout/UserMenu";

const Dashboard = () => {
  const [auth] = useAuth();
  const [liveTrains, setLiveTrains] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [loading, setLoading] = useState(false);
  const [supervisors, setSupervisors] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [returned, setReturned] = useState("");

  // Define all work tabs
  const TABS = [
    { id: "mcc", label: "MCC" },
    { id: "acca", label: "ACCA" },
    { id: "bio", label: "BIO" },
    { id: "pftr", label: "PFTR" },
    { id: "laundry", label: "Laundry" },
    { id: "pit & yard", label: "Pit & Yard" },
  ];

  // Get user's assigned work
  const userWork = auth?.user?.work?.toLowerCase() || "";

  // If user has specific work assigned, show only that tab
  const filteredTabs =
    userWork && TABS.some((tab) => tab.id === userWork)
      ? TABS.filter((tab) => tab.id === userWork)
      : TABS;

  // Set default active tab
  useEffect(() => {
    if (userWork && filteredTabs.length > 0) {
      setActiveTab(userWork);
    } else if (!userWork && TABS.length > 0) {
      setActiveTab(TABS[0].id);
    }
  }, [userWork]);

  // Fetch live trains
  const fetchLiveTrains = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/get-livemcctrain`
      );
      setLiveTrains(res.data || []);
    } catch (error) {
      console.error("Error fetching live trains:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all supervisors
  const fetchSupervisors = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/auth/getsupervisor`
      );
      setSupervisors(res.data.supervisor || []);
    } catch (error) {
      console.error("Error fetching supervisors:", error);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchLiveTrains();
    fetchSupervisors();
  }, []);

  // Update train status
  const updateTrain = async (id, data) => {
            if (!window.confirm("Are you sure you want to Mark this Duty Completed?")) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/update-mcctrain/${id}`,
        data
      );
      fetchLiveTrains();
    } catch (error) {
      console.error("Error updating train:", error);
    }
  };

  // Mark as completed handler
  const handleMarkCompleted = (train) => {
    if (activeTab === "acca") {
 if (!window.confirm("Are you sure you want to Mark this Duty Completed?")) return;

      setSelectedTrain(train);
      setShowPopup(true);
    } else {
      updateTrain(train._id, { status: "completed" ,reqq:train.workers?.length});
    }
  };

  // Handle popup submit (for ACCA)
  const handlePopupSubmit = async () => {
    if (!selectedTrain) return;
    await updateTrain(selectedTrain._id, {
      status: "completed",
      returned: Number(returned) || 0,
    });
    setShowPopup(false);
    setSelectedTrain(null);
    setReturned("");
  };

  // Format date & time
  const formatDateTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Render train table
  const renderLiveTrainTable = () => {
    const filteredTrains = liveTrains.filter(
      (train) => train.work?.toLowerCase() === activeTab
    );

    if (filteredTrains.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="text-center py-4 text-gray-500">
            No live trains available for {activeTab.toUpperCase()}.
          </td>
        </tr>
      );
    }

    return filteredTrains.map((train) => {
      const supervisorData = supervisors.find(
        (sup) => sup._id === train.supervisor
      );

      return (
        <tr
          key={train._id}
          className="hover:bg-gray-50 odd:bg-white even:bg-gray-50"
        >
          <td className="border border-gray-300 px-2 sm:px-4 py-2 text-gray-700 text-sm sm:text-base">
            {train.trainno}
          </td>
          <td className="border border-gray-300 px-2 sm:px-4 py-2 text-gray-700 capitalize text-sm sm:text-base">
            {train.status}
          </td>
          <td className="border border-gray-300 px-2 sm:px-4 py-2 text-gray-700 text-sm sm:text-base">
            {formatDateTime(train.createdAt)}
          </td>
          <td className="border border-gray-300 px-2 sm:px-4 py-2 text-gray-700 text-sm sm:text-base">
            {train.workers?.length || 0}
          </td>
          <td className="border border-gray-300 px-2 sm:px-4 py-2 text-gray-700 text-sm sm:text-base">
            {supervisorData ? supervisorData.name : "N/A"}
          </td>
          <td className="border border-gray-300 px-2 sm:px-4 py-2">
            <div className="flex flex-wrap gap-2">
              {train.status !== "completed" && (
                <button
                  onClick={() => handleMarkCompleted(train)}
                  className="text-xs sm:text-sm bg-green-500 text-white px-2 sm:px-3 py-1 rounded hover:bg-green-600"
                >
                  Mark as Completed
                </button>
              )}
              <Link
                to={`/dashboard/user/traindetails/${train._id}`}
                className="text-xs sm:text-sm bg-yellow-500 text-white px-2 sm:px-3 py-1 rounded hover:bg-yellow-600 flex items-center gap-1"
              >
                <FaEdit />
              </Link>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <Layout title="Dashboard - User">
      <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
        <UserMenu />
        <div className="p-4 md:p-6 flex-1 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Live Work Details</h1>

          {/* Tabs */}
          <ul className="flex flex-wrap border-b mb-4">
            {filteredTabs.map((tab) => (
              <li
                key={tab.id}
                className={`cursor-pointer px-3 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base ${
                  activeTab === tab.id
                    ? "border-b-2 border-red-500 text-red-500"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </li>
            ))}
          </ul>

          {/* Table */}
          <div className="overflow-x-auto w-full">
            <table className="min-w-full border border-gray-300 table-auto text-sm sm:text-base">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs sm:text-sm tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left">
                    Train No
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left">
                    Status
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left">
                    Created At
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left">
                    Workers
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left">
                    Supervisor
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  renderLiveTrainTable()
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg w-11/12 sm:w-96">
            <h2 className="text-xl font-bold mb-4 text-green-600">
              Complete Train - {selectedTrain?.trainno}
            </h2>

            <label className="block text-green-700 mb-2 font-medium">
              Returned Bedsheet Count:
              <input
                name="returned"
                type="number"
                value={returned}
                onChange={(e) => setReturned(e.target.value)}
                className="mt-2 w-full border rounded px-2 py-1 bg-gray-100"
              />
            </label>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handlePopupSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;