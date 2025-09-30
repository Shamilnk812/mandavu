import React, { useEffect, useState } from 'react'
import Sidebar from '../../Components/Owner/Sidebar'
import { axiosOwnerInstance } from '../../Utils/Axios/axiosInstance'
import { useSelector } from 'react-redux'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';
import { FaSleigh } from 'react-icons/fa'
import { toast } from 'react-toastify'



const ManageSlote = () => {

    const [bookedDates, setBookedDates] = useState([])
    const venueId = useSelector((state) => state.owner.venueId);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const handleCloseModal = () => setShowModal(false);


    const fetchAllBookedDates = async () => {

        try {
            const response = await axiosOwnerInstance.get(`/get-booked-dates/${venueId}`)
            setBookedDates(response.data)
            console.log('response data', response.data)
        } catch (error) {
            console.error('something went wrong', error)
        }

    }

    useEffect(() => {
        fetchAllBookedDates()
    }, [])


    const events = bookedDates.map((item) => {
        let color = "green";

        if (item.status === "Unavailable") {
            color = "gray";
        } 

        return {
            title: item.status,
            start: item.date,
            color: color,
        };
    });


    const handleSubmit = async (action) => {
        try {
            const response = await axiosOwnerInstance.post(`/manage-unavailable-date/${venueId}/`,
                {
                    date: selectedDate,
                    action: action,
                }
            );

            console.log("Response:", response.data);
            fetchAllBookedDates();
            setSelectedDate("")
            setShowModal(false); 

            if (response.data.warning) {
                toast.warning(response.data.warning);
            } else if (response.data.message) {
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error("Something went wrong", error.response?.data || error);
            toast.error(error.response?.data?.error || "An error occurred");
        }
    };







    return (
        <>
            <Sidebar />
            <div className="flex flex-col flex-1 mt-14 bg-customColor7 min-h-screen transition-all duration-300 md:ml-64">
                <div className="p-10">
                    <div className="bg-white pb-10 border rounded-lg shadow-lg">
                        <div>
                            <h1 className="text-2xl border-b border-gray-300 font-semibold py-3  text-center text-gray-600" >Manage Booking Slotes</h1>
                        </div>

                        <div className='p-8'>
                            <div className="h-[400px] bg-gray-50 p-4 rounded-lg shadow-lg">
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

                        <div className='flex flex justify-end mt-4 px-8'>
                            <button
                                className='border border-purple-600 text-purple-600 rounded py-1 px-3 hover:bg-purple-600 hover:text-white transition-colors duration-200'
                                onClick={() => setShowModal(true)} 
                            >
                                Manage Slote
                            </button>

                        </div>


                    </div>
                </div>
            </div>





            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative p-4 w-full max-w-md max-h-full">
                        <div className="relative bg-white rounded-lg shadow">

                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b rounded-t">
                                <h3 className="text-xl font-semibold text-gray-800">Manage Slot</h3>
                                <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-900"
                                    onClick={handleCloseModal}
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-600">
                                        Select Date
                                    </label>
                                    <input
                                        type="date"
                                        className="bg-gray-50 border text-gray-700 text-sm rounded-lg block w-full p-2.5"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end mt-6 gap-2">
                                    <button
                                        className="bg-red-600 text-white px-4 py-1  rounded hover:bg-red-700 transition"
                                        onClick={() => handleSubmit('remove')}
                                    >
                                        Remove
                                    </button>
                                    <button
                                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
                                        onClick={() => handleSubmit('add')}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}


        </>
    )
}

export default ManageSlote
