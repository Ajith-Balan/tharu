import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import AdminMenu from '../../components/layout/AdminMenu';

const Editstaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loadingIfsc, setLoadingIfsc] = useState(false);
  const [ifscError, setIfscError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    aadhar: '',
    empid: '',
    category: '',
    wage: '',
    bank: '',
    branch: '',
    ifsccode: '',
    acnumber: '',
    uanno: '',
    esino: '',
    status: '',
    designation: '',
  });

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND}/api/v1/worker/getoneworker/${id}`);
        setFormData(res.data[0]);
        
        
      } catch (err) {
        toast.error('Failed to fetch worker details');
      } finally {
        setLoadingData(false);
      }
    };
    fetchWorker();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const ifsccodechange = async (e) => {
    const { name, value } = e.target;
    const upperIFSC = value.toUpperCase();
    setFormData((prev) => ({ ...prev, [name]: upperIFSC }));

    if (upperIFSC.length === 11) {
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
        setIfscError('⚠️ Invalid IFSC Code');
      } finally {
        setLoadingIfsc(false);
      }
    }
  };

  const validateForm = () => {
    const { name, phone, empid, aadhar } = formData;
    if (!name || !phone || !empid || !aadhar) {
      toast.error('Please fill all required fields');
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast.error('Phone number must be 10 digits');
      return false;
    }
    if (!/^\d{12}$/.test(aadhar)) {
      toast.error('Aadhar must be 12 digits');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await axios.put(`${import.meta.env.VITE_APP_BACKEND}/api/v1/worker/update-worker/${id}`, formData);
      toast.success('Worker updated successfully');
      navigate('/dashboard/manager/staffdetails');
    } catch (err) {
      toast.error('Failed to update worker');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) return <div className="text-center p-10">Loading...</div>;

  return (
    <Layout>
      <div className="flex bg-gray-100">
        <AdminMenu />
        <div className="flex-1 flex justify-center items-center p-6">
          <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Update Worker</h2>

           <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Staff Name</label>
    <input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Staff Name" />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Phone" />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Emp ID</label>
    <input type="text" name="empid" value={formData.empid} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Emp ID" />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
    <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Designation" />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar</label>
    <input type="text" name="aadhar" value={formData.aadhar} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Aadhar" />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Wage</label>
    <input type="text" name="wage" value={formData.wage} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Wage" />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
    <input type="text" name="ifsccode" value={formData.ifsccode} onChange={ifsccodechange} className={`border p-2 w-full rounded ${ifscError && 'border-red-500'}`} placeholder="IFSC" />
    {loadingIfsc && <p className="text-sm text-blue-600">Checking IFSC...</p>}
    {ifscError && <p className="text-sm text-red-600">{ifscError}</p>}
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
    <input type="text" name="bank" value={formData.bank} readOnly className="bg-gray-100 border p-2 w-full rounded" placeholder="Bank" />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
    <input type="text" name="branch" value={formData.branch} readOnly className="bg-gray-100 border p-2 w-full rounded" placeholder="Branch" />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
    <input type="text" name="acnumber" value={formData.acnumber} onChange={handleChange} className="border p-2 w-full rounded" placeholder="A/C Number" />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">UAN Number</label>
    <input type="text" name="uanno" value={formData.uanno} onChange={handleChange} className="border p-2 w-full rounded" placeholder="UAN No" />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">ESI Number</label>
    <input type="text" name="esino" value={formData.esino} onChange={handleChange} className="border p-2 w-full rounded" placeholder="ESI No" />
  </div>



   <label className="block text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="" disabled>
                        Select Staff status
                      </option>
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Resigned">Resigned</option>
                    </select>

  <div className="md:col-span-2 text-center">
    <button
      type="submit"
      className={`px-4 py-2 text-white rounded-md ${isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-800"}`}
      disabled={isSubmitting}
    >
      {isSubmitting ? "Updating..." : "Update Worker"}
    </button>
  </div>
</form>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Editstaff;
