import React, { useEffect,useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from "axios";
import { axiosUserInstance } from '../../Utils/Axios/axiosInstance';
import {toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { UserLogout,openToggleMenu,closeToggleMenu } from "../../Redux/Slices/User";
import CommonNotification from '../Common/Notifications2';





export default  function Navb() {

  const dispatch = useDispatch()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
   
  };

  useEffect(()=> {
    if (isMenuOpen){
      dispatch(openToggleMenu())
    }else{
      dispatch(closeToggleMenu())
    }
  },[isMenuOpen])

  

  const navigate  = useNavigate()

  const user = JSON.parse(localStorage.getItem('user'))
  const jwt_access = localStorage.getItem('access_token')

  useEffect(()=> {
      if (jwt_access=== null && !user) {
          navigate("/user/login")
      }
  },[])
  
  const access_token = localStorage.getItem('access_token');
  const refresh_token = localStorage.getItem('refresh_token');


  const handleLogout = async () => {
      const refresh_token = localStorage.getItem('refresh_token');
      try {
          const response = await axiosUserInstance.post('logout/', 
              { "refresh_token": refresh_token },
             
          );
          if (response.status === 200) {
              
              dispatch(UserLogout())
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('role');
              localStorage.removeItem('user_email');
              localStorage.removeItem('user_id');
              navigate("/user/login");
              toast.success("Logout successfully");
          }
      } catch (error) {
          console.error("Logout failed:", error);
          toast.error("Logout failed. Please try again.");
      }
  };


    return(
        <>
            
    <nav className="fixed fixed top-0 left-0 w-full border-b  bg-gray-100 shadow-sm z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/user/home" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/user/mandavu-logo.png" className="h-8" alt="Mandavu logo" />
        </a>
        <button 
          onClick={toggleMenu}
          type="button" 
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-gray-200 " 
          aria-controls="navbar-solid-bg" 
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>
        <div className={`${isMenuOpen ? '' : 'hidden'} w-full md:block md:w-auto`} id="navbar-solid-bg">
          <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-teal-700  text-center md:dark:bg-transparent dark:border-gray-700">
            <li>
              <Link to='/user/home'  
              // className="block py-2 px-3 md:p-0 text-teal-600 hover:text-white hover:bg-orange-600 rounded  md:hover:bg-transparent md:hover:text-orange-600 "
              className="relative block py-1 px-2 text-teal-600 hover:text-teal-900 transition-colors duration-300
              after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px]
              after:bg-teal-600 hover:after:w-full after:transition-all after:duration-300"
              >Home</Link>
            </li>
            <li>
              <Link to='/user/show-booking-details' 
              // className="block py-2 px-3 md:p-0 text-teal-600 hover:text-white hover:bg-orange-600 rounded  md:hover:bg-transparent md:hover:text-orange-600 "
              className="relative block py-1 px-3 text-teal-600 hover:text-teal-900 transition-colors duration-300
              after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px]
              after:bg-teal-600 hover:after:w-full after:transition-all after:duration-300"
              >Profile</Link>
            </li>
            <li>
              <Link to='/user/contact-us' 
              // className="block py-2 px-3 md:p-0 text-teal-600 hover:text-white hover:bg-orange-600 rounded  md:hover:bg-transparent md:hover:text-teal-700 "
              className="relative block py-1 px-2 text-teal-600 hover:text-teal-900 transition-colors duration-300
              after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px]
              after:bg-teal-600 hover:after:w-full after:transition-all after:duration-300"
              >Contact Us</Link>
            </li>
            <li>
              <a onClick={handleLogout} 
              // className="block py-2 px-3 md:p-0 text-teal-600 hover:text-white hover:bg-orange-600 rounded  md:hover:bg-transparent md:hover:text-orange-600 cursor-pointer"
              className="relative block py-1 px-2 text-teal-600 hover:text-teal-900 transition-colors duration-300
              after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px]
              after:bg-teal-600 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
              >Logout</a>
            </li>
            <li 
            // className="block text-center py-2 px-3 md:p-0 text-orange-600 hover:text-white hover:bg-orange-600 rounded  md:hover:bg-transparent md:hover:text-orange-600 "
            className="relative block py-1 px-2 text-teal-600 hover:text-teal-900 transition-colors duration-300
              after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px]
              after:bg-teal-600 hover:after:w-full after:transition-all after:duration-300"
            >
              <div className='flex justify-end'>
              <CommonNotification />
              </div>

            </li>
          </ul>
        </div>

      </div>
    </nav>

    <div className="pt-16" > 

    </div>


        </>
    )
}





