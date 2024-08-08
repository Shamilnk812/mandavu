import { useSelector } from "react-redux";
import Navbar from "../../Components/Owner/Navbar";
import Sidebar from "../../Components/Owner/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";  // Ensure toast is imported

export default function BookingManagement() {
    const venueId = useSelector((state) => state.owner.venueId);
    const [bookingDetails, setBookingDetails] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [bookingId, setBookingId] = useState(null);

    const fetchBookingDetails = async () => {
        if (!venueId) {
            console.error('Venue ID is not available');
            return;
        }
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/v2/auth/all-booking-details/${venueId}/`);
            setBookingDetails(response.data);
        } catch (error) {
            console.error('Error fetching booking details:', error);
        }
    };

    useEffect(() => {    
        fetchBookingDetails();
    }, [venueId]);

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
            await axios.post(`http://127.0.0.1:8000/api/v2/auth/booking-cancelling/${bookingId}/`, { reason: cancelReason });
            handleCloseModal();
            toast.success('Booking Cancelled successfully');
            // Refresh the booking details after canceling
            fetchBookingDetails();
        } catch (error) {
            console.error('Something went wrong:', error);
            toast.error('Failed to cancel booking');
        }
    };

    return (
        <>
            <Sidebar/>
            <div className="bg-customColor7 flex">
                <div className="flex-1 p-10 text-2xl ml-64">
                    <div className="bg-customColor8 rounded-lg shadow-lg pb-10 mt-16">
                        <h3 className="text-2xl bg-gradient-to-r from-teal-500 to-gray-800 font-semibold mb-4 py-3 text-center text-white rounded-tl-lg rounded-tr-lg">Booking Details</h3>
                        <div className="p-8">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-white uppercase bg-gradient-to-r from-teal-500 to-gray-800 dark:bg-gradient-to-r from-teal-500 to-gray-800 dark:text-white">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">User Name</th>
                                        <th scope="col" className="px-6 py-3">Date</th>
                                        <th scope="col" className="px-6 py-3">Time</th>
                                        <th scope="col" className="px-6 py-3">Details</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                        <th scope="col" className="px-6 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookingDetails.map((booking) => (
                                        <tr key={booking.id} className="bg-customColor7 border-b border-gray-300 dark:bg-customColor7 dark:border-gray-400">
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-900">
                                                {booking.name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-900">{booking.date}</td>
                                            <td className="px-6 py-4 text-gray-900 ">{booking.time}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    type="button"
                                                    className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2 dark:bg-purple-600 dark:hover:bg-purple-700"
                                                    // onClick={() => navigate(`/user/view-booking-details/${booking.id}`)}
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                            <td className={`px-6 py-4 ${
                                                booking.status === 'Booking Confirmed' ? 'text-blue-500' :
                                                booking.status === 'Booking Completed' ? 'text-green-500' :
                                                booking.status === 'Booking Canceled' ? 'text-red-500' : 'text-gray-900'
                                            }`}>
                                                {booking.status}
                                            </td>
                                            <td className="px-6 py-4">
                                                {booking.status === 'Booking Confirmed' ? (
                                                    <button
                                                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2 dark:bg-red-600 dark:hover:bg-red-700"
                                                        onClick={() => handleCancelClick(booking.id)}
                                                    >
                                                        Cancel
                                                    </button>
                                                ) : booking.status === 'Booking Completed' ? (
                                                    <span className="text-green-500">Booking Completed</span>
                                                ) : booking.status === 'Booking Canceled' ? (
                                                    <span className="text-red-500">Cancelled</span>
                                                ) : null}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div id="authentication-modal" tabIndex="-1" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                    <div className="relative p-4 w-full max-w-md max-h-full">
                        <div className="relative bg-teal-800 rounded-lg shadow dark:bg-teal-800">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Cancel Booking
                                </h3>
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                                        <label htmlFor="cancelReason" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Reason for Cancellation</label>
                                        <textarea
                                            id="cancelReason"
                                            name="cancelReason"
                                            rows="4"
                                            className="bg-customColor7 border border-teal-500 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-customColor7 dark:border-teal-500 dark:placeholder-teal-500 dark:text-gray-800"
                                            value={cancelReason}
                                            onChange={(e) => setCancelReason(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-center pt-4">
                                        <button type="submit" className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800">Submit</button>
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
