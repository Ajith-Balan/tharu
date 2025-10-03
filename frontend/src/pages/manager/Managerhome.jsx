import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/Auth";
import axios from "axios";
import AdminMenu from "../../components/layout/AdminMenu.jsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FaSearch } from "react-icons/fa";
import moment from "moment";

const Managerhome = () => {
  const [auth] = useAuth();
  const [trainStats, setTrainStats] = useState({});
  const [liveTrains, setLiveTrains] = useState([]);
  const [allWorkers, setAllWorkers] = useState([]);
  const [bills, setBills] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [completedWork, setCompletedWork] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (auth?.user) {
      fetchTrainStats();
      fetchLiveTrains();
      fetchWorkers();
      fetchBills();
      fetchSupervisors();
      fetchCompletedWork();
    }
  }, [auth?.user]);

  const fetchTrainStats = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/get-completedmcctrain`
      );
      setTrainStats(res.data || {});
    } catch (err) {
      console.error("Error fetching train stats:", err);
    }
  };

  const fetchLiveTrains = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/get-livemcctrain`
      );
      setLiveTrains(res.data || []);
    } catch (err) {
      console.error("Error fetching live trains:", err);
    }
  };

  const fetchWorkers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/worker/get-workers`
      );
      setAllWorkers(res.data || []);
    } catch (err) {
      console.error("Error fetching workers:", err);
    }
  };

  const fetchBills = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/getbills`
      );
      const sortedBills = (res.data.bills || []).sort(
        (a, b) => new Date(b.month + "-01") - new Date(a.month + "-01")
      );
      setBills(sortedBills);
    } catch (err) {
      console.error("Error fetching bills:", err);
    }
  };

  const fetchSupervisors = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/work/get-workers`
      );
      setSupervisors(res.data || []);
    } catch (err) {
      console.error("Error fetching supervisors:", err);
    }
  };

  const fetchCompletedWork = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/get-completed`
      );
      setCompletedWork(res.data || []);
    } catch (err) {
      console.error("Error fetching completed work:", err);
    }
  };

  // Supervisor ID to Name
  const getSupervisorName = (id) => {
    const sup = supervisors.find((s) => s._id === id);
    return sup ? sup.name : id;
  };

  // Metrics Calculations
  const passedBillCount = bills.filter((b) => b.status === "Bill Passed").length;
  const pendingBillCount = bills.filter((b) => b.status !== "Bill Passed").length;
  const totalBillAmount = bills.reduce((acc, b) => acc + (b.billvalue || 0), 0);
  const netAmount = bills.reduce((acc, b) => acc + (b.netamount || 0), 0);
  const totalPenalties = bills.reduce((acc, b) => acc + (b.penalty || 0), 0);

  const totalLiveWork = liveTrains.filter((t) => t.status === "processing").length;
  const totalCompletedWork = completedWork.filter((t) => t.status === "completed").length;

  const todayLiveWork = liveTrains.filter(
    (t) =>
      moment(t.createdAt).isSame(new Date(), "day") &&
      t.status === "processing"
  ).length;

  const todayCompletedWork = completedWork.filter(
    (t) =>
      moment(t.updatedAt).isSame(new Date(), "day") &&
      t.status === "completed"
  ).length;

  // Example profit data (replace with API if available)
  const profitData = bills.map((b) => ({
    month: b.month,
    profit: b.netamount || 0,
  }));

  return (
    <Layout title="Manager Dashboard">
      <div className="flex min-h-screen bg-gray-100">
        <AdminMenu />
        <main className="flex-1 p-6">
          {/* Greeting */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-red-600">
              Hi, {auth?.user?.name || "Manager"}!
            </h1>
            <p className="text-gray-600 mt-2 sm:mt-0">
              Advanced Manager Dashboard
            </p>
          </div>

          {/* Contract Period & Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard title="Passed Bills" value={passedBillCount} color="green" />
            <MetricCard title="Pending Bills" value={pendingBillCount} color="yellow" />
            <MetricCard title="Net Amount" value={`₹ ${netAmount.toLocaleString()}`} color="green" />
            <MetricCard title="Total Bill Amount" value={`₹ ${totalBillAmount.toLocaleString()}`} color="gray" />
            <MetricCard title="Total Penalties" value={`₹ ${totalPenalties.toLocaleString()}`} color="red" />
            <MetricCard title="Total Live Work" value={totalLiveWork} color="blue" />
            <MetricCard title="Total Completed Work" value={totalCompletedWork} color="green" />
            <MetricCard title="Today Live Work" value={todayLiveWork} color="blue" />
            <MetricCard title="Today Completed Work" value={todayCompletedWork} color="green" />
          </div>

          {/* Search Filter */}
          <div className="flex items-center mb-4">
            <FaSearch className="mr-2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by Train No"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded p-2 flex-1"
            />
          </div>

          {/* Live Trains Table */}
          <AdvancedTable
            title="Live Trains"
            headers={["Train No","Work","Supervisor","Total Coaches","Type","Req","Used","Status"]}
            data={liveTrains.filter(
              (t) =>
                t.trainno.includes(search) ||
                getSupervisorName(t.supervisor)
                  .toLowerCase()
                  .includes(search.toLowerCase())
            )}
            keys={["trainno","work","supervisor","totalcoach","type","reqq","used","status"]}
            getSupervisorName={getSupervisorName}
          />

          {/* Workers Table */}
          <AdvancedTable
            title="Workers"
            headers={["Name","Phone","Emp ID","Designation","Wage","Bank","IFSC","Status"]}
            data={allWorkers.filter((w) =>
              w.name.toLowerCase().includes(search.toLowerCase())
            )}
            keys={["name","phone","empid","designation","wage","bank","ifsccode","status"]}
          />

          {/* Bills Table */}
          <AdvancedTable
            title="Bills"
            headers={["Month","Contract Period","Status","Bill Value","Penalty","Net Amount"]}
            data={bills.filter((b) => b.month.includes(search))}
            keys={["month","contractperiod","status","billvalue","penalty","netamount"]}
            isCurrency
          />

          {/* Profit Chart */}
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

// Metric Card Component
const MetricCard = ({ title, value, color }) => {
  const colors = {
    green: "text-green-700 bg-green-100",
    red: "text-red-700 bg-red-100",
    yellow: "text-yellow-700 bg-yellow-100",
    blue: "text-blue-700 bg-blue-100",
    gray: "text-gray-700 bg-gray-100",
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <h5 className="text-gray-500 font-medium">{title}</h5>
      <p className={`text-xl font-bold ${colors[color] || "text-gray-800"}`}>
        {value}
      </p>
    </div>
  );
};

// Advanced Table Component
const AdvancedTable = ({ title, headers, data, keys, isCurrency, getSupervisorName }) => (
  <div className="bg-white rounded shadow p-6 mb-8">
    <h2 className="text-lg font-semibold text-gray-700 mb-4">{title}</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item._id}>
              {keys.map((k) => (
                <td key={k} className="px-6 py-4">
                  {k === "supervisor" && getSupervisorName
                    ? getSupervisorName(item[k])
                    : isCurrency && typeof item[k] === "number"
                    ? `₹ ${item[k].toLocaleString()}`
                    : item[k] || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Managerhome;
