import axios from "axios";
import { useState, useEffect} from "react";
import { useDispatch } from "react-redux";
import { Link,useNavigate,useLocation} from "react-router-dom";
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
import { axiosOwnerInstance } from "../../Utils/Axios/axiosInstance";



export default function  Sidebar () {
    
    const dispatch = useDispatch()
    const navigate  = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    

    const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    };
    const isActive = (path) => location.pathname === path ? 'bg-white text-teal-600 hover:bg-white' : 'text-white';


    const handleOwnerLogout = async () =>{
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
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
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
              <CommonNotification/>
              <div className="flex items-center ms-3">
                <div>
                  <button
                    type="button"
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-expanded="false"
                    data-dropdown-toggle="dropdown-user"
                  >
                    <span className="sr-only">Open user menu</span>
                  </button>
                </div>
                <div
                  className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                  id="dropdown-user"
                >
                  <div className="px-4 py-3" role="none">
                    <p className="text-sm text-gray-900 dark:text-white" role="none">
                      Neil Sims
                    </p>
                    <p
                      className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                      role="none"
                    >
                      neil.sims@flowbite.com
                    </p>
                  </div>
                  <ul className="py-1" role="none">
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      >
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      >
                        Settings
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      >
                        Earnings
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      >
                        Sign out
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-teal-700 border-r border-teal-700 sm:translate-x-0 dark:teal-700 dark:border-teal-700`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-teal-700">
          <ul className="space-y-2 font-medium">
            <li>
              <Link to='/owner/dashboard'
                className={`flex items-center p-2 rounded-lg  hover:bg-teal-500  group ${isActive('/owner/dashboard')}`}
              >
                <span className="ms-3"> <DashboardIcon/> Dashboard</span>
              </Link>
            </li>
             <li>
              <Link to='/owner/booking-management'
                className={`flex items-center p-2 rounded-lg hover:bg-teal-500 group ${isActive('/owner/booking-management')}`}
              >
                <span className="flex-1 ms-3 whitespace-nowrap"><WysiwygIcon/> View Bookings</span>
              </Link>
            </li> 
           
            <li>
              <Link to='/owner/events-management'
                className={`flex items-center p-2 rounded-lg hover:bg-teal-500 group ${isActive('/owner/events-management')} `}
              >
                <span className="flex-1 ms-3 whitespace-nowrap"><CelebrationIcon/> Events</span>
              </Link>
            </li>
            <li>
              <Link to='/owner/facilities-management'
                className={`flex items-center p-2 rounded-lg hover:bg-teal-500  group ${isActive('/owner/facilities-management')}`}
              >
                <span className="flex-1 ms-3 whitespace-nowrap"><TableViewIcon/> Facilities </span>
              </Link>
            </li>
            <li>
              <Link to='/owner/booking-packages'
                className={`flex items-center p-2 rounded-lg  hover:bg-teal-500 group ${isActive('/owner/booking-packages')}`}
              >
                <span className="flex-1 ms-3 whitespace-nowrap"><TableViewIcon/> Packages </span>
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
                <span className="flex-1 ms-3 whitespace-nowrap"><AccountBoxIcon/> Profile</span>
              </Link>
            </li>
            <li>
              <Link to='/owner/banner-management'
                className={`flex items-center p-2 rounded-lg  hover:bg-teal-500  group ${isActive('/owner/banner-management')}`}

              >
                <span className="flex-1 ms-3 whitespace-nowrap"><CollectionsIcon/> Photos</span>
              </Link>
            </li>
            <li>
              <Link to='/owner/chat'
                  className={`flex items-center p-2 rounded-lg  hover:bg-teal-500 group ${isActive('/owner/chat')}`}

              >
                <span className="flex-1 ms-3 whitespace-nowrap"><ChatIcon/> Inbox</span>
              </Link>
            </li>
            <li>
              <Link
                onClick={handleOwnerLogout}
                className="flex items-center p-2 text-white rounded-lg  hover:bg-teal-500  group"
              >
                <span className="flex-1 ms-3 whitespace-nowrap"><LogoutIcon/> Log Out</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
        </>
    )
}