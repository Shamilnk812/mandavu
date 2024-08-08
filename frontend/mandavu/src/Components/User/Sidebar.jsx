
import { Link } from "react-router-dom"

export default function Sidebar() {
    return(
        <>
         <div class=" bg-teal-700 text-white w-64 p-4 space-y-6 fixed h-full">
            {/* <h1 class="text-2xl font-bold">User Profile</h1> */}
            <div className="mt-12">
            <nav>
                <a href="#" class="block text-white  py-2.5 px-4 rounded transition duration-200 text-white hover:bg-teal-500">Dashboard</a>
                <Link to='/user/show-booking-details' href="#" class="block text-white py-2.5 px-4 rounded transition duration-200 text-white hover:bg-teal-500">Bookings</Link>
                <a href="#" class="block text-white py-2.5 px-4 rounded transition duration-200 text-white hover:bg-teal-500">Messages</a>
                <a href="#" class="block text-white py-2.5 px-4 rounded transition duration-200 text-white hover:bg-teal-500">Logout</a>
            </nav>
            </div>
        </div>
        </>
    )
}