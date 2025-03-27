import * as Yup from 'yup';


const OwnerDetailsEditSchema = Yup.object({
    first_name: Yup.string()
      .required("First Name is required")
      .matches(/^[A-Za-z0-9]+$/, "Only alphabets and numbers are allowed")
      .test(
        "not-numeric",
        "First Name cannot contain only numbers",
        (value) => isNaN(value)
      )
      .test(
        "min-characters",
        "First Name must be at least 3 characters long",
        (value) => {
          return value && value.replace(/[^a-zA-Z]/g, "").length >= 3;
        }
      ),
      last_name: Yup.string()
      .required("Last Name is required")
      .matches(/^[A-Za-z0-9]+$/, "Only alphabets and numbers are allowed")
      .test(
        "not-numeric",
        "Last Name cannot contain only numbers",
        (value) => isNaN(value)
      )
      .test(
        "min-characters",
        "Last Name must be at least 2 characters long",
        (value) => {
          return value && value.replace(/[^a-zA-Z]/g, "").length >= 2;
        }
      ),
    phone: Yup.string()
        .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
        .required('Phone number is required'),
    phone2: Yup.string()
        .matches(/^\d{10}$/, 'Additional phone number must be exactly 10 digits')
        .required('Additional phone number is required')
})

export default OwnerDetailsEditSchema;