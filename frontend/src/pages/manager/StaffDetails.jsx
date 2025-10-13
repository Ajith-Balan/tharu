import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/Auth";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import AdminMenu from "../../components/layout/AdminMenu";
import { Link } from "react-router-dom";

const StaffDetails = () => {
  const [auth] = useAuth();
  const [allWorkers, setAllWorkers] = useState([]);
  const [activeTab, setActiveTab] = useState("MCC");

  const tabs = ["MCC", "BIO", "ACCA", "Laundry", "Pit & Yard", "PFTR"];

  const fetchWorkers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/worker/get-workers`
      );
      const workers = (res.data || []) .sort((a, b) => {
        // Prefer createdAt if available, fallback to _id
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(parseInt(a._id.substring(0, 8), 16) * 1000);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(parseInt(b._id.substring(0, 8), 16) * 1000);
        return dateB - dateA; // Newest first
      });
      setAllWorkers(workers || []);
    } catch (err) {
      console.error("Error fetching workers:", err);
    }
  };

  useEffect(() => {
    if (auth?.user) fetchWorkers();
  }, [auth?.user]);

  const filteredWorkers = allWorkers.filter(
    (worker) => worker.work?.toLowerCase() === activeTab.toLowerCase()
  );

  return (
    <Layout title="Staff Details - Manager">
      <div className="flex flex-col bg-gray-100 min-h-screen">
        {/* Admin Menu on top */}
        <div className="w-full">
          <AdminMenu />
        </div>

        <main className="flex-1 p-4 overflow-x-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            All Staff Members
          </h1>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full font-medium ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Staff Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left border-b">Name</th>
                  <th className="px-4 py-2 text-left border-b">Phone</th>
                  <th className="px-4 py-2 text-left border-b">Emp ID</th>
                  <th className="px-4 py-2 text-left border-b">Aadhar</th>
                  <th className="px-4 py-2 text-left border-b">Status</th>
                  <th className="px-4 py-2 text-left border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkers.length > 0 ? (
                  filteredWorkers.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{s.name}</td>
                      <td className="px-4 py-2 border-b">{s.phone}</td>
                      <td className="px-4 py-2 border-b">{s.empid}</td>
                      <td className="px-4 py-2 border-b">{s.aadhar}</td>
                      <td className="px-4 py-2 border-b">
                        <span className="bg-green-100 px-2 py-1 rounded">
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 border-b">
                        <Link
                          to={`/dashboard/manager/editstaff/${s._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-2 text-center text-gray-600"
                    >
                      No staff found in this category.
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

export default StaffDetails;
