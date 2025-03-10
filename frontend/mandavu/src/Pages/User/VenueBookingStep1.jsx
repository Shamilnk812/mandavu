import { useParams,useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { lazy, Suspense, useEffect, useRef } from "react";
const BookingFormForAddress = lazy(() => import("../../Components/User/Booking/BookingForm1"));
const BookingSummary1 = lazy(() => import("../../Components/User/Booking/BookingSummary1"))
import LoadingAnimation from "../../Components/Common/LoadingAnimation";
import Navb from "../../Components/User/Navb";
import FooterCmp from "../../Components/User/Footer";



export default function VenueBookingStep1() {
    const { venueId } = useParams();
    const navigate = useNavigate();
    const formRef = useRef(); // Create a reference for the form
    const selectedPackage = useSelector((state) => state.user.selectedPackage);
    const selectedEvent = useSelector((state) => state.user.selectedEvent);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (!selectedPackage || !selectedEvent) {
            navigate("/user/home"); 
        }
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);

    }, [selectedPackage, selectedEvent, navigate]);



    const handleNext = () => {
        if (formRef.current) {
            formRef.current.submitForm(); // Trigger the form submission
        }
    };
    
    if (loading) {
        return <LoadingAnimation />;
    }


    return (
        <>
            <Navb />
            <div className="container mx-auto max-w-screen-xl px-4 pt-12 pb-24">
                <div className="flex flex-wrap -mx-4">
                    <Suspense fallback={<LoadingAnimation/>}>
                        <BookingFormForAddress ref={formRef} venueId={venueId} />
                        <BookingSummary1 venueId={venueId} onNext={handleNext} />
                    </Suspense>

                </div>
            </div>

            <FooterCmp />

        </>
    )
}
