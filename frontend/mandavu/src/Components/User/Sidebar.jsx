
import { useState } from "react";
import { Link,useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import ViewSidebarRoundedIcon from '@mui/icons-material/ViewSidebarRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import { useSelector } from "react-redux";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isToggelMenu = useSelector((state) => state.user.toggleMenuOpen)



  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const isActive = (path) => location.pathname === path ? 'bg-teal-500' : '';

  return (
    <>
      {/* Toggle Button (Visible on small screens) */}


      {!isSidebarOpen && !isToggelMenu && (
        <button
          onClick={toggleSidebar}
          className="fixed top-24 left-4 z-50 text-white bg-teal-600 p-2 rounded lg:hidden"
        >
          {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-teal-700 text-white transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="p-4 space-y-6">
          <nav className="mt-24">
            <Link
              to="/user/show-booking-details"
              className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-teal-500 ${isActive('/user/show-booking-details')}`}

            >
              <GridViewRoundedIcon />  Bookings
            </Link>
            <Link
              to="/user/profile2"
              className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-teal-500 ${isActive('/user/profile2')}`}
            >
              <AccountCircleRoundedIcon /> Profile
            </Link>

            <Link
              to="/user/chat"
              className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-teal-500 ${isActive('/user/chat')}`}

            >
              <ChatRoundedIcon /> Messages
            </Link>

          </nav>
        </div>
      </div>

      {/* Overlay (Visible when sidebar is open on small screens) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}


