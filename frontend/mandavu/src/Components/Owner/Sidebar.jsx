import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link,useNavigate} from "react-router-dom";
import { OwnerLogout } from "../../Redux/Slices/Owner";
import { toast } from "react-toastify";


export default function  Sidebar () {
    
    const dispatch = useDispatch()
    const navigate  = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    };

    const handleOwnerLogout = async () =>{
        const refresh_token = localStorage.getItem('refresh_token');
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v2/auth/logout/', 
                { "refresh_token": refresh_token },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                }
            );
            if (response.status === 200) {

                dispatch(OwnerLogout())
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('owner_id');
                toast.success("Logout successfully");
                navigate("/owner/login");
            }
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed. Please try again.");
        }
    };


    return (
        
         <>
      

<nav className="fixed top-0 z-50 w-full bg-customColor2 border-b border-customColor2 dark:bg-customColor2 dark:border-customColor2">
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
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-customColor2 border-r border-customColor2 sm:translate-x-0 dark:customColor2 dark:border-customColor2`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-customColor2">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-black hover:bg-customColor3 dark:hover:bg-customColor3 group"
              >
                <span className="ms-3">Dashboard</span>
              </a>
            </li>
            <li>
              <Link to='/owner/venue-management'
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-black hover:bg-customColor3 dark:hover:bg-customColor3 group"
              >
                <span className="flex-1 ms-3 whitespace-nowrap">Venue Management</span>
              </Link>
            </li>
            <li>
              <Link to='/owner/details'
                
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-black hover:bg-customColor3 dark:hover:bg-customColor3 group"
              >
                <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
              </Link>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-black hover:bg-customColor3 dark:hover:bg-customColor3 group"
              >
                <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
              </a>
            </li>
            <li>
              <a
                onClick={handleOwnerLogout}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-black hover:bg-customColor3 dark:hover:bg-customColor3 group"
              >
                <span className="flex-1 ms-3 whitespace-nowrap">Log Out</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
        </>
    )
}