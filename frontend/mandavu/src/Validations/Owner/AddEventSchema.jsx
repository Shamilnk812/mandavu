import * as Yup from "yup";


const AddEventSchema = Yup.object({
    eventName: Yup.string()
    .trim() // Remove leading and trailing whitespace
    .min(2, 'Enter a valid event name ')
    .required('Event Name is required'),
    eventImage: Yup.mixed().required('Event Image is required'),
})


export default AddEventSchema