import React,{useEffect,useState} from 'react'
import Main from './Home/Main'
import Header from './layout/Header'
import  Abut  from './Home/Abut'
import Progress from './Home/progress'
import Services from './Home/Services'
import WhyWe from './Home/Whywe'
import Testimonials from './Home/Testimonials'
import Fq from './Home/Fq'
import Contact from './Home/contact'
import Footer from './Home/Footer'
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from '../context/Auth'
const Site = () => {
  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();
  useEffect(() => {
    if (auth?.user) {
       const dashboardPath = 
        auth.user.role === 1 
            ? "/dashboard/admin" 
            : auth.user.role === 2 
                ? "/dashboard/manager" 
                : "/dashboard/user";
            navigate(dashboardPath);
    }
  }, [auth, navigate]);

  return (
    <div>
        <Header/>
        <Main/>
        <Abut/>
        <Services/>
        <Progress/>
        <WhyWe/>
        <Testimonials/>
        <Fq/>
        <Contact/>
        <Footer/>
        
    </div>
  )
}

export default Site