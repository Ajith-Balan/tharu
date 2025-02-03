import React from 'react';
import Layout from '../components/layout/Layout';
import { FaTshirt, FaRocket, FaHandsHelping } from 'react-icons/fa';

// You can replace this URL with any other image URL from Unsplash or similar sites.
const aboutImage = 'https://st2.depositphotos.com/3591429/10566/i/450/depositphotos_105666254-stock-photo-business-people-at-meeting-and.jpg';

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <Layout title={'About Us '}>
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-semibold mt-6 mb-4 text-center text-red-600">About CJ Attire</h1>
          <img src={aboutImage} alt="About CJ Attire" className="w-full h-48 object-cover rounded-md mb-4" />

          <p className="mb-4">
            Started in 2023, CJ Attire thrived as e-commerce soared, making an online presence not just essential but inevitable. From the outset, the brand embraced and popularized a crowd-favorite trend—the Oversized Tee—pushing it into the mainstream. This trend sparked massive demand, inspiring numerous other brands to follow suit.



          </p>

          <p className="mb-4">
            Join us in this fashion revolution as we defy conventions, embrace individuality, and celebrate the essence of street culture. CJ Attire is more than just a brand; it’s a bold statement. Get ready to unleash your unapologetic style with us.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center p-4 bg-red-600 text-white rounded-md shadow-md">
              <FaTshirt className="h-8 w-8 mr-2" />
              <span>Fashion Innovation</span>
            </div>
            <div className="flex items-center p-4 bg-red-600 text-white rounded-md shadow-md">
              <FaRocket className="h-8 w-8 mr-2" />
              <span>Trendy Styles</span>
            </div>
            <div className="flex items-center p-4 bg-red-600 text-white rounded-md shadow-md">
              <FaHandsHelping className="h-8 w-8 mr-2" />
              <span>Community Focused</span>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default About;
