import DatePicker from "react-multi-date-picker"
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import transition from "react-element-popper/animations/transition"
import opacity from "react-element-popper/animations/opacity"
import { axiosOwnerInstance } from "../../../Utils/Axios/axiosInstance";
import { format, addDays } from "date-fns";
import { toast } from "react-toastify"
import BookingStatusColors from "./BookingStatusColors";


export default function SelectDates({ venueId, selectedPackage, isRangeMode, setSelectedDates, selectedDates, datePickerRef, setShowTimeSlots, setPackageTimeSlots,allBookedDates }) {



    const bookedDates = allBookedDates.map(item => item.date)



    const handleDateChange = (dates) => {
        if (isRangeMode) {
            // Format dates for range mode
            const [startDate, endDate] = dates.map((date) => new Date(date));
            if (!endDate) {
                const formattedStartDate = format(startDate, "yyyy-MM-dd");
                setSelectedDates([formattedStartDate]);
            } else {

                const dayDifference = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

                if (dayDifference > 3) {
                    // If the range exceeds 3 days
                    alert("You can only select a range of up to 3 days.");

                    return; // Prevent further execution
                }
                const allDates = [];
                let currentDate = startDate;
                while (currentDate <= endDate) {
                    allDates.push(format(currentDate, "yyyy-MM-dd"));
                    currentDate = addDays(currentDate, 1); // Move to the next day
                }
                setSelectedDates(allDates);
            }
            // const formattedDates = dates.map((date) => format(new Date(date), "yyyy-MM-dd"));
            // setSelectedDates(formattedDates);
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



    return (
        <>
            <div className="flex flex-wrap -mx-3 mb-4 mt-12">

               {/* Section for showing booking status colors */}
                <BookingStatusColors />

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
                                            backgroundColor: "orange",
                                            color: "white",
                                            pointerEvents: "none", // Prevent mouse interactions
                                            opacity: 0.7,
                                            textDecoration: "line-through",
                                        },
                                        
                                       
                                    };
                                }
                                return {}; // Default behavior for other dates
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



            </div>
        </>
    )
}