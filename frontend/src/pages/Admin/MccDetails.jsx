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



      const data = {
    contractPeriod: "Jan 2024 -  Dec 2027",
    managerName: "John Doe",
    totalLabours: 150,
    pitYardCount: 75,
    mccLabourCount: 40,
    lastBillPassedDate: "2024-01-15",
    estimatedBillPassingDate: "2024-02-15",
    totalExpenses: "$500,000",
    billAmount: "$200,000",
    salary: "$300,000",
    billDelayReason: "Pending approval from finance department",
    supervisors: ["Alice Brown", "Bob Smith", "Charlie Johnson"]
  };



  const targetDate = new Date('2027-12-28T00:00:00');
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      return { years: 0, months: 0, days: 0 };
    }

    const years = targetDate.getFullYear() - now.getFullYear();
    let months = targetDate.getMonth() - now.getMonth();
    let days = targetDate.getDate() - now.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      months += 12;
    }

    return { years, months, days };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

    return (
        <Layout>
            <div className="mt-10 px-6 md:px-16 lg:px-32 mb-10">

    <div className='flex justify-center my-10 items-center gap-2'>
       <p > 
                 

         <span className='  flex gap-20 px-40 py-5 p-1 shadow '>
           
              <span className="font-semibold flex">  <FaCalendarAlt className="text-blue-500 mr-2  text-2xl" />  Period of Contract :  </span>

            {data.contractPeriod}
            <div className="bg-yellow-200 px-6 rounded text-xl">
        <span className="mr-4">{timeLeft.years} Years</span>
        <span className="mr-4">{timeLeft.months} Months Left</span>
        {/* <span>{timeLeft.days} Days </span> */}
        
      </div>
         </span>
       
         </p>

       
                </div> 


                <div className="bg-white p-4 flex justify-between">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">MCC Details</h1>
               <div className='flex items-center gap-2'>
                <FaUserTie className="text-green-500 text-2xl" />
                 <p  > <span className="font-semibold">   Manager Name   </span> <br />
         
            {managers.name}
         </p>
                </div>       
         
        </div>



        
                {/* Tab navigation */}
                <div className="flex border-b space-x-1 mb-10">
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
                        <div className="overflow-x-auto mb-10">
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
                            <div className="overflow-x-auto mb-10">
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

 <div className="p-6 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
  
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Total Number of Labours</p>
          <p>{data.totalLabours}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Pit & Yard Count</p>
          <p>{data.pitYardCount}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">MCC Labour Count</p>
          <p>{data.mccLabourCount}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Last Bill Passed Date</p>
          <p>{data.lastBillPassedDate}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Estimated Bill Passing Date</p>
          <p>{data.estimatedBillPassingDate}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Total Expenses</p>
          <p>{data.totalExpenses}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Bill Amount & Salary</p>
          <p>{data.billAmount} & {data.salary}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Reason for Bill Delay</p>
          <p>{data.billDelayReason}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg col-span-1 md:col-span-2 lg:col-span-3">
          <p className="font-semibold mb-2">List of Supervisors</p>
          <ul className="list-disc pl-4">
            {data.supervisors.map((supervisor, index) => (
              <li key={index}>{supervisor}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>





            

            </div>
        </Layout>
    );
};

export default MccDetails;
