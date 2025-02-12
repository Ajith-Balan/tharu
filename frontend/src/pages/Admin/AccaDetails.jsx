

import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/Auth';
import * as XLSX from 'xlsx';
import { FaUserTie,FaRegCalendarAlt, FaUsers, FaClipboardList, FaCalendarAlt, FaMoneyBillWave, FaExclamationCircle } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs"; // Install using: npm install dayjs
import { Users } from "lucide-react";

const AccaDetails = () => {
    const { id } = useParams();
    const [managers, setManager] = useState({});
    const [livetrain, setLivetrain] = useState([]);
    const [completedGrouped, setCompletedGrouped] = useState([]);
    const [auth] = useAuth();
    const [isDownloading, setIsDownloading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('contractinfo'); // State to toggle between live and completed trains
    const [groupedData, setGroupedData] = useState({});
    
    useEffect(() => {
        if (id) getManager();
    }, [id]);

    useEffect(() => {
        getTrain();
        getCompletedTrain();
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

   

    const getCompletedTrain = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/get-completedmcctrain`);
            const data = res.data;
            setCompletedGrouped(data)
            if (!data || data.length === 0) {
                setGroupedData({});
                return;
            }

            // Get the current month
            const currentMonth = dayjs().format("YYYY-MM");

            // Group data by day
            const grouped = data.reduce((acc, train) => {
                const formattedDate = dayjs(train.updatedAt).format("YYYY-MM-DD");

                // Only include data within the current month
                if (formattedDate.startsWith(currentMonth)) {
                    acc[formattedDate] = acc[formattedDate] ? [...acc[formattedDate], train] : [train];
                }

                return acc;
            }, {});

            setGroupedData(grouped);
        } catch (error) {
            console.error("Error fetching completed trains:", error);
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
                Status: train.status,
                BedsheetReqired : train.totalcoach,
                BedsheetLoss:train.workers

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

    const data1 = [
        { reqman: 178, manpower: 195, shortman: 10, excessman: 5 ,bedreq:155,allobed:100,},
        { reqman: 18, manpower: 1587, shortman: 140, excessman: 550 ,bedreq:155,allobed:100,},
        { reqman: 518, manpower: 15, shortman: 130, excessman: 590 ,bedreq:155,allobed:100, }
    ];

    const total = [
        { reqman: 178, manpower: 195, shortman: 10, excessman: 5 ,bedreq:155,allobed:100,},
     
    ];
    

    
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










  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);


  

  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {


    // If startDate is not provided, set it to the first day of the current month
    const defaultStartDate = startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    // If endDate is not provided, set it to today
    const defaultEndDate = endDate || new Date();

    const filtered = Object.entries(groupedData).reduce((acc, [date, trains]) => {
        const trainDate = new Date(date);

        if (trainDate >= defaultStartDate && trainDate <= defaultEndDate) {
            acc[date] = trains;
        }
        return acc;
    }, {});

    setFilteredData(filtered);
}, [startDate, endDate, groupedData]);

  
    return (
        <Layout>
            <div className="mt-10 px-6 md:px-16 lg:px-32 mb-10">

                {/*   <div className='flex justify-center my-10 items-center gap-2'>
       <p > 
                 

         <span className='  flex gap-20 px-40 py-5 p-1 shadow '>
           
              <span className="font-semibold flex">  <FaCalendarAlt className="text-blue-500 mr-2  text-2xl" />  Period of Contract :  </span>

            {data.contractPeriod}
            <div className="bg-yellow-200 px-6 rounded text-xl">
        <span className="mr-4">{timeLeft.years} Years</span>
        <span className="mr-4">{timeLeft.months} Months Left</span>
        <span>{timeLeft.days} Days </span>
        
      </div>
         </span>
       
         </p>

       
                </div> */}



                

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
                <h1 className="text-3xl font-bold text-gray-800 mb-6">ACCA Details</h1>
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
                {activeTab === 'live' && (
                    <>
                        <div className="flex justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Live Trains</h2>
                            <button onClick={getTrain} className="px-3 py-1 text-sm bg-gray-300 rounded-lg shadow hover:bg-gray-400">Refresh</button>
                        </div>
                        <div className="overflow-x-auto mb-10">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                                    <thead>
                                        <tr className="bg-gray-100 border">
                                            <th className="px-2  border py-1 text-left text-gray-600">Date</th>
                                            <th className="px-2 border py-1 text-left text-gray-600">Train No</th>
                                            <th className="px-2 border py-1 text-left text-gray-600">started on</th>
                                             <th className="px-2 border py-1 text-left text-gray-600">Man power req</th>
                                            <th className="px-2 border py-1 text-left text-gray-600">Man power allocated</th>
                                            <th className="px-2 border py-1 text-left text-gray-600">man excess</th>
                                            <th className="px-2 border py-1 text-left text-gray-600">man Short</th>
                                            <th className="px-2 border py-1 text-left text-gray-600">Bedsheet required</th>
                                            <th className="px-2 border py-1 text-left text-gray-600">Actual Loaded</th>
                                            <th className="px-2 border py-1 text-left text-gray-600">Excess</th>
                                            <th className="px-2 border py-1 text-left text-gray-600">Short</th>
                                            <th className="px-2 border py-1 text-left text-gray-600">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {livetrain.length > 0 ? (
                                            livetrain.map((train, index) => (
                                                data1.map((trainn) => (

                                                <tr key={train._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                    <td className="px-4 py-2">{new Date(train.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-4 py-2">{train.trainno}</td>
                                                    <td className="px-4  py-2">{new Date(train.createdAt).toLocaleTimeString()}</td>
                                                    <td className="px-4  py-2">{trainn.reqman}</td>
                                                    <td className="px-4  py-2">{trainn.manpower}</td>
                                                    <td className="px-4  py-2">{trainn.shortman}</td>
                                                    <td className="px-4  py-2">{trainn.excessman}</td>
                                                    <td className="px-4  py-2">{trainn.reqman}</td>
                                                    <td className="px-4  py-2">{trainn.reqman}</td>
                                                    <td className="px-4  py-2">{trainn.reqman}</td>
                                                    <td className="px-4  py-2">{trainn.reqman}</td>

                                                    <td className="px-4 text-green-500 py-2">{train.status}</td>


                                                </tr>
                                            ))
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
                       <div className="mb-4">
  <h2 className="text-2xl font-bold text-gray-800">Completed Trains</h2>

  {/* Filter Section */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white shadow-md rounded-lg p-3 space-y-2 sm:space-y-0 sm:space-x-2">
    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full">
      <span className="text-gray-700 font-medium">Filter:</span>

      {/* Start Date */}
      <div className="relative w-full sm:w-36">
        <FaRegCalendarAlt className="absolute left-3 top-3 text-gray-500" />
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
             dateFormat="dd-MM-yyyy"
          endDate={endDate}
          className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholderText="Start Date"
        />
      </div>

      <span className="text-gray-500 hidden sm:inline">to</span>

      {/* End Date */}
      <div className="relative w-full sm:w-36">
        <FaRegCalendarAlt className="absolute left-3 top-3 text-gray-500" />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
             dateFormat="dd-MM-yyyy"
          minDate={startDate}
          className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholderText="End Date"
        />
      </div>
    </div>

    {/* Download Button */}
    <button
      onClick={downloadExcel}
      disabled={isDownloading}
      className={`w-52 rounded  px-1 py-1  shadow ${
        isDownloading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white'
      }`}
    >
      {isDownloading ? 'Downloading...' : 'Download Excel'}
    </button>
  </div>
</div>

                        {loading ? (
                            <p className="text-center py-4 text-gray-500">Loading completed trains...</p>
                        ) : (
                            <div className="overflow-x-auto mb-10">
                                <table className="min-w-full text-center bg-white border border-gray-200 rounded-lg shadow-lg">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="px-4 py-2 text-left text-gray-600">Date</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Number of Trains</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Man power req</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Man power allocated</th>
                                            <th className="px-4 py-2 text-left text-gray-600">man excess</th>
                                            <th className="px-4 py-2 text-left text-gray-600">man Short</th>



                                            <th className="px-4 py-2 text-left text-gray-600">Bedsheet required</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Actual Loaded</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Excess</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Short</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Returned Bedsheet</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Bedsheet Loss</th>

                                        </tr>
                                    </thead>
                                    <tbody>
    {Object.keys(filteredData).length > 0 ? (
        Object.entries(filteredData).map(([date, trains]) => {
            const totalCoaches = trains.reduce((sum, train) => sum + train.totalcoach, 0);
            const totalWorkers = trains.reduce((sum, train) => sum + train.workers, 0);
            const excess = totalWorkers - totalCoaches;
            const nonNegativeExcess = Math.max(excess, 0); // Ensures non-negative result

            const short = totalCoaches - totalWorkers;
            const nonNegativeShort = Math.max(short, 0); // Ensures non-negative result

            return (

                
                <tr key={date} className="bg-gray-50">
                    <td className="px-4 py-2">{date.split("-").reverse().join("-")}</td>
                    <td className="px-4 py-2">{trains.length}</td>
                    <td className="px-4 py-2">{totalCoaches}</td>
                    <td className="px-4 py-2">{totalWorkers}</td>
                    <td className="px-4 py-2">{nonNegativeExcess}</td>
                    <td className="px-4 py-2">{nonNegativeShort}</td>
                    <td className="px-4 py-2">{totalCoaches - 15}</td>
                    <td className="px-4  py-2">{totalWorkers - (totalCoaches - 15)}</td>
                    <td className="px-4 py-2">{nonNegativeExcess}</td>
                    <td className="px-4 py-2">{nonNegativeShort}</td>
                    <td className="px-4 py-2">{totalCoaches - 15}</td>
                    <td className="px-4  py-2">{totalWorkers - (totalCoaches - 15)}</td>


                    
                </tr>
            );
        })
    ) : (
        <tr>
            <td colSpan="8" className="text-center py-4 text-gray-500">
                No completed trains available.
            </td>
        </tr>
    )}
</tbody>

                                </table>
                            </div>

                            
                        )
                        
                        }

                        
                    </>
                )}

                 {/* Completed Trains */}
{activeTab === 'completed' && (
    <>
        <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Total Summary</h2>
        </div>
        {loading ? (
            <p className="text-center py-4 text-gray-500">Loading completed trains...</p>
        ) : (
            <div className="overflow-x-auto mb-10">
                <table className="min-w-full bg-white text-center border border-gray-200 rounded-lg shadow-lg">
                    <thead>
                        <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left text-gray-600">Date</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Number of Trains</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Man power req</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Man power allocated</th>
                                            <th className="px-4 py-2 text-left text-gray-600">man excess</th>
                                            <th className="px-4 py-2 text-left text-gray-600">man Short</th>



                                            <th className="px-4 py-2 text-left text-gray-600">Bedsheet required</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Actual Loaded</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Excess</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Short</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Returned Bedsheet</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Bedsheet Loss</th>
                        </tr>
                    </thead>
                    <tbody>
    {/* Total Summary Row */}
    <tr className="bg-blue-100  font-bold">
        <td className="px-4 py-2">Total</td>
        <td className="px-4 py-2">{completedGrouped.length}</td>
        <td className="px-4 py-2">
            {completedGrouped.reduce((sum, train) => sum + (train.totalcoach || 0), 0)}
        </td>
        <td className="px-4 py-2">
            164
        </td>
        <td className="px-4 py-2">
            78
        </td>
        <td className="px-4 py-2">
            4
        </td>
        <td className="px-4 py-2">
            45
        </td>
        <td className="px-4  py-2">
            119
        </td><td className="px-4  py-2">
            78
        </td>
        <td className="px-4 bg-red-400 py-2">
            4
        </td>
        <td className="px-4  py-2">
            43
        </td>
        <td className="px-4 bg-red-400 py-2">
            119
        </td>
    </tr>

    {/* Train Data Rows
    {completedGrouped.length > 0 ? (
        completedGrouped.map((train, index) => {
            const totalCoaches = train.totalcoach || 0;
            const totalWorkers = train.workers || 0;
            const excess = Math.max(0, totalWorkers - totalCoaches);
            const short = Math.max(0, totalCoaches - totalWorkers);

            return (
                <tr key={train._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-2">{new Date(train.updatedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{train.trainno}</td>
                    <td className="px-4 py-2">{totalCoaches}</td>
                    <td className="px-4 py-2">{totalWorkers}</td>
                    <td className="px-4 py-2">{excess}</td>
                    <td className="px-4 py-2">{short}</td>
                    <td className="px-4 py-2">{train.returnedBedsheet || 0}</td>
                    <td className="px-4 py-2">{train.bedsheetLoss || 0}</td>
                </tr>
            );
        })
    ) : (
        <tr>
            <td colSpan="8" className="text-center py-4 text-gray-500">No completed trains available.</td>
        </tr>
    )} */}
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

export default AccaDetails;
