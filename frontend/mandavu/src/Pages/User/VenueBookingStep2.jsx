import { lazy, Suspense, useState, useEffect, } from "react";
import Navb from "../../Components/User/Navb";
import { axiosUserInstance } from "../../Utils/Axios/axiosInstance";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LoadingAnimation from "../../Components/Common/LoadingAnimation";
const BookingFormForDateAndTime = lazy(() => import("../../Components/User/Booking/BookingForm2"));
const BookingSummary2 = lazy(() => import("../../Components/User/Booking/BookingSummary2"));



export default function VenueBookingStep2() {

    const { venueId } = useParams();

    const selectedPackage = useSelector((state) => state.user.selectedPackage)

    const [selectedDates, setSelectedDates] = useState([])
    const [selectedTimeSlot, setSelectedTimeSlot] = useState([]);
    const [airConditionSelection, setAirConditionSelection] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Track loading state

    const [selectedFacilities, setSelectedFacilities] = useState([])

    const [totalAmount, setTotalAmount] = useState(selectedPackage?.price)
    const [advanceAmount, setAdvanceAmount] = useState(selectedPackage?.price * 0.15)

    const [venue, setVenue] = useState(null)


    useEffect(() => {
        const fetchVenueDetails = async () => {
            try {
                const response = await axiosUserInstance.get(`single-venue-details/${venueId}/`);
                setVenue(response.data);
                console.log("parent render", response.data)
            } catch (error) {
                console.error('Error fetching venue details:', error);
            } finally {
                setIsLoading(false)
            }
        };

        fetchVenueDetails();
    }, [venueId]);

    if (isLoading) {
        return (
            <LoadingAnimation />
        );
    }


    return (
        <>
            <Navb />
            <div className="container mx-auto max-w-screen-xl px-4 py-6">
                <div className="flex flex-wrap -mx-4">
                    <Suspense
                        fallback={
                            <LoadingAnimation />
                        }
                    >
                        <BookingFormForDateAndTime
                            venueId={venue?.id}
                            facilities={venue?.facilities}
                            setSelectedDates={setSelectedDates}
                            selectedDates={selectedDates}
                            selectedTimeSlot={selectedTimeSlot}
                            setSelectedTimeSlot={setSelectedTimeSlot}
                            airConditionSelection={airConditionSelection}
                            setAirConditionSelection={setAirConditionSelection}
                            setSelectedFacilities={setSelectedFacilities}
                            selectedFacilities={selectedFacilities}
                            totalAmount={totalAmount}
                            setTotalAmount={setTotalAmount}
                            setAdvanceAmount={setAdvanceAmount}
                        />
                        <BookingSummary2
                            venue={venue}
                            venueId={venueId}
                            selectedDates={selectedDates}
                            selectedTimeSlot={selectedTimeSlot}
                            airConditionSelection={airConditionSelection}
                            selectedFacilities={selectedFacilities}
                            totalAmount={totalAmount}
                            advanceAmount={advanceAmount}
                        />
                        {/* <BookingFormForDateAndTime facilities={venue?.facilities} setSelectedDates={setSelectedDates} selectedDates={selectedDates} selectedTimeSlot={selectedTimeSlot} setSelectedTimeSlot={setSelectedTimeSlot} airConditionSelection={airConditionSelection} setAirConditionSelection={setAirConditionSelection} setSelectedFacilities={setSelectedFacilities} selectedFacilities={selectedFacilities} totalAmount={totalAmount} setTotalAmount={setTotalAmount} setAdvanceAmount={setAdvanceAmount} /> */}
                        {/* <BookingSummary2 venue={venue} venueId={venueId} selectedDates={selectedDates} selectedTimeSlot={selectedTimeSlot} airConditionSelection={airConditionSelection} selectedFacilities={selectedFacilities} totalAmount={totalAmount} advanceAmount={advanceAmount} /> */}

                    </Suspense>
                </div>
            </div>

        </>
    )
}