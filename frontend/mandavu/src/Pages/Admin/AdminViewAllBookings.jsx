import { useEffect, useState } from "react";
import Sidebar from "../../Components/Admin/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SearchIcon from '@mui/icons-material/Search';
import { axiosAdminInstance } from "../../Utils/Axios/axiosInstance";
import PaginationCmp from "../../Components/Admin/PaginationCmp";




export default function AdminViewAllBookings() {
    const [bookings, setBookings] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchAllBookings = async () => {
        try {
            const response = await axiosAdminInstance.get(`get-all-bookings?page=${currentPage}&start_date=${startDate}&end_date=${endDate}`);
            setBookings(response.data.results);
            setTotalPages(response.data.total_pages);
            console.log(response.data.results)
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
        if (startDate && startDate > endDate) {
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
                                <label htmlFor="startDate" className="mb-1 text-gray-800 text-lg">Starting Date</label>
                                <input
                                    id="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="px-4 py-2 border rounded"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="endDate" className="mb-1 text-gray-800 text-lg">Ending Date</label>
                                <input
                                    id="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="px-4 py-2 border rounded"
                                />
                            </div>
                            <div className="mt-6">
                                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded transition-colors duration-300 hover:bg-purple-500"><SearchIcon /></button>
                            </div>
                        </form>
                    </div>


                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        {bookings.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">No records found.</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                            {bookings.map((booking_data) => (
                                <div
                                    key={booking_data.id}
                                    className="flex flex-col bg-white rounded-lg shadow-md p-6 border h-[400px] transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:border-gray-300"
                                >
                                    {/* Row for each detail */}
                                    <div className="flex justify-between items-center mb-4 border-b">
                                        <span className="font-medium text-gray-500 ">User :</span>
                                        <span className="text-gray-600 ">{booking_data.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-4 border-b">
                                        <span className="font-medium text-gray-500 ">Venue :</span>
                                        <span className="text-gray-600 ">{booking_data.venue_name}</span>
                                    </div>
                                    <div className="flex justify-between items-start mb-4 border-b">
                                        <span className="font-medium text-gray-500 ">Dates :</span>
                                        <div className="text-gray-600 ">
                                            {booking_data.dates && booking_data.dates.length > 0
                                                ? booking_data.dates.map((date, index) => (
                                                      <div key={index}>{date}</div>
                                                  ))
                                                : 'No Dates'}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-start mb-4 border-b">
                                        <span className="font-medium text-gray-500 ">Times :</span>
                                        <div className="text-gray-600 ">
                                            {Array.isArray(booking_data.times) && booking_data.times.length > 0
                                                ? booking_data.times.map((time, index) =>
                                                      Array.isArray(time) ? (
                                                          <div key={index}>{time.join(' - ')}</div>
                                                      ) : (
                                                          <div key={index}>{time}</div>
                                                      )
                                                  )
                                                : 'No Times'}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mb-4 border-b">
                                        <span className="font-medium text-gray-500 ">Advance Amount :</span>
                                        <span className="text-gray-600 ">{booking_data.booking_amount}</span>
                                    </div>
                                    {/* add remainign amount */}
                                    <div className="flex justify-between items-center mb-4 border-b">
                                        <span className="font-medium text-gray-500 ">Remaining Amount :</span>
                                        <span className="text-gray-600 ">{booking_data.total_price}</span>
                                    </div>

                                    <div className="flex justify-between items-center mb-4 border-b">
                                        <span className="font-medium text-gray-500 ">Total Amount :</span>
                                        <span className="text-gray-600 ">{booking_data.total_price}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-500 ">Status :</span>
                                        <span className={` font-semibold ${statusTextColor(booking_data.status)}`}>
                                            {booking_data.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        )}
                        {bookings.length > 0 && (
                            <PaginationCmp setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />

                        )}
                    </div>
                </div>
            </div>
        </>
    );
}











