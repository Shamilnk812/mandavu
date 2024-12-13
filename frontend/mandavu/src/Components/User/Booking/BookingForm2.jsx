import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import ViewAllBookingSlots from "./ShowAllBookingSlots"
import "react-multi-date-picker/styles/colors/teal.css"
// import "./DatePicker/DatePickerStyle.css"
import { toast } from "react-toastify"
import { axiosUserInstance } from "../../../Utils/Axios/axiosInstance"
import SelectDates from "./SelectDates"
import SelectAirConditioningSection from "./SelectAirConditioningSection"
import SelectTimeSlotsSection from "./SelectTimeSlotsSection"
import SelectAdditionalFacilitiesSection from "./SelectAdditionalFacilitiesSection"






export default function BookingFormForDateAndTime({ venueId, setSelectedDates, selectedDates, selectedTimeSlot, setSelectedTimeSlot, airConditionSelection, setAirConditionSelection, facilities, selectedFacilities, setSelectedFacilities, totalAmount, setTotalAmount, setAdvanceAmount }) {


    console.log(facilities)

    const selectedPackage = useSelector((state) => state.user.selectedPackage)
    const isRangeMode = selectedPackage?.price_for_per_hour.toLowerCase() === "not allowed";

    const datePickerRef = useRef()
    const [showCalendar, setShowCalendar] = useState(true);
    const [bookedDatesForRegularPackage, setBookedDatesForRegularPackage] = useState([])
    const [bookedDatesForAlternativePackage, setBookedDatesForAlternativePackage] = useState([])
    const [packageTimeSlots, setPackageTimeSlots] = useState([])
    const [showTimeSlots, setShowTimeSlots] = useState(false);



    //  FETCH BOOKED DATES 
    useEffect(() => {
        const fetchBookedDates = async () => {
            try {
                const bookingPackage = selectedPackage?.package_name === "regular" ? "regular" : "alternative";
                const response = await axiosUserInstance.get(`/get-booked-dates/${venueId}/`, {
                    params: { booking_package: bookingPackage }
                });

                if (bookingPackage == 'regular') {
                    setBookedDatesForRegularPackage(response.data)
                } else {
                    setBookedDatesForAlternativePackage(response.data);
                }

                console.log("Fetched booked dates:", response.data);
            } catch (error) {
                console.error("Error fetching booked dates:", error);
                toast.error("Something went wrong");
            }
        };

        fetchBookedDates();
    }, [venueId, selectedPackage]);


    const hasPaidActiveFacilities = facilities.some(
        (facility) => facility.is_active && facility.price !== "FREE"
    );




    return (
        <>
            <div className="w-full md:w-7/12 px-4 mb-6 md:mb-0">
                <div className="p-6 bg-customColor8 rounded-lg shadow-md">
                    <h2 className="text-2xl bg-gradient-to-r from-teal-500 to-gray-800 rounded-lg py-2 text-center text-white font-semibold mb-4">
                        Booking Form
                    </h2>

                    {/*Section for  view calendar  */}
                    <ViewAllBookingSlots
                        venueId={venueId}
                        showCalendar={showCalendar}
                        setShowCalendar={setShowCalendar}
                        selectedPackage={selectedPackage}
                        bookedDatesForRegularPackage={bookedDatesForRegularPackage}
                        bookedDatesForAlternativePackage={bookedDatesForAlternativePackage}
                    />



                    <div className="flex flex-wrap -mx-3 mb-4 mt-12">

                        {/* Section for selcting dates */}
                        <SelectDates
                            venueId={venueId}
                            isRangeMode={isRangeMode}
                            setSelectedDates={setSelectedDates}
                            selectedDates={selectedDates}
                            datePickerRef={datePickerRef}
                            selectedPackage={selectedPackage}
                            setPackageTimeSlots={setPackageTimeSlots}
                            setShowTimeSlots={setShowTimeSlots}
                            bookedDatesForRegularPackage={bookedDatesForRegularPackage}
                            bookedDatesForAlternativePackage={bookedDatesForAlternativePackage}
                            packagePrice={selectedPackage?.price}
                            setAdvanceAmount={setAdvanceAmount}
                            setTotalAmount={setTotalAmount}
                            totalAmount={totalAmount}
                        />


                        <SelectAirConditioningSection
                            selectedPackage={selectedPackage}
                            airConditionSelection={airConditionSelection}
                            setAirConditionSelection={setAirConditionSelection}
                            setAdvanceAmount={setAdvanceAmount}
                            setTotalAmount={setTotalAmount}
                            totalAmount={totalAmount}
                        />

                    </div>



                    {/* Section for selecting time slots */}
                    <SelectTimeSlotsSection
                        venueId={venueId}
                        packageTimeSlots={packageTimeSlots}
                        showTimeSlots={showTimeSlots}
                        selectedTimeSlot={selectedTimeSlot}
                        setSelectedTimeSlot={setSelectedTimeSlot}
                        selectedDates={selectedDates}
                        packageName={selectedPackage?.package_name}
                        packagePrice={selectedPackage?.price}
                        setAdvanceAmount={setAdvanceAmount}
                        setTotalAmount={setTotalAmount}
                        totalAmount={totalAmount}

                    />




                    {/* Section for select Additional Facilities */}
                    {hasPaidActiveFacilities && selectedPackage?.package_name.toLowerCase() === "regular" && (
                        <SelectAdditionalFacilitiesSection
                            facilities={facilities}
                            selectedFacilities={selectedFacilities}
                            setSelectedFacilities={setSelectedFacilities}
                            totalAmount={totalAmount}
                            setTotalAmount={setTotalAmount}
                            setAdvanceAmount={setAdvanceAmount}
                        />
                    )}


                </div>
            </div>
        </>

    )
}




