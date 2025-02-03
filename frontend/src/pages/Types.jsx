import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const Types = () => {
    const { id } = useParams();
    const [types, setTypes] = useState([]);
    const [site, setSite] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch data by state ID
    const getProductBystate = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND}/api/v1/types/getdistrictwise-worktype/${id}`
            );
            setTypes(data?.worktype || []); // Assuming "state" contains types
            setSite(data?.sites || {}); // Assuming "sites" contains site details
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load types. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) getProductBystate();
    }, [id]);

    return (
        <Layout>
            <div className="container mx-auto px-4 mt-5 py-8">
                {/* Site Information */}
                {loading ? (
                    <div className="text-center">
                        <p className="text-lg font-semibold">Loading site details...</p>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-600">
                        <p className="text-lg font-semibold">{error}</p>
                    </div>
                ) : (
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-semibold">{site.name}</h2>
                    </div>
                )}

                {/* Types Grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {types.length > 0 ? (
                            types.map((type) => (
                                <div key={type._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                                    <Link to={`/dashboard/admin/${type.name}/${type._id}`}>
                                        <div className="p-4">
                                            <h5 className="text-lg font-semibold mb-2">{type.name}</h5>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-500">
                                <p>No types found for this site.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Types;
