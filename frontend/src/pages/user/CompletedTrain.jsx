import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/Auth";
import UserMenu from "../../components/layout/UserMenu";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

const CompletedTrain = () => {
  const [auth] = useAuth();
  const [completedDates, setCompletedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(""); // current selected tab

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
    } else if (!userWork) {
      setSelectedCategory(options[0]); // default to first option
    }
  }, [userWork]);

  // Fetch on mount and when selected category changes
  useEffect(() => {
    if (auth?.user && selectedCategory) {
      fetchCompletedTrains();
    }
  }, [auth?.user, selectedCategory]);

  const fetchCompletedTrains = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/get-completedmcctrain`
      );
      const completed =
        res.data?.filter(
          (train) => train.work?.toLowerCase() === selectedCategory.toLowerCase()
        ) || [];
      setCompletedDates(completed);
    } catch (err) {
      console.error("Error fetching completed trains:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Completed Trains">
      <div className="flex min-h-screen bg-gray-100">
        <UserMenu />
        <main className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-green-600">
              Completed Trains
            </h1>
          </div>

          {/* 🔹 Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {displayedTabs.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedCategory(opt)}
                className={`px-4 py-2 rounded transition text-sm font-medium ${
                  selectedCategory === opt
                    ? "bg-blue-600 text-white border border-blue-600"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {opt.toUpperCase()}
              </button>
            ))}
          </div>

          {/* 🔹 Table */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full bg-white rounded-lg shadow-sm text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Train No</th>
                    <th className="px-4 py-2 text-left font-semibold">Status</th>
                    <th className="px-4 py-2 text-left font-semibold">Date</th>
                    <th className="px-4 py-2 text-left font-semibold">Workers Count</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : completedDates.length > 0 ? (
                    completedDates.map((train) => (
                      <tr
                        key={train._id}
                        className="hover:bg-gray-50 border-t border-gray-200"
                      >
                        <td className="px-4 py-2 text-gray-800">{train.trainno}</td>
                        <td className="px-4 py-2 text-gray-800 capitalize">
                          {train.status}
                        </td>
                        <td className="px-4 py-2 text-gray-800">
                          {new Date(train.updatedAt).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-4 py-2 text-gray-700 capitalize">
                          {train.workers?.length || 0}
                        </td>
                     
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500">
                        No completed trains found in {selectedCategory.toUpperCase()}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default CompletedTrain;
