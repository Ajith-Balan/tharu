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
import SearchResult from './pages/SearchResults';
import CreateType from './pages/Admin/createtype';
import Types from './pages/Types';
import CreateStates from './pages/Admin/CreateState';
import StateSite from './pages/Admin/StateSite';
import CreateSite from './pages/Admin/CreateSite';
import UpdateSite from './pages/Admin/UpdateSite';
import MccDetails from './pages/Admin/MccDetails';
import ManagerRoute from './components/Routes/ManagerRoute';
import Managerhome from './pages/manager/Managerhome';
import Addmcctrain from './pages/user/Addmcctrain';
import Site from './components/Site';
function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
        <Route path='/' element={<Site/>} />
        <Route path='/search' element={<SearchResult />} />


        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forget' element={<Forget />} />
          
          {/* Private Route Wrapper */}
          <Route path='/dashboard' element={<AdminRoute />} >
          <Route path='admin' element={<AdminDashboard />} />
          <Route path='admin/create-states' element={<CreateStates/>} />
          <Route path='admin/states/:id' element={<StateSite />} />
          <Route path='admin/MCC/:id' element={<MccDetails />} />

          <Route path='admin/create-site' element={<CreateSite/>} />
          <Route path='admin/create-type' element={<CreateType/>} />

          <Route path='admin/update-site/:id' element={<UpdateSite/>}/>




          </Route>
   {/* Private Route Wrapper */}
   <Route path='/dashboard' element={<PrivateRoute />} >
          <Route path='user' element={<Dashboard />} />
          <Route path='user/addmcctrain' element={<Addmcctrain />} />



          </Route>


          <Route path='/dashboard' element={<ManagerRoute />} >
          <Route path='manager' element={<Managerhome />} />



          </Route>

          <Route path='/types/:id' element={<Types />} />

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
