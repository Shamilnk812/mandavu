import { useEffect, useState } from "react";
import Navb from "../../Components/User/Navb";
import Sidebar from "../../Components/User/Sidebar";
import axios from "axios";
import { useParams } from "react-router-dom";




export default function ShowSingleBookingDetails() {
    const { bookingId } = useParams();
    const [bookedDetails, setBookedDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSingleBookingDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://127.0.0.1:8000/api/v1/auth/show-single-booking-details/${bookingId}/`);
                setBookedDetails(response.data);
                console.log('Fetched data:', response.data);
            } catch (error) {
                console.error('Something went wrong:', error);
                setError('Failed to fetch booking details');
            } finally {
                setLoading(false);
            }
        };
        fetchSingleBookingDetails();
    }, [bookingId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;


    return(
        <>
        <Navb/>
        <Sidebar/>
        <div className="bg-customColor7 flex">
                <div className="flex-1 p-10 text-2xl ml-64">
                    <div className="bg-customColor8 rounded-lg shadow-lg pb-10">
                        <h3 className="text-2xl bg-gradient-to-r from-teal-500 to-gray-800 font-semibold mb-4 py-3 text-center text-white rounded-tl-lg rounded-tr-lg">Booking Details</h3>
                        <div className="space-y-4 px-10 py-10">
                            {bookedDetails ? (
                                <div className="bg-white p-6 rounded-lg shadow-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <h4 className="font-semibold text-lg text-gray-700">Booking ID:</h4>
                                            <p className="text-gray-400 text-lg">{bookedDetails.id}</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="font-semibold text-lg text-gray-700">Venue Name:</h4>
                                            <p className="text-gray-400 text-lg ">{bookedDetails.venue.name}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="flex flex-col">
                                            <h4 className="font-semibold text-lg text-gray-700">Date:</h4>
                                            <p className="text-gray-400 text-lg ">{bookedDetails.date}</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="font-semibold text-lg text-gray-700">Time:</h4>
                                            <p className="text-gray-400 text-lg ">{bookedDetails.time}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="flex flex-col">
                                            <h4 className="font-semibold text-lg text-gray-700">Total Price:</h4>
                                            <p className="text-gray-400 text-lg ">{bookedDetails.total_price}</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="font-semibold text-lg text-gray-700">Booking Amount:</h4>
                                            <p className="text-gray-400 text-lg ">{bookedDetails.booking_amount}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="flex flex-col">
                                            <h4 className="font-semibold text-lg text-gray-700">Name:</h4>
                                            <p className="text-gray-400 text-lg ">{bookedDetails.name}</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="font-semibold text-lg text-gray-700">Email:</h4>
                                            <p className="text-gray-400 text-lg ">{bookedDetails.email}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="flex flex-col">
                                            <h4 className="font-semibold text-lg text-gray-700">Phone:</h4>
                                            <p className="text-gray-400 text-lg ">{bookedDetails.phone}</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="font-semibold text-lg text-gray-700">Additional Phone:</h4>
                                            <p className="text-gray-400 text-lg ">{bookedDetails.additional_phone}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="flex flex-col">
                                            <h4 className="font-semibold text-lg text-gray-700">Address:</h4>
                                            <p className="text-gray-400 text-lg ">{bookedDetails.address}</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="font-semibold text-lg text-gray-700">City:</h4>
                                            <p className="text-gray-400 text-lg ">{bookedDetails.city}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="flex flex-col">
                                            <h4 className="font-semibold text-lg text-gray-700">State:</h4>
                                            <p className="text-gray-400 text-lg ">{bookedDetails.state}</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="font-semibold text-lg text-gray-700">Condition:</h4>
                                            <p className="text-gray-400 text-lg ">{bookedDetails.condition}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="flex flex-col">
                                            <h4 className="font-semibold text-lg text-gray-700">Status:</h4>
                                            <p className={`text-gray-400 text-lg  ${bookedDetails.status === 'Booking Confirmed' ? 'text-blue-500' : bookedDetails.status === 'Booking Completed' ? 'text-green-500' : 'text-red-500'}`}>
                                                {bookedDetails.status}
                                            </p>
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="font-semibold text-lg text-gray-700">Created At:</h4>
                                            <p className="text-gray-400 text-lg ">{new Date(bookedDetails.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p>No booking details found.</p>
                            )}
                        </div>
                     </div>   
                     </div>   
                     </div>   
        </>
    )
}