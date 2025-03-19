import * as Yup from "yup" ;

const SignupSchema = Yup.object().shape({
    
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

    email: Yup.string().email("Invalid email address").required("The Email field is required"),
    password: Yup.string()
    .required("The Password field is required")
    .min(8, "Password must be 8 characters long")
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol"),
    password2: Yup.string()
    .oneOf([Yup.ref("password")], "The Password confirmation doesn't match.")
    .required("Confirm password is required"),

    
});

export default SignupSchema;
