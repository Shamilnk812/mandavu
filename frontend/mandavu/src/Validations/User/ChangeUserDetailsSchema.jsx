import * as Yup from 'yup';


const ChangeUserDetailsSchema = Yup.object().shape({
    first_name: Yup.string()
      .trim()
      .matches(/^[A-Za-z]+$/, "Please enter a valid name (letters only)")
      .required('First name is required'),
    last_name: Yup.string()
      .trim()
      .matches(/^[A-Za-z]+$/, "Please enter a valid name (letters only)")
      .required('Last name is required'),
  });

export default ChangeUserDetailsSchema;