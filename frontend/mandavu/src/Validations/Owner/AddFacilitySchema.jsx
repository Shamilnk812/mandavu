import * as Yup from "yup";

const AddFacilitySchema = Yup.object({
    facility: Yup.string()
    .transform((value) => value.trim())
    .matches(/^[A-Za-z&\s\-_'".,]+$/, 'Facility can only contain alphabets and & -_\'".,')
    .test('min-letters', 'Facility must contain at least 4 letters', (value) => {
        if (!value) return false;
        const letterCount = (value.match(/[A-Za-z]/g) || []).length;
        return letterCount >= 4;
    })
    .test('no-only-special', 'Facility cannot contain only special characters', (value) => {
        return /[A-Za-z]/.test(value);
    })
    .test('no-leading-special', 'Facility cannot start with a special character', (value) => {
        if (!value) return false;
        return !/^[&\s\-_'".,]/.test(value); // Ensures the first character is NOT special
    })
    .test('max-special-chars', 'Facility cannot contain more than 3 special characters', (value) => {
        if (!value) return false;
        const specialCharCount = (value.match(/[&\s\-_'".,]/g) || []).length;
        return specialCharCount <= 3;
    })
    .required('Facility is required'),
    // facility: Yup.string()
    //     .matches(/^[A-Za-z&\s\-_'".,]+$/, 'Facility can only contain alphabets and & -_\'".,')
    //     .test('no-only-special', 'Facility cannot contain only special characters', (value) => {
    //         return /[A-Za-z]/.test(value);  // Ensures at least one alphabet is present
    //     })
    //     .required('Facility is required'),
    price: Yup.string()
        .matches(/^(FREE|\d+)$/, 'Price must be a positive number or "FREE"')
        .required('Price is required'),
})


export default AddFacilitySchema