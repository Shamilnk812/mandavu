import * as Yup from 'yup';

const VenueRegisterSchema = Yup.object({
  convention_center_name: Yup.string()
  .matches(/^[A-Za-z\s]+$/, 'Enter valid Venue name')
  .required('Convention Center Name is required'),
  short_description: Yup.string()
  .matches(/^[A-Za-z\s]+$/, 'Enter valid Short Description')
  .required('Short Description is required'),
  description: Yup.string().required('Description is required'),
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
  city: Yup.string()
  .matches(/^[A-Za-z\s]+$/, 'Enter valid city name')
  .required('City name is required'),
  pincode: Yup.string()
    .matches(/^\d{6}$/, 'Enter valid pincode')
    .required('Pincode is required'),
  address: Yup.string().required('Address is required')
});

export default VenueRegisterSchema;
