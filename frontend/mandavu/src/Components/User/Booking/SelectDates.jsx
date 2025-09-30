import DatePicker from "react-multi-date-picker"
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import transition from "react-element-popper/animations/transition"
import opacity from "react-element-popper/animations/opacity"
import { axiosOwnerInstance } from "../../../Utils/Axios/axiosInstance";
import { format, addDays, parse } from "date-fns";
import { toast } from "react-toastify"
import BookingStatusColors from "./BookingStatusColors";
import "./Styles/DatePickerStyle.css"


export default function SelectDates({ venueId, selectedPackage, isRangeMode, setSelectedDates, selectedDates, datePickerRef, setShowTimeSlots, setPackageTimeSlots, bookedDatesForAlternativePackage, bookedDatesForRegularPackage, packagePrice, totalAmount, setAdvanceAmount, setTotalAmount }) {




    // const bookedDates = bookedDatesForRegularPackage.map(item => item.date)

    const bookedDates = bookedDatesForRegularPackage.filter(
        (item) => item.status === "Booking Confirmed"
    ).map((item) => item.date);

    const unavailableDatesForRegular = bookedDatesForRegularPackage.filter(
        (item) => item.status === "Unavailable"
    ).map((item) => item.date);


    // let low = [];
    let mediumAvailabilityDates = [];
    let almostFullyBookedDates = [];
    let completelyBookedDates = [];
    let unavailableDates = [];


  
    // Categorize the dates for alternative packages
    if (bookedDatesForAlternativePackage) {
        bookedDatesForAlternativePackage.forEach(item => {
            const { date, booked_time_slots_count, status } = item;
            
            
            // if (booked_time_slots_count >= 0 && booked_time_slots_count <= 4) {
            //     low.push(date);
            // }
            if (booked_time_slots_count >= 4 && booked_time_slots_count <= 8) {
                mediumAvailabilityDates.push(date);
            } else if (booked_time_slots_count > 4 && booked_time_slots_count <= 11) {
                almostFullyBookedDates.push(date);
            } else if (booked_time_slots_count === 12) {
                completelyBookedDates.push(date);
            } else if (status === 'unavailable'){
                unavailableDates.push(date)
            }
        });
    }



    const handleDateChange = (dates) => {
        if (isRangeMode) {
            // Format dates for range mode
            const [startDate, endDate] = dates.map((date) => new Date(date));
            if (!endDate) {
                const formattedStartDate = format(startDate, "yyyy-MM-dd");
                setSelectedDates([formattedStartDate]);
                updateAmount(formattedStartDate);
            } else {
                
               
                const dayDifference = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

                if (dayDifference > 3) {
                    // If the range exceeds 3 days
                    // alert("You can only select a range of up to 3 days.");
                    toast.warning("You can only select a range of up to 3 days.")

                    return; // Prevent further execution
                }
                const allDates = [];
                let currentDate = startDate;
                while (currentDate <= endDate) {
                    allDates.push(format(currentDate, "yyyy-MM-dd"));
                    currentDate = addDays(currentDate, 1); // Move to the next day
                }
                 
                const conflictDate = allDates.find((date) => bookedDates.includes(date));
                if (conflictDate) {
                    toast.warning(`The date ${conflictDate} is already booked. Please select valid slots.`);
                    return; // Prevent further execution
                }
                
                setSelectedDates(allDates);
                updateAmount(allDates);

              
            }
            // const formattedDates = dates.map((date) => format(new Date(date), "yyyy-MM-dd"));
            // setSelectedDates(formattedDates);
        }
        else {
            // Allow only one date
            const singleDate = Array.isArray(dates) ? dates[0] : dates;
            const formattedDate = singleDate ? format(new Date(singleDate), "yyyy-MM-dd") : null;
            setSelectedDates(formattedDate ? [formattedDate] : []);

            if (singleDate) {
                datePickerRef.current.closeCalendar();
            }
        }


        fetchTimeSoltesForPackge();

        // console.log("Formatted dates:",selectedDates);
        setShowTimeSlots(true);

    };




    const fetchTimeSoltesForPackge = async () => {
        try {
            const response = await axiosOwnerInstance.get(`get-time-slotes/${venueId}/?packageId=${selectedPackage?.id}`)
            const slots = response.data.length > 0 ? response.data[0].time_slots : [];
            setPackageTimeSlots(slots)
            console.log("fetched dates ", slots)
        } catch (error) {
            toast.error('Failed to fetch packge time slotes. Please try again later')
        }
    }

    
    // Updating total amount and advance amount
    const updateAmount = (allSelectedDates)=> {

        const packageAmount = parseFloat(packagePrice)
        const currentTotal = parseFloat(totalAmount)

        if (allSelectedDates.length === 1 ){
            setTotalAmount(packageAmount)
            setAdvanceAmount(packageAmount * 0.15)
        }else if (allSelectedDates.length === 2){
            const newTotal = currentTotal + packageAmount
            setTotalAmount(newTotal)
            setAdvanceAmount(newTotal * 0.15)  
        }else if (allSelectedDates.length === 3){
            const newTotal = currentTotal + (packageAmount * 2 )
            setTotalAmount(newTotal)
            setAdvanceAmount(newTotal * 0.15)  
        }else{
            setTotalAmount(packageAmount)
            setAdvanceAmount(packageAmount * 0.15)
        }

    }



    return (
        <>
            {/* <div className="flex flex-wrap -mx-3 mb-4 mt-12"> */}

                {/* Section for showing booking status colors */}
                {/* <BookingStatusColors  /> */}

                <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                        Select Date
                    </label>

                    <div className="flex items-center">
                        <DatePicker
                            range={isRangeMode}
                            value={isRangeMode ? selectedDates : selectedDates[0] || null}

                            onChange={handleDateChange}
                            className="teal"
                            inputClass="custom-input"
                            containerStyle={{ width: "100%" }}
                            minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                            maxDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
                            animations={[opacity(), transition({ from: 35, duration: 800 })]}
                            ref={datePickerRef}
                            mapDays={({ date }) => {
                                const formattedDate = format(new Date(date), "yyyy-MM-dd");
                                if (bookedDates.includes(formattedDate)) {
                                    return {
                                        disabled: true,
                                        // style: { color: "orange", textDecoration: "line-through" }, 
                                        style: {
                                            backgroundColor: "red",
                                            color: "white",
                                            pointerEvents: "none", // Prevent mouse interactions
                                            opacity: 0.7,
                                            textDecoration: "line-through",
                                        },


                                    };
                                }
                                if (unavailableDatesForRegular.includes(formattedDate)) {
                                    return {
                                        disabled: true,
                                        style: {
                                            backgroundColor: "gray",
                                            color: "white",
                                            pointerEvents: "none",
                                            opacity: 0.7,
                                            // textDecoration: "line-through",
                                        },
                                    };
                                }
                                if (mediumAvailabilityDates.includes(formattedDate)) {
                                    return {
                                        style: {
                                            backgroundColor: "#008000",
                                            opacity: 0.5,
                                            color: "white",
                                        }
                                    }
                                }
                                if (almostFullyBookedDates.includes(formattedDate)) {
                                    return {
                                        style: {
                                            backgroundColor: "orange",
                                            opacity: 0.7,
                                            color: "white",
                                        }
                                    }
                                }
                                if (completelyBookedDates.includes(formattedDate)) {
                                    return {
                                        disabled: true,
                                        style: {
                                            backgroundColor: "red",
                                            color: "white",
                                            textDecoration: "line-through",
                                        }
                                    }
                                }
                                if (unavailableDates.includes(formattedDate)) {
                                    return {
                                        disabled: true,
                                        style: {
                                            backgroundColor: "gray",
                                            color: "white",
                                            pointerEvents: "none",
                                            textDecoration: "line-through",
                                        }
                                    }
                                }


                                return {}; 
                            }}


                        />
                        <button
                            onClick={() => datePickerRef.current.openCalendar()}
                            className="custom-button"
                            style={{ marginLeft: "4px" }}
                        >
                            <CalendarMonthIcon />
                        </button>
                    </div>
                </div>



            {/* </div> */}
        </>
    )
}