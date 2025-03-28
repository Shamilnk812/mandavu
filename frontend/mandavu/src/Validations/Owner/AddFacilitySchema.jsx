import * as Yup from "yup";

const AddFacilitySchema = Yup.object({
    facility: Yup.string()
        .matches(/^[A-Za-z&\s\-_'".,]+$/, 'Facility can only contain alphabets and & -_\'".,')
        .test('no-only-special', 'Facility cannot contain only special characters', (value) => {
            return /[A-Za-z]/.test(value);  // Ensures at least one alphabet is present
        })
        .required('Facility is required'),
    price: Yup.string()
        .matches(/^(FREE|\d+)$/, 'Price must be a positive number or "FREE"')
        .required('Price is required'),
})


export default AddFacilitySchema