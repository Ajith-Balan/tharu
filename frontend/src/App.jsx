import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';

import Home from './pages/home';
import About from './pages/About';
import Contact from './pages/Contact';
import Policy from './pages/Policy';
import Pagenotfound from './pages/Pagenotfound';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import Dashboard from './pages/user/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import PrivateRoute from './components/Routes/PrivateRoute';
import AdminRoute from './components/Routes/AdminRoute';
import AdminDashboard from './pages/Admin/AdminDashboard';

import Forget from './pages/Auth/Forget';
import ManagerRoute from './components/Routes/ManagerRoute';
import Managerhome from './pages/manager/Managerhome';
import Addmcctrain from './pages/user/Addmcctrain';
import Site from './components/Site';
import LiveTrain from './pages/manager/LiveTrain';
import Addsupervisor from './pages/manager/Addsupervisor';
import Addworkers from './pages/manager/Addworkers';
import CompletedTrain from './pages/user/Completedtrain';

import TrainDetails from './pages/user/TrainDetails';
import StaffDetails from './pages/manager/StaffDetails';
import Attendance from './pages/manager/Attendance';
import TrainDetail from './pages/manager/TrainDetail';
import Completedtrain from './pages/manager/CompletedTrain';
import Editstaff from './pages/manager/Editstaff';
import Billdetails from './pages/manager/Billdetails';
import Addbill from './pages/manager/Addbill';
import Connect from './pages/manager/Connect';
import BulkUploadWorkers from './pages/manager/BulkUploadWorkers';
function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
        <Route path='/' element={<Site/>} />
        {/* <Route path='/search' element={<SearchResult />} /> */}


        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forget' element={<Forget />} />
          
          {/* Private Route Wrapper */}
          <Route path='/dashboard' element={<AdminRoute />} >
          <Route path='admin' element={<AdminDashboard />} />
          <Route path='admin/Live-train/:id' element={<LiveTrain />} />
          <Route path='admin/addsupervisors' element={<Addsupervisor />} />

          <Route path='admin/addworkers' element={<Addworkers/>} />



          </Route>
   {/* Private Route Wrapper */}
   <Route path='/dashboard' element={<PrivateRoute />} >
          <Route path='user' element={<Dashboard />} />
          <Route path='user/addduty' element={<Addmcctrain />} />
           <Route path='user/completedduty' element={<CompletedTrain />} />
           <Route path='user/traindetails/:id' element={<TrainDetails />} />




          </Route>


          <Route path='/dashboard' element={<ManagerRoute />} >
          <Route path='manager' element={<Managerhome />} />
          <Route path='manager/bills' element={<Billdetails />} />
          <Route path='manager/connect' element={<Connect />} />
         <Route path='manager/addbills' element={<Addbill />} />


          <Route path='manager/addsupervisors' element={<Addsupervisor />} />
           <Route path='manager/addworkerss' element={<BulkUploadWorkers />} />

          <Route path='manager/addworkers' element={<Addworkers/>} />
          <Route path='manager/addwork' element={<Addmcctrain/>} />
           <Route path='manager/livework' element={<LiveTrain/>} />

          <Route path='manager/completed' element={<Completedtrain/>} />

           <Route path='manager/traindetail/:id' element={<TrainDetail/>} />

           <Route path='manager/staffdetails' element={<StaffDetails/>} />
           <Route path='manager/editstaff/:id' element={<Editstaff/>} />
            <Route path='manager/attendance' element={<Attendance/>} />






          </Route>

          {/* <Route path='/addsupervisors' element={<Addsupervisor />} /> */}


          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/policy' element={<Policy />} />
          <Route path='*' element={<Pagenotfound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
