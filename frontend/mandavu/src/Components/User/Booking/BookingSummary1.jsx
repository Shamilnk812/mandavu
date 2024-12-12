import { useEffect, useState } from "react"
import { axiosUserInstance } from "../../../Utils/Axios/axiosInstance";
import { useSelector } from "react-redux";
import toPascalCase from "../../../Utils/Extras/ConvertToPascalCase";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import HeaderSectionOfBookingSummary from "./HeaderSectionOfBookingSummary";




export default function BookingSummary1({ venueId,onNext }) {

    const [venue, setVenue] = useState(null);
    const selectedEvent = useSelector((state) => state.user.selectedEvent);
    const selectedPackage = useSelector((state) => state.user.selectedPackage);
    
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const fetchVenueDetails = async () => {
            try {
                const response = await axiosUserInstance.get(`single-venue-details/${venueId}/`);
                setVenue(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching venue details:', error);
            }
        };

        fetchVenueDetails();
    }, [venueId]);



    return (
        <>
            <div className="w-full md:w-5/12 px-4">
                <div className="p-6 bg-customColor8 rounded-lg shadow-xl border border-gray-200">

                    {/* Header Section */}
                    <HeaderSectionOfBookingSummary venue={venue}/>
                    
                    {/* Booking Details */}
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
                                {selectedPackage && (
                                    <div className="flex justify-between text-gray-600 text-base mt-1">
                                        <span className="font-semibold">Price:</span>
                                        <span>₹{Number(selectedPackage.price)}</span>
                                    </div>
                                )}
                                {selectedPackage.price_for_per_hour.toLowerCase() !== 'not allowed' && (
                                    <div className="flex justify-between text-gray-600 text-base mt-1">
                                        <span className="font-semibold">Price per/hour</span>
                                        <span>₹{Number(selectedPackage.price_for_per_hour)}</span>
                                    </div>
                                )}
                                {selectedPackage.extra_price_for_aircondition && (
                                    <div className="flex justify-between text-gray-600 text-base mt-1">
                                        <span className="font-semibold">Extra cost for AC:</span>
                                        <span>₹{Number(selectedPackage.extra_price_for_aircondition)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-gray-600 text-base mt-1">
                                    <span className="font-semibold">Package Description</span>
                                </div>


                                {/* Package Description with "See More" */}
                                <div className="relative mt-2">
                                    <div
                                        className={`overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? "max-h-[500px]" : "max-h-16"
                                            }`}
                                    >
                                        <p className="text-gray-600 text-sm whitespace-pre-line">
                                            {selectedPackage?.description || "No description available"}
                                        </p>
                                    </div>
                                    {!isExpanded && selectedPackage?.description?.length > 100 && (
                                        <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white to-transparent"></div>
                                    )}
                                </div>
                                {selectedPackage?.description && (
                                    <button
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="mt-2 text-teal-500 font-semibold hover:underline focus:outline-none"
                                    >
                                        {isExpanded ? (
                                            <>
                                                See Less <ArrowDropUpIcon />
                                            </>
                                        ) : (
                                            <>
                                                See More <ArrowDropDownIcon />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                    <button 
                    onClick={onNext}
                    type="submit"
                    className="w-3/4 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition duration-300"
                    
                    >
                        Next <ArrowCircleRightIcon/>
                    </button>
                </div>
                </div>
            </div>
        </>
    )
}


