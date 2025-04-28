import { useEffect, useState } from "react";
import Navb from "../../Components/User/Navb";
import Sidebar from "../../Components/User/Sidebar";
import axios from "axios";
import { axiosUserInstance } from "../../Utils/Axios/axiosInstance";
import { useParams } from "react-router-dom";
import LoadingAnimation from "../../Components/Common/LoadingAnimation";




export default function ShowSingleBookingDetails() {
    const { bookingId } = useParams();
    const [booking, setBookedDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSingleBookingDetails = async () => {
            try {
                setLoading(true);
                const response = await axiosUserInstance.get(`show-single-booking-details/${bookingId}/`);
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

    if (loading) return <LoadingAnimation />
    if (error) return <p>{error}</p>;


    return (
        <>
            <Navb />
            <div className="flex flex-col lg:flex-row">
                <Sidebar />
                <main className="flex-1 px-4 py-6 bg-gray-100 lg:ml-64 ">
                    <div className="max-w-4xl mx-auto bg-white my-16 pt-2 shadow-lg rounded-lg">
                        <h3 className="text-xl  font-semibold mb-2 py-3 m text-center text-gray-600 ">Booking Details</h3>


                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                            <dl className="sm:divide-y sm:divide-gray-200">


                                <div className="py-3 sm:py-5 lg:px-6 border-b border-gray-200">
                                    <h2 className="text-md font-semibold text-teal-600">
                                        {booking.venue.convention_center_name}
                                    </h2>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex justify-between border-b border-gray-200">
                                    <dt className="text-sm font-medium text-gray-600">
                                        Event
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                                        {booking.event_name}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex justify-between border-b border-gray-200">
                                    <dt className="text-sm font-medium text-gray-600">
                                        Booking Package
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                                        {booking.package_name}
                                    </dd>
                                </div>

                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex justify-between  border-b border-gray-200 ">
                                    <dt className="text-sm font-medium text-gray-600">
                                        Dates
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                                        {booking.dates && booking.dates.length > 0 ? (
                                            <ul className="list-none ml-0">
                                                {booking.dates.map((date, index) => (
                                                    <li key={index}>{date}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span>No dates available</span>
                                        )}
                                    </dd>
                                </div>



                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex justify-between border-b border-gray-200">
                                    <dt className="text-sm font-medium text-gray-600">
                                        Times
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                                        {booking.times && booking.times.length > 0 ? (
                                            <ul className="list-none ml-0">
                                                {booking.times.map((time, index) => (
                                                    <li key={index}>
                                                        {Array.isArray(time) ? `${time[0]} - ${time[1]}` : time}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span>No times available</span>
                                        )}
                                    </dd>
                                </div>

                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex justify-between border-b border-gray-200">
                                    <dt className="text-sm font-medium text-gray-600">
                                        Phone number
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                                        {booking.phone}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex justify-between border-b border-gray-200">
                                    <dt className="text-sm font-medium text-gray-600">
                                        Additional Phone number
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                                        {booking.additional_phone}
                                    </dd>
                                </div>

                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex justify-between border-b border-gray-200">
                                    <dt className="text-sm font-medium text-gray-600">
                                        Total Amount
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                                    ₹{Math.floor(booking.total_price)}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex justify-between border-b border-gray-200">
                                    <dt className="text-sm font-medium text-gray-600">
                                        Remaining Amount
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                                    ₹{Math.floor(booking.remaining_amount)}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex justify-between border-b border-gray-200">
                                    <dt className="text-sm font-medium text-gray-600">
                                        Booking Amount
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                                    ₹{Math.floor(booking.booking_amount)}
                                    </dd>
                                </div>
                                {booking.refund_amount > 0 && (
                                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex justify-between border-b border-gray-200">
                                        <dt className="text-sm font-medium text-gray-600">
                                            Refund Amount
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                                        ₹{Math.floor(booking.refund_amount)}
                                        </dd>
                                    </div>
                                )}

                                {booking.is_canceled_by_user === true && (
                                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex justify-between border-b border-gray-200">
                                        <dt className="text-sm font-medium text-gray-600">
                                            Cancelled By
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                                            Your are cancelld this booking
                                        </dd>
                                    </div>
                                )}

                                {booking.status === 'Booking Canceled' && (
                                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex justify-between border-b border-gray-200">
                                        <dt className="text-sm font-medium text-gray-600">
                                            Cancelled Reason
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                                            {booking.cancel_reason}
                                        </dd>
                                    </div>
                                )}

                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex justify-between border-b border-gray-200">
                                    <dt className="text-sm font-medium text-gray-600">
                                        Status
                                    </dt>
                                    <dd>
                                        <span
                                            className={`mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2 px-4 py-2 rounded 
                                ${booking.status === 'Booking Confirmed' ? 'bg-orange-500 text-white' : ''} 
                                ${booking.status === 'Booking Completed' ? 'bg-green-500 text-white' : ''} 
                                ${booking.status === 'Booking Canceled' ? 'bg-red-500 text-white' : ''}`}
                                        > {booking.status} </span>
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex justify-between border-b border-gray-200">
                                    <dt className="text-sm font-medium text-gray-600">
                                        Full Address
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                                        {booking.address} {booking.city} {booking.state}
                                    </dd>
                                </div>



                            </dl>

                        </div>


                    </div>
                </main>
            </div>
        </>
    )
}