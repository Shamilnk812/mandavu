import * as Yup from 'yup';


const OwnerDetailsEditSchema = Yup.object({
    first_name: Yup.string()
      .transform((value) => value.trim()) 
      .required("First Name is required")
      .matches(/^[A-Za-z]+$/, "Only alphabets are allowed") 
      .test(
        "min-characters",
        "First Name must be at least 3 characters long",
        (value) => value && value.replace(/[^a-zA-Z]/g, "").length >= 3
      ),
      
    last_name: Yup.string()
      .transform((value) => value.trim()) 
      .required("Last Name is required")
      .matches(/^[A-Za-z]+$/, "Only alphabets are allowed") 
      .test(
        "min-characters",
        "Last Name must be at least 2 characters long",
        (value) => value && value.replace(/[^a-zA-Z]/g, "").length >= 2
      ),
    phone: Yup.string()
        .transform((value) => value.trim()) 
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .required('Phone number is required')
        .test('no-repeated-digits', 'Invalid phone number', (value) => {
          return !/^(.)\1{9}$/.test(value); 
        })
        .test('no-leading-zero', 'Please enter a valid phone number', (value) => {
          return !/^0/.test(value); 
        }),
      
      phone2: Yup.string()
        .transform((value) => value.trim()) 
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .required('Additional Phone number is required')
        .test('phone-different', 'Phone numbers must be different', function (value) {
          // Access other values using `this.parent` or `this.options.context`
          const { phone } = this.parent;
          return phone !== value;
        })
        .test('no-repeated-digits', 'Invalid phone number', (value) => {
          return !/^(.)\1{9}$/.test(value); 
        })
        .test('no-leading-zero', 'Please enter a valid phone number', (value) => {
          return !/^0/.test(value); 
        })
})

export default OwnerDetailsEditSchema;