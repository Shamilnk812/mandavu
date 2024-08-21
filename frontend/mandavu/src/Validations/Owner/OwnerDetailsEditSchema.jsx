import * as Yup from 'yup';


const OwnerDetailsEditSchema = Yup.object({
    first_name: Yup.string()
        .trim()
        .required('First name is required'),
    last_name: Yup.string()
        .trim()
        .required('Last name is required'),
    phone: Yup.string()
        .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
        .required('Phone number is required'),
    phone2: Yup.string()
        .matches(/^\d{10}$/, 'Additional phone number must be exactly 10 digits')
        .required('Additional phone number is required')
})

export default OwnerDetailsEditSchema;