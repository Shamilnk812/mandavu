import { useFormik } from "formik";
import { forwardRef, useImperativeHandle } from "react";
import BookingForm1Schema from "../../../Validations/User/BookingForm1Schema";
import { useDispatch } from "react-redux";
import { setBookingDetails } from "../../../Redux/Slices/User";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { toast } from "react-toastify";

const BookingFormForAddress = forwardRef((props, ref) => {

    const { venueId } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const formik = useFormik({
        initialValues: {
            fullName: '',
            phoneNumber: '',
            additionalPhoneNumber: '',
            city: '',
            state: '',
            pincode: '',
            fullAddress: '',
            eventDetails: '',
        },
        validationSchema: BookingForm1Schema,
        onSubmit: async (values) => {
            // console.log("Submitted with ", values);
            const {pincode, state} = values

            try{
                const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`)
                const data = response.data[0];

                if (data.Status !== 'Success' || !data.PostOffice || data.PostOffice.length === 0) {
                    toast.error('Invalid Pincode. Please enter a valid one.');
                    return;
                }

                const pincodeState = data.PostOffice[0].State.toLowerCase().trim();
                const enteredState = state.toLowerCase().trim();

                if (pincodeState !== enteredState) {
                    toast.error(`Entered state doesn't match any  pincode.`);
                    return;
                }

                dispatch(setBookingDetails({addressAndEventDetails: values,}))
                // navigate(`/user/venue-booking-step1/${venueId}`)
                navigate(`/user/venue-booking-step2/${venueId}`)
            }catch(error){
                toast.error('Failed to validate pincode. Please try again.');
                console.error(error);
            }

        },
    });

    useImperativeHandle(ref, () => ({
        submitForm: () => {
            formik.handleSubmit(); // Expose Formik's handleSubmit
        },
    }));

    return (
        <div className="w-full md:w-7/12 px-4 mb-6 md:mb-0">
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl bg-gradient-to-r from-teal-600 to-gray-800 rounded-lg py-2 text-center text-white font-semibold mb-4">Booking Form</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="fullName">Full Name</label>
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
                        <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="phoneNumber">Phone Number</label>
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
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                        
                        <div className="w-full md:w-1/2 px-3">
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="additionalPhoneNumber">Additional Phone Number</label>
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
                        <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="city">City</label>
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
                        
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                        
                        <div className="w-full md:w-1/2 px-3">
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="state">State</label>
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
                        <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="pincode">Pincode</label>
                            <input
                                className="appearance-none block w-full bg-customColor7 text-gray-700 border rounded-lg py-3 px-4 leading-tight focus:outline-teal-500 focus:bg-white"
                                id="pincode"
                                type="text"
                                name="pincode"
                                value={formik.values.pincode}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.pincode && formik.errors.pincode ? (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.pincode}</div>
                            ) : null}
                        </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full px-3">
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="fullAddress">Full Address</label>
                            <textarea
                                className="appearance-none block w-full bg-customColor7 text-gray-700 border rounded-lg py-3 px-4 leading-tight focus:outline-teal-500 focus:bg-white"
                                id="fullAddress"
                                rows="3"
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
                        <div className="w-full px-3">
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="eventDetails">Event Details</label>
                            <textarea
                                className="appearance-none block w-full bg-customColor7 text-gray-700 border rounded-lg py-3 px-4 leading-tight focus:outline-teal-500 focus:bg-white"
                                id="eventDetails"
                                rows="3"
                                name="eventDetails"
                                value={formik.values.eventDetails}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.eventDetails && formik.errors.eventDetails ? (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.eventDetails}</div>
                            ) : null}
                        </div>
                    </div>



                </form>
            </div>
        </div>
    );
});

export default BookingFormForAddress;



