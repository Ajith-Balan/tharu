import React, { useState, useEffect } from 'react';
import Layout from "../../components/layout/Layout"
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { CiEdit } from "react-icons/ci";
import AdminMenu from '../../components/layout/AdminMenu';

const StateSite = () => {
    const { id } = useParams();
    const [site, setSites] = useState([]);
    const [states, setStates] = useState({});

    const getSiteByState = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND}/api/v1/site/site-states/${id}`);
            setSites(res.data.sites);
            setStates(res.data.states);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (id) getSiteByState();
    }, [id]);

    return (
        <Layout>
           <div className="container mx-auto px-4 mt-5 py-8">
           <AdminMenu/>

    <h1 className="text-3xl font-bold mb-8 text-center">{states.name}</h1>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {site?.map((p) => (
              <div key={p._id} className="text-center">
                <Link to={`/types/${p._id}`}>
                
                  <div className="flex justify-between items-center text-lg bg-white hover:bg-gray-100  shadow-lg rounded-lg overflow-hidden p-2 font-semibold mb-1">
                    
  <h5 >{p.name}</h5>

<Link  to={`/dashboard/admin/update-site/${p._id}`}>
<CiEdit/>

                </Link>
</div>
</Link>



              </div>

              
              
            ))}
          </div>
</div>

        </Layout>
    );
};

export default StateSite;
