import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/Auth';
import * as XLSX from 'xlsx';
import { FaUserTie, FaUsers, FaClipboardList, FaCalendarAlt, FaMoneyBillWave, FaExclamationCircle } from "react-icons/fa";
import { Users } from "lucide-react";
import { Link , useNavigate } from 'react-router-dom'

const MccDetails = () => {
    const { id } = useParams();
    const [managers, setManager] = useState({});
    const [livetrain, setLivetrain] = useState([]);
    const [completedGrouped, setCompletedGrouped] = useState([]);
    const [auth] = useAuth();
    const [isDownloading, setIsDownloading] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('contractinfo'); // State to toggle between live and completed trains

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
    contractPeriod: "Oct 2024 -  Sep 2026",
    contractValue:"₹130,000,000",
    managerName: "John Doe",
    totalLabours: 95,
    pitYardCount: 24,
    mccLabourCount: 71,
    lastBillPassedPeriod:"September",
    lastBillPassedDate: "2024-11-25",
    estimatedBillPassingDate: "2025-02-15",
    penality: "150,000",
    billDelayReason: "Pending approval from finance department",
    billAmount: "$200,000",
    grossSalary: "$1980,000",
    netSalary: "$1918,000",
    esiGross:"1000",
    pfGross:"32000",
    advance:"22500",
    otherAllowance:"16100",
    chemicalPurchase: "$500,000",
    electricityCharge:"100000",
    rent:"40000",
    cleaningmaterialPurchase:"8000",
    otherExpenses:"10000",
    supervisors: ["Smitha", "Lijesh", "Rajkumar","Akbar","Inamul"]
    
  };


  const targetDate = new Date('2026-09-29T00:00:00');
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

//   train
  const data1 = {
    trainno:"05/02/2025",
status:"Live",
Coaches:"84",
TotalWorkersallocated:59,
actualWorkersRequired:58,
Excess:"6",
Short:"5"  
};


const WorkerStatus = ({ data1 }) => {
    // Calculate actual workers required (rounding up)
    const actualWorkersRequired = Math.ceil(parseFloat(data1.Coaches) * 0.6);
    
    // Calculate excess and shortage of workers
    const workerDifference = actualWorkersRequired - parseInt(data1.TotalWorkersallocated);
    const excessWorkers = data1.Excess
    const shortageWorkers = data1.Short



};
    return (
        <Layout>
            <div className="mt-10 px-6 md:px-16 lg:px-32 mb-10">

            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-20 shadow p-4 md:p-6 bg-red-50">
  <span className="flex items-center text-sm md:text-base">
    <FaCalendarAlt className="text-blue-500 mr-2 text-xl md:text-2xl" />
    <b className="mr-2">Period of Contract:</b>
    {data.contractPeriod}
  </span>

  <div className="bg-yellow-200 px-4 py-2 rounded text-sm md:text-xl flex flex-col md:flex-row items-center">
    <span className="mr-2 md:mr-4">{timeLeft.years} Years</span>
    <span className="mr-2 md:mr-4">{timeLeft.months} Months Left</span>
    {/* <span>{timeLeft.days} Days</span> */}
  </div>

  <span className="font-semibold flex text-sm md:text-md">
    Contract Value: {data.contractValue}
  </span>
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
                        onClick={() => setActiveTab('contractinfo')}
                        className={`px-4 py-2  font-semibold  ${activeTab === 'contractinfo' ? 'text-white bg-green-500 hover:bg-green-500 hover:text-white'  : 'text-red-500'}`}
                    >
                    Contract Info
                    </button>
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
                {/* contract info */}
                {activeTab === 'contractinfo' && (
                    <>
                    <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Labour</h1>
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
        </div>
        </div>
        
        <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Bill</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Last Bill Passed </p>
          <p>{data.lastBillPassedDate}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Last Bill Passed Period </p>
          <p>{data.lastBillPassedPeriod}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Estimated Bill Passing Date</p>
          <p>{data.estimatedBillPassingDate}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Penality</p>
          <p>{data.penality}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Bill Value</p>
          <p>{data.billAmount}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Reason for Bill Delay</p>
          <p>{data.billDelayReason}</p>
        </div>
        </div>
        </div>
        <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Salary</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Gross Salary</p>
          <p> {data.grossSalary}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Net Salary</p>
          <p> {data.netSalary}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Esi gross</p>
          <p> {data.esiGross}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">PF Gross</p>
          <p> {data.pfGross}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Advance</p>
          <p> {data.advance}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Other Allowance</p>
          <p> {data.otherAllowance}</p>
        </div>
        </div>
        </div>
        <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Expenses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Chemical Purchase</p>
          <p>{data.chemicalPurchase}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Electricity Charges</p>
          <p>{data.electricityCharge}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Rent</p>
          <p>{data.rent}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Cleaning Material Purchase</p>
          <p>{data.cleaningmaterialPurchase}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Other Expenses</p>
          <p>{data.otherExpenses}</p>
        </div>
        </div>
        </div>
        
        
        <div className="bg-white p-6 shadow-lg rounded-xl col-span-1 md:col-span-2 lg:col-span-3 transition-all hover:shadow-2xl hover:scale-105">
      <div className="flex items-center justify-center mb-4">
        <Users className="text-blue-600 w-8 h-8" />
      </div>
      <p className="font-semibold text-center text-2xl text-gray-800">Supervisors</p>
      <ul className="mt-3 space-y-2 text-gray-600">
        {data.supervisors.map((supervisor, index) => (
          <li key={index} className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
            <Users className="text-gray-500 w-5 h-5" />
            {supervisor}
          </li>
        ))}
      </ul>
    </div>
    

                    </>

                )}

                {/* Live Trains */}
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
                                            <th className="px-4 py-2 text-left text-gray-600">Action</th>
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
                                                    <Link to={`/Live-train/${train._id}`}><td className="px-4 text-blue-500 py-2">View Details</td></Link>

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
                                                    <th className="px-4 py-2 text-left text-gray-600">Total Coaches</th>

                                                    <th className="px-4 py-2 text-left text-gray-600">Labour Allocated</th>
                                                    <th className="px-4 py-2 text-left text-gray-600">Actual Labour As per Tender</th>
                                                    <th className="px-4 py-2 text-left text-gray-600">Excess Of Workers</th>
                                                    <th className="px-4 py-2 text-left text-gray-600">Short Of Workers</th>
                                                    <th className="px-4 py-2 text-left text-gray-600">Actions</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {completedGrouped.length > 0 ? (
                                            completedGrouped.map((train, index) => (
                                                <tr key={train._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                     <td className="px-4 py-2">{data1.trainno}</td>
                                                            <td className="px-4 text-grey-900 py-2">{data1.Coaches}</td>
                                                            <td className="px-4 text-grey-900 py-2">{data1.TotalWorkersallocated}</td>
                                                            <td className="px-4 text-grey-900 py-2">{data1.actualWorkersRequired}</td>
                                                            
                                                            <td className="px-4 text-grey-900 py-2">{data1.Excess}</td>
                                                           <td className="px-4 text-blue-500 py-2">{data1.Short}</td>
                                                    
                                                    <Link to={`/Daybase-Detail/${train._id}`}><td className="px-4 text-blue-500 py-2">View Details</td></Link>


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


// <Link to={`/Live-train/${train._id}`}>