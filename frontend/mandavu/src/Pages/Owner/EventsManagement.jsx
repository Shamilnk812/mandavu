import { useSelector } from "react-redux";
import Sidebar from "../../Components/Owner/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import AddEventSchema from "../../Validations/Owner/AddEventSchema";
import AddEventModal from "../../Components/Owner/AddEventModal";
import { axiosOwnerInstance } from "../../Utils/Axios/axiosInstance";
import ReportIcon from '@mui/icons-material/Report';
import { setLocale } from "yup";
import SkeletonAnimation from "../../Components/Owner/SkeletonAnimation";
import EmptyDataShowMessage from "../../Components/Owner/EmptyDataShowMessage";




export default function EventsManagement() {


    const venueId = useSelector((state) => state.owner?.venueId)
    const [showModal, setShowModal] = useState(false)
    const [eventsList, setEventsList] = useState([])
    const [isLoading, setIsLoading] = useState(true)


    const formik = useFormik({
        initialValues: {
            eventImage: null,
            eventName: ''
        }, validationSchema: AddEventSchema,
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append('event_photo', values.eventImage)
            formData.append('event_name', values.eventName)

            try {
                const response = await axiosOwnerInstance.post(`add-event/${venueId}/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                toast.success('New event added successfully')
                handleCloseModal()
                fetchEventsDetails();
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Failed to add new event. Please try again later.';
                toast.error(errorMessage)
            }
        }
    })

    const handleImageChange = (e) => {
        formik.setFieldValue('eventImage', e.target.files[0]);
    };


    const fetchEventsDetails = async () => {
        try {
            setIsLoading(true)
            const response = await axiosOwnerInstance.get(`get-all-events/${venueId}/`)
            setEventsList(response.data)
        } catch (error) {
            toast.error('Failed to fetch event details. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchEventsDetails();
    }, [venueId])

    const handleBlockEvent = async (event_id) => {
        try {
            const response = await axiosOwnerInstance.patch(`block-event/${venueId}/`, { event_id })
            toast.success('Event successfully blocked!');
            fetchEventsDetails()

        } catch (error) {
            toast.error('Failed to block event. Please try again later.')
        }
    }


    const handleUnblockEvent = async (event_id) => {
        try {
            const response = await axiosOwnerInstance.patch(`unblock-event/${venueId}/`, { event_id })
            toast.success('Event successfullt unblocked !')
            fetchEventsDetails()
        } catch (error) {
            toast.error('Failed to unblock event. Please try again later.')

        }

    }

    const handleOpenModal = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        formik.resetForm()
    }
    return (
        <>
            <Sidebar />
            <div className="flex flex-col flex-1 ml-64 mt-14 bg-customColor7 min-h-screen">
                <div className="p-10">
                    <div className="bg-white rounded-lg shadow-lg border pb-10">
                        <div>
                            <h3 className="text-2xl font-semibold py-3 border-b border-gray-300 text-center text-gray-700 rounded-tl-lg rounded-tr-lg">
                                Events
                            </h3>
                        </div>
                        <div className="px-8 py-5">
                            <div className="flex justify-end items-center py-4">
                                <button
                                    className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800 transition-all duration-300 flex items-center"
                                    onClick={handleOpenModal}
                                >
                                    + Add Event
                                </button>
                            </div>

                            {/* Loading Skeleton */}
                            {isLoading ? (

                                <SkeletonAnimation />
                            ) : (
                                /* Actual Content */
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {eventsList.length > 0 ? (
                                        eventsList.map((event, index) => (
                                            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                                                <div className="relative">
                                                    <img
                                                        src={event.event_photo}
                                                        alt={event.name}
                                                        className="w-full h-48 object-cover"
                                                    />
                                                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${event.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {event.is_active ? 'Active' : 'Inactive'}
                                                    </div>
                                                </div>

                                                <div className="p-5">
                                                    <h3 className="text-lg font-semibold text-center text-gray-500 border-b border-gray-200 pb-1 mb-2">{event.event_name}</h3>

                                                    <div className="flex justify-end items-center mt-4">
                                                        {event.is_active ? (
                                                            <button
                                                                className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-800 transition-colors duration-200 flex items-center"
                                                                onClick={() => handleBlockEvent(event.id)}
                                                            >
                                                                Block
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-800 transition-colors duration-200 flex items-center"
                                                                onClick={() => handleUnblockEvent(event.id)}
                                                            >
                                                                Unblock
                                                            </button>
                                                        )}

                                                        {/* <button className="text-gray-600 hover:text-gray-900">
                                                            <DotsVerticalIcon className="w-5 h-5" />
                                                        </button> */}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (

                                        <EmptyDataShowMessage title={'Event'} />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <AddEventModal showModal={showModal} handleCloseModal={handleCloseModal} formik={formik} handleImageChange={handleImageChange} />
            )}
        </>
    )
}