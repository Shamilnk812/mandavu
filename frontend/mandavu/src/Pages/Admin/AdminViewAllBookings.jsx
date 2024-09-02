import { useEffect, useState } from "react";
import Sidebar from "../../Components/Admin/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SearchIcon from '@mui/icons-material/Search';

export default function AdminViewAllBookings() {
    const [bookings, setBookings] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchAllBookings = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/admin_dash/auth/get-all-bookings?page=${currentPage}&start_date=${startDate}&end_date=${endDate}`);
            setBookings(response.data.results);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.log('error is :', error);
            toast.error('Failed to fetch Bookings details. Please try again later');
        }
    };

    useEffect(() => {
        fetchAllBookings();
    }, [currentPage]);

    const handleSearch = (e) => {
        e.preventDefault();

        const today = new Date().toISOString().split('T')[0];
        if (!startDate) {
            toast.warning('Starting date is required.');
            return;
        }
        if (!endDate) {
            toast.warning('Ending date is required.');
            return;
        }
        if (startDate && startDate > today) {
            toast.error('Please enter a valid starting date.');
            return;
        }
        if (endDate && endDate < startDate) {
            toast.error('Please enter a valid ending date.');
            return;
        }
        fetchAllBookings();
    };

    const statusTextColor = (status) => {
        switch (status) {
            case 'Booking Completed':
                return 'text-green-500'; // Green text color
            case 'Booking Confirmed':
                return 'text-orange-500'; // Orange text color
            case 'Booking Canceled':
                return 'text-red-500'; // Red text color
            default:
                return 'text-gray-500'; // Default text color
        }
    }

    return (
        <>
            <Sidebar />
            <div className="p-4 sm:ml-64">
                <div className="p-4 border-2 border-gray-200 border-solid rounded-lg dark:border-gray-700 mt-14">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">All Bookings</h2>
                        <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex flex-col">
                        <label htmlFor="startDate" className="mb-1 text-gray-800">Starting Date</label>
                        <input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-4 py-2 border rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="endDate" className="mb-1 text-gray-800">Ending Date</label>
                        <input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-4 py-2 border rounded"
                        />
                    </div>
                         <div className="mt-6">
                            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded transition-colors duration-300 hover:bg-purple-500"><SearchIcon/></button>
                        </div>
                        </form>
                    </div>

                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        {bookings.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">No records found.</div>
                        ) : (
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">User</th>
                                        <th scope="col" className="px-6 py-3">Venue</th>
                                        <th scope="col" className="px-6 py-3">Date</th>
                                        <th scope="col" className="px-6 py-3">Time</th>
                                        <th scope="col" className="px-6 py-3">Price</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking_data) => (
                                        <tr key={booking_data.id} className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 `}>
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {booking_data.name}
                                            </th>
                                            <td className="px-6 py-4">{booking_data.venue_name}</td>
                                            <td className="px-6 py-4">{booking_data.date}</td>
                                            <td className="px-6 py-4">{booking_data.time}</td>
                                            <td className="px-6 py-4">{booking_data.total_price}</td>
                                            <td className={`px-6 py-4 ${statusTextColor(booking_data.status)}`}>
                                                {booking_data.status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {bookings.length > 0 && (
                            <div className="flex justify-center mt-10 mb-5">
                                <div className="p-4 flex items-center">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`p-2 rounded-full text-white transition-colors duration-300 
                                        ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'}`}
                                    >
                                        <NavigateBeforeIcon />
                                    </button>
                                    <span className="mx-4">Page {currentPage} of {totalPages}</span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className={`p-2 rounded-full text-white transition-colors duration-300 
                                        ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'}`}
                                    >
                                        <NavigateNextIcon />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
