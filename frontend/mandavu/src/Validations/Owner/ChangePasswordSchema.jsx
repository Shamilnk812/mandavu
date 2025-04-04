import * as Yup from 'yup';

const ChangePasswordSchema = Yup.object({
    old_password: Yup.string()
        .transform((value) => value.trim()) 
        .required('Old password is required'),
    new_password: Yup.string()
        .transform((value) => value.trim()) 
        .min(8, "Password must be 8 characters long")
        .matches(/[0-9]/, "Password requires a number")
        .matches(/[a-z]/, "Password requires a lowercase letter")
        .matches(/[A-Z]/, "Password requires an uppercase letter")
        .matches(/[^\w]/, "Password requires a symbol")
        .required('Password is required'),
    confirm_password: Yup.string()
        .transform((value) => value.trim()) 
        .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
        .required('Confirm password is required'),
});


export default ChangePasswordSchema;