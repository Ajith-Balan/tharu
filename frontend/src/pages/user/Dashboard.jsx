import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/Auth';
import axios from 'axios';
import UserMenu from '../../components/layout/UserMenu';
import { FaEdit, FaSave } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [auth] = useAuth();
  const [liveTrains, setLiveTrains] = useState([]);
  const [activeTab, setActiveTab] = useState('processing');
  const [loading, setLoading] = useState(false);
  const [editRowId, setEditRowId] = useState(null);
  const [editableData, setEditableData] = useState({});

  const TABS = [{ id: 'processing', label: 'Processing Trains' }];

  useEffect(() => {
    if (auth?.user) {
      getLiveTrains();
    }
  }, [auth?.user]);


  
    const [searchTerm, setSearchTerm] = useState("");
    const [allWorkers, setAllWorkers] = useState([]);
    const [selectedWorkers, setSelectedWorkers] = useState([]);
  
    // Fetch all workers from backend
    useEffect(() => {
      const fetchWorkers = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_APP_BACKEND}/api/v1/worker/get-workers`
          );
          setAllWorkers(res.data); // assuming array of { _id, name, role }
        } catch (error) {
          console.error("Failed to fetch workers:", error);
        }
      };
      fetchWorkers();
    }, []);

  const getLiveTrains = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/get-livemcctrain`
      );
      setLiveTrains(res.data || []);
    } catch (err) {
      console.error('Error fetching live trains:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (train) => {
    setEditRowId(train._id);
    setEditableData({ ...train });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async (trainId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/update-mcctrain/${trainId}`,
        editableData
      );
      setEditRowId(null);
      getLiveTrains(); // Refresh
    } catch (error) {
      console.error('Failed to update train:', error);
    }
  };

  const formatDateTime = (date) =>
    new Date(date).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  const renderLiveTrainTable = () =>
    liveTrains.length > 0 ? (
      liveTrains.map((train) => (
        <tr key={train._id} className="hover:bg-gray-100 border-t border-gray-300">
          <td className="px-4 py-2 text-gray-700">
            {editRowId === train._id ? (
              <input
                type="text"
                name="trainno"
                value={editableData.trainno || ''}
                onChange={handleInputChange}
                className="border rounded px-2 py-1 w-full"
              />
            ) : (
              train.trainno
            )}
          </td>

          <td className="px-4 py-2 text-gray-700 capitalize">
            {editRowId === train._id ? (
              <select
                name="status"
                value={editableData.status || ''}
                onChange={handleInputChange}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
              </select>
            ) : (
              train.status
            )}
          </td>

          <td className="px-4 py-2 text-gray-700">{formatDateTime(train.createdAt)}</td>

        <td className="px-4 py-2 text-gray-700">
  {editRowId === train._id ? (
    <div className="flex flex-col gap-2">
      {/* Selected Workers */}
      <div className="flex flex-wrap gap-1">
        {(editableData.workersDetailed || []).map((worker) => (
          <span
            key={worker._id}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1"
          >
            {worker.name}
            <button
              onClick={() => {
                const updated = editableData.workersDetailed.filter(w => w._id !== worker._id);
                setEditableData({
                  ...editableData,
                  workersDetailed: updated,
                  workers: updated.map(w => w._id)
                });
              }}
              className="text-red-500 font-bold"
            >
              &times;
            </button>
          </span>
        ))}
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search workers"
        value={editableData.workerSearch || ""}
        onChange={(e) =>
          setEditableData((prev) => ({
            ...prev,
            workerSearch: e.target.value,
          }))
        }
        className="border rounded px-2 py-1"
      />

      {/* Suggestions */}
      {editableData.workerSearch && (
        <ul className="border rounded bg-white max-h-32 overflow-y-auto">
          {allWorkers
            .filter(
              (w) =>
                w.name.toLowerCase().includes(editableData.workerSearch.toLowerCase()) &&
                !editableData.workersDetailed?.some((sel) => sel._id === w._id)
            )
            .map((worker) => (
              <li
                key={worker._id}
                onClick={() => {
                  const updated = [...(editableData.workersDetailed || []), worker];
                  setEditableData({
                    ...editableData,
                    workersDetailed: updated,
                    workers: updated.map((w) => w._id),
                    workerSearch: "",
                  });
                }}
                className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
              >
                {worker.name}
              </li>
            ))}
        </ul>
      )}
    </div>
  ) : (
    train.workers?.length || 0
  )}
</td>


          <td className="px-4 py-2 flex space-x-2">
            {editRowId === train._id ? (
              <button
                onClick={() => handleSaveClick(train._id)}
                className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
              >
                <FaSave /> Save
              </button>
            ) : (
              <>
                {train.status !== 'completed' && (
                  <button
                    onClick={() => handleMarkCompleted(train._id)}
                    className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Mark as Completed
                  </button>
                )}
                <Link
                to={`/dashboard/user/traindetails/${train._id}`}
                  // onClick={() => handleEditClick(train)}
                  className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 flex items-center gap-1"
                >
                  <FaEdit /> 
                </Link>
              </>
            )}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="5" className="text-center py-4 text-gray-500">
          No live trains available.
        </td>
      </tr>
    );

  const handleMarkCompleted = async (trainId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/update-mcctrain/${trainId}`,
        { status: 'completed' }
      );
      getLiveTrains();
    } catch (error) {
      console.error('Failed to mark as completed:', error);
    }
  };

  return (
    <Layout title="Dashboard - User">
      <div className="flex  bg-gray-100">
        <UserMenu />
        <main className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-red-600">Hi, {auth?.user?.name || 'User'}!</h1>
            <p className="text-gray-600 mt-2 sm:mt-0">Welcome to your Dashboard</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Train Status</h2>

            <ul className="flex border-b mb-4">
              {TABS.map((tab) => (
                <li
                  key={tab.id}
                  className={`cursor-pointer px-6 py-3 font-medium ${
                    activeTab === tab.id
                      ? 'border-b-2 border-red-500 text-red-500'
                      : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </li>
              ))}
            </ul>

            {activeTab === 'processing' && (
              <div className="overflow-x-auto mt-2">
                <table className="min-w-full bg-white rounded-lg shadow-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-700 font-semibold">Train No</th>
                      <th className="px-4 py-2 text-left text-gray-700 font-semibold">Status</th>
                      <th className="px-4 py-2 text-left text-gray-700 font-semibold">Started On</th>
                      <th className="px-4 py-2 text-left text-gray-700 font-semibold">Workers Count</th>
                      <th className="px-4 py-2 text-left text-gray-700 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-gray-500">Loading...</td>
                      </tr>
                    ) : (
                      renderLiveTrainTable()
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Dashboard;
