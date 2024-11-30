import * as Yup from "yup";
import generateAmPmTimes from "../../Utils/Extras/GenerateAmPmTimes";

const AddTimeSloteSchema = Yup.object({
    start_time: Yup.string().required("Start time is required"),
    end_time: Yup.string()
        .required("End time is required")
        .test(
            "end-time-greater",
            "End time must be after the start time",
            function (value) {
                const { start_time } = this.parent;
                const startTimeIndex = generateAmPmTimes().indexOf(start_time);
                const endTimeIndex = generateAmPmTimes().indexOf(value);
                return endTimeIndex > startTimeIndex;
            }
        ),
})

export default AddTimeSloteSchema;