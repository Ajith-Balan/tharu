import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/Auth';
import * as XLSX from 'xlsx';
import { FaUserTie, FaUsers, FaClipboardList, FaCalendarAlt, FaMoneyBillWave, FaExclamationCircle } from "react-icons/fa";


const MccDetails = () => {
    const { id } = useParams();
    const [managers, setManager] = useState({});
    const [livetrain, setLivetrain] = useState([]);
    const [completedGrouped, setCompletedGrouped] = useState([]);
    const [auth] = useAuth();
    const [isDownloading, setIsDownloading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('live'); // State to toggle between live and completed trains

    useEffect(() => {
        if (id) getManager();
    }, [id]);

    useEffect(() => {
        getTrain();
        getcompletedTrain();
    }, []);

    const getManager = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND}/api/v1/auth/getmanager/${id}`);
            setManager(res.data.manager);
        } catch (error) {
            console.error('Error fetching manager data:', error);
        }
    };

    const getTrain = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/get-livemcctrain`);
            const liveTrains = auth?.user ? res.data.filter((train) => train.site === auth.user.type) : [];
            setLivetrain(res.data);
        } catch (error) {
            console.error('Error fetching live trains:', error);
        }
    };

    const getcompletedTrain = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/get-completedmcctrain`);
            const completedTrains = auth?.user ? res.data.filter((train) => train.site === auth.user.type) : [];
            setCompletedGrouped(res.data);
        } catch (error) {
            console.error('Error fetching completed trains:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadExcel = () => {
        setIsDownloading(true);
        try {
            const formattedData = completedGrouped.map(train => ({
                Date: new Date(train.updatedAt).toLocaleDateString(),
                TrainNo: train.trainno,
                Status: train.status
            }));
            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Completed Trains');
            XLSX.writeFile(workbook, 'Completed_Trains.xlsx');
        } catch (error) {
            console.error('Error downloading Excel file:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Layout>
            <div className="mt-20 px-6 md:px-16 lg:px-32">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">MCC Details</h1>


                <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold text-center mb-4">Contract Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[ 
          { icon: <FaCalendarAlt className="text-blue-500 text-2xl" />, label: "Period of Contract", value: "0/12/2025 - 1/26/2029" },
          { icon: <FaUserTie className="text-green-500 text-2xl" />, label: "Manager Name", value: `${managers.name}` },
          { icon: <FaUsers className="text-purple-500 text-2xl" />, label: "Total Number of Labours", value: "[Count]" },
          { icon: <FaClipboardList className="text-yellow-500 text-2xl" />, label: "Labour Division MCC Count", value: "[Count]" },
          { icon: <FaClipboardList className="text-yellow-500 text-2xl" />, label: "Pit & Yard Count", value: "[Count]" },
          { icon: <FaCalendarAlt className="text-red-500 text-2xl" />, label: "Last Passed Bill", value: "[Month]" },
          { icon: <FaExclamationCircle className="text-orange-500 text-2xl" />, label: "Reason for Bill Delay", value: "[Reason]" },
          { icon: <FaCalendarAlt className="text-blue-500 text-2xl" />, label: "Estimated Bill Passing Date", value: "[Date]" },
          { icon: <FaUserTie className="text-green-500 text-2xl" />, label: "List of Supervisors", value: "[Names]" },
          { icon: <FaMoneyBillWave className="text-indigo-500 text-2xl" />, label: "Total Expenses", value: "[Amount]" },
          { icon: <FaMoneyBillWave className="text-indigo-500 text-2xl" />, label: "Bill Amount & Salary", value: "[Amount]" }
        ].map((item, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-xl shadow-md flex items-center space-x-3">
            {item.icon}
            <p className="font-semibold">{item.label}: <span className="text-gray-600">{item.value}</span></p>
          </div>
        ))}
      </div>
    </div>

                <div className='flex gap-x-4 m-2 text-center'>
                    <div className=' p-2 bg-gray-200'>total  Livetrain count <br />{livetrain.length}</div>
                    <div className='p-2 bg-gray-200'>total Completedtrain count <br />{completedGrouped.length}</div>
                </div>

                <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-8">
                    <h5 className="text-xl font-semibold text-gray-700">Manager:</h5>
                    <p className="text-lg text-gray-600">{managers.name || 'Loading...'}</p>
                </div>

                {/* Tab navigation */}
                <div className="flex border-b space-x-1 mb-6">
                    <button
                        onClick={() => setActiveTab('live')}
                        className={`px-4 py-2  font-semibold  ${activeTab === 'live' ? ' bg-green-500 text-white  hover:bg-green-500 hover:text-white' : 'text-green-500'}`}
                    >
                        Live Trains
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`px-4 py-2  font-semibold  ${activeTab === 'completed' ? 'text-white bg-green-500  hover:text-white' : 'text-blue-500'}`}
                    >
                        Completed Trains
                    </button>
                </div>

                {/* Live Trains */}
                {activeTab === 'live' && (
                    <>
                        <div className="flex justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Live Trains</h2>
                            <button onClick={getTrain} className="px-3 py-1 text-sm bg-gray-300 rounded-lg shadow hover:bg-gray-400">Refresh</button>
                        </div>
                        <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="px-4 py-2 text-left text-gray-600">Date</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Train No</th>
                                            <th className="px-4 py-2 text-left text-gray-600">started on</th>

                                            <th className="px-4 py-2 text-left text-gray-600">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {livetrain.length > 0 ? (
                                            livetrain.map((train, index) => (
                                                <tr key={train._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                    <td className="px-4 py-2">{new Date(train.updatedAt).toLocaleDateString()}</td>
                                                    <td className="px-4 py-2">{train.trainno}</td>
                                                    <td className="px-4  py-2">{new Date(train.createdAt).toLocaleTimeString()}</td>

                                                    <td className="px-4 text-green-500 py-2">{train.status}</td>

                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center py-4 text-gray-500">No live trains available.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                    </>
                )}

                {/* Completed Trains */}
                {activeTab === 'completed' && (
                    <>
                        <div className="flex justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Completed Trains</h2>
                            <button
                                onClick={downloadExcel}
                                disabled={isDownloading}
                                className={`px-4 py-2 font-semibold shadow shadow ${isDownloading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                            >
                                {isDownloading ? 'Downloading...' : 'Download Excel'}
                            </button>
                        </div>
                        {loading ? (
                            <p className="text-center py-4 text-gray-500">Loading completed trains...</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="px-4 py-2 text-left text-gray-600">Date</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Train No</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Started on</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Completed on</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {completedGrouped.length > 0 ? (
                                            completedGrouped.map((train, index) => (
                                                <tr key={train._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                    <td className="px-4 py-2">{new Date(train.updatedAt).toLocaleDateString()}</td>
                                                    <td className="px-4 py-2">{train.trainno}</td>
                                                    <td className="px-4  py-2">{new Date(train.createdAt).toLocaleTimeString()}</td>
                                                    <td className="px-4  py-2">{new Date(train.updatedAt).toLocaleTimeString()}</td>

                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center py-4 text-gray-500">No completed trains available.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};

export default MccDetails;
