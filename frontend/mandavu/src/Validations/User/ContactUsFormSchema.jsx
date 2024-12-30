import * as Yup from "yup";


const ContactUsFormSchema = Yup.object().shape({
    user_name: Yup.string()
        .required("Username is required")
        .test(
            "min-characters",
            "username must be a valid one",
            function (value) {
                const alphabeticCharacters = value
                    ? value.replace(/[^a-zA-Z]/g, "")
                    : "";
                return alphabeticCharacters.length >= 3;
            }
        ),
    email: Yup.string().email("Invalid email address").required("The Email field is required"),
    message: Yup.string()
        .required("Enter a valid message")
})


export default ContactUsFormSchema;