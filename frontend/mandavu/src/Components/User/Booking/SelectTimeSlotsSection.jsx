


const timeSlotsForRegular = [
    "Morning",
    "Evenig",
    "Full Day"
]



export default function SelectTimeSlotsSection({ packageTimeSlots, setSelectedTimeSlot, selectedTimeSlot, showTimeSlots }) {


    const handleTimeSlotClick = (slot) => {
        if (packageTimeSlots.length === 0) {
            // If packageTimeSlots is empty, allow only one selection
            setSelectedTimeSlot([slot]);
        } else {
            // Handle selection for packageTimeSlots
            if (
                selectedTimeSlot.some(
                    (selected) => selected[0] === slot[0] && selected[1] === slot[1]
                )
            ) {
                // If the slot is already selected, deselect it
                setSelectedTimeSlot((prev) =>
                    prev.filter(
                        (selected) => selected[0] !== slot[0] || selected[1] !== slot[1]
                    )
                );
            } else {
                // Add the slot if the limit is not reached
                if (selectedTimeSlot.length < 3) {
                    setSelectedTimeSlot((prev) => [...prev, slot]);
                }
            }
        }
    };



    return (
        <>
            <div
                className={`transition-all duration-700 ease-in-out overflow-hidden mb-6 ${showTimeSlots ? "max-h-[500px]" : "max-h-0"
                    }`}
            >
                <div className="py-4 bg-gray-100 rounded-lg shadow-xl">
                    <h3 className="text-lg text-center text-gray-700 font-semibold mb-4">Select Time Slot</h3>

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
                        {/* Conditional Rendering */}
                        {packageTimeSlots.length === 0
                            ? // Render Regular Time Slots (single selection allowed)
                            timeSlotsForRegular.map((slot, index) => (
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
                            : // Render Package Time Slots
                            packageTimeSlots.map((slot, index) => (
                                <button
                                    key={index}
                                    onClick={() =>
                                        slot.is_active && handleTimeSlotClick([slot.start_time, slot.end_time])
                                    }
                                    className={`px-4 py-4 rounded-lg text-sm font-medium transition duration-300 ${selectedTimeSlot.some(
                                        (selected) =>
                                            selected[0] === slot.start_time && selected[1] === slot.end_time
                                    )
                                        ? "bg-teal-500 text-white"
                                        : slot.is_active
                                            ? "bg-white text-gray-700 border border-gray-300 hover:bg-teal-100"
                                            : "bg-gray-400 text-gray-600 cursor-not-allowed"
                                        }`}
                                    disabled={!slot.is_active || (selectedTimeSlot.length === 3 && !selectedTimeSlot.some(
                                        (selected) =>
                                            selected[0] === slot.start_time && selected[1] === slot.end_time
                                    ))}
                                >
                                    {slot.start_time} - {slot.end_time}
                                </button>
                            ))

                        }
                    </div>
                </div>
            </div>

        </>
    )
}