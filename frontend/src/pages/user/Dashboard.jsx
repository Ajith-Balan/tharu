import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import axios from 'axios';
import { useAuth } from '../../context/Auth';
import { AiOutlinePlus } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope } from 'react-icons/fa'; 

const Dashboard = () => {
    const [auth] = useAuth();
    const [managers, setManager] = useState({});
    const [livetrain, setLivetrain] = useState([]);
    const [completedGrouped, setCompletedGrouped] = useState({});
    const [activeTab, setActiveTab] = useState("processing");

    const getManager = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND}/api/v1/auth/getmanager/${auth.user.type}`);
            setManager(res.data.manager);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getTrain = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/get-livemcctrain`);
            const liveTrains = res.data.filter((train) => train.site === auth.user.type);
            setLivetrain(liveTrains);
        } catch (error) {
            console.error('Error fetching live trains:', error);
        }
    };

    const getCompletedTrain = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/get-completedmcctrain`);
            const completedTrains = res.data
                .filter((train) => train.site === auth.user.type)
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

            const grouped = completedTrains.reduce((acc, train) => {
                const date = new Date(train.updatedAt).toLocaleDateString();
                if (!acc[date]) acc[date] = [];
                acc[date].push(train);
                return acc;
            }, {});

            setCompletedGrouped(grouped);
        } catch (error) {
            console.error('Error fetching completed trains:', error);
        }
    };

    const formatDateTime = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return new Date(dateString).toLocaleString(undefined, options);
    };

    useEffect(() => {
        getManager();
    }, []);

    useEffect(() => {
        getTrain();
        getCompletedTrain();
    }, []);

    return (
        <Layout>
            <div className="mt-20 px-4 md:px-10 lg:px-20 bg-gray-100 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
    <h1 className="text-2xl md:text-3xl font-bold text-red-600">Hii!!     Ajith Balan</h1>
    <div className="flex items-center gap-4">
        
        <div className="flex items-center gap-2">
            <img
                src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                alt="User Profile"
                className="w-12 h-12 rounded-full border border-gray-300 object-cover"
            />
            <span className="text-lg font-medium text-gray-700">Ajith balan</span>
        </div>
       
    </div>
</div>


<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 max-w-md">
        <h5 className="text-lg font-semibold text-gray-700">Active Train:</h5>
        <p className="text-md text-gray-600">{managers.name || "Loading..."}</p>
        <div className="mt-4">
            <span className="inline-block px-4 py-2 text-sm font-semibold text-green-700 bg-green-100 rounded-full">
                Active
            </span>
        </div>
    </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 max-w-md">
        <h5 className="text-lg font-semibold text-gray-700">Work Completed:</h5>
        <p className="text-md text-gray-600">{managers.name || "Loading..."}</p>
        <div className="mt-4">
            <span className="inline-block px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full">
                Completed
            </span>
        </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8 max-w-md">
        <h5 className="text-lg font-semibold text-gray-700">Pending:</h5>
        <p className="text-md text-gray-600">{managers.name || "Loading..."}</p>
        <div className="mt-4">
            <span className="inline-block px-4 py-2 text-sm font-semibold text-yellow-700 bg-yellow-100 rounded-full">
                Pending
            </span>
        </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8 max-w-md">
        <h5 className="text-lg font-semibold text-gray-700">Scheduled:</h5>
        <p className="text-md text-gray-600">{managers.name || "Loading..."}</p>
        <div className="mt-4">
            <span className="inline-block px-4 py-2 text-sm font-semibold text-purple-700 bg-purple-100 rounded-full">
                Scheduled
            </span>
        </div>
    </div>
</div>

                <div className="mb-6 border-b border-gray-300">
               <div className='flex items-end justify-end'>

               <Link to={`/dashboard/user/addmcctrain`}>
            <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
                <AiOutlinePlus className="text-xl" />
                Create 
            </button>
        </Link>
               </div>
               <div className="px-6 py-4 bg-gray-100  mb-6">
     <div className="mb-4 flex items-center gap-2">
        <FaUser className="text-gray-700 text-xl" />
        <h1 className="text-xl font-semibold text-gray-700">Manager:</h1>
    </div>
     <div className="mb-4 flex items-center gap-2">
        <FaEnvelope className="text-gray-700 text-xl" />
        <h2 className="text-lg font-semibold text-gray-700">Contact:</h2>
    </div>
    <div className="flex items-center gap-4 mt-4">
        
   
    </div>
</div>
                    <ul className="flex">
                        <li
                            className={`cursor-pointer px-6 py-3 ${
                                activeTab === "processing"
                                    ? "border-b-2 border-red-500 text-red-500"
                                    : "text-gray-500"
                            }`}
                            onClick={() => setActiveTab("processing")}
                        >
                            Processing Trains
                        </li>
                        <li
                            className={`cursor-pointer px-6 py-3 ${
                                activeTab === "completed"
                                    ? "border-b-2 border-emerald-400 text-emerald-400"
                                    : "text-gray-500"
                            }`}
                            onClick={() => setActiveTab("completed")}
                        >
                            Completed Trains
                        </li>
                    </ul>
                </div>
                {activeTab === "processing" && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg shadow-md">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">Train No</th>
                                    <th className="px-4 py-2 text-left text-gray-600 font-semibold">Status</th>
                                    <th className="px-4 py-2 text-left text-gray-600 font-semibold">Started On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {livetrain.length > 0 ? (
                                    livetrain.map((train) => (
                                        <tr key={train._id} className="hover:bg-gray-100 border-t border-gray-300">
                                            <td className="px-4 py-2 text-gray-700 font-bold">{train.trainno}</td>
                                            <td className="px-4 py-2">
                                                <span
                                                    className={`py-1 text-sm font-medium rounded-full ${
                                                        train.status === "Processing"
                                                            ? "bg-red-100 text-green-600"
                                                            : "text-yellow-400"
                                                    }`}
                                                >
                                                    {train.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-gray-500">
                                                {formatDateTime(train.createdAt)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                                            No live trains available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === "completed" && (
                    <div className="overflow-x-auto">
                        {Object.keys(completedGrouped).length > 0 ? (
                            Object.entries(completedGrouped).map(([date, trains]) => (
                                <div key={date} className="mb-8">
                                    <h3 className="text-lg font-bold text-red-500 mb-4">{date}</h3>
                                    <table className="min-w-full bg-white rounded-lg shadow-md">
                                        <thead>
                                            <tr className="bg-gray-200">
                                                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Train No</th>
                                                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Status</th>
                                                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Created On</th>
                                                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Completion Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {trains.map((train) => (
                                                <tr key={train._id} className="hover:bg-gray-100 border-t border-gray-300">
                                                    <td className="px-4 py-2 text-gray-700 font-bold">{train.trainno}</td>
                                                    <td className="px-4 py-2">
                                                        <span
                                                            className={`py-1 text-sm font-medium ${
                                                                train.status === "Completed"
                                                                    ? "bg-blue-100 text-blue-600"
                                                                    : "text-emerald-500"
                                                            }`}
                                                        >
                                                            {train.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 text-gray-500">
                                                        {formatDateTime(train.createdAt)}
                                                    </td>
                                                    <td className="px-4 py-2 text-gray-500">
                                                        {formatDateTime(train.updatedAt)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No completed trains available.</p>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Dashboard;