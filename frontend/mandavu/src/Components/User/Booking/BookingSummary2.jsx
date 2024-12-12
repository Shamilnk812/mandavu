import { useState, useEffect } from "react";
import { axiosUserInstance } from "../../../Utils/Axios/axiosInstance";
import { useSelector } from "react-redux";
import toPascalCase from "../../../Utils/Extras/ConvertToPascalCase";
import { loadStripe } from '@stripe/stripe-js';
import { toast } from "react-toastify";


import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import HeaderSectionOfBookingSummary from "./HeaderSectionOfBookingSummary";
import ShowSelectedAdditionalFacilities from "./ShowSelectedAdditionalFacilities";



export default function BookingSummary2({ venue, venueId, selectedDates, selectedTimeSlot, airConditionSelection, selectedFacilities, totalAmount, advanceAmount }) {

    // const [venue, setVenue] = useState(null);
    const stripePromise = loadStripe('pk_test_51Pk7W0InNBryIEQ5TM0E3lDkhnP8fVDez4nJsHBG5n0Rx0mhb6y1QNZKw8iotApyKCzccZ8pSFMnqD2V93MqF9bC00HrsiLp5u');
    // const neww = pk_test_51Pk7W0InNBryIEQ5TM0E3lDkhnP8fVDez4nJsHBG5n0Rx0mhb6y1QNZKw8iotApyKCzccZ8pSFMnqD2V93MqF9bC00HrsiLp5u

    const selectedEvent = useSelector((state) => state.user.selectedEvent)
    const selectedPackage = useSelector((state) => state.user.selectedPackage)
    const userBookingDetails = useSelector((state) => state.user.addressAndEventDetails)
    const [isChecked, setIsChecked] = useState(false)

    const userId = useSelector((state) => state.user.user?.id);

    console.log("venue deails ",venue)

    const handleSubmit = async () => {


        if (!selectedDates || selectedDates.length === 0) {
            toast.warning("Please select booking date.")
            return;
        }
        if (!selectedTimeSlot || selectedTimeSlot.length === 0) {
            toast.warning("Please select a booking time.")
            return;
        }
        if (!airConditionSelection) {
            toast.warning("Please select air conditioning options.")
            return
        }


        const bookingDetails = {
            ...userBookingDetails,
            email: "jacktest@gmail.com",
            dates: selectedDates,
            times: selectedTimeSlot,
            bookingAmount: totalAmount,
            date: "2024-12-12",
            timeOfDay: "morning",
            airConditioning: airConditionSelection,
            eventName: selectedEvent,
            bookingPackage: selectedPackage?.id,
            facilities: selectedFacilities,
            packageAmount: selectedPackage?.price,
            venueName: venue?.convention_center_name,
            venueId: venue?.id,
            userId: userId,
            totalAmount: totalAmount,
            advanceAmount: advanceAmount,

        }
        console.log("Submitted with ", bookingDetails)
        try {
            const response = await axiosUserInstance.post('create-checkout-session/', bookingDetails);

            const { id } = response.data;

            const stripe = await stripePromise;

            const result = await stripe.redirectToCheckout({ sessionId: id });

            if (result.error) {
                console.error(result.error.message);
            }
        } catch (error) {
            console.error('Error booking venue:', error);
            toast.error("Something went wrong. Please try again later.")
        }
    }








    return (
        <>


            <div className="w-full md:w-5/12 px-4">
                <div className="p-6 bg-customColor8 rounded-lg shadow-xl border border-gray-200">

                    {/* Header Section */}
                    <HeaderSectionOfBookingSummary venue={venue} />


                    {/* Section for showing selected facilities  */}

                    {selectedFacilities.length > 0 && (
                        <ShowSelectedAdditionalFacilities selectedFacilities={selectedFacilities} />
                    )}





                    <div>
                        <div className="flex items-start bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition">
                            <div className="mx-4  w-full">
                                <div className="flex justify-center bg-gradient-to-r from-teal-500 to-gray-800 rounded-lg py-1 mb-4">
                                    <h4 className="text-lg text-white font-semibold ">
                                        Selected Event & Package
                                    </h4>
                                </div>




                                {/* Event and Package Details */}
                                <div className="flex justify-between text-gray-600 text-base mt-1">
                                    <span className="font-semibold">Event:</span>
                                    <span>{toPascalCase(selectedEvent)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-base mt-1 font-medium">
                                    <span className="font-semibold">Package:</span>
                                    <span>{toPascalCase(selectedPackage?.package_name || "packge name")}</span>
                                </div>




                                {selectedDates.length > 0 && (
                                    <div className="mt-2">
                                        <span className="font-semibold text-gray-600">Dates:</span>
                                        <ul className="mt-2 space-y-2 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 px-4 py-2">
                                            {selectedDates.map((date, index) => (
                                                <li
                                                    key={index}
                                                    className="flex justify-between items-center  text-gray-700 "
                                                >
                                                    <span className="text-base font-medium text-gray-600"></span>
                                                    <span className="text-base font-semibold text-gray-800">
                                                        {new Date(date).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "2-digit",
                                                            year: "numeric",
                                                        })}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}




                                {selectedTimeSlot.length > 1 ? (
                                    <div className="mt-4">
                                        <span className="font-semibold text-gray-600">Time Slots:</span>
                                        <ul className="mt-2 space-y-2 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 px-4 py-2">
                                            {selectedTimeSlot.map((slot, index) => (
                                                <li
                                                    key={index}
                                                    className="flex justify-between items-center text-gray-700"
                                                >
                                                    <span className="text-base font-medium text-gray-600"></span>
                                                    <span className="text-base font-semibold text-gray-800">
                                                        {slot[0]} - {slot[1]}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    selectedTimeSlot.length === 1 && (
                                        <div className="flex justify-between text-gray-600 text-base mt-4 font-medium">
                                            <span className="font-semibold">Time:</span>
                                            <span>
                                                {selectedTimeSlot}
                                            </span>
                                        </div>
                                    )
                                )}

                                {airConditionSelection === 'AC' && (
                                    <div className="flex justify-between text-gray-600 text-base mt-1 font-medium">
                                        <span className="font-semibold">Air Condition:</span>
                                        {/* add date */}
                                        <span>₹{selectedPackage.extra_price_for_aircondition} </span>
                                    </div>

                                )}



                                <div className="flex justify-between text-gray-600 text-base mt-1 font-medium">
                                    <span className="font-semibold">Packge Amount:</span>
                                    <span>₹{Number(selectedPackage.price)} </span>
                                </div>

                                <div className="flex justify-between text-gray-600 text-base mt-1 font-medium">
                                    <span className="font-semibold">Total Amount:</span>
                                    <span>₹{Number(totalAmount)}</span>
                                </div>

                                <div className="flex justify-between text-gray-600 text-base mt-1 font-medium">
                                    <span className="font-semibold">Remaining Amount:</span>
                                    <span>₹{Number(totalAmount - advanceAmount)}</span>
                                </div>


                                <div className="flex justify-between text-gray-600 text-lg mt-3 font-medium">
                                    <span className="font-semibold">Advance Amount:</span>
                                    <span>₹{advanceAmount}</span>
                                </div>


                                <p className="mt-12 text-sm text-teal-600 font-semibold italic bg-teal-50 p-2 rounded-lg border border-teal-300">
                                    * You need to pay 15% of the total amount to book the  venue. (Advance Amount)
                                </p>



                            </div>
                        </div>
                    </div>



                    {/* sectoin check box  */}





                    {/* Agreement Checkbox */}
                    <div className="flex items-center justify-center mt-8">
                        <input
                            type="checkbox"
                            id="agreeTerms"
                            // className="mr-2"
                            className="w-4 h-4 mr-2 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                        />
                        <label htmlFor="agreeTerms" className="text-gray-700 text-sm">
                            I have read and agree to the{' '}
                            <a
                                href={venue?.terms_and_conditions}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-600 font-semibold hover:underline"
                            >
                                Venue Rules
                            </a>{' '}
                            and{' '}
                            <a
                                href="/path-to-refund-policy.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-600 font-semibold hover:underline"
                            >
                                Refund Policy
                            </a>.
                        </label>
                    </div>



                    <div className="mt-2 mb-8 flex justify-center">
                        <button

                            type="submit"
                            className={`w-3/4 py-3 font-bold rounded-lg transition duration-300 
                                ${isChecked ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}                            onClick={handleSubmit}
                            disabled={!isChecked}
                        >
                            Proceed To Payment <ArrowCircleRightIcon />
                        </button>
                    </div>
                </div>
            </div>



        </>
    )
}





