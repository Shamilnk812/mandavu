import { useParams,useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { lazy, Suspense, useEffect, useRef } from "react";
const BookingFormForAddress = lazy(() => import("../../Components/User/Booking/BookingForm1"));
const BookingSummary1 = lazy(() => import("../../Components/User/Booking/BookingSummary1"))
import LoadingAnimation from "../../Components/Common/LoadingAnimation";
import Navb from "../../Components/User/Navb";



export default function VenueBookingStep1() {
    const { venueId } = useParams();
    const navigate = useNavigate();
    const formRef = useRef(); // Create a reference for the form
    const selectedPackage = useSelector((state) => state.user.selectedPackage);
    const selectedEvent = useSelector((state) => state.user.selectedEvent);


    useEffect(() => {
        if (!selectedPackage || !selectedEvent) {
            navigate("/user/home"); 
        }

    }, [selectedPackage, selectedEvent, navigate]);



    const handleNext = () => {
        if (formRef.current) {
            formRef.current.submitForm(); // Trigger the form submission
        }
    };


    return (
        <>
            <Navb />
            <div className="container mx-auto max-w-screen-xl px-4 py-6">
                <div className="flex flex-wrap -mx-4">
                    <Suspense fallback={<LoadingAnimation/>}>
                        <BookingFormForAddress ref={formRef} venueId={venueId} />
                        <BookingSummary1 venueId={venueId} onNext={handleNext} />
                    </Suspense>

                </div>
            </div>

        </>
    )
}
