import { toast } from "react-toastify";
import { axiosOwnerInstance } from "../../Utils/Axios/axiosInstance";


export default function BookingPackgeTimeSloteCard({ index, slot, venueId, packageId }) {

    const handleChangetheStatus = async (e) => {
        const isActive = e.target.checked;
        console.log('stausss', isActive)


        try {
            const response = await axiosOwnerInstance.put(`change_time_slote_status/${venueId}/`, {
                index: index,
                package_id: packageId,
                is_active: isActive,
            })

            const { updated_slot } = response.data

            const statusMessage = updated_slot.is_active
                ? `${updated_slot.start_time} - ${updated_slot.end_time} Unblocked successfully`
                : `${updated_slot.start_time} - ${updated_slot.end_time} Blocked successfully`;
            toast.success(statusMessage)
        } catch (error) {
            console.error(error)
            toast.error("Failed to update time slot. Please try again later")
        }
    }

    return (
        <>
            <div
                key={index}
                className="flex items-center justify-between p-4 mb-4 last:mb-0 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
            >
                {/* Individual time slot */}
                <p className="text-teal-700 font-medium text-lg">
                    {slot.start_time} - {slot.end_time}
                </p>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked={slot.is_active}
                        onChange={handleChangetheStatus}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-teal-300 peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
            </div>
        </>
    )
} 