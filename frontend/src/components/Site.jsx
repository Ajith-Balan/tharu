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
      const { role } = auth.user;

      if (role === 1) {
        navigate("/dashboard/manager");
      } else if (role === 0) {
        navigate("/dashboard/user");
      } else {
        // Invalid or missing role — logout
        setAuth({ user: null, token: '' });
        localStorage.removeItem("auth");
        navigate("/login");
      }
    }
  }, [auth, navigate, setAuth]);


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
        {/* <Contact/> */}
        {/* <Footer/> */}
        
    </div>
  )
}

export default Site