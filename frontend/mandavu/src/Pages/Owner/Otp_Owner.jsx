import { useFormik } from "formik"
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import axios from 'axios';
import OtpSchema from "../../Validations/User/OtpSchema";
import { useEffect, useState } from "react";
import { axiosOwnerInstance } from "../../Utils/Axios/axiosInstance";
import { CircularProgress } from "@mui/material";



export default function OtpVerification() {

  const email = localStorage.getItem('email')
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [isResendVisible, setIsResendVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendOtpLoading, setResendOtpLoading] = useState(false);



  useEffect(() => {
    if (!email) {
      navigate('/owner/register-step-1');
    }
  }, [email, navigate]);
  
  console.log('emillll',email)
  
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendVisible(true);
    }
  }, [timeLeft]);


  const handleOwnerResendOtp = async () => {
    setResendOtpLoading(true)
    try {
      const response = await axiosOwnerInstance.post('resend-owner-otp/', { email });
      toast.success(response.data.message);
      setTimeLeft(120); // Reset the timer
      setIsResendVisible(false);
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setResendOtpLoading(false)
    }
  };

  const formik = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema: OtpSchema,
    onSubmit: async (values) => {
      setLoading(true)
      try {
        const response = await axiosOwnerInstance.post('verify-otp/', { ...values, email });
        toast.success('OTP verified successfully!');
        localStorage.removeItem('email')
        navigate('/owner/venue_approval_waiting');
      } catch (error) {
        if (error.response && error.response.data) {
          const errorMessage = error.response.data.error || 'OTP verification failed';
          toast.error(errorMessage);
        }
        else {
          toast.error('OTP verification failed');
        }
      } finally {
        setLoading(false)
      }

    }
    
    

  })
  return (
    <>

      <div className="min-h-screen bg-teal-600 flex justify-center items-center  px-4 sm:px-6">
        <div className="py-8 px-12 sm:px-12 bg-white rounded-2xl shadow-xl w-full max-w-lg">

          {/* Website Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/user/mandavu-logo.png"
              alt="Mandavu Logo"
              className="w-24 h-auto sm:w-32"
            />
          </div>

          <div>
            <h1 className="text-xl font-bold text-center text-gray-800 mb-2 cursor-pointer">Enter Your OTP</h1>
            <p className="w-full text-center text-sm mb-8 font-semibold text-gray-600 tracking-wide cursor-pointer">An OTP has been sent to your email Please check your email</p>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <input
              type="text"
              name="otp"
              id="otp"
              value={formik.values.otp}
              onChange={formik.handleChange}
              placeholder="Enter your OTP"
              className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
            />
            {formik.errors.otp && formik.touched.otp ? (
              <div className="text-red-500 text-sm">{formik.errors.otp}</div>
            ) : null}


            <div className="text-center mt-6">
              <button type="submit" 
               disabled={loading}
               className={`w-1/2 py-2 text-xl text-white bg-teal-600 rounded-lg hover:bg-teal-800 transition-all duration-300 ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
              >
               {loading ? (
                  <CircularProgress size={20} style={{ color: 'white' }} />
                ) : (
                  'Submit'
                )}
                </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            {timeLeft > 0 ? (
              <p>Resend OTP in {timeLeft} seconds</p>
            ) : (
              isResendVisible && (
                <button
                  onClick={handleOwnerResendOtp}
                  disabled={resendOtpLoading}
                  className={`w-1/2 py-2 text-white bg-yellow-600 rounded-lg hover:bg-yellow-800 transition-all duration-300  ${resendOtpLoading ? 'cursor-not-allowed opacity-70' : ''}`}
                >
                  {resendOtpLoading ? (
                  <CircularProgress size={20} style={{ color: 'white' }} />
                ) : (
                  'Resend OTP'
                )}
                </button>
              )
            )}
          </div>
        </div>
        
      </div>
    </>
  )
}