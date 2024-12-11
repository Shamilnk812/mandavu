import * as Yup from 'yup';
const pincodePattern = /^\d{6}$/;

const BookingForm1Schema = Yup.object({
    fullName: Yup.string().matches(/^[A-Za-z ]*$/, 'Only alphabets are allowed').required('Full Name is required'),
    // email: Yup.string().email('Invalid email format').required('Email is required'),
    phoneNumber: Yup.string().matches(/^[0-9]{10}$/, 'Must be exactly 10 digits').required('Phone Number is required'),
    additionalPhoneNumber: Yup.string().matches(/^[0-9]{10}$/, 'Must be exactly 10 digits').required('Additional Phone Number is required'),
    city: Yup.string().matches(/^[A-Za-z ]*$/, 'Only alphabets are allowed').required('City is required'),
    state: Yup.string().matches(/^[A-Za-z ]*$/, 'Only alphabets are allowed').required('State is required'),
    pincode: Yup.string()
    .matches(pincodePattern, 'Enter a valid pincode')
    .required('Pincode is required'),
    fullAddress: Yup.string().required('Full Address is required'),
    eventDetails: Yup.string().required('Event Details is required'),
    // airConditioning: Yup.string().required('Air Conditioning is required'),
    // timeOfDay: Yup.string().required('Time of Day is required'),
    // date: Yup.string().required('Date is required').test(
    //     'is-valid-date',
    //     'Please enter a valid date',
    //     function (value) {
    //         const today = new Date();
    //         const selectedDate = new Date(value);
    //         return selectedDate > today;
    //     }
    // ),

})

export default BookingForm1Schema;
