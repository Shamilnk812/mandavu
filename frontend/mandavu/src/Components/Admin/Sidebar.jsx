import {Link, useNavigate ,useLocation} from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminLogoutSlice } from "../../Redux/Slices/AdminSlice";
import { useDispatch } from "react-redux";
import CommonNotification from "../Common/Notifications2";
import { axiosAdminInstance } from "../../Utils/Axios/axiosInstance";
import DashboardIcon from '@mui/icons-material/Dashboard';
import StoreIcon from '@mui/icons-material/Store';
import FestivalIcon from '@mui/icons-material/Festival';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import InboxIcon from '@mui/icons-material/Inbox';


export default function Sidebar() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? 'bg-gray-600' : '';


    const handleAdminLogout = async () => {
      const refresh_token = localStorage.getItem('refresh_token');
      try {
          const response = await axiosAdminInstance.post('logout/', 
              { "refresh_token": refresh_token },
              
          );
          if (response.status === 200) {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              dispatch(AdminLogoutSlice())
              navigate("/admin");
              toast.success("Logout successfully");
          }
      } catch (error) {
          console.error("Logout failed:", error);
          toast.error("Logout failed. Please try again.");
      }
  };
  
  
    return (
      <>

      
  {/* <nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
  <div class="px-3 py-3 lg:px-5 lg:pl-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center justify-start rtl:justify-end">
        <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
            <span class="sr-only">Open sidebar</span>
            <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
               <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
            </svg>
         </button>
        <a class="flex ms-2 md:me-24">
          <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Admin</span>
        </a>
          <CommonNotification/>
      </div>
      <div class="flex items-center">
          <div class="flex items-center ms-3">
            <div>
              <button type="button" class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                <span class="sr-only">Open user menu</span>
              </button>
            </div>
            <div class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600" id="dropdown-user">
              <div class="px-4 py-3" role="none">
                <p class="text-sm text-gray-900 dark:text-white" role="none">
                  Neil Sims
                </p>
                <p class="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                  neil.sims@flowbite.com
                </p>
              </div>
              <ul class="py-1" role="none">
                <li>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Dashboard</a>
                </li>
                <li>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Settings</a>
                </li>
                <li>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Earnings</a>
                </li>
                <li>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Sign out</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
    </div>
  </div>
</nav> */}


<nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
  <div class="px-3 py-3 lg:px-5 lg:pl-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center justify-start rtl:justify-end">
        <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
          <span class="sr-only">Open sidebar</span>
          <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
          </svg>
        </button>
        <a class="flex ms-2 md:me-24">
          <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Admin</span>
        </a>
      </div>
      <div class="flex items-center">
      
        <div class="flex items-center ms-3 mr-4">
          <CommonNotification />
        </div>
        <div class="flex items-center ms-3">
          <div>
            <button type="button" class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" aria-expanded="false" data-dropdown-toggle="dropdown-user">
              <span class="sr-only">Open user menu</span>
            </button>
          </div>
          <div class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600" id="dropdown-user">
            <div class="px-4 py-3" role="none">
              <p class="text-sm text-gray-900 dark:text-white" role="none">
                Neil Sims
              </p>
              <p class="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                neil.sims@flowbite.com
              </p>
            </div>
            <ul class="py-1" role="none">
              <li>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Dashboard</a>
              </li>
              <li>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Settings</a>
              </li>
              <li>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Earnings</a>
              </li>
              <li>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Sign out</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>


<aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
   <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
      <ul className="space-y-2 font-medium">
         <li>
            <Link to='/admin/dashboard' className={`flex items-center p-2  rounded-lg text-white hover:bg-gray-700  group ${isActive('/admin/dashboard')}`}>
               <span className="ms-3"><DashboardIcon /> Dashboard</span>
            </Link>
         </li>
         <li>
            <Link to='/admin/ownerslist' className={`flex items-center p-2  rounded-lg text-white hover:bg-gray-700  group ${isActive('/admin/ownerslist')}`}>
               
               <span className="flex-1 ms-3 whitespace-nowrap"><StoreIcon/> Owner Management</span>
            </Link>
            </li>
         <li>
            <Link to='/admin/venuelist' className={`flex items-center p-2  rounded-lg text-white hover:bg-gray-700  group ${isActive('/admin/venuelist')}`}>
               
               <span className="flex-1 ms-3 whitespace-nowrap"><FestivalIcon /> Venue Management</span>
            </Link>
            </li>
            <li>
               <Link to='/admin/userslist' className={`flex items-center p-2  rounded-lg text-white hover:bg-gray-700  group ${isActive('/admin/userslist')}`}>
                  
                  <span className="flex-1 ms-3 whitespace-nowrap"><PeopleAltIcon /> User Management</span>
               </Link>
            </li>
            <li>
               <Link to='/admin/user-inquiry' className={`flex items-center p-2  rounded-lg text-white hover:bg-gray-700  group ${isActive('/admin/user-inquiry')}`}>
                  
                  <span className="flex-1 ms-3 whitespace-nowrap"><InboxIcon/> Inbox</span>
               </Link>
            </li>
         
         
         <li>
            <a onClick={handleAdminLogout} className="flex items-center p-2  rounded-lg text-white hover:bg-gray-700  group">
               <span className="flex-1 ms-3 whitespace-nowrap"><LogoutIcon/> Log Out</span>
            </a>
         </li>


      </ul>
      
   </div>
</aside>

      </>
    );
  }
  