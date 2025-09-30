import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import axios from "axios";
import { toast } from "react-toastify";

const Addbill = () => {
  const [formData, setFormData] = useState({
    month: "",
    status: "",
    billvalue: "",
    penalty: "",
    netamount: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();

  // Show confirmation popup
  const confirmed = window.confirm("Are you sure you want to add this bill?");
  if (!confirmed) return;

  setIsSubmitting(true);
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/createbill`,
      formData
    );
    if (res.status === 201) {
      toast.success("Bill added successfully");
      setFormData({
        month: "",
        status: "",
        billvalue: "",
        penalty: "",
        netamount: "",
      });
    } else if (res.status === 200) {
      toast.error("Already registered, please login");
    } else {
      toast.error("Registration failed");
    }
  } catch (error) {
    console.error(error);
    toast.error("Error during registration");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Add Monthly Bill</h2>
        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
          {/* Month picker */}
          <div>
            <label className="block mb-1 text-gray-700">Month</label>
            <input
              type="month"
              name="month"
              value={formData.month}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status dropdown */}
          <div>
            <label className="block mb-1 text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Status --</option>
              <option value="Processing">Processing</option>
              <option value="Passed to Division">Passed to Division</option>
              <option value="Accounts">Accounts</option>
              <option value="Bill Passed">Bill Passed</option>
            </select>
          </div>

          {/* Other fields */}
          {["billvalue", "penalty", "netamount"].map((field) => (
            <div key={field}>
              <label className="block mb-1 text-gray-700">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="number"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {isSubmitting ? "Submitting..." : "Add Bill"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Addbill;
