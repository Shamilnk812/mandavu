import { useState,useEffect } from "react";
import { axiosUserInstance } from "../../../Utils/Axios/axiosInstance";
import { useSelector } from "react-redux";
import toPascalCase from "../../../Utils/Extras/ConvertToPascalCase";
import { loadStripe } from '@stripe/stripe-js';


import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';



export default function BookingSummary2({venue,venueId,selectedDates, selectedTimeSlot , airConditionSelection, selectedFacilities,totalAmount, advanceAmount}){

    // const [venue, setVenue] = useState(null);
    const stripePromise = loadStripe('pk_test_51Pk7W0InNBryIEQ5TM0E3lDkhnP8fVDez4nJsHBG5n0Rx0mhb6y1QNZKw8iotApyKCzccZ8pSFMnqD2V93MqF9bC00HrsiLp5u');
    // const neww = pk_test_51Pk7W0InNBryIEQ5TM0E3lDkhnP8fVDez4nJsHBG5n0Rx0mhb6y1QNZKw8iotApyKCzccZ8pSFMnqD2V93MqF9bC00HrsiLp5u

    const selectedEvent = useSelector((state)=> state.user.selectedEvent)
    const selectedPackage = useSelector((state)=> state.user.selectedPackage)
    const userBookingDetails = useSelector((state)=> state.user.addressAndEventDetails)
    const [isExpanded, setIsExpanded] = useState(false)
    
    const userId = useSelector((state) => state.user.user?.id);



    const handleSubmit =  async()=> {
         

        const bookingDetails = {
            ...userBookingDetails,
            email:"jacktest@gmail.com",
            dates: selectedDates,
            times: selectedTimeSlot,
            bookingAmount: totalAmount,
            date:"2024-12-12",
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
        console.log("Submitted with ",bookingDetails)
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
        }
    }
   







    return(
        <>



           
            {/* <div className="w-full md:w-5/12 px-4">
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

                            </div>

                        <div className="flex justify-between items-center mt-4">
                            <span className="text-lg font-semi-bold">Venue Price</span>
                            <span className="text-lg font-bold">₹ </span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-lg font-semi-bold">Total Amount</span>
                            <span className="text-lg font-bold">₹</span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-lg font-bold">Booking Amount (15%)</span>
                            <span className="text-xl font-bold">₹</span>
                        </div>
                        <p className="mt-2 text-teal-500 font-bold">* You only need to pay 15% of the total amount to book the venue.</p>
                    </div>



                </div>  */}


<div className="w-full md:w-5/12 px-4">
                <div className="p-6 bg-customColor8 rounded-lg shadow-xl border border-gray-200">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold text-gray-600">Booking Summary</h2>
                        <span className="text-sm text-gray-500 italic">
                            {new Date().toLocaleDateString()}
                        </span>
                    </div>

                    {/* Venue Details */}
                    <div className="mb-6">
                        <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-sm">
                            <img
                                src={
                                    venue?.images?.length > 0
                                        ? venue.images[0].venue_photo
                                        : "https://via.placeholder.com/300x200"
                                }
                                alt="Venue"
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                            <div className="absolute bottom-2 left-4 text-white">
                                <h3 className="text-xl font-semibold">
                                    {toPascalCase(venue?.convention_center_name || 'Default Venue Name')}
                                </h3>
                            </div>
                        </div>
                    </div>
                    
                 {selectedFacilities.length > 0 && (
                
                <>
                    {/* SELECTED FACILITIES  */}
                    <div>
                        <div className="flex items-start bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition mb-4">
                            <div className="mx-4  w-full">
                                <div className="flex justify-center  to-gray-800 rounded-lg py-1 mb-4">
                                    <h4 className="text-lg text-gray-900 font-semibold ">
                                        Additional Facilities
                                    </h4>
                                </div>
                                 
                                 {/* RENDER FACILITIES */}
                                

                                {selectedFacilities.length > 0 ? (
                        <div>
                           
                            <div className="mt-2">
                                {selectedFacilities.map((facility) => (
                                    <div
                                        key={facility.id}
                                        className="flex justify-between items-center py-2 border-b border-gray-200"
                                    >
                                        <span className="text-sm text-gray-700">
                                            {facility.facility}
                                        </span>
                                        <span className="text-sm font-medium text-gray-700">
                                            ₹{facility.price}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No facilities selected.</p>
                    )}

                                </div>
                                </div>
                                </div>
                                </>
                )}



                    {/* SECTION 1  */}
                      
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
                                {/* {selectedTimeSlot && (
                                     <div className="flex justify-between text-gray-600 text-base mt-4 font-medium">
                                     <span className="font-semibold">Time:</span>
                                     <span>{selectedTimeSlot}</span>
                                 </div>
 
                                )} */}




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
 
                                ) }
                                 


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



                        {/* {selectedFacilities.map((facility)=> {
                            <span >{facility.facility}</span>
                        })} */}

                                

                               
                                
                            </div>
                        </div>
                    </div>





           




                  

                    <div className="mt-8 flex justify-center">
                    <button 
                    
                    type="submit"
                    className="w-3/4 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition duration-300"
                    onClick={handleSubmit}
                    >
                        Proceed To Payment<ArrowCircleRightIcon/>
                    </button>
                </div>
                </div>
            </div>



        </>
    )
}







// booking summary 


  {/* Booking Details */}
//   <div>
//   <div className="flex items-start bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition mt-10">
//       <div className="mx-4  w-full">
//           <div className="flex justify-center bg-gradient-to-r from-teal-500 to-gray-800 rounded-lg py-1 mb-4">
//               <h4 className="text-lg text-white font-semibold ">
//                   Selected Event & Package
//               </h4>
//           </div>

//           <div className="flex justify-between text-gray-600 text-base mt-1">
//               <span className="font-semibold">Event:</span>
//               <span>{toPascalCase(selectedEvent)}</span>
//           </div>
//           <div className="flex justify-between text-gray-600 text-base mt-1 font-medium">
//               <span className="font-semibold">Package:</span>
//               <span>{toPascalCase(selectedPackage?.package_name || "packge name")}</span>
//           </div>
//           {selectedPackage && (
//               <div className="flex justify-between text-gray-600 text-base mt-1">
//                   <span className="font-semibold">Price:</span>
//                   <span>₹{Number(selectedPackage.price)}</span>
//               </div>
//           )}
//           {selectedPackage.price_for_per_hour.toLowerCase() !== 'not allowed' && (
//               <div className="flex justify-between text-gray-600 text-base mt-1">
//                   <span className="font-semibold">Price per/hour</span>
//                   <span>₹{Number(selectedPackage.price_for_per_hour)}</span>
//               </div>
//           )}
//           {selectedPackage.extra_price_for_aircondition && (
//               <div className="flex justify-between text-gray-600 text-base mt-1">
//                   <span className="font-semibold">Extra cost for AC:</span>
//                   <span>₹{Number(selectedPackage.extra_price_for_aircondition)}</span>
//               </div>
//           )}

//           <div className="flex justify-between text-gray-600 text-base mt-1">
//               <span className="font-semibold">Package Description</span>
//           </div>


        
//           <div className="relative mt-2">
//               <div
//                   className={`overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? "max-h-[500px]" : "max-h-16"
//                       }`}
//               >
//                   <p className="text-gray-600 text-sm whitespace-pre-line">
//                       {selectedPackage?.description || "No description available"}
//                   </p>
//               </div>
//               {!isExpanded && selectedPackage?.description?.length > 100 && (
//                   <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white to-transparent"></div>
//               )}
//           </div>
//           {selectedPackage?.description && (
//               <button
//                   onClick={() => setIsExpanded(!isExpanded)}
//                   className="mt-2 text-teal-500 font-semibold hover:underline focus:outline-none"
//               >
//                   {isExpanded ? (
//                       <>
//                           See Less <ArrowDropUpIcon />
//                       </>
//                   ) : (
//                       <>
//                           See More <ArrowDropDownIcon />
//                       </>
//                   )}
//               </button>
//           )}
//       </div>
//   </div>
// </div>