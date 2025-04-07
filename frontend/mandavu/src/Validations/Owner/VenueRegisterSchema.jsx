import * as Yup from 'yup';

const alphaNumericPattern = /^[a-zA-Z0-9\s]+$/;
const positiveDigitPattern = /^[1-9]\d*$/;
const alphabetPattern = /^[a-zA-Z\s]+$/;
const pincodePattern = /^\d{6}$/;
const alphaNumericWithSpecialCharsPattern = /^[a-zA-Z0-9\s.,-]+$/;



const VenueRegisterSchema = Yup.object({
  convention_center_name: Yup.string()
  .transform((value) => value.trim()) 
  .matches(alphabetPattern, 'Convention center name can only contain alphanumeric characters')
    .test(
      'not-only-numbers',
      'Convention center name cannot contain only numbers',
      (value) => !/^\d+$/.test(value) 
    )
    .required('Convention center name is required'),
  short_description: Yup.string()
  .transform((value) => value.trim()) 
  .matches(alphaNumericWithSpecialCharsPattern, 'Short description can only contain alphanumeric characters')
  .min(15, 'Short description must be at least 15 characters')
  .test('not-only-numbers', 'Short description cannot contain only numbers', value => !/^\d+$/.test(value))
  .test('no-start-number', 'Short description cannot start with a number', value => !/^\d/.test(value))
  .required('Short description is required'),
  description: Yup.string()
  .transform((value) => value.trim()) 
  .matches(alphaNumericWithSpecialCharsPattern, 'Description can only contain alphanumeric characters and - , .')
  .min(15, 'Short description must be at least 15 characters')
  .test('not-only-numbers', 'Short description cannot contain only numbers', value => !/^\d+$/.test(value))
  .test('no-start-number', 'Short description cannot start with a number', value => !/^\d/.test(value))
  .required('Description is required'),
  // price: Yup.number()
  // .positive('Price must be a positive number')
  // .integer('Dining seat count must be an integer')
  // .required('Price is required'),
  dining_seat_count: Yup.number()
  .positive('Dining seat count must be a positive digit')
  .integer('Dining seat count must be an integer')
  .required('Dining seat count is required'),
  auditorium_seat_count: Yup.number()
  .positive('Auditorium seat count must be a positive digit')
  .integer('Auditorium seat count must be an integer')
  .required('Auditorium seat count is required'),
  // condition: Yup.string().required('Condition is required'),
  state: Yup.string()
  .transform((value) => value.trim()) 
  .matches(alphabetPattern, 'Enter a Valid state')
  .required('State is required'),
  district: Yup.string()
  .transform((value) => value.trim()) 
  .matches(alphabetPattern, 'Enter valid district')
  .required('District is required'),
  city: Yup.string()
  .transform((value) => value.trim()) 
  .matches(alphabetPattern, 'Enter valid city name')
  .required('City is required'),
  pincode: Yup.string()
  .transform((value) => value.trim()) 
  .matches(pincodePattern, 'Enter a valid pincode')
  .required('Pincode is required'),
  address: Yup.string()
  .transform((value) => value.trim()) 
  .required('Full address is required')
  .test(
    'is-valid-address',
    'Please enter a valid address',
    value => value && /[a-zA-Z]/.test(value) 
  ),
});

export default VenueRegisterSchema;
