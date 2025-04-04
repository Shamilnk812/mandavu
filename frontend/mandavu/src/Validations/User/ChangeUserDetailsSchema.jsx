import * as Yup from 'yup';


const ChangeUserDetailsSchema = Yup.object().shape({
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
  });

export default ChangeUserDetailsSchema;