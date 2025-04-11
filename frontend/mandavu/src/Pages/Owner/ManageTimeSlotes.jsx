import { useParams } from "react-router-dom";
import Sidebar from "../../Components/Owner/Sidebar";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { axiosOwnerInstance } from "../../Utils/Axios/axiosInstance";
import { toast } from "react-toastify";
import BookingPackgeTimeSloteCard from "../../Components/Owner/BookingPackageTimeSlote";
import LoadingAnimation from "../../Components/Common/LoadingAnimation";



export default function ManageTimeSlotesForPackages() {
    const { id } = useParams()
    const venueId = useSelector((state) => state.owner.venueId);
    const [timeSlotes, setTimeSlotes] = useState([])
    const [isLoading, setIsLoading] = useState(true)


    const fetchTimeSoltes = async () => {
        try {
            const response = await axiosOwnerInstance.get(`get-time-slotes/${venueId}/?packageId=${id}`)
            const slots = response.data.length > 0 ? response.data[0].time_slots : [];
            setTimeSlotes(slots)
            console.log(slots)
        } catch (error) {
            toast.error('Failed to fetch packge time slotes. Please try again later')
        }finally{
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchTimeSoltes();
    }, [venueId, id])


    return isLoading ? (
        <LoadingAnimation/>
    ):(
        <>
            <Sidebar />

            <div className="flex flex-col flex-1 mt-14 bg-customColor7 min-h-screen transition-all duration-300 md:ml-64">

            <div className="p-10">
                    <div className="bg-white rounded-lg shadow-lg pb-10 ">
                        <h3 className="text-2xl border-b border-gray-300 font-semibold mb-4 py-3 text-center text-gray-600 rounded-tl-lg rounded-tr-lg">
                            Manage Time Slots
                        </h3>

                        <div className="flex justify-center py-10">
                            <div className="bg-white p-12 w-1/2 rounded-lg shadow-sm border border-gray-200">
                                {timeSlotes.length > 0 ? (
                                    timeSlotes.map((slot, index) => (

                                        <BookingPackgeTimeSloteCard
                                            slot={slot}
                                            index={index}
                                            venueId={venueId}
                                            packageId={id}
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-600 text-center">
                                        No time slots available.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

