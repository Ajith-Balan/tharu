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
  const [editableData, setEditableData] = useState({ status: "completed" });

  // List of available work categories
  const TABS = [
    { id: "mcc", label: "MCC" },
    { id: "acca", label: "ACCA" },
    { id: "bio", label: "BIO" },
    { id: "pftr", label: "PFTR" },
    { id: "laundry", label: "Laundry" },
    { id: "pit & yard", label: "Pit & Yard" },
  ];

  // Get user's work type
  const userWork = auth?.user?.work?.toLowerCase() || "";

  // Tabs logic
  const filteredTabs =
    userWork && TABS.some((tab) => tab.id === userWork)
      ? TABS.filter((tab) => tab.id === userWork)
      : TABS; // if no work → show all tabs

  // Set default active tab
  useEffect(() => {
    if (userWork && filteredTabs.length > 0) {
      setActiveTab(userWork);
    } else if (!userWork && TABS.length > 0) {
      setActiveTab(TABS[0].id); // first tab for "no work"
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

  useEffect(() => {
    fetchLiveTrains();
  }, []);

  const handleMarkCompleted = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/update-mcctrain/${id}`,
        editableData
      );
      fetchLiveTrains();
    } catch (error) {
      console.error("Error marking train completed:", error);
    }
  };

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

  const renderLiveTrainTable = () => {
    const filteredTrains = liveTrains.filter(
      (train) => train.work?.toLowerCase() === activeTab
    );

    if (filteredTrains.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="text-center py-4 text-gray-500">
            No live trains available for {activeTab.toUpperCase()}.
          </td>
        </tr>
      );
    }

    return filteredTrains.map((train) => (
      <tr
        key={train._id}
        className="hover:bg-gray-50 odd:bg-white even:bg-gray-50"
      >
        <td className="border border-gray-300 px-4 py-2 text-gray-700">
          {train.trainno}
        </td>
        <td className="border border-gray-300 px-4 py-2 text-gray-700 capitalize">
          {train.status}
        </td>
        <td className="border border-gray-300 px-4 py-2 text-gray-700">
          {formatDateTime(train.createdAt)}
        </td>
        <td className="border border-gray-300 px-4 py-2 text-gray-700">
          {train.workers?.length || 0}
        </td>
        <td className="border border-gray-300 px-4 py-2">
          <div className="flex flex-wrap gap-2">
            {train.status !== "completed" && (
              <button
                onClick={() => handleMarkCompleted(train._id)}
                className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Mark as Completed
              </button>
            )}
            <Link
              to={`/dashboard/user/traindetails/${train._id}`}
              className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 flex items-center gap-1"
            >
              <FaEdit />
            </Link>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <Layout title="Dashboard - User">
      <div className="flex bg-gray-100 min-h-screen">
        <UserMenu />
        <div className="p-6 flex-1 w-full">
          <h1 className="text-2xl font-bold mb-4">Live Work Details</h1>

          {/* Tabs */}
          <ul className="flex border-b mb-4 flex-wrap">
            {filteredTabs.map((tab) => (
              <li
                key={tab.id}
                className={`cursor-pointer px-6 py-3 font-medium ${
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
            <table className="min-w-full border border-gray-300 table-fixed text-sm">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left bg-gray-100 w-1/5">
                    Train No
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left bg-gray-100 w-1/5">
                    Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left bg-gray-100 w-1/5">
                    Created At
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left bg-gray-100 w-1/5">
                    Workers
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left bg-gray-100 w-1/5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
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
    </Layout>
  );
};

export default Dashboard;
