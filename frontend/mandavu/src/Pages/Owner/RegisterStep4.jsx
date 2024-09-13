import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import AddFacilityModal2 from "../../Components/Owner/AddFacilityModal2";
import { toast } from "react-toastify";
import axios from "axios";
import AddFacilitySchema from "../../Validations/Owner/AddFacilitySchema";
import { axiosOwnerInstance } from "../../Utils/Axios/axiosInstance";




export default function RegistrationStep4() {
    const [showModal, setShowModal] = useState(false);
    const [facilities, setFacilities] = useState([]);
    const registrationData = JSON.parse(sessionStorage.getItem('registrationData')) || {};
    const progress = registrationData.progress;
    const navigate = useNavigate();

    useEffect(() => {
        const registrationData = JSON.parse(sessionStorage.getItem('registrationData')) || {};
        if (!registrationData || registrationData.step_1 !== 'completed' || registrationData.step_2 !== 'completed' || registrationData.step_3 !== 'completed') {
            toast.error('Please complete Previous steps')
            navigate('/owner/register-step-1');
        } else if (registrationData.facilities) {
            setFacilities(registrationData.facilities);
        }
    }, [navigate]);


    const formik = useFormik({
        initialValues: {
            facility: '',
            price: 'FREE',
        },
        validationSchema: AddFacilitySchema,
        onSubmit: (values, { resetForm }) => {
            const newFacility = {
                facility: values.facility,
                price: values.price === 'FREE' ? 'FREE' : values.price,
            };

            // Update the facilities state
            setFacilities((prevFacilities) => {
                const updatedFacilities = [...prevFacilities, newFacility];

                // Update the registrationData in session storage
                const registrationData = JSON.parse(sessionStorage.getItem('registrationData'));
                registrationData.facilities = updatedFacilities;
                sessionStorage.setItem('registrationData', JSON.stringify(registrationData));

                return updatedFacilities;
            });

            resetForm();
            setShowModal(false);
            toast.success('New facility added successfully');
        },
    });

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        formik.resetForm();
    };

    const handleDeleteEvent = (indexToDelete) => {
        setFacilities((prevFacilities) => {
            const updatedFacilities = prevFacilities.filter((_, index) => index !== indexToDelete);

            // Update the registrationData in session storage
            const registrationData = JSON.parse(sessionStorage.getItem('registrationData'));
            registrationData.facilities = updatedFacilities;
            sessionStorage.setItem('registrationData', JSON.stringify(registrationData));

            return updatedFacilities;
        });
        toast.success('Facility successfully cancelled');
    };

    const handleCancel = () => {
        sessionStorage.removeItem('registrationData'); // Remove registration data from sessionStorage
        navigate('/owner/signup'); // Navigate to the owner signup page
      };
    
      const splitAndSendData = async () => {
        const registrationData = JSON.parse(sessionStorage.getItem('registrationData')) || {};
    
        // Prepare the data
        const formData = {
            owner: {
                first_name: registrationData.first_name,
                last_name: registrationData.last_name,
                email: registrationData.email,
                phone: registrationData.phone,
                phone2: registrationData.phone2,
                id_proof: registrationData.id_proof,  
                password: registrationData.password,
                password2: registrationData.password2,
            },
            venue: {
                convention_center_name: registrationData.convention_center_name,
                short_description: registrationData.short_description,
                description: registrationData.description,
                dining_seat_count: registrationData.dining_seat_count,
                auditorium_seat_count: registrationData.auditorium_seat_count,
                condition: registrationData.condition,
                state: registrationData.state,
                price: registrationData.price,
                district: registrationData.district,
                city: registrationData.city,
                pincode: registrationData.pincode,
                address: registrationData.full_address,
                terms_and_conditions: registrationData.terms_conditions, // Assuming it's base64 encoded
                venue_license: registrationData.venue_license, // Assuming it's base64 encoded
            },
            venue_images: registrationData.venue_images, // Array of image blobs or URLs
            events: registrationData.events, // Array of events
            facilities: registrationData.facilities, // Array of facilities
        };
    
        try {
            
            const response = await axiosOwnerInstance.post('register/', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            toast.success(response.data.message || 'Registration successful!');
            localStorage.setItem('email', registrationData.email);
            sessionStorage.removeItem('registrationData');
            navigate('/owner/otp');

            // Handle success, maybe navigate to another page or show a success message
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'An error occurred during registration.';
            toast.error(errorMessage);
            console.error('Error during registration:', error);
            
        }
    };  


    const handleRegister = () => {
        splitAndSendData();
    };
    
    return (
        <>
            <div className="min-h-screen bg-teal-600 flex justify-center items-center">
                <div className="absolute w-60 h-60 rounded-xl bg-teal-500 -top-5 -left-16 z-0 transform rotate-45 hidden md:block"></div>
                <div className="py-12 px-12 w-1/2 bg-white rounded-2xl shadow-xl z-20">
                    <div>
                        <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">Facilities</h1>
                    </div>
                    <p className="text-center text-sm text-gray-700 font-semibold mb-8">Add your providing facilities here</p>

                    {!facilities.length ? (
                        <div>
                        <div className="border-dashed border-2 border-gray-800 w-full h-40 rounded-lg flex items-center justify-center mb-10">
                            <button
                                onClick={handleOpenModal}
                                className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800"
                            >
                                + Add Facility
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
                            <div className="flex justify-end items-center py-4 pr-2">
                                <button
                                    className=" bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800 transition-colors duration-300 ease-in-out hover:shadow-lg"
                                    onClick={handleOpenModal}
                                >
                                    + Add
                                </button>
                            </div>
                            <div className="relative overflow-x-auto" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-white uppercase bg-gradient-to-r from-teal-500 to-gray-800 dark:bg-gradient-to-r from-teal-500 to-gray-800 dark:text-white">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Facility</th>
                                            <th scope="col" className="px-6 py-3">Price</th>
                                            <th scope="col" className="px-6 py-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {facilities.map((facility, index) => (
                                            <tr key={index} className="bg-customColor8 border-b border-gray-300 dark:bg-customColor8 dark:border-gray-400">
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-900">
                                                    {facility.facility}
                                                </td>
                                                <td className="px-6 py-4 text-gray-900">{facility.price}</td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-800 "
                                                        onClick={() => handleDeleteEvent(index)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-center gap-4 mt-6">
                                <button 
                                    type="button" 
                                    onClick={handleCancel}
                                    className="mt-6 w-24 bg-red-600 text-white py-2 rounded-lg hover:bg-red-800 transition-colors duration-300 ease-in-out hover:shadow-lg"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleRegister}
                                    className="mt-6 w-24 bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-800 transition-colors duration-300 ease-in-out hover:shadow-lg"
                                >
                                    Register
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
                <div className="w-40 h-40 absolute bg-teal-500 rounded-full top-0 right-12 hidden md:block"></div>
                <div className="w-20 h-40 absolute bg-teal-500 rounded-full bottom-20 left-10 transform rotate-45 hidden md:block"></div>
            </div>
                
            <AddFacilityModal2 
                showModal={showModal}
                handleCloseModal={handleCloseModal}
                formik={formik}
            />
        </>
    );
}
