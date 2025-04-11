import * as Yup from "yup";


const ContactUsFormSchema = Yup.object().shape({
    user_name: Yup.string()
       
        .transform((value) => value.trim()) 
        .required("Username is required")
        .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed") 
        .test(
          "min-characters",
          "username must be at least 3 characters long",
          (value) => value && value.replace(/[^a-zA-Z]/g, "").length >= 3
        ),    
    email: Yup.string()
    .transform((value) => value.trim())
    .email("Invalid email address")
    .required("The Email field is required"),
    message: Yup.string()
    .transform((value) => value.trim()) 
    .required("Enter a valid message")
})


export default ContactUsFormSchema;