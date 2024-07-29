import * as Yup from "yup" ;

const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("The Email field is required"),
    password: Yup.string()
    .required("The Password field is required")
    .min(8, "Password must be 8 characters long")
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol"),

});

export default LoginSchema ;