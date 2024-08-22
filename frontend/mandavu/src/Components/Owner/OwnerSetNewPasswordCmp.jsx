import axios from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

export default function OwnerSetNewPasswordCmp({uidb64, token}) {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
          password: '',
          confirm_password: '',
          uidb64: uidb64 || '',
          token: token || '',
        },
        validationSchema: Yup.object({
          password: Yup.string()
            .min(8, 'Password must be at least 8 characters long')
            .required('Password is required'),
          confirm_password: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Please confirm your password'),
        }),
        onSubmit: async (values) => {
          console.log(values);
          try{
            const response = await axios.patch('http://127.0.0.1:8000/api/v2/auth/owner-setnew-password/', values);
            toast.success(response.data.message);
            navigate('/owner/login')
          } catch (error) {
            toast.error('Failed to create new password. Please try again later.');
          }
        },
      });
    
   return(
    <div className="min-h-screen bg-teal-600 flex justify-center items-center">
    <div className="absolute w-60 h-60 rounded-xl bg-teal-500 -top-5 -left-16 z-0 transform rotate-45 hidden md:block"></div>
    <div className="py-12 px-12 bg-white rounded-2xl shadow-xl z-20">
      <div>
        <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">Reset Your Password</h1>
        <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">
          Please enter your new password and confirm it below.
        </p>
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <input
          type="password"
          name="password"
          id="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter your new password"
          className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
        />
        {formik.errors.password && formik.touched.password ? (
          <div className="text-red-500 text-sm">{formik.errors.password}</div>
        ) : null}

        <input
          type="password"
          name="confirm_password"
          id="confirm_password"
          value={formik.values.confirm_password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Confirm your new password"
          className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
        />
        {formik.errors.confirm_password && formik.touched.confirm_password ? (
          <div className="text-red-500 text-sm">{formik.errors.confirm_password}</div>
        ) : null}

        <div className="text-center mt-6">
          <button type="submit" className="w-1/2 py-2 text-xl text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-all">
            Submit
          </button>
        </div>
      </form>
    </div>
    <div className="w-40 h-40 absolute bg-teal-500 rounded-full top-0 right-12 hidden md:block"></div>
    <div className="w-20 h-40 absolute bg-teal-500 rounded-full bottom-20 left-10 transform rotate-45 hidden md:block"></div>
  </div>
   )
}