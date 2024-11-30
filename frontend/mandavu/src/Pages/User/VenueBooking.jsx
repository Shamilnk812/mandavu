import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { axiosUserInstance } from '../../Utils/Axios/axiosInstance';
import Navb from '../../Components/User/Navb';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

export default function VenueBooking() {
    const { venueId } = useParams();
    const navigate = useNavigate();
    const userId = useSelector((state) => state.user.user?.id);
    const [venue, setVenue] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [bookingAmount, setBookingAmount] = useState(0);
    const [bookedDates, setBookedDates] =useState([])

    const stripePromise = loadStripe('pk_test_51Pk7W0InNBryIEQ5TM0E3lDkhnP8fVDez4nJsHBG5n0Rx0mhb6y1QNZKw8iotApyKCzccZ8pSFMnqD2V93MqF9bC00HrsiLp5u');

    useEffect(() => {
        const fetchVenueDetails = async () => {
            try {
                const response = await axiosUserInstance.get(`single-venue-details/${venueId}/`);
                setVenue(response.data);
                console.log(response.data)
                setTotalAmount(response.data.price);
                setBookingAmount(response.data.price * 0.15);
            } catch (error) {
                console.error('Error fetching venue details:', error);
            }
        };

        fetchVenueDetails();
    }, [venueId]);

    useEffect(()=> {
        const fetchBookedDates = async ()=> {
            try{
                const response = await axiosUserInstance.get(`booking-details/${venueId}`);
                const bookedDatesArray = response.data.map(booking => booking.start);
                setBookedDates(bookedDatesArray);
                
            }catch(error) {
                console.log('Something Wnet Worng ')
            }
        }
        fetchBookedDates()
    },[venueId])


  

    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            phoneNumber: '',
            additionalPhoneNumber: '',
            city: '',
            state: '',
            fullAddress: '',
            airConditioning: '',
            timeOfDay: 'morning',
            date: '',
            facilities: []
        },
        validationSchema: Yup.object({
            fullName: Yup.string().matches(/^[A-Za-z ]*$/, 'Only alphabets are allowed').required('Full Name is required'),
            email: Yup.string().email('Invalid email format').required('Email is required'),
            phoneNumber: Yup.string().matches(/^[0-9]{10}$/, 'Must be exactly 10 digits').required('Phone Number is required'),
            additionalPhoneNumber: Yup.string().matches(/^[0-9]{10}$/, 'Must be exactly 10 digits').required('Additional Phone Number is required'),
            city: Yup.string().matches(/^[A-Za-z ]*$/, 'Only alphabets are allowed').required('City is required'),
            state: Yup.string().matches(/^[A-Za-z ]*$/, 'Only alphabets are allowed').required('State is required'),
            fullAddress: Yup.string().required('Full Address is required'),
            airConditioning: Yup.string().required('Air Conditioning is required'),
            timeOfDay: Yup.string().required('Time of Day is required'),
            date: Yup.string().required('Date is required').test(
                'is-valid-date',
                'Please enter a valid date',
                function (value) {
                    const today = new Date();
                    const selectedDate = new Date(value);
                    return selectedDate > today;
                }
            ),
        
        }),
        onSubmit: async (values) => {
            if (bookedDates.includes(values.date)) {
                toast.error("This date is already booked. Please check veiw slot calandar.");
                return;
            }
            const updatedFacilities = values.facilities.map(facility => 
                `${facility.facility} - ${facility.price}`
            );

            const updatedBookingDetails = {
                ...values,
                totalAmount,
                bookingAmount,
                venueName: venue?.convention_center_name,
                venueId: venue?.id,
                userId: userId,
                facilities: updatedFacilities
            };

            try {
                const response = await axiosUserInstance.post('create-checkout-session/', updatedBookingDetails);

                const { id } = response.data;

                const stripe = await stripePromise;

                const result = await stripe.redirectToCheckout({ sessionId: id });

                if (result.error) {
                    console.error(result.error.message);
                }
            } catch (error) {
                console.error('Error booking venue:', error);
            }
        }
    });

    // const handleFacilityChange = (e, facility) => {
    //     const { checked } = e.target;

    //     let updatedFacilities;
    //     if (checked) {
    //         updatedFacilities = [...formik.values.facilities, facility];
    //         const newTotal = totalAmount + (facility.price || 0);
    //         setTotalAmount(newTotal);
    //         setBookingAmount(newTotal * 0.15);
    //     } else {
    //         updatedFacilities = formik.values.facilities.filter(f => f.id !== facility.id);
    //         const newTotal = totalAmount - (facility.price || 0);
    //         setTotalAmount(newTotal);
    //         setBookingAmount(newTotal * 0.15);
    //     }
    //     formik.setFieldValue('facilities', updatedFacilities);
    // };

    const handleFacilityChange = (e, facility) => {
        const { checked } = e.target;
    
        // Convert the facility price to a number; if "FREE", treat it as 0
        const facilityPrice = facility.price === "FREE" ? 0 : parseFloat(facility.price);
    
        let updatedFacilities;
        if (checked) {
            updatedFacilities = [...formik.values.facilities, facility];
            const newTotal = totalAmount + (facilityPrice || 0);
            setTotalAmount(newTotal);
            setBookingAmount(newTotal * 0.15);
        } else {
            updatedFacilities = formik.values.facilities.filter(f => f.id !== facility.id);
            const newTotal = totalAmount - (facilityPrice || 0);
            setTotalAmount(newTotal);
            setBookingAmount(newTotal * 0.15);
        }
        formik.setFieldValue('facilities', updatedFacilities);
    };

    const renderAirConditioningOptions = () => {
        if (!venue) return null;
        const options = [];
        if (venue.condition === 'Both' || venue.condition === 'AC') {
            options.push(<option key="ac" value="ac">A/C</option>);
        }
        if (venue.condition === 'Both' || venue.condition === 'Non AC') {
            options.push(<option key="nonac" value="nonac">Non A/C</option>);
        }
        return options;
    };

    const renderFacilities = () => {
        if (!venue) return null;
        return venue.facilities.map(facility => (
            <label key={facility.id} className="inline-flex items-center w-full mb-2">
                <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={formik.values.facilities.some(f => f.id === facility.id)}
                    onChange={(e) => handleFacilityChange(e, facility)}
                />
                <span className="ml-2">{facility.facility} - {facility.price ? `₹${facility.price}` : 'Included'}</span>
            </label>
        ));
    };

    
    const renderSelectedFacilities = () => {
        if (!venue) return null;
        const selectedFacilities = formik.values.facilities.map(f => (
            <div key={f.id} className="flex justify-between items-center mb-2">
                <span className='text-gray-500'>{f.facility}</span>
                <span className="font-semi-bold">₹{f.price}</span>
            </div>
        ));
        return selectedFacilities;
    };
     

    return (
        <>
            <Navb />
            <div className="container mx-auto max-w-screen-xl px-4 py-6">
                <div className="flex flex-wrap -mx-4">
                    {/* Left Side Form */}
                    <div className="w-full md:w-7/12 px-4 mb-6 md:mb-0">
                        <div className="p-6 bg-customColor8 rounded-lg shadow-md">
                            <h2 className="text-2xl bg-gradient-to-r from-teal-500 to-gray-800 rounded-lg py-2 text-center text-white font-semibold mb-4">Booking Form</h2>
                            <form onSubmit={formik.handleSubmit}>
                                {/* Form fields... */}
                                <div className="flex flex-wrap -mx-3 mb-4">
                                    <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">Full Name</label>
                                        <input
                                            className="appearance-none block w-full bg-customColor7 text-gray-700 border rounded-lg py-3 px-4 leading-tight focus:outline-teal-500 focus:bg-white"
                                            id="fullName"
                                            type="text"
                                            name="fullName"
                                            value={formik.values.fullName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.fullName && formik.errors.fullName ? (
                                            <div className="text-red-500 text-xs mt-1">{formik.errors.fullName}</div>
                                        ) : null}
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                                        <input
                                            className="appearance-none block w-full bg-customColor7 text-gray-700 border rounded-lg py-3 px-4 leading-tight focus:outline-teal-500 focus:bg-white"
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.email && formik.errors.email ? (
                                            <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Other form fields... */}
                                <div className="flex flex-wrap -mx-3 mb-4">
                                    <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">Phone Number</label>
                                        <input
                                            className="appearance-none block w-full bg-customColor7 text-gray-700 border rounded-lg py-3 px-4 leading-tight focus:outline-teal-500 focus:bg-white"
                                            id="phoneNumber"
                                            type="text"
                                            name="phoneNumber"
                                            value={formik.values.phoneNumber}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                                            <div className="text-red-500 text-xs mt-1">{formik.errors.phoneNumber}</div>
                                        ) : null}
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="additionalPhoneNumber">Additional Phone Number</label>
                                        <input
                                            className="appearance-none block w-full bg-customColor7 text-gray-700 border rounded-lg py-3 px-4 leading-tight focus:outline-teal-500 focus:bg-white"
                                            id="additionalPhoneNumber"
                                            type="text"
                                            name="additionalPhoneNumber"
                                            value={formik.values.additionalPhoneNumber}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.additionalPhoneNumber && formik.errors.additionalPhoneNumber ? (
                                            <div className="text-red-500 text-xs mt-1">{formik.errors.additionalPhoneNumber}</div>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Continue with other form fields and the rest of your form... */}
                                <div className="flex flex-wrap -mx-3 mb-4">
                                    <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">City</label>
                                        <input
                                            className="appearance-none block w-full bg-customColor7 text-gray-700 border rounded-lg py-3 px-4 leading-tight focus:outline-teal-500 focus:bg-white"
                                            id="city"
                                            type="text"
                                            name="city"
                                            value={formik.values.city}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.city && formik.errors.city ? (
                                            <div className="text-red-500 text-xs mt-1">{formik.errors.city}</div>
                                        ) : null}
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">State</label>
                                        <input
                                            className="appearance-none block w-full bg-customColor7 text-gray-700 border rounded-lg py-3 px-4 leading-tight focus:outline-teal-500 focus:bg-white"
                                            id="state"
                                            type="text"
                                            name="state"
                                            value={formik.values.state}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.state && formik.errors.state ? (
                                            <div className="text-red-500 text-xs mt-1">{formik.errors.state}</div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="flex flex-wrap -mx-3 mb-4">
                                    <div className="w-full px-3">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullAddress">Full Address</label>
                                        <input
                                            className="appearance-none block w-full bg-customColor7 text-gray-700 border rounded-lg py-3 px-4 leading-tight focus:outline-teal-500 focus:bg-white"
                                            id="fullAddress"
                                            type="text"
                                            name="fullAddress"
                                            value={formik.values.fullAddress}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.fullAddress && formik.errors.fullAddress ? (
                                            <div className="text-red-500 text-xs mt-1">{formik.errors.fullAddress}</div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="flex flex-wrap -mx-3 mb-4">
                                    <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="airConditioning">Air Conditioning</label>
                                        <select
                                            className="appearance-none block w-full bg-customColor7 text-gray-700 border rounded-lg py-3 px-4 leading-tight focus:outline-teal-500 focus:bg-white"
                                            id="airConditioning"
                                            name="airConditioning"
                                            value={formik.values.airConditioning}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        >
                                            <option value="" label="Select option" />
                                            {renderAirConditioningOptions()}
                                        </select>
                                        {formik.touched.airConditioning && formik.errors.airConditioning ? (
                                            <div className="text-red-500 text-xs mt-1">{formik.errors.airConditioning}</div>
                                        ) : null}
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="timeOfDay">Time of Day</label>
                                        <select
                                            className="appearance-none block w-full bg-customColor7 text-gray-700 border rounded-lg py-3 px-4 leading-tight focus:outline-teal-500 focus:bg-white"
                                            id="timeOfDay"
                                            name="timeOfDay"
                                            value={formik.values.timeOfDay}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        >
                                            <option value="morning">Morning</option>
                                            <option value="afternoon">Afternoon</option>
                                            <option value="evening">Evening</option>
                                            <option value="night">Night</option>
                                        </select>
                                        {formik.touched.timeOfDay && formik.errors.timeOfDay ? (
                                            <div className="text-red-500 text-xs mt-1">{formik.errors.timeOfDay}</div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="flex flex-wrap -mx-3 mb-4">
                                    <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">Date</label>
                                        <input
                                            className="appearance-none block w-full bg-customColor7 text-gray-700 border rounded-lg py-3 px-4 leading-tight focus:outline-teal-500 focus:bg-white"
                                            id="date"
                                            type="date"
                                            name="date"
                                            value={formik.values.date}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.date && formik.errors.date ? (
                                            <div className="text-red-500 text-xs mt-1">{formik.errors.date}</div>
                                        ) : null}
                                        
                                    </div>
                                    <div className="w-full md:w-1/2 px-3 flex items-end">
                                            <button onClick={()=> navigate(`/user/view-slot/${venue.id}`)} className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 4h10M3 11h18M5 19h14m-1-8H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2z" />
                                            </svg>
                                            View Slot
                                        </button>
                                        
                                    </div>
                                </div>



{/* 
                                <div className="flex flex-wrap -mx-3 mb-4">
                                    <div className="w-full px-3">
                                        
                                    </div>
                                </div> */}

                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="w-full px-3">
                                        <label className="block text-gray-700 text-md font-bold mb-2">Add Additional Facilities</label>
                                        {renderFacilities()}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end">
                                    <button
                                        className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800"
                                        type="submit"
                                    >
                                        Book Venue
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                 
                     <div className="w-full md:w-5/12 px-4">
                    <div className="p-6 bg-customColor8 rounded-lg shadow-md">
                        <div className="flex items-center mb-4">
                            <img src={
                                    venue && venue.images && venue.images.length > 0
                                        ? venue.images[0].venue_photo 
                                        : 'path/to/placeholder-image.jpg' 
                                } alt="Venue" className="w-16 h-16 rounded mr-4" />
                            <h2 className="text-2xl font-semibold">Booking Summary</h2>
                        </div>
                        <p className="text-lg font-bold mb-2">{venue?.name} </p>
                        <h3 className="text-xl font-semibold mb-4">Selected Facilities</h3>
                        <div>
                        <div className="flex justify-between items-center mb-2">
                                    <span className='text-gray-500'>Dining hall {venue?.dining_seat_count} - Auditorium  {venue?.auditorium_seat_count} seat</span>
                                    
                                    <span className='text-gray-500' >Included</span>
                                </div>
                            {renderSelectedFacilities()}</div>

                        <div className="flex justify-between items-center mt-4">
                            <span className="text-lg font-semi-bold">Venue Price</span>
                            <span className="text-lg font-bold">₹ {venue?.price}</span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-lg font-semi-bold">Total Amount</span>
                            <span className="text-lg font-bold">₹{totalAmount}</span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-lg font-bold">Booking Amount (15%)</span>
                            <span className="text-xl font-bold">₹{bookingAmount.toFixed(2)}</span>
                        </div>
                        <p className="mt-2 text-teal-500 font-bold">* You only need to pay 15% of the total amount to book the venue.</p>
                    </div>
                </div> 






                </div>
            </div>
        </>
    );
}
