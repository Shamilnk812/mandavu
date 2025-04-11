import { useEffect, useState } from "react";
import Sidebar from "../../Components/Admin/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SearchIcon from '@mui/icons-material/Search';
import { axiosAdminInstance } from "../../Utils/Axios/axiosInstance";
import PaginationCmp from "../../Components/Admin/PaginationCmp";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FestivalIcon from '@mui/icons-material/Festival';
import ReportIcon from '@mui/icons-material/Report';




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


    const handleResetFilters = () => {
        fetchAllBookings();
        setStartDate('');
        setEndDate('');
    };


    const statusBadgeColor = (status) => {
        switch (status) {
            case 'Booking Completed':
                return 'bg-green-100 text-green-800';
            case 'Booking Confirmed':
                return 'bg-yellow-100 text-yellow-800';
            case 'Booking Canceled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    const statusPillColor = (status) => {
        switch (status) {
            case 'Booking Completed':
                return 'bg-green-500';
            case 'Booking Confirmed':
                return 'bg-yellow-500';
            case 'Booking Canceled':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    }

    return (
        <>
            <Sidebar />
            <div className="p-4 md:ml-64">
                <div className="p-4 rounded-lg bg-white shadow-sm border border-gray-200 mt-14">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-700">Booking Management</h2>
                            <p className="text-gray-600">View all bookings</p>
                        </div>

                    
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-start">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="relative">
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">From</label>
                                    <div>
                                        <input
                                            id="startDate"
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="p-2 border border-gray-300 rounded-lg text-sm  outline-none focus:ring-gray-500 focus:border-gray-500 w-full"
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                    <div>
                                        <input
                                            id="endDate"
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="p-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-gray-500 focus:border-gray-500 w-full"
                                        />

                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="h-10 px-3 py-2 bg-purple-600 text-white rounded-lg transition-all duration-300 hover:bg-purple-700 flex items-center justify-center gap-2 mt-6 sm:mt-7"
                            >
                                <span className="hidden sm:inline"><SearchIcon /></span>
                            </button>
                        </form>
                    </div>

                    {/* Content Section */}
                    {bookings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded">
                            <ReportIcon fontSize="large" className="text-gray-600" />
                            <h3 className="text-lg font-medium text-gray-700 mb-2">No bookings found</h3>
                            <p className="text-gray-500 mb-6">Try adjusting your search filters</p>
                            <button
                                onClick={handleResetFilters}
                                className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded font-medium"
                            >
                                Reset filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {bookings.map((booking, index) => (
                                    <div
                                        key={booking.id}
                                        className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
                                    >

                                        <div className={`px-4 py-3 ${statusBadgeColor(booking.status)}`}>
                                            <div className="flex items-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusPillColor(booking.status)} text-white`}>
                                                    {booking.status}
                                                </span>
                                                <span className="ml-auto text-xs text-gray-500">
                                                    Booking ID: {index + 1}
                                                </span>
                                            </div>
                                        </div>


                                        <div className="p-5">
                                            <div className="flex items-start mb-4">
                                                <div className="flex-shrink-0">
                                                    <AccountCircleIcon className="text-teal-600" />
                                                </div>
                                                <div className="ml-2">
                                                    <h3 className="text-lg font-medium text-gray-700">{booking.name}</h3>
                                                </div>
                                            </div>
                                            <div className="flex items-start mb-4">
                                                <div className="flex-shrink-0">
                                                    <FestivalIcon className="text-teal-700" />
                                                </div>
                                                <div className="ml-2">
                                                    <h3 className="text-lg font-medium text-gray-600">{booking.venue_name}</h3>
                                                </div>
                                            </div>


                                            <div className="space-y-4">
                                                {/* Dates */}
                                                <div>
                                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Booking Dates</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {booking.dates && booking.dates.length > 0 ? (
                                                            booking.dates.map((date, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                                                                >
                                                                    {date}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-sm text-gray-500">No dates specified</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Times */}
                                                <div>
                                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Time Slots</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {Array.isArray(booking.times) && booking.times.length > 0 ? (
                                                            booking.times.map((time, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100"
                                                                >
                                                                    {Array.isArray(time) ? time.join(' - ') : time}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-sm text-gray-500">No times specified</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Payment Info */}
                                                <div className="grid grid-cols-3 gap-2 pt-2">
                                                    <div className="bg-gray-100 p-2 rounded-lg">
                                                        <p className="text-xs text-gray-500">Advance</p>
                                                        <p className="font-medium">₹{Math.round(booking.booking_amount)}</p>
                                                    </div>
                                                    <div className="bg-gray-100 p-2 rounded-lg">
                                                        <p className="text-xs text-gray-500">Remaining</p>
                                                        <p className="font-medium">₹{Math.round(booking.remaining_amount)}</p>
                                                    </div>
                                                    <div className="bg-gray-100 p-2 rounded-lg">
                                                        <p className="text-xs text-gray-500">Total</p>
                                                        <p className="font-medium">₹{Math.round(booking.total_price)}</p>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {bookings.length > 0 && (
                                <div className="mt-8">
                                    <PaginationCmp
                                        setCurrentPage={setCurrentPage}
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

        </>
    );
}



