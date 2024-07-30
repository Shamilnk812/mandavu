import * as Yup from 'yup';

const VenueRegisterSchema = Yup.object({
  name: Yup.string()
  .matches(/^[A-Za-z\s]+$/, 'Enter valid Venue name')
  .required('Convention Center Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  description: Yup.string().required('Description is required'),
  phone: Yup.string()
    .matches(/^\d{10}$/, 'Enter valid phone number')
    .required('Phone is required'),
  price: Yup.number()
    .positive('Price must be a positive number')
    .required('Price is required'),
  dining_seat_count: Yup.number()
    .positive('Dining Seat Count must be a positive number')
    .required('Dining Seat Count is required'),
  auditorium_seat_count: Yup.number()
    .positive('Auditorium Seat Count must be a positive number')
    .required('Auditorium Seat Count is required'),
  condition: Yup.string().required('Condition is required'),
  state: Yup.string()
  .matches(/^[A-Za-z\s]+$/, 'Enter valid state')
  .required('State is required'),
  district: Yup.string()
  .matches(/^[A-Za-z\s]+$/, 'Enter valid district')
  .required('District is required'),
  pincode: Yup.string()
    .matches(/^\d{6}$/, 'Enter valid pincode')
    .required('Pincode is required'),
  address: Yup.string().required('Address is required')
});

export default VenueRegisterSchema;
