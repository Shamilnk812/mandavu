
import React from 'react'
import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosUserInstance } from '../../Utils/Axios/axiosInstance';
import { motion } from "framer-motion";


const PaymentStatus = () => {

  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const navigate = useNavigate();




  // useEffect(() => {
  //   const timer = setTimeout(async () => {
  //     const queryParams = new URLSearchParams(window.location.search);
  //     const sessionId = queryParams.get("session_id");
  //     console.log('session idddd', sessionId);

  //     if (!sessionId) {
  //       navigate("/user/payment-cancelled");
  //       return;
  //     }

  //     try {
  //       const response = await axiosUserInstance.get(
  //         `/verify-booking?session_id=${sessionId}`
  //       );

  //       if (response.data.status === "success") {
  //         navigate("/user/payment-success");
  //       } else {
  //         navigate("/user/payment-cancelled");
  //       }
  //     } catch (error) {
  //       console.error("Payment verification error:", error);
  //       navigate("/user/payment-cancelled");
  //     }
  //   }, 15000); // ⏳ wait 15s (animation plays during this time)

  //   return () => clearTimeout(timer);
  // }, [navigate]);



  useEffect(() => {
    const verifyPayment = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const sessionId = queryParams.get("session_id");
      console.log('sesssino iddd ---',sessionId)

      if (!sessionId) {
        setVerificationStatus('failed');
        navigate("/user/payment-cancelled", {
          state: { message: "No session ID found. Please try again." }
        });
        return;
      }

      try {
        const response = await axiosUserInstance.get(
          `/verify-booking?session_id=${sessionId}`
        );

        if (response.data.status === "success") {
          setVerificationStatus('success');
          setTimeout(() => {
            navigate("/user/payment-success");
          }, 2000);
        } else {
          setVerificationStatus('failed');
          navigate("/user/payment-cancelled", {
            state: { message: response.data.message }
          });
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setVerificationStatus('failed');
        const errorMessage = error.response?.data?.message ||
          "Payment verification failed. Please contact support.";
        navigate("/user/payment-cancelled", {
          state: { message: errorMessage }
        });
      }
    };

    const timer = setTimeout(verifyPayment, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);




  const getStatusMessage = () => {
        switch (verificationStatus) {
            case 'verifying':
                return "Verifying your payment...";
            case 'success':
                return "Payment verified! Redirecting...";
            case 'failed':
                return "Verification failed. Redirecting...";
            default:
                return "Verifying your payment...";
        }
    };





  return (

     <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="flex flex-col items-center">
                {/* Logo Animation */}
                <motion.img
                    src="/user/mandavu-logo.png"
                    alt="Mandavu Logo"
                    className="w-48 h-16 mb-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 1,
                        ease: "easeInOut",
                        repeat: verificationStatus === 'verifying' ? Infinity : 0,
                        repeatType: "reverse",
                    }}
                />

                {/* Status-specific content */}
                {verificationStatus === 'verifying' && (
                    <>
                        <div className="flex space-x-2 mb-4">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <motion.div
                                    key={index}
                                    className="h-3 w-3 bg-teal-500 rounded-full"
                                    animate={{
                                        opacity: [0.3, 1, 0.3],
                                        scale: [1, 1.5, 1],
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        delay: index * 0.2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                            ))}
                        </div>
                        <p className="text-gray-600 text-lg font-medium">{getStatusMessage()}</p>
                    </>
                )}

                {verificationStatus === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <p className="text-green-600 text-lg font-medium">{getStatusMessage()}</p>
                    </motion.div>
                )}
            </div>
        </div>


    // <div className="flex items-center justify-center h-screen bg-gray-100">
    //   <div className="flex flex-col items-center">
    //     {/* Logo Animation */}
    //     <motion.img
    //       src="/user/mandavu-logo.png"
    //       alt="Mandavu Logo"
    //       className="w-full h-16 mb-6"
    //       initial={{ opacity: 0, scale: 0.8 }}
    //       animate={{ opacity: 1, scale: 1 }}
    //       transition={{
    //         duration: 1,
    //         ease: "easeInOut",
    //         repeat: Infinity,
    //         repeatType: "reverse",
    //       }}
    //     />

    //     {/* Animated Dots */}
    //     <div className="flex space-x-2">
    //       {Array.from({ length: 3 }).map((_, index) => (
    //         <motion.div
    //           key={index}
    //           className="h-2 w-2 bg-teal-500 rounded-full"
    //           animate={{
    //             opacity: [0.3, 1, 0.3],
    //             scale: [1, 1.5, 1],
    //           }}
    //           transition={{
    //             duration: 0.8,
    //             delay: index * 0.2,
    //             repeat: Infinity,
    //             ease: "easeInOut",
    //           }}
    //         />
    //       ))}
    //     </div>

    //     <p className="mt-4 text-gray-600">Verifying your payment...</p>
    //   </div>
    // </div>
  )
}

export default PaymentStatus
