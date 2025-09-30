import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import axios from 'axios';
import { useAuth } from '../../context/Auth';
import * as XLSX from 'xlsx';

const Attendance = () => {
  const [auth] = useAuth();
  const [allWorkers, setAllWorkers] = useState([]);
  const [completedTrains, setCompletedTrains] = useState([]);
  const [loading, setLoading] = useState(false);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const fetchWorkers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/worker/get-workers`
      );
      setAllWorkers(res.data || []);
    } catch (err) {
      console.error('Error fetching workers:', err);
    }
  };

  const fetchCompletedTrains = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/get-completedmcctrain`
      );
      const completed = res.data?.filter((train) => train.status === 'completed');
      setCompletedTrains(completed || []);
    } catch (err) {
      console.error('Error fetching completed trains:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.user) {
      fetchWorkers();
      fetchCompletedTrains();
    }
  }, [auth?.user]);

  // Attendance logic
  const getAttendanceStatus = (workerId, day) => {
    const today = new Date();
    const isFutureDate =
      day > today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    if (isFutureDate) return '-'; // clearer for future dates

    const trainCount = completedTrains.filter(train => {
      const trainDate = new Date(train.updatedAt);
      return (
        trainDate.getDate() === day &&
        trainDate.getMonth() === month &&
        trainDate.getFullYear() === year &&
        train.workers?.includes(workerId)
      );
    }).length;

    if (trainCount === 0) return 'A';
    if (trainCount === 1) return 'P';
    if (trainCount === 2) return 'P2';
    if (trainCount === 3) return 'P3';

    return 'P';
  };

  const downloadExcel = () => {
    const monthName = now.toLocaleString('default', { month: 'long' });
    const title = `Attendance - ${monthName} ${year}`;

    const header = ['Name', ...daysArray.map(day => `${day}`), 'Total'];

    const data = allWorkers.map(worker => {
      let total = 0;
      const row = [worker.name];

      daysArray.forEach(day => {
        const status = getAttendanceStatus(worker._id, day);
        row.push(status);

        if (status === 'P') total += 1;
        else if (status === 'P2') total += 2;
        else if (status === 'P3') total += 3;
      });

      row.push(total);
      return row;
    });

    const worksheetData = [[title], header, ...data];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    worksheet['!cols'] = [{ wch: 20 }, ...daysArray.map(() => ({ wch: 4 })), { wch: 6 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

    XLSX.writeFile(workbook, `Attendance_${month + 1}_${year}.xlsx`);
  };

  return (
    <Layout title="Attendance - Manager">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">
          Attendance - {now.toLocaleString('default', { month: 'long' })} {year}
        </h1>

        <div className="flex justify-end mb-2">
          <button
            onClick={downloadExcel}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Download Excel
          </button>
        </div>

        {loading ? (
          <p>Loading data...</p>
        ) : (
          <div className="overflow-auto max-h-[70vh]">
            <table className="min-w-full table-auto border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 sticky left-0 top-0 bg-gray-100 z-10">
                    Name
                  </th>
                  {daysArray.map(day => (
                    <th
                      key={day}
                      className="border p-2 text-sm sticky top-0 bg-gray-100 z-10"
                    >
                      {day}
                    </th>
                  ))}
                  <th className="border p-2 text-sm sticky top-0 bg-gray-100 z-10">Total</th>
                </tr>
              </thead>
              <tbody>
                {allWorkers.map(worker => {
                  let total = 0;
                  const dayStatus = daysArray.map(day => {
                    const status = getAttendanceStatus(worker._id, day);
                    if (status === 'P') total += 1;
                    else if (status === 'P2') total += 2;
                    else if (status === 'P3') total += 3;
                    return status;
                  });

                  return (
                    <tr key={worker._id}>
                      <td className="border p-2 sticky left-0 bg-white font-medium z-10">
                        {worker.name}
                      </td>
                      {dayStatus.map((status, index) => (
                        <td
                          key={index}
                          className={`border p-1 text-center text-sm ${
                            status === 'A'
                              ? 'bg-red-100 text-red-600'
                              : status.startsWith('P')
                              ? 'bg-green-100 text-green-700'
                              : 'text-gray-400'
                          }`}
                        >
                          {status}
                        </td>
                      ))}
                      <td className="border p-1 text-center font-semibold">{total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Attendance;
