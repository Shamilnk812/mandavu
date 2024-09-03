import { useEffect, useState } from "react";
import Navb from "../../Components/User/Navb";
import Sidebar from "../../Components/User/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AddReviewModal from "../../Components/User/AddReviewModal";
 // Fixed the typo here

export default function ShowBookingDetails() {
    const navigate = useNavigate();
    const userId = useSelector((state) => state.user.user?.id);
    const [bookedDetails, setBookedDetails] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [selectedBookingId, setSelectedBookingId] = useState(null);

    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
    // const [selectedBookingId, setSelectedBookingId] = useState(null)
    // const [reting,setRating] = useState(0)
    // const [reviewText, setReviewText] = useState('')


    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);

        if (queryParams.get('success')) {
            navigate('/user/payment-success'); // Redirect to PaymentSuccess page
        } 
        if (queryParams.get('cancel')) {
            navigate('/user/payment-cancelled'); // Redirect to PaymentCancelled page
        }
    }, [navigate]);



   
        const fetchBookingDetails =  async ()=> {
            try{
                const responce = await axios.get(`http://127.0.0.1:8000/api/v1/auth/show-booked-details/${userId}`);
                setBookedDetails(responce.data)
                console.log(responce.data)
            }catch(error) {
                console.error('Something went wrong')
            }
        }
       
   
    
    useEffect(()=> {
        fetchBookingDetails();
    },[userId])



    
    const handleCancelClick = (bookingId) => {
        setSelectedBookingId(bookingId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCancelReason("");
        setSelectedBookingId(null);
    };


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!cancelReason.trim()) {
                toast.error('Please enter a valid reason');
                return;
            }
            await axios.post(`http://127.0.0.1:8000/api/v1/auth/cancel-booking/${selectedBookingId}/`, { reason: cancelReason });
            handleCloseModal();
            toast.success('Booking Cancelled successfully')
            // Refresh the booking details after canceling
            fetchBookingDetails()
        } catch (error) {
            console.error('Something went wrong');
        }
    };


    const handleReviewClick = (id) => {
        setSelectedBookingId(id)
        setIsRatingModalOpen(true)
    }

    const handleCloseReviewModal = ()=>{
        setIsRatingModalOpen(false)
        setSelectedBookingId(null)
    }

   

    const handleReviewSubmit = async ({ rating, reviewText }) => {
        console.log('sumittdd ',rating,reviewText)
        try {
            await axios.post(`http://127.0.0.1:8000/api/v1/auth/add-review/`, {
                booking: selectedBookingId,
                rating: rating,
                review: reviewText,
            });
            handleCloseReviewModal();
            toast.success("Review submitted successfully");
            fetchBookingDetails();
        } catch (error) {
            console.error("Something went wrong");
            toast.error("Failed to submit review");
        }
    };

    
    return (
        <>
            <Navb />
            <Sidebar />
            <div className="bg-customColor7 flex">
                <div className="flex-1 p-10 text-2xl ml-64">
                    <div className="bg-customColor8 rounded-lg shadow-lg pb-10">
                        <h3 className="text-2xl bg-gradient-to-r from-teal-500 to-gray-800 font-semibold mb-4 py-3 text-center text-white rounded-tl-lg rounded-tr-lg">Booking Details</h3>
                        <div className="p-8">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-white uppercase bg-gradient-to-r from-teal-500 to-gray-800 dark:bg-gradient-to-r from-teal-500 to-gray-800 dark:text-white">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Venue name</th>
                                        <th scope="col" className="px-6 py-3">Date</th>
                                        <th scope="col" className="px-6 py-3">Time</th>
                                        <th scope="col" className="px-6 py-3">Details</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                        <th scope="col" className="px-6 py-3">Action</th>
                                       

                                    </tr>
                                </thead>
                                <tbody>
                                    {bookedDetails.map((booking) => (
                                        <tr key={booking.id} className="bg-customColor7 border-b border-gray-300 dark:bg-customColor7 dark:border-gray-400">
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-900">
                                                {booking.venue.convention_center_name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-900">{booking.date}</td>
                                            <td className="px-6 py-4 text-gray-900 ">{booking.time}</td>
                                            <td className="px-6 py-4">
                                            <button type="button" 
                                            class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800  font-medium rounded-lg text-sm px-5 py-2 dark:bg-purple-600 dark:hover:bg-purple-700 "
                                           onClick={()=> navigate(`/user/view-booking-details/${booking.id}`)}
                                           >View Details</button>

                                            </td>
                                            <td className={`px-6 py-4 font-semibold ${
                                                booking.status === 'Booking Confirmed' ? 'text-blue-500' :
                                                booking.status === 'Booking Completed' ? 'text-green-500' :
                                                booking.status === 'Booking Canceled' ? 'text-red-500' : 'text-gray-900'
                                            }`}>
                                                {booking.status}
                                            </td>
                                            <td className="px-6 py-4">
                                                {/* {booking.status === 'Booking Confirmed' ? (
                                                    <button class="focus:outline-none text-white bg-red-700 hover:bg-red-800  font-medium rounded-lg text-sm px-5 py-2 dark:bg-red-600 dark:hover:bg-red-700 "
                                                    onClick={()=> handleCancelClick(booking.id)}
                                                    >Cancel</button>
                                                ) : booking.status === 'Booking Completed' ? (

                                                    <button className="focus:outline-none text-white bg-teal-700 hover:bg-teal-800 font-medium rounded-lg text-sm px-5 py-2 dark:bg-teal-600 dark:hover:bg-teal-700"
                                                    onClick={()=> handleReviewClick(booking.id)}
                                                    >
                                                        Add Review
                                                    </button>

                                                ) : booking.status === 'Booking Canceled' ? (
                                                    <span className="text-red-500">Cancelled</span>
                                                ) : null} */}

                                                {booking.status === 'Booking Completed' ? (
                                                    booking.review_added ? (
                                                        <button className="focus:outline-none text-white bg-teal-900 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2"
                                                        disabled
                                                     >
                                                        Review Added
                                                     </button>
                                                   ) : (
                                                <button className="focus:outline-none text-white bg-teal-700 hover:bg-teal-800 font-medium rounded-lg text-sm px-5 py-2 dark:bg-teal-600 dark:hover:bg-teal-700"
                                                    onClick={() => handleReviewClick(booking.id)}
                                                 >
                                                    Add Review
                                                 </button>
                                                    )
                                                    ) : booking.status === 'Booking Canceled' ? (
                                                        <button
                                                        className="focus:outline-none text-white bg-gray-400 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2"
                                                        disabled
                                                    >
                                                        Cancelled
                                                    </button>
                                                    ) : booking.status === 'Booking Confirmed' ? (
                                                        <button class="focus:outline-none text-white bg-red-700 hover:bg-red-800  font-medium rounded-lg text-sm px-5 py-2 dark:bg-red-600 dark:hover:bg-red-700 "
                                                        onClick={()=> handleCancelClick(booking.id)}
                                                        >Cancel</button>
                                                    ): null}
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

            <AddReviewModal 
                isOpen={isRatingModalOpen}
                onClose={handleCloseReviewModal}
                onSubmit={handleReviewSubmit}
            />
        </>   
    );
}
