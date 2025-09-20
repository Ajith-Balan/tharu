import React,{useState,useEffect} from 'react'
import Layout from '../../components/layout/Layout'
import { useAuth } from '../../context/Auth';
import axios from 'axios';
import { FaEdit } from "react-icons/fa";
import AdminMenu from '../../components/layout/AdminMenu';
import { Link } from 'react-router-dom';
const StaffDetails = () => {
      const [auth] = useAuth();
  const [allWorkers, setAllWorkers] = useState([]);


     const fetchWorkers = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_APP_BACKEND}/api/v1/worker/get-workers`
          );
          setAllWorkers(res.data || []);
        } catch (err) {
          console.error('Error fetching workers:', err);
        }
      };

        useEffect(() => {
          if (auth?.user) {
            fetchWorkers();
          }
        }, [auth?.user]);
  return (
    <Layout title="Staff Details - Admin">
      <div className="flex  bg-gray-100">
        {/* Sidebar */}
        <AdminMenu />

        {/* Main Content */}
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">All Staff Members</h1>

          <div className="grid mt-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allWorkers.map((s) => (
              <div
                key={s._id}
                className="bg-white rounded-xl shadow-md p-4 border border-gray-200 relative"
              >
                {/* Edit Icon */}
                <Link
               to={`/dashboard/manager/editstaff/${s._id}`}
                  className="absolute top-3 right-3 text-blue-600 hover:text-blue-800"
                 
                >
                  <FaEdit />
                </Link>

                <h2 className="text-lg font-bold text-gray-800 mb-1">{s.name}</h2>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Phone:</span> {s.phone}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Emp ID:</span> {s.empid}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Aadhar:</span> {s.aadhar}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default StaffDetails
