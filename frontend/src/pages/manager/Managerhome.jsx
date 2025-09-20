import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/Auth';
import axios from 'axios';
import AdminMenu from '../../components/layout/AdminMenu.jsx';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
const Managerhome = () => {
  const [auth] = useAuth();
  const [liveTrains, setLiveTrains] = useState([]);
  const [trainStats, setTrainStats] = useState({});
  const [activeTab, setActiveTab] = useState("processing");



  useEffect(() => {
    if (auth?.user) {
      getTrainDetails();
      getTrainStats();
    }
  }, [auth?.user]);

  const getTrainDetails = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/get-livemcctrain`);
      setLiveTrains(res.data);
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


  const profitData = [
    { month: "Jan", profit: 50000 },
    { month: "Feb", profit: 75000 },
    { month: "Mar", profit: 62000 },
    { month: "Apr", profit: 83000 },
    { month: "May", profit: 91000 },
  ];


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



  return (
    <Layout title="Dashboard - Admin">
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <AdminMenu />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Greeting */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-red-600">Hi, {auth?.user?.name || "Admin"}!</h1>
            <p className="text-gray-600 mt-2 sm:mt-0">Welcome to the Admin Dashboard</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {["Active", "Completed", "Pending", "Scheduled"].map(renderStatsCard)}
          </div>

          {/* Train Tabs */}
            <div className="flex justify-end items-center gap-4 mb-6">
            <label className="text-sm font-medium">Filter by:</label>
            <select className="border rounded p-2">
              <option value="total">Total</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Business Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded shadow p-4">
              <h2 className="text-gray-700 font-semibold mb-2">Contract Period</h2>
              <p className="text-gray-900">01 Jan 2024 – 31 Dec 2025</p>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h2 className="text-gray-700 font-semibold mb-2">Total Coaches</h2>
              <p className="text-gray-900 font-bold text-xl">320</p>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h2 className="text-gray-700 font-semibold mb-2">Consumed Coaches</h2>
              <p className="text-gray-900 font-bold text-xl">210</p>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h2 className="text-gray-700 font-semibold mb-2">Total Bill Value</h2>
              <p className="text-gray-900">₹ 18,00,000</p>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h2 className="text-gray-700 font-semibold mb-2">Total Penalty</h2>
              <p className="text-red-600">₹ 35,000</p>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h2 className="text-gray-700 font-semibold mb-2">Tax Breakdown</h2>
              <ul className="text-gray-800 space-y-1">
                <li>Taxable Amount: ₹ 17,65,000</li>
                <li>CGST (9%): ₹ 1,58,850</li>
                <li>SGST (9%): ₹ 1,58,850</li>
                <li>Cess: ₹ 5,000</li>
              </ul>
            </div>

            <div className="bg-white rounded shadow p-4 lg:col-span-2">
              <h2 className="text-gray-700 font-semibold mb-2">
                Net Amount After Tax
              </h2>
              <p className="text-green-700 text-xl font-bold">₹ 21,87,700</p>
            </div>
          </div>

          {/* Profit Graph */}
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Monthly Profit Overview
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
         
        </main>
      </div>
    </Layout>
  );
};

export default Managerhome;
