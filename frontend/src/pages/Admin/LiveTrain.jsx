
import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/Auth';
import * as XLSX from 'xlsx';
import { FaUserTie, FaUsers, FaClipboardList, FaCalendarAlt, FaMoneyBillWave, FaExclamationCircle } from "react-icons/fa";
import { Users } from "lucide-react";
import { Link , useNavigate } from 'react-router-dom'

const LiveTrain = () => {
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
    status:"Live",
    Coaches:"23",
    TotalWorkersallocated:18,
actualWorkersRequired:15,
    Excess:"4",
    Short:"0"
    

    
  };
  const WorkerStatus = ({ data }) => {
    // Calculate actual workers required (rounding up)
    const actualWorkersRequired = Math.ceil(parseFloat(data.Coaches) * 0.6);
    
    // Calculate excess and shortage of workers
    const workerDifference = actualWorkersRequired - parseInt(data.TotalWorkersallocated);
    const excessWorkers = workerDifference < 0 ? Math.abs(workerDifference) : 0;
    const shortageWorkers = workerDifference > 0 ? workerDifference : 0;



};
    return (
        <Layout>
            <div className="mt-10 px-6 md:px-16 lg:px-32 mb-10">




                <div className="bg-white p-4 flex justify-between">
                
               <div className='flex items-center gap-2'>
                <FaUserTie className="text-green-500 text-2xl" />
                 <p  > <span className="font-semibold">  Supervisor : Rajkummar   </span> <br />
         
            {managers.name}
         </p>
                </div>       
         
        </div>



        

 


<div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Train No : 12677</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
  
        <div className="bg-green-400 p-4 shadow rounded-lg">
          <p className="font-semibold">Status</p>
          <p>{data.status}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Total Number Of Coaches</p>
          <p>{data.Coaches}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Total Number Of Workers Allocated</p>
          <p>{data.TotalWorkersallocated}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-semibold">Actual Workers Required</p>
          <p>{data.actualWorkersRequired}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="text-red-500 font-bold">Excess of Workers</p>
          <p className='text-red-500 font-bold'>{Math.max(data.TotalWorkersallocated-data.actualWorkersRequired,0)}</p>
          
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="font-bold text-red-500">Shortage of Workers</p>
          <p className="font-bold text-red-500">{Math.max(data.actualWorkersRequired-data.TotalWorkersallocated,0)}</p>
        </div>
        </div>
        </div>
        
       


            

            </div>
        </Layout>
    );
};

export default LiveTrain;
