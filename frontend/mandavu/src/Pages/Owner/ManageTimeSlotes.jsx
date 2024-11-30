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

            <div className="bg-customColor7 flex">
                <div className="flex-1 p-10 text-2xl ml-64">
                    <div className="bg-customColor8 rounded-lg shadow-lg pb-10 mt-16">
                        <h3 className="text-2xl bg-gradient-to-r from-teal-500 to-gray-800 font-semibold mb-4 py-3 text-center text-white rounded-tl-lg rounded-tr-lg">
                            Manage Time Slots
                        </h3>

                        <div className="flex justify-center py-10">
                            <div className="bg-white p-12 w-1/2 rounded-lg shadow-md">
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

