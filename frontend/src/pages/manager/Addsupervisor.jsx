import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminMenu from '../../components/layout/AdminMenu';

const Addsupervisor = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingIfsc, setLoadingIfsc] = useState(false);
  const [ifscError, setIfscError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    aadhar: '',
    empid: '',
    designation: '',
    wage: '',
    bank: '',
    branch: '',
    ifsccode: '',
    acnumber: '',
    uanno: '',
    esino: '',
    status: '',

    role: 0
  });

  const navigate = useNavigate();





  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const ifsccodechange = async (e) => {
    const { name, value } = e.target;
    const upperIFSC = value.toUpperCase();
    setFormData((prev) => ({ ...prev, [name]: upperIFSC }));

    if (name === 'ifsccode' && upperIFSC.length === 11) {
      setLoadingIfsc(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND}/api/v1/worker/get-ifsc/${upperIFSC}`);
        setFormData((prev) => ({
          ...prev,
          bank: res.data.BANK,
          branch: res.data.BRANCH,
        }));
        setIfscError('');
      } catch (err) {
        setFormData((prev) => ({ ...prev, bank: '', branch: '' }));
        setIfscError('⚠️ Enter a valid IFSC code');
      } finally {
        setLoadingIfsc(false);
      }
    }
  };

  const validateForm = () => {
    const { name, phone, empid, aadhar, password, confirmPassword } = formData;
    if (!name || !aadhar || !phone || !empid || !password || !confirmPassword) {
      toast.error('Please fill all fields');
      return false;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      toast.error('Phone number must be 10 digits');
      return false;
    }
    if (!/^[0-9]{12}$/.test(aadhar)) {
      toast.error('Aadhar number must be 12 digits');
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_APP_BACKEND}/api/v1/auth/register`, formData);
      if (res.status === 201) {
        toast.success('Registered successfully');
        // setTimeout(() => navigate('/login'), 1000);
      } else if (res.status === 200) {
        toast.error('Already registered, please login');
      } else {
        toast.error('Registration failed');
      }
    } catch (error) {
      toast.error('Error during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Add Supervisor">
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <AdminMenu />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Add Supervisor</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                 <div>
                    <label className="block text-gray-700 mb-2">Work</label>
                    <select
                      name="work"
                      value={formData.work}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="" disabled>
                        Select work
                      </option>
                      <option value="mcc">MCC</option>
                      <option value="acca">ACCA</option>
                      <option value="bio">BIO</option>
                      <option value="pftr">PFTR</option>
                      <option value="pit & yard">PIT & YARD</option>
                      <option value="laundry">lAUNDRY</option>
                      
                    </select>
                  </div>

              <div>
               <label htmlFor="name" className=" text-sm font-medium text-gray-700 "> Supervisor Name </label>
              <input type="text" name="name" placeholder="Supervisor Name" required value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                 </div>

             
<div>
                                <label htmlFor="name" className=" text-sm font-medium text-gray-700 ">Supervisor Email</label>

 <input type="email" name="email" placeholder="Supervisor Email" required value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
</div>
              
<div>
                                <label htmlFor="name" className=" text-sm font-medium text-gray-700 ">Phone Number</label>

<input type="text" name="phone" placeholder="Phone Number" required value={formData.phone} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
</div>
             
<div>
                                <label htmlFor="name" className=" text-sm font-medium text-gray-700 ">Password</label>

 <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
</div>
              
<div>
                                <label htmlFor="name" className=" text-sm font-medium text-gray-700 ">Confirm Password</label>

<input type="password" name="confirmPassword" placeholder="Confirm Password" required value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
</div>

<div>
                                <label htmlFor="name" className=" text-sm font-medium text-gray-700 ">Supervisor Emp ID</label>

   <input type="text" name="empid" placeholder="Supervisor Emp ID" required value={formData.empid} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
</div>
           


<div>
                                <label htmlFor="name" className=" text-sm font-medium text-gray-700 ">Aadhar Number</label>

<input type="text" name="aadhar" placeholder="Aadhar Number" required value={formData.aadhar} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
</div>
              
              
<div>
                                <label htmlFor="name" className=" text-sm font-medium text-gray-700 ">Designation</label>

 <input type="text" name="designation" placeholder="Designation" required value={formData.designation} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
</div>
             

<div>

                              <label htmlFor="name" className=" text-sm font-medium text-gray-700 ">Wage Per Day</label>
<input type="text" name="wage" placeholder="Wage Per Day" required value={formData.wage} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
</div>
              
<div>
                            <label htmlFor="name" className=" text-sm font-medium text-gray-700 ">Bank Name</label>
  <input type="text" name="bank" placeholder="Bank Name" value={formData.bank} readOnly className="w-full p-2 border border-gray-300 bg-gray-100 rounded-md" />
</div>
              
              <div>

                          <label htmlFor="name" className=" text-sm font-medium text-gray-700 ">Branch Name </label>

              <input type="text" name="branch" placeholder="Branch Name" value={formData.branch} readOnly className="w-full p-2 border border-gray-300 bg-gray-100 rounded-md" />
   </div>
              <div className="md:col-span-1">
                <label htmlFor="ifsccode" className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                <input type="text" name="ifsccode" placeholder="Enter IFSC Code"  value={formData.ifsccode} onChange={ifsccodechange} className={`w-full p-2 border ${ifscError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500`} />
                {loadingIfsc && <p className="text-sm text-blue-600 mt-1">Checking IFSC...</p>}
                {ifscError && <p className="text-sm text-red-600 mt-1">{ifscError}</p>}
              </div>

            
              <div>
               <label htmlFor="name" className=" text-sm font-medium text-gray-700 "> Account Number </label>

  <input type="text" name="acnumber" placeholder="Account Number"  value={formData.acnumber} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>

               <label htmlFor="name" className=" text-sm font-medium text-gray-700 "> UAN Number </label>

              <input type="text" name="uanno" placeholder="UAN Number"  value={formData.uanno} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                            </div>

              <div>
               <label htmlFor="name" className=" text-sm font-medium text-gray-700 "> ESI Number </label>

  <input type="text" name="esino" placeholder="ESI Number"  value={formData.esino} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
              </div>
            
              
{/* 
              <div className="w-full">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" id="status" required value={formData.status} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                  <option value="" disabled>Select status</option>
                  <option value="Active">Active</option>
                  <option value="Resigned">Resigned</option>
                  <option value="Onleave">Onleave</option>
                </select>
              </div> */}

              <div className="md:col-span-2 text-center">
                <button type="submit" disabled={isSubmitting} className={`px-4 py-2 text-white rounded-md ${isSubmitting ? 'bg-gray-400' : 'bg-yellow-900 hover:bg-gray-900'}`}>
                  {isSubmitting ? 'Submitting...' : 'Add Supervisor'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Addsupervisor;
