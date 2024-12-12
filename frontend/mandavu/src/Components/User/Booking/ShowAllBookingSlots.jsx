import { useState, useEffect } from "react"
import { axiosUserInstance } from "../../../Utils/Axios/axiosInstance"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import "./Styles/CalendarStyle.css"

export default function ViewAllBookingSlots({ venueId, showCalendar, setShowCalendar }) {

    const [events, setEvents] = useState([])

    const fetchBookingDetails = () => {
        axiosUserInstance.get(`booking-details/${venueId}`)
            .then((res) => {
                const bookings = res.data.map((booking) => ({
                    id: booking.id,
                    title: booking.status === 'Booking Confirmed' ? 'Booked' : booking.status === 'Booking Completed' ? 'Completed' : booking.status === 'Booking Canceled' ? 'Canceled' : 'Other',
                    start: booking.start,
                    color: booking.status === 'Booking Confirmed' ? 'orange' : booking.status === 'Booking Completed' ? 'green' : 'blue'
                }));
                setEvents(bookings);
                console.log(bookings)
            })
            .catch((err) => {
                console.error("Error fetching booking details:", err);
            });
    };

    useEffect(() => {
        fetchBookingDetails()
    }, [])

    return (
        <>

            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${showCalendar ? "max-h-[500px]" : "max-h-0"
                    }`}
            >
                <div className="h-[350px] bg-gray-50 p-4 rounded-lg shadow-lg">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        headerToolbar={{
                            left: "prev,next",
                            center: "title",
                            right: "today"
                        }}
                        eventColor="#3788d8"
                        eventTextColor="#fff"
                        height="100%"
                    />
                </div>
            </div>


            <div
                className={`mt-4 ${showCalendar ? "flex justify-end" : "text-center"
                    }`}
            >
                <button
                    onClick={() => setShowCalendar(!showCalendar)}
                    className={`px-3 py-1 text-sm font-semibold rounded-lg shadow-lg transform hover:-translate-y-1 hover:shadow-xl   focus:outline-none  transition duration-300 
            ${showCalendar
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-teal-500 hover:bg-teal-600 text-white"
                        }`}
                >
                    {showCalendar ? (
                        <>
                            <span>Hide </span>
                            <ArrowDropUpIcon />
                        </>
                    ) : (
                        <>
                            <span>View Slots </span>
                            <ArrowDropDownIcon />
                        </>
                    )}
                </button>
            </div>





        </>
    )
}