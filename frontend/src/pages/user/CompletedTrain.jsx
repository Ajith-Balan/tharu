import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/Auth";
import UserMenu from "../../components/layout/UserMenu";

const CompletedTrain = () => {
  const [auth] = useAuth();
  const [completedDates, setCompletedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(""); // current tab

  const options = ["mcc", "acca", "bio", "laundry", "pftr", "pit & yard"];
  const userWork = auth?.user?.work?.toLowerCase() || "";

  const displayedTabs = userWork ? options.filter((opt) => opt === userWork) : options;

  useEffect(() => {
    if (userWork && options.includes(userWork)) setSelectedCategory(userWork);
    else setSelectedCategory(options[0]);
  }, [userWork]);

  useEffect(() => {
    if (auth?.user && selectedCategory) fetchCompletedTrains();
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
        ).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
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
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white shadow-md md:h-auto">
          <UserMenu />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
            <h1 className="text-2xl font-bold text-green-600 mb-2 sm:mb-0">
              Completed Trains
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
            {displayedTabs.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedCategory(opt)}
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-sm sm:text-base font-medium transition ${
                  selectedCategory === opt
                    ? "bg-blue-600 text-white border border-blue-600"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {opt.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-md p-2 sm:p-6 overflow-x-auto">
            <table className="min-w-full text-sm sm:text-base">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-2 sm:px-4 py-2 text-left font-semibold">Train No</th>
                  <th className="px-2 sm:px-4 py-2 text-left font-semibold">Status</th>
                  <th className="px-2 sm:px-4 py-2 text-left font-semibold">Date</th>
                  <th className="px-2 sm:px-4 py-2 text-left font-semibold">Workers Count</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : completedDates.length > 0 ? (
                  completedDates.map((train) => (
                    <tr
                      key={train._id}
                      className="hover:bg-gray-50 border-t border-gray-200"
                    >
                      <td className="px-2 sm:px-4 py-2">{train.trainno}</td>
                      <td className="px-2 sm:px-4 py-2 capitalize">{train.status}</td>
                      <td className="px-2 sm:px-4 py-2">
                        {new Date(train.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-2 sm:px-4 py-2">{train.workers?.length || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      No completed trains found in {selectedCategory.toUpperCase()}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default CompletedTrain;
