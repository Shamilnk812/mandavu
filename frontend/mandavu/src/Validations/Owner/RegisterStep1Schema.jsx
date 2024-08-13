import * as Yup from 'yup';

const SignupStep1Schema = Yup.object().shape({
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
  .required("Last Name is required")
  .test(
      "min-characters",
      "Last Name must be at least 3 characters long",
      function (value){
          const alphabeticCharacters = value
          ? value.replace(/[^a-zA-Z]/g, "")
          : "";
          return alphabeticCharacters.length >=1 ;
      }
  ),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  phone2: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Additional Phone number is required')
    .test('phone-different', 'Phone numbers must be different', function (value) {
      // Access other values using `this.parent` or `this.options.context`
      const { phone } = this.parent;
      return phone !== value;
    }),
  id_proof: Yup.mixed()
    .required('ID Proof is required')
    .test('fileSize', 'File too large', value => !value || (value && value.size <= 1048576)) // 1 MB
    .test('fileType', 'Unsupported File Format', value => !value || (value && ['image/jpeg', 'image/png'].includes(value.type))),
  password: Yup.string()
    .min(8, "Password must be 8 characters long")
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol")
    .required('Password is required'),
  password2: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
})

export default SignupStep1Schema;
