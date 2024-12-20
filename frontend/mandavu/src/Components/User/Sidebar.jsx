
// import { Link } from "react-router-dom"

// export default function Sidebar() {
//     return(
//         <>
//          <div class=" bg-teal-700 text-white w-64 p-4 space-y-6 fixed h-full">
            
//             <div className="mt-12">
//             <nav>
//                 <a href="#" class="block text-white  py-2.5 px-4 rounded transition duration-200 text-white hover:bg-teal-500">Dashboard</a>
//                 <Link to='/user/profile2'  class="block text-white py-2.5 px-4 rounded transition duration-200 text-white hover:bg-teal-500">Profile</Link>
//                 <Link to='/user/show-booking-details'  class="block text-white py-2.5 px-4 rounded transition duration-200 text-white hover:bg-teal-500">Bookings</Link>
//                 <Link to='/user/chat' class="block text-white py-2.5 px-4 rounded transition duration-200 text-white hover:bg-teal-500">Messages</Link>
//                 <a href="#" class="block text-white py-2.5 px-4 rounded transition duration-200 text-white hover:bg-teal-500">Logout</a>
//             </nav>
//             </div>
//         </div>
//         </>
//     )
// }




import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Toggle Button (Visible on small screens) */}
      <button
        onClick={toggleSidebar}
        className="fixed top-24 left-4 z-50 text-white bg-teal-600 p-2 rounded lg:hidden"
      >
        {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-teal-700 text-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="p-4 space-y-6">
          <nav className="mt-12">
            <a
              href="#"
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-teal-500"
            >
              Dashboard
            </a>
            <Link
              to="/user/profile2"
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-teal-500"
            >
              Profile
            </Link>
            <Link
              to="/user/show-booking-details"
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-teal-500"
            >
              Bookings
            </Link>
            <Link
              to="/user/chat"
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-teal-500"
            >
              Messages
            </Link>
            <a
              href="#"
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-teal-500"
            >
              Logout
            </a>
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
