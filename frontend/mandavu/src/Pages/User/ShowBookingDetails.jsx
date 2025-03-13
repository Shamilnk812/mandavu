import { useEffect, useState } from "react";
import Navb from "../../Components/User/Navb";
import Sidebar from "../../Components/User/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { axiosUserInstance } from "../../Utils/Axios/axiosInstance";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AddReviewModal from "../../Components/User/AddReviewModal";
import ForumIcon from '@mui/icons-material/Forum';
import { useChat } from "../../Utils/ChatContext/CreateChat";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import PaginationCmp from "../../Components/Admin/PaginationCmp";
import UserBookingCancelModal from "../../Components/User/UserBookingCancelModal";


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

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false)


    const { handleChat } = useChat()

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);

        if (queryParams.get('success')) {
            navigate('/user/payment-success'); // Redirect to PaymentSuccess page
        }
        if (queryParams.get('cancel')) {
            navigate('/user/payment-cancelled'); // Redirect to PaymentCancelled page
        }
    }, [navigate]);




    const fetchBookingDetails = async () => {
        try {
            const response = await axiosUserInstance.get(`show-booked-details/${userId}`,
                {
                    params: { page: currentPage },}
            );
            setBookedDetails(response.data.results)
            console.log(response.data.results)
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error('Something went wrong')
        }
    }



    useEffect(() => {
        fetchBookingDetails();
    }, [userId,currentPage])




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
        setLoading(true)
        try {
            if (!cancelReason.trim()) {
                toast.error('Please enter a valid reason');
                return;
            }
            await axiosUserInstance.post(`cancel-booking/${selectedBookingId}/`, { reason: cancelReason , user:userId });
            handleCloseModal();
            toast.success('Booking Cancelled successfully')
            // Refresh the booking details after canceling
            fetchBookingDetails()
        } catch (error) {
            console.error('Something went wrong');
        }finally{
            setLoading(false)
        }
    };


    const handleReviewClick = (id) => {
        setSelectedBookingId(id)
        setIsRatingModalOpen(true)
    }

    const handleCloseReviewModal = () => {
        setIsRatingModalOpen(false)
        setSelectedBookingId(null)
    }



    const handleReviewSubmit = async ({ rating, reviewText }) => {
        console.log('sumittdd ', rating, reviewText)
        try {
            await axiosUserInstance.post(`add-review/`, {
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
            <div className="flex flex-col lg:flex-row">
                <Sidebar />
                <main className="flex-1 px-4 py-6 bg-gray-100 lg:ml-64">
                    <div className="max-w-4xl mx-auto bg-white px-4 pb-4 pt-2 shadow-lg rounded-lg mt-16">

                        <h3 className="text-xl  font-semibold mb-8 py-4 text-center text-gray-600 border-b border-gray-200 ">
                            Booking Details
                        </h3>
                        {bookedDetails.length < 1 && (
                                <p className="p-12 text-center text-gray-600">Looks like you haven’t booked a venue yet. Find the perfect space for your event!</p>
                            )}
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">

                           


                            {bookedDetails.map((booking) => {

                                const formattedDates = booking.dates.length === 1
                                    ? booking.dates[0]
                                    : `${booking.dates[0]} to ${booking.dates[booking.dates.length - 1]}`;


                                const formattedTimes = booking.times.includes("Full Day") || booking.times.includes("Morning") || booking.times.includes("Evening")
                                    ? booking.times.join(' | ')
                                    : booking.times
                                        .map((slot) => `${slot[0]} - ${slot[1]}`)
                                        .join(' | ');

                                return (
                                    <div key={booking.id} className="bg-white shadow-lg rounded-lg p-6">

                                        <h4 className="text-xl font-bold text-teal-600 mb-4">
                                            {booking.venue.convention_center_name}
                                        </h4>

                                        <div className="flex justify-between border-b py-2">
                                            <span className="font-medium text-gray-600">Event:</span>
                                            <span className="text-gray-800">{booking.event_name}</span>
                                        </div>
                                        <div className="flex justify-between border-b py-2">
                                            <span className="font-medium text-gray-600">Package:</span>
                                           
                                            <span className="text-gray-800">{booking.package_name}</span>
                                        </div>
                                        <div className="flex justify-between border-b py-2">
                                            <span className="font-medium text-gray-600">Date:</span>
                                            <span className="text-gray-800">{formattedDates}</span>
                                        </div>

                                        <div className="flex justify-between border-b py-2">
                                            <span className="font-medium text-gray-600">Time:</span>
                                            <span className="text-gray-800">{formattedTimes}</span>
                                        </div>

                                        <div className="flex justify-between border-b py-2">
                                            <span className="font-medium text-gray-600">Booking Status:</span>
                                            <span className={`font-semibold ${booking.status === 'Booking Confirmed' ? 'text-blue-500' :
                                                    booking.status === 'Booking Completed' ? 'text-green-500' :
                                                        booking.status === 'Booking Canceled' ? 'text-red-500' : 'text-gray-800'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>

                                        <div className="flex justify-between py-4">
                                            <span className="font-medium text-gray-600">Details:</span>
                                            <button
                                                type="button"
                                                className="text-purple-700 border border-purple-700 hover:bg-purple-700 hover:text-white font-medium rounded-lg text-sm px-5 py-2 transition-all duration-300"

                                                onClick={() => navigate(`/user/view-booking-details/${booking.id}`)}
                                            >
                                                View Details
                                            </button>
                                        </div>

                                        <div className="flex justify-end mt-4 space-x-4">
                                            <button
                                                onClick={() => handleChat(userId, booking.venue.owner)}
                                                className="focus:outline-none text-white bg-orange-600 hover:bg-orange-700 font-medium rounded-lg text-sm px-5 py-2 transition-all duration-300"
                                            >
                                                <ForumIcon /> Chat
                                            </button>

                                            {booking.status === 'Booking Completed' ? (
                                                booking.review_added ? (
                                                    <button className="focus:outline-none text-white bg-gray-300 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2" disabled>
                                                        Review Added
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="focus:outline-none text-white bg-teal-600 hover:bg-teal-800 font-medium rounded-lg text-sm px-5 py-2 transition-all duration-300"
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
                                                <button
                                                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2 transition-all duration-300"
                                                    onClick={() => handleCancelClick(booking.id)}
                                                >
                                                    Cancel
                                                </button>
                                            ) : null}
                                        </div>

                                    </div>
                                )

                            })}



                        </div>
                         
                         {bookedDetails.length > 0 &&(
                         <PaginationCmp setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages}/>
                         )}


                    </div>
                </main>
            </div>

            
            {/* Modal for cancelling bookings */}
            <UserBookingCancelModal  
                isModalOpen={isModalOpen} 
                handleCloseModal={handleCloseModal} 
                handleFormSubmit={handleFormSubmit} 
                cancelReason={cancelReason} 
                setCancelReason={setCancelReason}
                loading={loading}
                />
           
            


            {/* Modal for rating and add reviews */}
            <AddReviewModal
                isOpen={isRatingModalOpen}
                onClose={handleCloseReviewModal}
                onSubmit={handleReviewSubmit}
            />
        </>
    );
}
