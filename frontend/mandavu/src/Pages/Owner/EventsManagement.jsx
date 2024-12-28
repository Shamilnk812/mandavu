import { useSelector } from "react-redux";
import Sidebar from "../../Components/Owner/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import AddEventSchema from "../../Validations/Owner/AddEventSchema";
import AddEventModal from "../../Components/Owner/AddEventModal";
import { axiosOwnerInstance } from "../../Utils/Axios/axiosInstance";



export default function EventsManagement() {


    const venueId = useSelector((state)=> state.owner?.venueId)
    const [showModal, setShowModal] = useState(false)
    const [eventsList, setEventsList] = useState([])

    const formik = useFormik({
        initialValues:{
            eventImage: null,
            eventName: ''
        },validationSchema:AddEventSchema,
        onSubmit: async(values)=> {
            const formData = new FormData();
            formData.append('event_photo', values.eventImage)
            formData.append('event_name', values.eventName)
            
            try{
                const response = await axiosOwnerInstance.post(`add-event/${venueId}/`,formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                    })
                toast.success('New event added successfully')
                handleCloseModal()
                fetchEventsDetails();    
            }catch(error) {
                toast.error('Failed to add new event. Please try again later.')
            }
        }
    })
    
    const handleImageChange = (e) => {
        formik.setFieldValue('eventImage', e.target.files[0]);
    };


    const fetchEventsDetails = async ()=> {
        try{
            const response = await axiosOwnerInstance.get(`get-all-events/${venueId}/`)
            setEventsList(response.data)
        }catch(error) {
            toast.error('Failed to fetch event details. Please try again later.');
        }
    }
    useEffect(()=> {
        fetchEventsDetails();
    },[venueId])

    const handleBlockEvent = async (event_id)=> {
          try{
            const response = await axiosOwnerInstance.patch(`block-event/${venueId}/`,{event_id})
            toast.success('Event successfully blocked!');
            fetchEventsDetails()

          }catch(error) {
            toast.error('Failed to block event. Please try again later.')
          }
    }
    

    const handleUnblockEvent = async (event_id) => {
        try{
            const response = await axiosOwnerInstance.patch(`unblock-event/${venueId}/`,{event_id})
            toast.success('Event successfullt unblocked !')
            fetchEventsDetails()
        }catch(error) {
            toast.error('Failed to unblock event. Please try again later.')

        }

    }

    const handleOpenModal = ()=> {
        setShowModal(true)
    }

    const handleCloseModal = ()=> {
        setShowModal(false)
        formik.resetForm()
    }
    return(
        <>
        <Sidebar/>
        <div className="flex flex-col flex-1 ml-64 mt-16 bg-customColor7 min-h-screen">
                <div className="p-10">
                    <div className="bg-white rounded-lg shadow-lg border pb-10">
                        <div>
                            <h3 className="text-2xl font-semibold py-3 border-b border-gray-300 text-center text-gray-700 rounded-tl-lg rounded-tr-lg">
                                Events
                            </h3>
                        </div>
                        <div className="px-24 py-5">
                                <div className="relative overflow-x-auto h-[600px] overflow-y-auto">
                                    <div className="flex justify-end items-center py-4 pr-2">
                                        <button
                                            className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800 transiton-all duration-300"
                                            onClick={handleOpenModal}
                                        >
                                            + Add Event
                                        </button>
                                    </div>
                                    <table className="w-full  text-sm text-left rtl:text-right text-gray-500 ">
                                        <thead className="text-xs text-white uppercase bg-gray-700">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">Event Photo</th>
                                                <th scope="col" className="px-6 py-3">Name</th>
                                                <th scope="col" className="px-6 py-3">Status</th>
                                                <th scope="col" className="px-6 py-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {eventsList.map((event, index) => (
                                                <tr key={index} className="bg-customColor7 border-b border-gray-300 dark:bg-customColor7 dark:border-gray-400">
                                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        <img src={event.event_photo} alt={event.name} className="w-14 h-14 object-cover rounded-lg border border-gray-400" />
                                                    </td>
                                                    <td className="font-medium text-gray-700 whitespace-nowrap dark:text-gray-700">{event.event_name}</td>     

                                                    <td className="px-6 py-4 ">
                                                        <span className={event.is_active ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                                                {event.is_active ? 'Active' : 'Inactive'}
                                                         </span></td>
                                                    <td className="px-6 py-4">
                                                        {event.is_active ? (
                                                            <button
                                                                className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-800"
                                                                onClick={() => handleBlockEvent(event.id)}
                                                            >
                                                                Block
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-800"
                                                                onClick={() => handleUnblockEvent(event.id)}
                                                            >
                                                                Unblock
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                        
                        </div>
                    </div>
                </div>
            </div>
            {showModal && (
               <AddEventModal showModal={showModal} handleCloseModal={handleCloseModal} formik={formik} handleImageChange={handleImageChange}/>
            )}
        </>
    )
}