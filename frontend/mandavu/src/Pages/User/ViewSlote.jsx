import Navb from "../../Components/User/Navb";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";




export default function ViewSlote() {

    const {venueId} = useParams()
    const [events, setEvents] = useState([])


    const fetchBookingDetails = () => {
        axios.get(`http://127.0.0.1:8000/api/v1/auth/booking-details/${venueId}`)
            .then((res) => {
                const bookings = res.data.map((booking) => ({
                    id: booking.id,
                    title: booking.status === 'Booking Confirmed' ? 'Booked' : booking.status === 'Booking Completed' ? 'Completed' : booking.status === 'Booking Canceled' ? 'Canceled' : 'Other',
                    start: booking.start,
                    color: booking.status === 'Booking Confirmed' ? 'orange' : booking.status === 'Booking Completed' ? 'green' : 'blue'
                }));
                setEvents(bookings);
            })
            .catch((err) => {
                console.error("Error fetching booking details:", err);
            });
    };

    useEffect(()=> {
        fetchBookingDetails()
    },[])

    return(
        <>
        <Navb />

        <div className="container mx-auto max-w-screen-xl px-4 py-6">
        
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events ={events}

                headerToolbar={{
                    left:'prev,next',
                    center:'title',
                    right:'dayGridWeek, dayGridMonth, dayGridYear'
                }}
                />
                


        </div>  
        </>
    )
}