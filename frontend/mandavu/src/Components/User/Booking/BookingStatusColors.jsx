import { useSelector } from "react-redux"


export default function BookingStatusColors() {

    const selectedPackage = useSelector((state) => state.user.selectedPackage)

    return (
        <>

            {/* Showing staus   */}
            <div className="ml-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Booking Status
                </label>
                <div className="flex flex-wrap gap-4">
                    {/* Booked */}
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-green-500"></div>
                        <span className="text-gray-500 text-sm font-medium">Half</span>
                    </div>

                    {/* Confirmed */}
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-yellow-500"></div>
                        <span className="text-gray-500 text-sm font-medium">Almost</span>
                    </div>

                    {/* Cancelled */}
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-red-500"></div>
                        <span className="text-gray-500 text-sm font-medium">Full</span>
                    </div>
                </div>
            </div>
        </>
    )
}