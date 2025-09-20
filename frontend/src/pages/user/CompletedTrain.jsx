import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/Auth';
import UserMenu from '../../components/layout/UserMenu';

const CompletedTrain = () => {
  const [auth] = useAuth();
  const [completedTrains, setCompletedTrains] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth?.user) {
      fetchCompletedTrains();
    }
  }, [auth?.user]);

  const fetchCompletedTrains = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/get-completedmcctrain`
      );
      // filter trains where status is 'completed'
      const completed = res.data?.filter((train) => train.status === 'completed');
      setCompletedTrains(completed || []);
    } catch (err) {
      console.error('Error fetching completed trains:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date) =>
    new Date(date).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  return (
    <Layout title="Completed Trains">
      <div className="flex min-h-screen bg-gray-100">
        <UserMenu />
        <main className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-green-600">Completed Trains</h1>
            <p className="text-gray-600 mt-2 sm:mt-0">View all completed MCC trains</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full bg-white rounded-lg shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">Train No</th>
                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">Status</th>
                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">Completed On</th>
                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">Workers Count</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">Loading...</td>
                    </tr>
                  ) : completedTrains.length > 0 ? (
                    completedTrains.map((train) => (
                      <tr key={train._id} className="hover:bg-gray-100 border-t border-gray-300">
                        <td className="px-4 py-2 text-gray-700">{train.trainno}</td>
                        <td className="px-4 py-2 text-green-600 capitalize">{train.status}</td>
                        <td className="px-4 py-2 text-gray-700">{formatDateTime(train.updatedAt || train.createdAt)}</td>
                        <td className="px-4 py-2 text-gray-700 capitalize">{train.workers?.length || 0}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-gray-500 py-4">
                        No completed trains found.
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
