import { useState, useEffect } from "react"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import "./Styles/CalendarStyle.css"
import BookingStatusColors from "./BookingStatusColors";

export default function ViewAllBookingSlots({ venueId, showCalendar, setShowCalendar, selectedPackage, bookedDatesForRegularPackage, bookedDatesForAlternativePackage }) {



    // const regularbookedDates = bookedDatesForRegularPackage.map(item => item.date)

    const regularbookedDates = bookedDatesForRegularPackage.filter(
        (item) => item.status === "Booking Confirmed"
    ).map((item) => item.date);

    const unavailableDatesForRegular = bookedDatesForRegularPackage.filter(
        (item) => item.status === "Unavailable"
    ).map((item) => item.date);

    let mediumAvailabilityDates = [];
    let almostFullyBookedDates = [];
    let completelyBookedDates = [];
    let unAvailableDates = [];



    // Categorize the dates for alternative packages
    if (bookedDatesForAlternativePackage) {
        bookedDatesForAlternativePackage.forEach(item => {
            const { date, booked_time_slots_count, status } = item;

            if (booked_time_slots_count >= 4 && booked_time_slots_count <= 8) {
                mediumAvailabilityDates.push(date);
            } else if (booked_time_slots_count > 8 && booked_time_slots_count <= 11) {
                almostFullyBookedDates.push(date);
            } else if (booked_time_slots_count === 12) {
                completelyBookedDates.push(date);
            } else if (status === 'unavailable'){
                unAvailableDates.push(date)
            }
        });
    }


    const events = [
        ...regularbookedDates.map((date) => ({
            title: "Booked",
            start: date,
            color: "red", // Red for regular booked dates
        })),
        ...unavailableDatesForRegular.map((date) => ({
            title: "Unavailable",
            start: date,
            color: "gray", 
        })),

        ...mediumAvailabilityDates.map((date) => ({
            title: "Medium",
            start: date,
            color: "lightgreen", // Light green for medium availability
        })),
        ...almostFullyBookedDates.map((date) => ({
            title: "Almost Full",
            start: date,
            color: "orange", // Orange for almost fully booked
        })),
        ...completelyBookedDates.map((date) => ({
            title: "Fully Booked",
            start: date,
            color: "red", // Red for completely booked dates
        })),
        ...unAvailableDates.map((date) => ({
            title: "Unavailable",
            start: date,
            color: "gray", // Red for completely booked dates
        })),
    ];



    return (
        <>

            <div
                className={`transition-all duration-500 ease-in-out shadow-lg overflow-hidden ${showCalendar ? "max-h-[500px]" : "max-h-0"
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





            <div className="flex mt-4 justify-between items-center">
                {/* Check the package_name condition */}
                {selectedPackage?.package_name !== "regular" && (
                    <BookingStatusColors />
                )}

                {/* Button */}
                <div
                    className={`${selectedPackage?.package_name === "regular" ? "mx-auto" : ""
                        }`}>
                    <button
                        onClick={() => setShowCalendar(!showCalendar)}
                        className={`px-3 py-1 text-sm font-semibold rounded-lg shadow-lg transform hover:-translate-y-1 hover:shadow-xl focus:outline-none transition duration-300 
                ${showCalendar
                                ? "bg-teal-600 hover:bg-teal-700 text-white"
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
            </div>





        </>
    )
}