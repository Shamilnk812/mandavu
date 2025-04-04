import * as Yup from 'yup';

const OtpSchema = Yup.object().shape({
  otp: Yup.string()
    .transform((value) => value.trim())
    .length(6, 'OTP must be exactly 6 digits')
    .matches(/^\d{6}$/, 'OTP must be exactly 6 digits')
    .required('OTP is required'),
});

export default OtpSchema;