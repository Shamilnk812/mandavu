import { axiosUserInstance } from "../../../Utils/Axios/axiosInstance";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";



const timeSlotsForRegular = [
    "Morning",
    "Evening",
    // "Full Day"
]



export default function SelectTimeSlotsSection({ packageTimeSlots, setSelectedTimeSlot, selectedTimeSlot, showTimeSlots, selectedDates, packageName, packagePrice, packagePricePerHour, venueId, setAdvanceAmount, setTotalAmount, totalAmount }) {


    const [bookedTimeSlots, setBookedTimeSlots] = useState([])

    const fetchBookedTimeSlotsOfSelectedDate = async (date) => {
        try {
            // Convert the array to a string if it's an array
            const dateString = Array.isArray(date) && date.length === 1 ? date[0] : null;

            if (!dateString) {
                console.error("Invalid date format. Ensure a single date is selected.");
                return;
            }

            const response = await axiosUserInstance.get(`/get-booked-time-slots/${venueId}/`, {
                params: { selectedDate: dateString },
            });
            setBookedTimeSlots(response.data);
        } catch (error) {
            console.error("Something went wrong.", error);
            toast.error("Something went wrong.");
        }
    };


    useEffect(() => {
        if (selectedDates && Array.isArray(selectedDates) && selectedDates.length === 1 && packageName.toLowerCase() !== "regular") {
            fetchBookedTimeSlotsOfSelectedDate(selectedDates);
        }
    }, [selectedDates, packageName]); 



   


    const handleTimeSlotClick = (slot) => {
        // const packageAmount = parseFloat(packagePrice) || 0;
        const packageAmount = packagePricePerHour !== 'Not Allowed' 
        ? parseFloat(packagePricePerHour) || 0 
        : parseFloat(packagePrice) || 0;
        
        if (packageTimeSlots.length === 0) {
            setSelectedTimeSlot([slot]);
            return
        }

        setSelectedTimeSlot((prev) => {
            // Check if the slot is already selected
            const isAlreadySelected = prev.some(

                (selected) => selected[0] === slot[0] && selected[1] === slot[1]
            );

            let updatedSlots;
            let newTotal = parseFloat(totalAmount);

            if (isAlreadySelected) {
                // If the slot is already selected, deselect it
                updatedSlots = prev.filter(
                    (selected) => selected[0] !== slot[0] || selected[1] !== slot[1]
                );

                // Subtract packageAmount if more than one slot remains
                if (updatedSlots.length >= 1) {
                    newTotal -= packageAmount;
                }
            } else {
                // Add the slot if the limit is not reached
                if (prev.length < 3) {
                    updatedSlots = [...prev, slot];

                    // Add packageAmount for every additional slot
                    if (updatedSlots.length > 1) {
                        newTotal += packageAmount;
                    }
                } else {
                    updatedSlots = prev; 
                }
            }


            setTotalAmount(newTotal);
            setAdvanceAmount(newTotal * 0.15);

            return updatedSlots;
        });
    };


    const isBooked = (slot) => {
        return bookedTimeSlots.some(
            (bookedSlot) =>
                bookedSlot[0] === slot.start_time && bookedSlot[1] === slot.end_time
        );
    };




    return (
        <>
            <div
                className={`transition-all duration-700 ease-in-out overflow-hidden my-8 shadow-lg ${showTimeSlots ? "max-h-[500px]" : "max-h-0"
                    }`}
            >
                <div className="py-4 bg-gray-100 rounded-lg shadow-xl">
                    <h3 className="text-lg text-center text-gray-700 font-semibold mb-4">Select Time</h3>

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
                        {packageTimeSlots.length === 0
                            ? timeSlotsForRegular.map((slot, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleTimeSlotClick(slot)}
                                    className={`px-4 py-4 rounded-lg text-sm font-medium transition duration-300 ${selectedTimeSlot.includes(slot)
                                        ? "bg-teal-500 text-white"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-teal-100"
                                        }`}
                                >
                                    {slot}
                                </button>
                            ))
                            : packageTimeSlots.map((slot, index) => {
                                const booked = isBooked(slot);
                                return (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            !booked && slot.is_active && handleTimeSlotClick([slot.start_time, slot.end_time])
                                        }
                                        className={`px-4 py-4 rounded-lg text-sm font-medium transition duration-300 ${booked
                                            ? "bg-red-300 text-white cursor-not-allowed"
                                            : selectedTimeSlot.some(
                                                (selected) =>
                                                    selected[0] === slot.start_time &&
                                                    selected[1] === slot.end_time
                                            )
                                                ? "bg-teal-500 text-white"
                                                : slot.is_active
                                                    ? "bg-white text-gray-700 border border-gray-300 hover:bg-teal-100"
                                                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                                            }`}
                                        disabled={booked || !slot.is_active || (selectedTimeSlot.length === 3 &&
                                            !selectedTimeSlot.some(
                                                (selected) =>
                                                    selected[0] === slot.start_time &&
                                                    selected[1] === slot.end_time
                                            ))}
                                    >
                                        {slot.start_time} - {slot.end_time}
                                    </button>
                                );
                            })}
                    </div>
                </div>
            </div>

        </>
    )
}