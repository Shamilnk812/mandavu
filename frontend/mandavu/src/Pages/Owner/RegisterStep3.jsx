import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import AddEventModal from "../../Components/Owner/AddEventModal";
import { toast } from "react-toastify";
import { axiosOwnerInstance } from "../../Utils/Axios/axiosInstance";

export default function RegisterationStep3() {
    const [showModal, setShowModal] = useState(false);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const registrationData = JSON.parse(sessionStorage.getItem('registrationData')) || {};
    const progress = registrationData.progress;
    const tempVenueId = registrationData.registrationId;

    useEffect(() => {
        const registrationData = JSON.parse(sessionStorage.getItem('registrationData')) || {};
        if (!registrationData || registrationData.step_1 !== 'completed' || registrationData.step_2 !== 'completed') {
            // If not, navigate to registration-step-1
            toast.error('Please complete Previous steps.');
            navigate('/owner/register-step-1');

        } else if (registrationData.events) {
            // If registrationData has facilities, load them into the state
            setEvents(registrationData.events);
        }

    }, [navigate])

    useEffect(() => {
        const registrationData = JSON.parse(sessionStorage.getItem('registrationData')) || {};
        if (registrationData.step_3 === 'completed') {
            navigate('/owner/register-step-4');
        }

    }, [navigate])

    const formik = useFormik({
        initialValues: {
            eventName: '',
            eventImage: null,
        },
        validationSchema: Yup.object({
            eventName: Yup.string().required('Event Name is required'),
            eventImage: Yup.mixed().required('Event Image is required'),
        }),
        onSubmit: (values, { resetForm }) => {
            const reader = new FileReader();
            reader.readAsDataURL(values.eventImage);
            reader.onloadend = () => {
                const newEvent = {
                    name: values.eventName,
                    image: reader.result, // Base64 string
                };
                setEvents((prevEvents) => {
                    const updatedEvents = [...prevEvents, newEvent];

                    // Update the registrationData in session storage
                    // const registrationData = JSON.parse(sessionStorage.getItem('registrationData'));
                    // registrationData.events = updatedEvents;
                    // sessionStorage.setItem('registrationData', JSON.stringify(registrationData));

                    return updatedEvents;
                });

                resetForm();
                setShowModal(false);
                toast.success('New Event successfully added');
            };
        }
    });

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        formik.resetForm();
    };

    const handleImageChange = (e) => {
        formik.setFieldValue('eventImage', e.target.files[0]);
    };

    const handleDeleteEvent = (indexToDelete) => {
        setEvents((prevEvents) => {
            const updatedEvents = prevEvents.filter((_, index) => index !== indexToDelete);

            // Update the registrationData in session storage
            // const registrationData = JSON.parse(sessionStorage.getItem('registrationData'));
            // registrationData.events = updatedEvents;
            // sessionStorage.setItem('registrationData', JSON.stringify(registrationData));

            return updatedEvents;
        });
        toast.success('Event successfully deleted');
    };


    const handleCancel = async () => {
        try{
            const response = await axiosOwnerInstance.delete(`cancel-registration/${tempVenueId}`)
            sessionStorage.removeItem('registrationData'); // Remove registration data from sessionStorage
            navigate('/owner/register-step-1');
        }catch(error){
            toast.error("Failed to cancel registration.")
        }
    };



    const handleNext = async () => {
        try {

            const response = await axiosOwnerInstance.post(`registration-step3/${tempVenueId}/`, events)

            // const registrationData = JSON.parse(sessionStorage.getItem('registrationData')) || {};
            // const updatedData = {
            //     ...registrationData,
            //     progress: '75%',
            //     step_3: 'completed',
            // };
            const { registrationId } = response.data;
            console.log('reggg id is step 3 ', registrationId)

            sessionStorage.setItem('registrationData', JSON.stringify({
                ...registrationData, registrationId: registrationId, progress: '75%',
                step_3: 'completed'
            }));
            // sessionStorage.setItem('registrationData', JSON.stringify(updatedData));
            toast.success('Registration Step 3 is Completed')
            navigate('/owner/register-step-4');
        } catch (error) {
            console.error(error)
            console.error("Error response:", error.response); // Log the error for debugging
            const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
            toast.error(errorMessage); // Display error message in toast
        }
    };

   

    return (
        <>
            <div className="min-h-screen bg-teal-600 flex justify-center items-center">
                <div className="py-8 px-12 w-1/2 bg-white rounded-2xl shadow-xl z-20 w-full max-w-2xl">

                    <div className="flex justify-center mb-4">
                        <img
                            src="/user/mandavu-logo.png"
                            alt="Mandavu Logo"
                            className="w-24 h-auto sm:w-32"
                        />
                    </div>

                    <div>
                        <h1 className="text-2xl text-gray-700 font-bold text-center mb-2 cursor-pointer">Events</h1>
                    </div>
                    <p className="text-center text-sm text-gray-700 font-semibold mb-8">Add your providing events here</p>

                    {!events.length ? (
                        <div>
                            <div className="border-dashed border-2 border-gray-800 w-full h-40 rounded-lg flex items-center justify-center mb-10">
                                <button
                                    onClick={handleOpenModal}
                                    className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800 transition-all duration-300"
                                >
                                    + Add Events
                                </button>
                            </div>
                            <div>
                                <p className='text-center mb-4'>Four step Registraion</p>
                                <div className="w-full bg-gray-200 rounded-full">
                                    <div className={`bg-teal-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full`} style={{ width: progress }}> {progress}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-end items-center py-2 pr-2">
                                <button
                                    className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800 transition-colors duration-300 ease-in-out hover:shadow-lg"
                                    onClick={handleOpenModal}
                                >
                                    + Add Event
                                </button>
                            </div>
                            <div className="relative overflow-x-auto" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                <table className="w-full text-sm text-left rtl:text-right  text-gray-500 ">
                                    <thead className="text-xs text-white uppercase bg-gray-700 ">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Photo</th>
                                            <th scope="col" className="px-6 py-3">Event Name</th>
                                            <th scope="col" className="px-6 py-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {events.map((event, index) => (
                                            <tr key={index} className="bg-gray-100  border-b border-gray-400 ">
                                                <td className="px-6 py-4 font-medium  whitespace-nowrap text-white">
                                                    <img src={event.image} alt={event.name} className="w-12 h-12 object-cover rounded-lg border border-gray-400" />
                                                </td>
                                                <td className="px-6 py-4 text-gray-900">{event.name}</td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-800 transition-all duration-300"
                                                        onClick={() => handleDeleteEvent(index)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-center gap-4">
                                <button onClick={handleCancel} type="button" className="mt-6 w-24 bg-red-600 text-white py-2 rounded-lg hover:bg-red-800 transition-colors duration-300 ease-in-out hover:shadow-lg">
                                    cancel
                                </button>
                                <button onClick={handleNext} type="button" className="mt-6 w-24 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-800 transition-colors duration-300 ease-in-out hover:shadow-lg">
                                    Next
                                </button>
                            </div>

                            <div>
                                <p className='text-center mb-4 mt-6'>Four step Registraion</p>
                                <div className="w-full bg-gray-200 rounded-full">
                                    <div className={`bg-teal-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full`} style={{ width: progress }}> {progress}</div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

            </div>

            <AddEventModal
                showModal={showModal}
                handleCloseModal={handleCloseModal}
                formik={formik}
                handleImageChange={handleImageChange}
            />
        </>
    );
}
