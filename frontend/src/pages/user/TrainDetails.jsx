import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/layout/Layout';
import axios from 'axios';
import { useAuth } from '../../context/Auth';
import { useParams } from 'react-router-dom';
import { FaEdit, FaSave } from 'react-icons/fa';
import UserMenu from '../../components/layout/UserMenu';
const TrainDetails = () => {
  const [auth] = useAuth();
  const { id } = useParams();

  const [liveTrains, setLiveTrains] = useState({});
  const [allWorkers, setAllWorkers] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [loading, setLoading] = useState(false);

  // Memoized worker lookup map
  const workerMap = useMemo(() => {
    const map = {};
    allWorkers.forEach((w) => {
      map[w._id] = w.name;
    });
    return map;
  }, [allWorkers]);

  // Fetch train data
  useEffect(() => {
    if (auth?.user) {
      getLiveTrain();
    }
  }, [auth?.user]);

  // Fetch all workers
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND}/api/v1/worker/get-workers`
        );
        setAllWorkers(res.data);
      } catch (err) {
        console.error('Failed to fetch workers:', err);
      }
    };
    fetchWorkers();
  }, []);

  const getLiveTrain = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/getone-mcctrain/${id}`
      );
      setLiveTrains(res.data);
    } catch (err) {
      console.error('Error fetching train:', err);
    } finally {
      setLoading(false);
    }
  };

 const handleEditClick = (train) => {
  const detailed = (train.workers || []).map((workerId) =>
    allWorkers.find((w) => w._id === workerId)
  ).filter(Boolean); // remove any nulls

  setEditRowId(train._id);
  setEditableData({
    ...train,
    workerSearch: '',
    workersDetailed: detailed,
    workers: train.workers || [], // keep the IDs
  });
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async (trainId) => {
    try {
      const updateData = { ...editableData };
      delete updateData.workerSearch;

      await axios.put(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/update-mcctrain/${trainId}`,
        updateData
      );
      setEditRowId(null);
      getLiveTrain();
    } catch (err) {
      console.error('Error saving train:', err);
    }
  };

  return (
    <Layout>
      <div className='flex '>
   
<UserMenu />
      <div className="w-full mx-auto  p-4  mt-6 bg-white rounded-lg shadow">

        <div className="flex justify-between  items-center mb-6">
         
          <h1 className="text-2xl font-bold text-gray-800">Train Details</h1>
          {editRowId === liveTrains._id ? (
            <button
              onClick={() => handleSaveClick(liveTrains._id)}
              className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FaSave /> Save
            </button>
          ) : (
            <button
              onClick={() => handleEditClick(liveTrains)}
              className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FaEdit /> Edit
            </button>
          )}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-5">
            {/* Train No */}
            <div>
<div className="mb-4 text-sm text-gray-600">
  <div className="flex items-center gap-2">
    <span className="text-gray-400">📅</span>
    <span className="font-medium">Created:</span>
    <span> {new Date(liveTrains.createdAt).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}</span>
  </div>
  <div className="flex items-center gap-2 mt-1">
    <span className="text-gray-400">🕒</span>
    <span className="font-medium">Updated:</span>
    <span> {new Date(liveTrains.updatedAt).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}</span>
  </div>
</div> 
          <label className="block text-gray-700 font-medium">Train No</label>
              {editRowId === liveTrains._id ? (
                <input
                  type="text"
                  name="trainno"
                  value={editableData.trainno || ''}
                  onChange={handleInputChange}
                  className="border p-2 w-full rounded"
                />
              ) : (
                <p className="text-gray-800">{liveTrains.trainno}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-gray-700 font-medium">Status</label>
              {editRowId === liveTrains._id ? (
                <select
                  name="status"
                  value={editableData.status || ''}
                  onChange={handleInputChange}
                  className="border p-2 w-full rounded"
                >
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                </select>
              ) : (
                <p className="capitalize text-gray-800">{liveTrains.status}</p>
              )}
            </div>

            {/* Total Coaches */}
            <div>
              <label className="block text-gray-700 font-medium">Total Coaches</label>
              {editRowId === liveTrains._id ? (
                <input
                  type="number"
                  name="totalcoach"
                  value={editableData.totalcoach || ''}
                  onChange={handleInputChange}
                  className="border p-2 w-full rounded"
                />
              ) : (
                <p className="text-gray-800">{liveTrains.totalcoach}</p>
              )}
            </div>

            {/* Workers */}
            <div>
              <label className="block text-gray-700 font-medium">Assigned Workers</label>
              {editRowId === liveTrains._id ? (
                <div className="space-y-2">
                  {/* Selected workers */}
                  <div className="flex flex-wrap gap-2">
                    {(editableData.workersDetailed || []).map((worker) => (
                      <span
                        key={worker._id}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        {worker.name}
                        <button
                          onClick={() => {
                            const updated = editableData.workersDetailed.filter(
                              (w) => w._id !== worker._id
                            );
                            setEditableData({
                              ...editableData,
                              workersDetailed: updated,
                              workers: updated.map((w) => w._id),
                            });
                          }}
                          className="text-red-500"
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
                    value={editableData.workerSearch || ''}
                    onChange={(e) =>
                      setEditableData((prev) => ({
                        ...prev,
                        workerSearch: e.target.value,
                      }))
                    }
                    className="border p-2 w-full rounded"
                  />

                  {/* Suggestions */}
                  {editableData.workerSearch && (
                    <ul className="border rounded bg-white max-h-40 overflow-y-auto">
                      {allWorkers
                        .filter(
                          (w) =>
                            w.name
                              .toLowerCase()
                              .includes(editableData.workerSearch.toLowerCase()) &&
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
                                workerSearch: '',
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
                <div className="flex flex-wrap gap-2">
                  {(liveTrains.workers || []).map((workerId) => (
                    <span
                      key={workerId}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                    >
                      {workerMap[workerId] || 'Unknown'}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      </div>
    </Layout>
  );
};

export default TrainDetails;
