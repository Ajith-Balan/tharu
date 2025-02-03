import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/Auth';
import { Link } from "react-router-dom";
import useStates from '../../hooks/useStates.jsx';
import axios from 'axios';

const Managerhome = () => {
  const [auth] = useAuth();
  const states = useStates();
  const [liveTrains, setLiveTrains] = useState([]);
  const [trainStats, setTrainStats] = useState({});
  const [activeTab, setActiveTab] = useState("processing");

  useEffect(() => {
    getTrainDetails();
    getTrainStats();
  }, [auth.user.type]);

  const getTrainDetails = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/get-livemcctrain`);
      setLiveTrains(res.data.filter(train => train.site === auth.user.type));
    } catch (error) {
      console.error("Error fetching live trains", error);
    }
  };

  const getTrainStats = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/get-completedmcctrain`);
      setTrainStats(res.data);
    } catch (error) {
      console.error("Error fetching train stats", error);
    }
  };

  const formatDateTime = (date) => new Date(date).toLocaleString();

  const renderStatsCard = (status) => (
    <div key={status} className="bg-white p-6 rounded-lg shadow-md text-center">
      <h5 className="text-lg font-semibold text-gray-700">{status} Trains:</h5>
      <p className="text-md text-gray-600">{trainStats[status] || "Loading..."}</p>
      <div className="mt-4">
        <span className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${
          status === "Active" ? "text-green-700 bg-green-100" :
          status === "Completed" ? "text-blue-700 bg-blue-100" :
          status === "Pending" ? "text-yellow-700 bg-yellow-100" :
          "text-purple-700 bg-purple-100"
        }`}>
          {status}
        </span>
      </div>
    </div>
  );

  const renderLiveTrainTable = () => (
    liveTrains.length > 0 ? (
      liveTrains.map((train) => (
        <tr key={train._id} className="hover:bg-gray-100 border-t border-gray-300">
          <td className="px-4 py-2 text-gray-700">{train.trainno}</td>
          <td className="px-4 py-2 text-gray-700">{train.status}</td>
          <td className="px-4 py-2 text-gray-700">{formatDateTime(train.createdAt)}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="3" className="px-4 py-2 text-center text-gray-500">No live trains available.</td>
      </tr>
    )
  );

  return (
    <Layout title="Dashboard - Admin">
      <div className="container mx-auto mt-7 p-4 space-y-8">
        <div className="flex justify-between items-center p-6">
          <h1 className="text-2xl font-bold text-red-600">Hi, {auth?.user?.name || "Admin"}!</h1>
          <p className="text-gray-600">Welcome to the Admin Dashboard</p>
        </div>
        <hr />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {["Active", "Completed", "Pending", "Scheduled"].map(renderStatsCard)}
        </div>
        <div className="bg-white p-6">
          <ul className="flex flex-wrap justify-end space-x-4 py-3">
            {[{ label: "State +", to: "/dashboard/admin/create-states" },
              { label: "Site Place +", to: "/dashboard/admin/create-site" },
              { label: "Type +", to: "/dashboard/admin/create-type" },
              { label: "Orders List", to: "/dashboard/admin/orderslist" },
            ].map((action, index) => (
              <li key={index}>
                <Link to={action.to} className="hover:bg-gray-700 px-4 py-2 rounded transition duration-200 bg-red-500 text-white">
                  {action.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <hr />
        <div className="border-b border-gray-300 mb-4">
          <h1>Train Status</h1>
          <ul className="flex">
            {["processing", "completed"].map((tab) => (
              <li key={tab} className={`cursor-pointer px-6 py-3 ${
                activeTab === tab ? "border-b-2 border-red-500 text-red-500" : "text-gray-500"
              }`} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Trains
              </li>
            ))}
          </ul>
        </div>
        {activeTab === "processing" ? (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md p-6">
            <table className="min-w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Train No</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Status</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Started On</th>
                </tr>
              </thead>
              <tbody>{renderLiveTrainTable()}</tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500">No completed trains available.</div>
        )}
      </div>
    </Layout>
  );
};

export default Managerhome;
