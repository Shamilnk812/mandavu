import * as Yup from "yup" ;

const SignupSchema = Yup.object().shape({
    first_name: Yup.string()
    .required("First Name is required")
    .test(
        "min-characters",
        "First Name must be at least 3 characters long",
        function (value){
            const alphabeticCharacters = value
            ? value.replace(/[^a-zA-Z]/g, "")
            : "";
            return alphabeticCharacters.length >=3 ;
        }
    ),
    last_name: Yup.string()
    .required(" Last Name is required")
    .test(
        "min-characters",
        "Last Name must be at least 2 characters long",
        function(value) {
            const alphabeticCharacters = value ? value.replace(/[^a-zA-Z]/g, "") : "";
            return alphabeticCharacters.length >=2 ;
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
