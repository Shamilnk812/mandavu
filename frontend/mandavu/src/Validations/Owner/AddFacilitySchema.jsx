import * as Yup from "yup";

const AddFacilitySchema = Yup.object({
    facility: Yup.string().required('Facility is required'),
    price: Yup.string()
        .matches(/^(FREE|\d+)$/, 'Price must be a positive number or "FREE"')
        .required('Price is required'),
})


export default AddFacilitySchema