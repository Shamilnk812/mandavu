import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navb from '../../Components/User/Navb';
import { loadStripe } from '@stripe/stripe-js';
export default function VenueBooking() {
    const { venueId } = useParams();
    const [venue, setVenue] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [bookingAmount, setBookingAmount] = useState(0);

    const stripePromise = loadStripe('pk_test_51Pk7W0InNBryIEQ5TM0E3lDkhnP8fVDez4nJsHBG5n0Rx0mhb6y1QNZKw8iotApyKCzccZ8pSFMnqD2V93MqF9bC00HrsiLp5u');
    
    const [bookingDetails, setBookingDetails] = useState({
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
    });

    useEffect(() => {
        const fetchVenueDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/v1/auth/single-venue-details/${venueId}/`);
                setVenue(response.data);
                setTotalAmount(response.data.price);
                setBookingAmount(response.data.price * 0.15)
            } catch (error) {
                console.error('Error fetching venue details:', error);
            }
        };

        fetchVenueDetails();
    }, [venueId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookingDetails({
            ...bookingDetails,
            [name]: value
        });
    };

    const handleFacilityChange = (e, facility) => {
        const { checked } = e.target;
        let updatedFacilities;
        if (checked) {
            updatedFacilities = [...bookingDetails.facilities, facility];
            const newTotal = totalAmount + (facility.price || 0)
            setTotalAmount(newTotal);
            setBookingAmount(totalAmount * 0.15)
        } else {
            updatedFacilities = bookingDetails.facilities.filter(f => f.id !== facility.id);
            const newTotal = totalAmount - (facility.price || 0);
            setTotalAmount(newTotal);
            setBookingAmount(newTotal * 0.15); 
        }
        setBookingDetails(prevState => ({
            ...prevState,
            facilities: updatedFacilities
        }));
    };



     
    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedBookingDetails = {
                    ...bookingDetails,
                    totalAmount,
                    bookingAmount,
                    venueName: venue?.name
                };
    
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/auth/create-checkout-session/', updatedBookingDetails);
    
            const { id } = response.data;
    
            const stripe = await stripePromise;
    
            const result = await stripe.redirectToCheckout({ sessionId: id });
    
            if (result.error) {
                console.error(result.error.message);
            }
        } catch (error) {
            console.error('Error booking venue:', error);
        }
    };






    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const updatedBookingDetails = {
    //         ...bookingDetails,
    //         totalAmount,
    //         bookingAmount,
    //         venueName: venue?.name
    //     };
        
    //     try {
    //         const response = await axios.post('http://127.0.0.1:8000/api/v1/auth/create-checkout-session/', updatedBookingDetails);
    //         console.log('Booking successful:', response.data);
    //         window.location.href = response.data.url; 
    //     } catch (error) {
    //         console.error('Error booking venue:', error);
    //     }
    // };

    const renderAirConditioningOptions = () => {
        if (!venue) return null;
        const options = [];
        if (venue.condition === 'Both' || venue.condition === 'AC') {
            options.push(<option key="ac" value="ac">A/C</option>);
        }
        if (venue.condition === 'Both' || venue.condition === 'NonAC') {
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
                    checked={bookingDetails.facilities.some(f => f.id === facility.id)}
                    onChange={(e) => handleFacilityChange(e, facility)}
                />
                <span className="ml-2">{facility.facility} - {facility.price ? `₹${facility.price}` : 'Included'}</span>
            </label>
        ));
    };

    const renderSelectedFacilities = () => {
        if (!venue) return null;
        const selectedFacilities = bookingDetails.facilities.map(f => (
            <p key={f.id} className="text-gray-700 mb-2">{f.facility} - ₹{f.price}</p>
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
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4">Booking Form</h2>
                            <form onSubmit={handleSubmit}>
                                {/* Form fields... */}
                                <div className="flex flex-wrap -mx-3 mb-4">
                                    <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">Full Name</label>
                                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" id="fullName" type="text" name="fullName" value={bookingDetails.fullName} onChange={handleChange} />
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" id="email" type="email" name="email" value={bookingDetails.email} onChange={handleChange} />
                                    </div>
                                </div>

                                {/* Other form fields... */}
                                <div className="flex flex-wrap -mx-3 mb-4">
                                    <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">Phone Number</label>
                                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" id="phoneNumber" type="text" name="phoneNumber" value={bookingDetails.phoneNumber} onChange={handleChange} />
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="additionalPhoneNumber">Additional Phone Number</label>
                                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" id="additionalPhoneNumber" type="text" name="additionalPhoneNumber" value={bookingDetails.additionalPhoneNumber} onChange={handleChange} />
                                    </div>
                                </div>

                                {/* More form fields... */}
                                <div className="flex flex-wrap -mx-3 mb-4">
                                    <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">City</label>
                                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" id="city" type="text" name="city" value={bookingDetails.city} onChange={handleChange} />
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">State</label>
                                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" id="state" type="text" name="state" value={bookingDetails.state} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullAddress">Full Address</label>
                                    <textarea className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" id="fullAddress" name="fullAddress" value={bookingDetails.fullAddress} onChange={handleChange}></textarea>
                                </div>

                                <div className="flex flex-wrap -mx-3 mb-4">
                                    <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="timeOfDay">Time of Day</label>
                                        <select className="block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" id="timeOfDay" name="timeOfDay" value={bookingDetails.timeOfDay} onChange={handleChange}>
                                            <option value="morning">Morning</option>
                                            <option value="evening">Evening</option>
                                        </select>
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">Date</label>
                                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" id="date" type="date" name="date" value={bookingDetails.date} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="airConditioning">Air Conditioning</label>
                                    <select className="block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" id="airConditioning" name="airConditioning" value={bookingDetails.airConditioning} onChange={handleChange}>
                                        <option value="">Select an option</option>
                                        {renderAirConditioningOptions()}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Facilities</label>
                                    {renderFacilities()}
                                </div>

                                <div className="flex justify-end">
                                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Book Now</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Side Summary */}
                    <div className="w-full md:w-5/12 px-4">
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4">Booking Summary</h2>
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold">Venue: {venue?.name}</h3>
                                <p className="text-gray-700">Price: ₹{venue?.price}</p>
                            </div>
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold">Selected Facilities</h3>
                                <span className='ml-2'>Auditorium Seat count  {venue?.name}</span>
                                {renderSelectedFacilities()}
                            </div>
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold">Total Amount</h3>
                                <p className="text-gray-700">₹{totalAmount}</p>
                                <h3 className="text-lg font-semibold mb-2">Booking Amount (15%): ₹{bookingAmount}</h3>
                                <p className="text-gray-700">You only need to pay 15% of the total amount to confirm your booking.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
