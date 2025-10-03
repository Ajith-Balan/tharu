import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/Auth";
import axios from "axios";
import AdminMenu from "../../components/layout/AdminMenu";
import { FaEdit, FaSave, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const Billdetails = () => {
  const [auth] = useAuth();
  const [bills, setBills] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [activeTab, setActiveTab] = useState("mcc"); // Default tab

  const TABS = [
    { id: "mcc", label: "MCC" },
    { id: "acca", label: "ACCA" },
    { id: "bio", label: "BIO" },
    { id: "pftr", label: "PFTR" },
    { id: "laundry", label: "Laundry" },
    { id: "pit & yard", label: "Pit & Yard" },
  ];

  const fetchBills = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/getbills`
      );
      const sortedBills = (res.data.bills || []).sort(
        (a, b) => new Date(b.month + "-01") - new Date(a.month + "-01")
      );
      setBills(sortedBills || []);
    } catch (err) {
      console.error("Error fetching bills:", err);
    }
  };

  useEffect(() => {
    if (auth?.user) {
      fetchBills();
    }
  }, [auth?.user]);

  // DELETE
  const handleDelete = async (id) => {
    try {
      let confirmDelete = window.confirm("Are you sure you want to delete this bill?");
      if (!confirmDelete) return;

      await axios.delete(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/delete-bill/${id}`
      );

      toast.success("Bill Deleted Successfully");
      fetchBills();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while deleting the bill");
    }
  };

  // EDIT
  const handleEditClick = (bill) => {
    setEditId(bill._id);
    setEditedData({
      netamount: bill.netamount,
      billvalue: bill.billvalue,
      penalty: bill.penalty,
      consumedcoach: bill.consumedcoach,
      status: bill.status || "",
    });
  };

  const handleInputChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleSaveClick = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/update-bill/${id}`,
        editedData
      );
      toast.success("Bill Updated Successfully");
      setEditId(null);
      fetchBills();
    } catch (err) {
      console.error("Error updating bill:", err);
      toast.error("Failed to update bill");
    }
  };

  // FILTER bills by active tab
  const filteredBills = bills.filter(
    (bill) => bill.work?.toLowerCase() === activeTab.toLowerCase()
  );

  // TOTAL summary
  const totalBillValue = filteredBills.reduce((sum, b) => sum + (Number(b.billvalue) || 0), 0);
  const totalNetAmount = filteredBills.reduce((sum, b) => sum + (Number(b.netamount) || 0), 0);
  const totalPenalty = filteredBills.reduce((sum, b) => sum + (Number(b.penalty) || 0), 0);
const contractperiod = filteredBills.length > 0 ? filteredBills[0].contractperiod : "—";

  return (
    <Layout title="Bill Details - Manager">
      <div className="flex bg-gray-100 min-h-screen">
        <AdminMenu />
        <main className="flex-1 p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">All Bills</h1>
            <Link
              to="/dashboard/manager/addbills"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Add Bill
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Totals */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <h2 className="text-lg font-bold text-gray-800">Bill Value</h2>
              <p className="text-blue-600 font-semibold">{totalBillValue}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <h2 className="text-lg font-bold text-gray-800">Net Amount</h2>
              <p className="text-green-600 font-semibold">{totalNetAmount}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <h2 className="text-lg font-bold text-gray-800">Penalty</h2>
              <p className="text-red-600 font-semibold">{totalPenalty}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <h2 className="text-lg font-bold text-gray-800">Contract Period</h2>
              <p className="text-purple-600 font-semibold">{contractperiod}</p>
            </div>
          </div>

          {/* Bills */}
          {filteredBills.length === 0 ? (
            <p className="text-gray-600">No bills found for {activeTab.toUpperCase()}.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBills.map((bill) => (
                <div
                  key={bill._id}
                  className="bg-white rounded-xl shadow-md p-4 border border-gray-200 relative"
                >
                  {/* Edit/Save Button */}
                  {editId === bill._id ? (
                    <button
                      onClick={() => handleSaveClick(bill._id)}
                      className="absolute top-3 right-12 text-green-600 hover:text-green-800"
                    >
                      <FaSave />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditClick(bill)}
                      className="absolute top-3 right-12 text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(bill._id)}
                    className="absolute top-3 right-3 text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>

                  {/* Month */}
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Month:{" "}
                    {new Date(bill.month + "-01").toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h2>

                  {/* Editable fields */}
                  {["netamount", "billvalue", "penalty", "consumedcoach"].map(
                    (field) => (
                      <p key={field} className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">
                          {field.replace(/([A-Z])/g, " $1")}:
                        </span>{" "}
                        {editId === bill._id ? (
                          <input
                            type="number"
                            name={field}
                            value={editedData[field]}
                            onChange={handleInputChange}
                            className="border px-2 py-1 ml-2 rounded w-2/3"
                          />
                        ) : (
                          bill[field]
                        )}
                      </p>
                    )
                  )}

                  {/* Status Dropdown */}
                  <div className="text-sm bg-green-100 p-3 text-gray-600 mb-2">
                    <span className="font-medium">Status: </span>
                    {editId === bill._id ? (
                      <select
                        name="status"
                        value={editedData.status}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-lg p-1 ml-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        <option value="">-- Select --</option>
                        <option value="Processing">Processing</option>
                        <option value="Passed to Division">Passed to Division</option>
                        <option value="Accounts">Accounts</option>
                        <option value="Bill Passed">Bill Passed</option>
                      </select>
                    ) : (
                      bill.status || "N/A"
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default Billdetails;
