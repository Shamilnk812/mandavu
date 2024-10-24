

export default function EventCard({event, handleEventSelect, selectedEvent}) {
    return (
        <>
            <div
                className={`cursor-pointer  p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300 relative ${selectedEvent === event.event_name ? ' border-2 border-teal-600 shadow-[0_4px_10px_rgba(0,128,128,0.5)]' : 'border border-gray-400'}`}
                onClick={() => handleEventSelect(event)}
            >
                <img src={event.event_photo} alt={event.event_name} className="w-full h-24 sm:h-36 md:h-28 lg:h-28 object-cover rounded-lg" />
                <h3 className="text-center text-gray-700 mt-2">{event.event_name}</h3>
            </div>
        </>
    )
}