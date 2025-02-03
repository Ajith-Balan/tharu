import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [states, setStates] = useState([]);
  const [sites, setSites] = useState([]);
  const [worktypes, setWorktypes] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingSites, setLoadingSites] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    state: '',
    site: '',
    type: '',
  });

  const navigate = useNavigate();

  const getAllStates = async () => {
    setLoadingStates(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/states/get-states`
      );
      if (data?.success) {
        setStates(data.state);
      } else {
        toast.error('Failed to fetch states');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching states');
    } finally {
      setLoadingStates(false);
    }
  };

  const getSitesByState = async () => {
    if (!formData.state) return;
    setLoadingSites(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/site/site-states/${formData.state}`
      );
      if (data?.success) {
        setSites(data.sites);
      } else {
        toast.error('Failed to fetch sites');
        setSites([]);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching sites');
    } finally {
      setLoadingSites(false);
    }
  };

  const getWorkType = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/types/getdistrictwise-worktype/${formData.site}`
      );
      if (data?.success) {
        setWorktypes(data.worktype);
      } else {
        toast.error('Failed to fetch work types');
        setWorktypes([]);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching work types');
    }
  };

  useEffect(() => {
    getAllStates();
  }, []);

  useEffect(() => {
    getSitesByState();
  }, [formData.state]);

  useEffect(() => {
    if (formData.site) {
      getWorkType();
    }
  }, [formData.site]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { password, confirmPassword, state, site, type } = formData;
    // if (!state || !site || !type) {
    //   toast.error('Please fill all fields');
    //   return false;
    // }
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
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/auth/register`,
        formData
      );
      if (res.status === 201) {
        toast.success('Registered successfully');
        setTimeout(() => navigate('/login'), 1000);
      } else if (res.status === 200) {
        toast.error('Already registered, please login');
      } else {
        toast.error('Registration failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Register ">
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-8">Register</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border ${
                formData.email && !/\S+@\S+\.\S+/.test(formData.email)
                  ? 'border-red-500'
                  : 'border-gray-300'
              } rounded-md focus:ring-2 focus:ring-blue-500`}
            />
            {formData.email && !/\S+@\S+\.\S+/.test(formData.email) && (
              <p className="text-red-500 text-sm">Please enter a valid email.</p>
            )}
            <input
              type="number"
              name="phone"
              placeholder="Enter your phone number"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a State</option>
              <option value="kerala">kerala</option>
              {loadingStates ? (
                <option>Loading...</option>
              ) : (
                states.map((state) => (
                  <option key={state._id} value={state._id}>
                    {state.name}
                  </option>
                ))
              )}
            </select>
            <select
              name="site"
              value={formData.site}
              onChange={handleChange}
              disabled={!formData.state}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Site</option>
              <option value="pp">pp</option>
              {loadingSites ? (
                <option>Loading...</option>
              ) : (
                sites.map((site) => (
                  <option key={site._id} value={site._id}>
                    {site.name}
                  </option>
                ))
              )}
            </select>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={!formData.site}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Work Type</option>
              <option value="a">a</option>
              {worktypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={isSubmitting || loadingStates || loadingSites}
              className={`w-full py-2 font-semibold rounded-md text-white ${
                isSubmitting || loadingStates || loadingSites
                  ? 'bg-gray-400'
                  : 'bg-red-600 hover:bg-red-500'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Register'}
            </button>
            <p>
              Already a user?{' '}
              <Link to="/login" className="text-blue-600 underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
