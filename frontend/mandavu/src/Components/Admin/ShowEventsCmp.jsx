import { useState,useEffect } from "react";            
            

export default function ShowEventsCmp({ events }) {

    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        setFadeIn(true);
    }, []);

    return (
        <>
            <div
                className={`bg-white rounded-lg shadow-lg border transform transition-opacity duration-500 ease-out ${
                fadeIn ? 'opacity-100' : 'opacity-0'
                }`}
            >


                {/* Main Heading */}
                <h2 className="text-lg leading-6 font-medium text-center text-white py-5 mb-6 bg-gray-700 rounded-t-lg">Events</h2>

                <div className="h-[600px] overflow-y-auto">
                    {/* Events Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-12">
                        {events.map((event, index) => (
                            <div
                                key={event.id}
                                className="relative bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
                            >
                                {/* Event Photo */}
                                <img
                                    src={event.event_photo}
                                    alt={event.event_name}
                                    className="w-full h-48 object-cover"
                                />
                                {/* Event Name */}
                                <div className="p-4 text-center">
                                    <h3 className="text-base font-semibold text-gray-800">{event.event_name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </div>
        </>
    )
}