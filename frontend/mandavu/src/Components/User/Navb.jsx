import React, { useEffect,useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from "axios";
import { axiosUserInstance } from '../../Utils/Axios/axiosInstance';
import {toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { UserLogout } from "../../Redux/Slices/User";
import CommonNotification from '../Common/Notifications2';





export default  function Navb() {

  const dispatch = useDispatch()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
            
    <nav className="fixed fixed top-0 left-0 w-full border-teal-700 bg-teal-700 dark:teal-700 dark:teal-700 z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/user/mandavu-logo.png" className="h-8" alt="Mandavu logo" />
          {/* <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Mandavu</span> */}
        </a>
        <button 
          onClick={toggleMenu}
          type="button" 
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" 
          aria-controls="navbar-solid-bg" 
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>
        <div className={`${isMenuOpen ? '' : 'hidden'} w-full md:block md:w-auto`} id="navbar-solid-bg">
          <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
            <li>
              <Link to='/user/home'  className="block py-2 px-3 md:p-0 text-black rounded hover:bg-orange-600 md:hover:bg-transparent md:border-0 md:hover:text-orange-600 dark:text-black md:dark:hover:text-orange-500 dark:hover:bg-black-700 dark:hover:text-black md:dark:hover:bg-transparent">Home</Link>
            </li>
            <li>
              <Link to='/user/profile2' className="block py-2 px-3 md:p-0 text-black rounded hover:black md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-black md:dark:hover:text-orange-500 dark:hover:bg-gray-700 dark:hover:text-black md:dark:hover:bg-transparent">Profile</Link>
            </li>
            <li>
              <Link className="block py-2 px-3 md:p-0 text-black rounded hover:black md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-black md:dark:hover:text-orange-500 dark:hover:bg-gray-700 dark:hover:text-black md:dark:hover:bg-transparent">Contact Us</Link>
            </li>
            <li>
              <a onClick={handleLogout} className="block py-2 px-3 md:p-0 text-black rounded hover:black md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-black md:dark:hover:text-orange-500 dark:hover:bg-gray-700 dark:hover:text-black md:dark:hover:bg-transparent cursor-pointer">Logout</a>
            </li>
            <li className="block py-2 px-3 md:p-0 text-black rounded hover:black md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-black md:dark:hover:text-orange-500 dark:hover:bg-gray-700 dark:hover:text-black md:dark:hover:bg-transparent cursor-pointer"
            >
              <CommonNotification/>
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