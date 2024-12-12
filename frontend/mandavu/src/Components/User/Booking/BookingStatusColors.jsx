

export default function BookingStatusColors() {
    return (
        <>

            {/* Showing staus   */}
            <div className="w-full md:w-1/2 px-3 mb-4 ">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Booking Status
                </label>
                <div className="flex flex-wrap gap-4 mt-2">
                    {/* Booked */}
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-purple-500"></div>
                        <span className="text-gray-500 text-sm font-medium">Booked</span>
                    </div>

                    {/* Confirmed */}
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-yellow-500"></div>
                        <span className="text-gray-500 text-sm font-medium">Confirmed</span>
                    </div>

                    {/* Cancelled */}
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-500"></div>
                        <span className="text-gray-500 text-sm font-medium">Cancelled</span>
                    </div>
                </div>
            </div>
        </>
    )
}