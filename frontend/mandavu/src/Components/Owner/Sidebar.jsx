import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { OwnerLogout } from "../../Redux/Slices/Owner";
import { toast } from "react-toastify";
import CommonNotification from "../Common/Notifications2";
import DashboardIcon from '@mui/icons-material/Dashboard';
import CelebrationIcon from '@mui/icons-material/Celebration';
import TableViewIcon from '@mui/icons-material/TableView';
import ChatIcon from '@mui/icons-material/Chat';
import CollectionsIcon from '@mui/icons-material/Collections';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import MenuIcon from '@mui/icons-material/Menu';
import { axiosOwnerInstance } from "../../Utils/Axios/axiosInstance";




export default function Sidebar() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const isActive = (path) => location.pathname === path ? 'bg-white text-teal-600 hover:bg-white' : 'text-white';


  const handleOwnerLogout = async () => {
    const refresh_token = localStorage.getItem('refresh_token');
    try {
      const response = await axiosOwnerInstance.post('logout/',
        { "refresh_token": refresh_token }

      );
      if (response.status === 200) {

        dispatch(OwnerLogout())
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('role');
        localStorage.removeItem('owner_id');
        toast.success("Logout successfully");
        navigate("/owner/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };


  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "access_token" && !event.newValue) {
        dispatch(OwnerLogout());
        navigate("/owner/login");
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);



  return (

    <>


      <nav className="fixed top-0 z-50 w-full bg-white border-b shadow-sm ">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                onClick={toggleSidebar}
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-teal-600 bg-gray-200 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <span className="sr-only">Open sidebar</span>
                <MenuIcon />
              </button>
              <a className="flex ms-2 md:me-24">
                <img
                  src="/user/mandavu-logo.png"
                  className="h-8 me-3"
                  alt="Mandavu Logo"
                />
              </a>

            </div>

            <div className="flex items-center">
              <CommonNotification />
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-teal-700 border-r border-teal-700  md:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-teal-700">
          <ul className="space-y-2 font-medium">
            <li>
              <Link to='/owner/dashboard'
                className={`flex items-center p-2 rounded-lg  hover:bg-teal-500  group ${isActive('/owner/dashboard')}`}
              >
                <span className="ms-3"> <DashboardIcon /> Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to='/owner/booking-management'
                className={`flex items-center p-2 rounded-lg hover:bg-teal-500 group ${isActive('/owner/booking-management')}`}
              >
                <span className="flex-1 ms-3 whitespace-nowrap"><WysiwygIcon /> View Bookings</span>
              </Link>
            </li>

            <li>
              <Link to='/owner/events-management'
                className={`flex items-center p-2 rounded-lg hover:bg-teal-500 group ${isActive('/owner/events-management')} `}
              >
                <span className="flex-1 ms-3 whitespace-nowrap"><CelebrationIcon /> Events</span>
              </Link>
            </li>
            <li>
              <Link to='/owner/facilities-management'
                className={`flex items-center p-2 rounded-lg hover:bg-teal-500  group ${isActive('/owner/facilities-management')}`}
              >
                <span className="flex-1 ms-3 whitespace-nowrap"><TableViewIcon /> Facilities </span>
              </Link>
            </li>
            <li>
              <Link to='/owner/booking-packages'
                className={`flex items-center p-2 rounded-lg  hover:bg-teal-500 group ${isActive('/owner/booking-packages')}`}
              >
                <span className="flex-1 ms-3 whitespace-nowrap"><TableViewIcon /> Packages </span>
              </Link>
            </li>
            {/* <li>
              <Link to='/owner/details'
                
                className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-teal-500 dark:hover:bg-teal-500 group"
              >
                <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
              </Link>
            </li> */}
            <li>
              <Link to='/owner/details2'

                className={`flex items-center p-2 rounded-lg  hover:bg-teal-500  group ${isActive('/owner/details2')}`}

              >
                <span className="flex-1 ms-3 whitespace-nowrap"><AccountBoxIcon /> Profile</span>
              </Link>
            </li>
            <li>
              <Link to='/owner/banner-management'
                className={`flex items-center p-2 rounded-lg  hover:bg-teal-500  group ${isActive('/owner/banner-management')}`}

              >
                <span className="flex-1 ms-3 whitespace-nowrap"><CollectionsIcon /> Photos</span>
              </Link>
            </li>
            <li>
              <Link to='/owner/chat'
                className={`flex items-center p-2 rounded-lg  hover:bg-teal-500 group ${isActive('/owner/chat')}`}

              >
                <span className="flex-1 ms-3 whitespace-nowrap"><ChatIcon /> Inbox</span>
              </Link>
            </li>
            <li>
              <Link
                onClick={handleOwnerLogout}
                className="flex items-center p-2 text-white rounded-lg  hover:bg-teal-500  group"
              >
                <span className="flex-1 ms-3 whitespace-nowrap"><LogoutIcon /> Log Out</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  )
}