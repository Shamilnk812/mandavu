import * as Yup from 'yup';
const pincodePattern = /^\d{6}$/;

const BookingForm1Schema = Yup.object({
    fullName: Yup.string()
        .transform((value) => value.trim())
        .required("Fullname is required")
        // .matches(/^[A-Za-z]+$/, "Only alphabets are allowed")
        .matches(
            /^[A-Za-z]+(?: {1,3}[A-Za-z]+)*$/,
            "Only alphabets are allowed and up to 3 spaces between words"
          )
        .test(
            "min-characters",
            "Fullname must be at least 3 characters long",
            (value) => value && value.replace(/[^a-zA-Z]/g, "").length >= 3
        ),

        phoneNumber: Yup.string()
        .transform((value) => value.trim())
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .required('Phone number is required')
        .test('no-repeated-digits', 'Invalid phone number', (value) => {
            return !/^(.)\1{9}$/.test(value);
        })
        .test('no-leading-zero', 'Please enter a valid phone number', (value) => {
            return !/^0/.test(value);
        })
        .test('phone-different', 'Phone numbers must be different', function (value) {
            const { additionalPhoneNumber } = this.parent;
            return value !== additionalPhoneNumber;
        }),
    
    additionalPhoneNumber: Yup.string()
        .transform((value) => value.trim())
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .required('Additional phone number is required')
        .test('phone-different', 'Phone numbers must be different', function (value) {
            const { phoneNumber } = this.parent;
            return value !== phoneNumber;
        })
        .test('no-repeated-digits', 'Invalid phone number', (value) => {
            return !/^(.)\1{9}$/.test(value);
        })
        .test('no-leading-zero', 'Please enter a valid phone number', (value) => {
            return !/^0/.test(value);
        }),
    

    city: Yup.string().matches(/^[A-Za-z ]*$/, 'Only alphabets are allowed').required('City is required'),
    state: Yup.string().matches(/^[A-Za-z ]*$/, 'Only alphabets are allowed').required('State is required'),
    pincode: Yup.string()
        .transform((value) => value.trim()) 
        .matches(pincodePattern, 'Enter a valid pincode')
        .test(
        'not-repeated-digit',
        'Enter a valid pincode',
        (value) => !/^(\d)\1{5}$/.test(value)
        )
        .test(
        'not-start-with-zero',
        'Enter a valid pincode',
        (value) => value && !value.startsWith('0')
        )
        .required('Pincode is required'),

    fullAddress: Yup.string()
        .transform((value) => value.trim())
        .required('Full address is required')
        .test(
            'is-valid-address',
            'Please enter a valid address',
            value => value && /[a-zA-Z]/.test(value)
        ),

    eventDetails: Yup.string()
        .transform((value) => value.trim())
        .required('Full address is required')
        .test(
            'is-valid-address',
            'Please enter a valid address',
            value => value && /[a-zA-Z]/.test(value)
        ),


})

export default BookingForm1Schema;
