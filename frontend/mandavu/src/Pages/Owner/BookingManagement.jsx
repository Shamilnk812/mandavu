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
            console.log(response.data.results)
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
        
        // Reset the current page to 1 when searching for a new date range
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
        try {
            await axiosUserInstance.post(`cancel-booking/${bookingId}/`, { reason: cancelReason });
            handleCloseModal();
            toast.success('Booking Cancelled successfully');
            // Refresh the booking details after canceling
            fetchBookingDetails(startDate, endDate, currentPage);
        } catch (error) {
            console.error('Something went wrong:', error);
            toast.error('Failed to cancel booking');
        }
    };

    const handleUpdateStatus = async (bookingId)=> {
        try{
             await axiosOwnerInstance.post(`update-booking-status/${bookingId}/`)
             fetchBookingDetails(startDate, endDate, currentPage);
             toast.success('Booking Completed Successfully')

        }catch(error){
            toast.error('Failed to update booking status. Please try again later')
        }
    }


    return (
        <>
            <Sidebar/>
            <div className="bg-white flex">
            {/* <div className="bg-customColor7 flex"> */}
                <div className="flex-1  p-10 text-2xl ml-64">
                    <div className="bg-white rounded-lg shadow-lg border pb-10 mt-16">
                        <h3 className="text-xl border border-b  font-semibold mb-4 py-3 text-center text-gray-600 rounded-tl-lg rounded-tr-lg">Booking Details</h3>
                        <div className="px-10">
                            <div className="flex justify-end">
                            <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex flex-col">
                        <label htmlFor="startDate" className="mb-1 text-gray-800">Starting Date</label>
                        <input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-4 py-2 border rounded text-sm"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="endDate" className="mb-1 text-gray-800">Ending Date</label>
                        <input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-4 py-2 border rounded text-sm"
                        />
                    </div>
                         <div className="mt-6">
                            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded transition-colors duration-300 hover:bg-purple-500 text-sm"><SearchIcon/></button>
                        </div>
                        </form>
                            </div>
                            {bookingDetails.length === 0 ? (
                            <div className=" p-4 my-10 text-center text-gray-500 ">No records found.</div>
                        ) : (
                            
                            <div className="grid grid-cols-3 gap-6 mt-5 p-6  max-h-[900px] overflow-y-auto">
                            {bookingDetails.map((booking) => (
                                <div key={booking.id} className="bg-white border border-gray-300 rounded-lg shadow-lg  flex flex-col justify-between h-[400px] transform transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:border-gray-300">
                                    <div>
                                        <div 
                                        // className="w-full bg-red-200 h-8 my-4"
                                        className={` w-full p-1 my-4 text-center ${
                                            booking.status === 'Booking Confirmed' ? 'bg-yellow-600' :
                                            booking.status === 'Booking Completed' ? 'bg-green-600' :
                                            booking.status === 'Booking Canceled' ? 'bg-red-600' : 'text-gray-900'
                                        }`}
                                           
                                        >
                                            <span className="text-base font-semibold  text-white">{booking.status}</span>
                                        </div>
                                        <div className="px-6">
                                        <div className="flex justify-between mb-4">
                                            <span className="font-semibold text-base text-gray-800">User Name:</span>
                                            <span className="text-gray-600 text-base">{booking.name}</span>
                                        </div>
                                        <div className="flex justify-between mb-4">
                                            <span className="font-semibold text-base text-gray-800">Dates:</span>
                                            <div className="text-gray-600 text-base flex flex-col items-end">
                                                {booking.dates && booking.dates.length > 0 ? (
                                                    booking.dates.map((date, index) => (
                                                        <span key={index}>{date}</span>
                                                    ))
                                                ) : (
                                                    <span>N/A</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex justify-between mb-4">
                                            <span className="font-semibold text-base text-gray-800">Times:</span>
                                            <div className="text-gray-600 text-base flex flex-col items-end">
                                            {booking.times && booking.times.length > 0 ? (
                                                    booking.times.map((timeRange, index) => (
                                                        <span key={index}>
                                                            {["Morning", "Evening", "Full Day"].includes(timeRange) 
                                                                ? timeRange
                                                                : `${timeRange[0]} - ${timeRange[1]}`}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span>N/A</span>
                                                )}
                                            </div>
                                        </div>
                                       


                                        <div className="flex justify-between mb-4">
                                            <span className="font-semibold text-base text-gray-800">Details</span>
                                            <span className="text-gray-600 text-base">
                                            <button
                                                  type="button"
                                                   className="focus:outline-none text-purple-700 border border-purple-700 hover:bg-purple-700 hover:text-white font-medium rounded-lg text-sm px-5 py-2 transition-all duration-300"

                                                  onClick={() => navigate(`/owner/view-single-booking-details/${booking.id}`)}
                                                 >
                                                   View Details
                                                </button>
                                            </span>
                                        </div>

                                        {/* <div className="flex justify-between mb-4">
                                            <span className="font-semibold text-base text-gray-800">Status:</span>
                                            <span className={` text-base ${
                                                booking.status === 'Booking Confirmed' ? 'text-blue-500' :
                                                booking.status === 'Booking Completed' ? 'text-green-500' :
                                                booking.status === 'Booking Canceled' ? 'text-red-500' : 'text-gray-900'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </div> */}


                                    
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-4 mt-6 px-6 pb-6">
                                    {booking.status === 'Booking Confirmed' ? (
        booking.is_completed ? (
            // Show "Update Status" button only
            <button
                className="focus:outline-none text-white bg-teal-700 hover:bg-teal-800 font-medium rounded-lg text-sm px-5 py-2"
                onClick={() => handleUpdateStatus(booking.id)}
            >
                Update Status
            </button>
        ) : (
            // Show "Cancel" button only
            <button
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2"
                onClick={() => handleCancelClick(booking.id)}
            >
                Cancel
            </button>
        )
    ) : (
        // Disable both buttons for non-confirmed bookings
        <>
            <button
                className="focus:outline-none text-white bg-gray-400 font-medium rounded-lg text-sm px-5 py-2 cursor-not-allowed"
                disabled
            >
                Cancel
            </button>
            <button
                className="focus:outline-none text-white bg-gray-400 font-medium rounded-lg text-sm px-5 py-2 cursor-not-allowed"
                disabled
            >
                Update Status
            </button>
        </>
    )}
                                        {/* {booking.status === 'Booking Confirmed' ? (
                                            <>
                                                <button
                                                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2"
                                                    onClick={() => handleCancelClick(booking.id)}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className="focus:outline-none text-white bg-teal-700 hover:bg-teal-800 font-medium rounded-lg text-sm px-5 py-2"
                                                    onClick={() => handleUpdateStatus(booking.id)}
                                                >
                                                    Update Status
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="focus:outline-none text-white bg-gray-400 font-medium rounded-lg text-sm px-5 py-2 cursor-not-allowed"
                                                    disabled
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className="focus:outline-none text-white bg-gray-400 font-medium rounded-lg text-sm px-5 py-2 cursor-not-allowed"
                                                    disabled
                                                >
                                                    Update Status
                                                </button>
                                            </>
                                        )} */}
                                    </div>
                                </div>
                            ))}
                        </div>
                          )}

                         {bookingDetails.length > 0 && (
                            <div className="flex justify-center mt-10 mb-5">
                                <div className="p-4 flex items-center">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`p-2 rounded-full text-white transition-colors duration-300 text-sm
                                        ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-800 cursor-pointer'}`}
                                    >
                                        <NavigateBeforeIcon/>
                                    </button>
                                    <span className="mx-4 text-sm">Page <span className="bg-blue-300 p-1.5">{currentPage}</span>  of {totalPages}</span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className={`p-2 rounded-full text-white transition-colors duration-300 text-sm
                                        ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-800 cursor-pointer'}`}
                                    >
                                        <NavigateNextIcon/>
                                    </button>
                                </div>
                            </div>

                          )}


                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div  className="fixed bg-black bg-opacity-50 inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
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
                                        <button type="submit" className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800 transition-all duration-300">Submit</button>
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












// <table className="w-full mt-5 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
//                                 <thead className="text-xs text-white uppercase bg-gradient-to-r from-teal-500 to-gray-800 dark:bg-gradient-to-r from-teal-500 to-gray-800 dark:text-white">
//                                     <tr>
//                                         <th scope="col" className="px-6 py-3">User Name</th>
//                                         <th scope="col" className="px-6 py-3">Date</th>
//                                         <th scope="col" className="px-6 py-3">Time</th>
//                                         <th scope="col" className="px-6 py-3">Details</th>
//                                         <th scope="col" className="px-6 py-3">Status</th>
//                                         <th scope="col" className="px-6 py-3">Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {bookingDetails.map((booking) => (
//                                         <tr key={booking.id} className="bg-customColor7 border-b border-gray-300 dark:bg-customColor7 dark:border-gray-400">
//                                             <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-900">
//                                                 {booking.name}
//                                             </td>
//                                             <td className="px-6 py-4 text-gray-900">
//                                             {booking.dates && booking.dates.length > 0
//                                                 ? booking.dates.join(", ") 
//                                                 : "N/A"}

//                                             </td>
//                                             <td className="px-6 py-4 text-gray-900 ">
//                                             {booking.times && booking.times.length > 0
//                                                 ? booking.times.map(
//                                                     (timeRange) =>
//                                                         `${timeRange[0]} - ${timeRange[1]}`
//                                                 ).join(", ") 
//                                                 : "N/A"}
//                                                 </td>
                                          
//                                             <td className="px-6 py-4">
//                                                 <button
//                                                     type="button"
//                                                     className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2 dark:bg-purple-600 dark:hover:bg-purple-700"
//                                                     onClick={() => navigate(`/owner/view-single-booking-details/${booking.id}`)}
//                                                 >
//                                                     View Details
//                                                 </button>
//                                             </td>
//                                             <td className={`px-6 py-4 ${
//                                                 booking.status === 'Booking Confirmed' ? 'text-blue-500' :
//                                                 booking.status === 'Booking Completed' ? 'text-green-500' :
//                                                 booking.status === 'Booking Canceled' ? 'text-red-500' : 'text-gray-900'
//                                             }`}>
//                                                 {booking.status}
//                                             </td>
//                                             <td className="px-6 py-4 ">
//                                                 {booking.status === 'Booking Confirmed' ? (
//                                                     <>
//                                                     <button
//                                                         className="focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2  dark:bg-red-600 dark:hover:bg-red-700"
//                                                         onClick={() => handleCancelClick(booking.id)}
//                                                     >
//                                                         Cancel
//                                                     </button>

//                                                     <button
//                                                         className="focus:outline-none text-white bg-teal-700 hover:bg-teal-800 font-medium rounded-lg text-sm px-5 py-2 ml-2 dark:bg-teal-600 dark:hover:bg-teal-700"
//                                                         onClick={() => handleUpdateStatus(booking.id)}
//                                                     >
//                                                         Update Status
//                                                     </button>
//                                                     </>
//                                                 ) : (
//                                                     <>
//                                                         <button
//                                                             className="focus:outline-none text-white bg-gray-400 font-medium rounded-lg text-sm px-5 py-2 cursor-not-allowed"
//                                                             disabled
//                                                         >
//                                                             Cancel
//                                                         </button>
                                            
//                                                         <button
//                                                             className="focus:outline-none text-white bg-gray-400 font-medium rounded-lg text-sm px-5 py-2 ml-2 cursor-not-allowed"
//                                                             disabled
//                                                         >
//                                                             Update Status
//                                                         </button>
//                                                     </>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>