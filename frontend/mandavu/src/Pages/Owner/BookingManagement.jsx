import { useSelector } from "react-redux";
import Navbar from "../../Components/Owner/Navbar";
import Sidebar from "../../Components/Owner/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SearchIcon from '@mui/icons-material/Search';
import { axiosOwnerInstance, axiosUserInstance } from "../../Utils/Axios/axiosInstance";
import { CircularProgress } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventIcon from '@mui/icons-material/Event';



export default function BookingManagement() {
    const venueId = useSelector((state) => state.owner.venueId);
    const navigate = useNavigate();
    const [bookingDetails, setBookingDetails] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [bookingId, setBookingId] = useState(null);


    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchBookingDetails = async (startDate = '', endDate = '', page = 1) => {
        if (!venueId) {
            console.error('Venue ID is not available');
            return;
        }
        try {
            const response = await axiosOwnerInstance.get(`all-booking-details/${venueId}/`, {
                params: {
                    start_date: startDate,
                    end_date: endDate,
                    page: page,
                },
            });

            setBookingDetails(response.data.results);
            // console.log(response.data.results)
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error('Error fetching booking details:', error);
        }
    };

    // Fetch booking details when the component mounts or venueId, currentPage, startDate, or endDate changes
    useEffect(() => {
        fetchBookingDetails(startDate, endDate, currentPage);
    }, [venueId, currentPage]);

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
        setCurrentPage(1);
        fetchBookingDetails(startDate, endDate, 1);
    };
    const handleCancelClick = (bookingId) => {
        setBookingId(bookingId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCancelReason("");
        setBookingId(null);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            await axiosUserInstance.post(`cancel-booking/${bookingId}/`, { reason: cancelReason });
            handleCloseModal();
            toast.success('Booking Cancelled successfully');
            fetchBookingDetails(startDate, endDate, currentPage);
        } catch (error) {
            console.error('Something went wrong:', error);
            toast.error('Failed to cancel booking');
        } finally {
            setLoading(false)
        }
    };

    const handleUpdateStatus = async (bookingId) => {
        try {
            await axiosOwnerInstance.post(`update-booking-status/${bookingId}/`)
            fetchBookingDetails(startDate, endDate, currentPage);
            toast.success('Booking Completed Successfully')

        } catch (error) {
            toast.error('Failed to update booking status. Please try again later')
        }
    }


    return (
        <>



            <Sidebar />
            <div className="flex flex-col flex-1 mt-14 bg-gray-50 min-h-screen transition-all duration-300 md:ml-64">
                <div className="p-6 md:p-10">
                    <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
                        {/* Header Section */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-white">
                            {/* <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-gray-100"> */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <h1 className="text-2xl border-gray-300 font-semibold py-3  text-center text-gray-700">Booking Management</h1>

                                {/* Date Filter */}
                                <form onSubmit={handleSearch} className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4 items-end">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <label htmlFor="startDate" className="mb-1 text-sm font-medium text-gray-700">From</label>
                                            <div>
                                                <input
                                                    id="startDate"
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    className="px-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500 w-full"
                                                />
                                                {/* <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" /> */}
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="endDate" className="mb-1 text-sm font-medium text-gray-700">To</label>
                                            <div>
                                                <input
                                                    id="endDate"
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    className="px-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500 w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="h-10 px-3 py-2 bg-purple-600 text-white rounded-md transition-all duration-300 hover:bg-purple-700 flex items-center justify-center gap-2"
                                    >
                                        <SearchIcon />
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6">
                            {bookingDetails.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <h3 className="text-lg font-medium text-gray-700 mb-2">No bookings found</h3>
                                    <p className="text-gray-500 mb-6">Try adjusting your search filters</p>
                                    <button
                                        onClick={() => {
                                            setStartDate('');
                                            setEndDate('');
                                            fetchBookingDetails()

                                        }}
                                        className="px-4 py-2 text-purple-600 hover:text-purple-800 font-medium"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {bookingDetails.map((booking, index) => (
                                        <div
                                            key={booking.id}
                                            className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
                                        >
                                            {/* Status Badge */}
                                            <div className={`px-4 py-3 ${booking.status === 'Booking Confirmed' ? 'bg-yellow-100 border-b border-yellow-200' :
                                                    booking.status === 'Booking Completed' ? 'bg-green-100 border-b border-green-200' :
                                                        booking.status === 'Booking Canceled' ? 'bg-red-100 border-b border-red-200' : 'bg-gray-100'
                                                }`}>
                                                <div className="flex items-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === 'Booking Confirmed' ? 'bg-yellow-500 text-white' :
                                                            booking.status === 'Booking Completed' ? 'bg-green-500 text-white' :
                                                                booking.status === 'Booking Canceled' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'
                                                        }`}>
                                                        {booking.status}
                                                    </span>
                                                    <span className="ml-auto text-xs text-gray-500">
                                                        Booking ID: {index + 1}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Booking Details */}
                                            <div className="p-5">
                                                <div className="flex items-start mb-4">
                                                    <div className="flex-shrink-0">
                                                        <AccountCircleIcon className="text-gray-500" />
                                                    </div>
                                                    <div className="ml-2">
                                                        <h3 className="text-lg font-medium text-gray-500">{booking.name}</h3>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    {/* Dates */}
                                                    <div>
                                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Dates</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {booking.dates && booking.dates.length > 0 ? (
                                                                booking.dates.map((date, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                                    >
                                                                        {date}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-sm text-gray-500">No dates specified</span>
                                                            )}
                                                        </div>
                                                    </div>


                                                    <div>
                                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Time</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {booking.times && booking.times.length > 0 ? (
                                                                booking.times.map((timeRange, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                                                                    >
                                                                        {["Morning", "Evening", "Full Day"].includes(timeRange)
                                                                            ? timeRange
                                                                            : `${timeRange[0]} - ${timeRange[1]}`}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-sm text-gray-500">No times specified</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                 

                                                                                                 {/* Payment Info */}
                                                <div className="grid grid-cols-3 gap-2 pt-3">
                                                    {booking.status === 'Booking Confirmed' && (
                                                        <>
                                                        <div className="bg-gray-100 p-2 rounded-lg">
                                                            <p className="text-xs text-gray-500">Advance</p>
                                                            <p className="font-medium">₹{Math.round(booking.booking_amount)}</p>
                                                        </div>
                                                        <div className="bg-gray-100 p-2 rounded-lg">
                                                            <p className="text-xs text-gray-500">Remaining</p>
                                                            <p className="font-medium">₹{Math.round(booking.remaining_amount)}</p>
                                                        </div>
                                                        </>
                                                      )}
                                                    <div className="bg-gray-100 p-2 rounded-lg">
                                                        <p className="text-xs text-gray-500">Total</p>
                                                        <p className="font-medium">₹{Math.round(booking.total_price)}</p>
                                                    </div>
                                                </div>
                                                


                                                <div className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-3">
                                                    <button
                                                        onClick={() => navigate(`/owner/view-single-booking-details/${booking.id}`)}
                                                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                                    >
                                                        View Details
                                                    </button>

                                                    {booking.status === 'Booking Confirmed' && (
                                                        <div className="flex flex-1 gap-2">
                                                            {booking.is_completed ? (
                                                                <button
                                                                    onClick={() => handleUpdateStatus(booking.id)}
                                                                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none"
                                                                >
                                                                    Complete
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleCancelClick(booking.id)}
                                                                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>




                        {bookingDetails.length > 0 && (
                            <div className="flex justify-center mt-10 mb-5">
                                <div className="p-4 flex items-center">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`p-2 rounded-full text-white transition-colors duration-300 text-sm
                                     ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-800 cursor-pointer'}`}
                                    >
                                        <NavigateBeforeIcon />
                                    </button>
                                    <span className="mx-4 text-sm">Page <span className="bg-blue-300 p-1.5">{currentPage}</span>  of {totalPages}</span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className={`p-2 rounded-full text-white transition-colors duration-300 text-sm
                                        ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-800 cursor-pointer'}`}
                                    >
                                        <NavigateNextIcon />
                                    </button>
                                </div>
                            </div>

                        )}



                    </div>
                </div>
            </div>




            {isModalOpen && (
                <div className="fixed bg-black bg-opacity-50 inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                    <div className="relative p-4 w-full max-w-md max-h-full">
                        <div className="relative bg-white rounded-lg shadow ">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-700 ">
                                    Cancel Booking
                                </h3>
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                                    onClick={handleCloseModal}
                                >
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div className="p-4 md:p-5">
                                <form className="space-y-4" onSubmit={handleFormSubmit}>
                                    <div>
                                        <label htmlFor="cancelReason" className="block mb-2 text-sm font-medium text-gray-700 ">Reason for Cancellation</label>
                                        <textarea
                                            id="cancelReason"
                                            name="cancelReason"
                                            rows="4"
                                            className="border border-gray-400 text-gray-800 text-sm rounded-lg block w-full p-2.5"
                                            value={cancelReason}
                                            onChange={(e) => setCancelReason(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-center pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`mt-2 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-800 transition-all duration-300 ${loading ? 'cursor-not-allowed opacity-70' : ''} `}
                                        >
                                            {loading ? (
                                                <CircularProgress size={20} style={{ color: 'white' }} />
                                            ) : (
                                                'Submit'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}














