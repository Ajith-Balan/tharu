import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/Auth";
import axios from "axios";
import AdminMenu from "../../components/layout/AdminMenu";
import { FaEdit, FaSave } from "react-icons/fa";

const Billdetails = () => {
  const [auth] = useAuth();
  const [bills, setBills] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedData, setEditedData] = useState({});

  const fetchBills = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/getbills`
      );
      setBills(res.data.bills || []);
    } catch (err) {
      console.error("Error fetching bills:", err);
    }
  };

  useEffect(() => {
    if (auth?.user) {
      fetchBills();
    }
  }, [auth?.user]);

  const handleEditClick = (bill) => {
    setEditId(bill._id);
    setEditedData({
      netamount: bill.netamount,
      billvalue: bill.billvalue,
      penalty: bill.penalty,
      consumedcoach: bill.consumedcoach,
      status: bill.status || "", // include status
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
      setEditId(null);
      fetchBills(); // Refresh after update
    } catch (err) {
      console.error("Error updating bill:", err);
    }
  };

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

          {bills.length === 0 ? (
            <p className="text-gray-600">No bills found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bills.map((bill) => (
                <div
                  key={bill._id}
                  className="bg-white rounded-xl shadow-md p-4 border border-gray-200 relative"
                >
                  {/* Edit/Save Button */}
                  {editId === bill._id ? (
                    <button
                      onClick={() => handleSaveClick(bill._id)}
                      className="absolute top-3 right-3 text-green-600 hover:text-green-800"
                    >
                      <FaSave />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditClick(bill)}
                      className="absolute top-3 right-3 text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                  )}

                <h2 className="text-lg font-semibold text-gray-800 mb-2">
  Month: {new Date(bill.month + "-01").toLocaleString("default", { month: "long", year: "numeric" })}
</h2>


                  {["netamount", "billvalue", "penalty", ].map(
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
                  <div className="text-sm text-gray-600 mb-2">
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
