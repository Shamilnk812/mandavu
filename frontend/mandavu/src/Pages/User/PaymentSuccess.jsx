import Navb from "../../Components/User/Navb";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearBookingDetails } from "../../Redux/Slices/User";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";


export default function PaymentSuccess() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showContent, setShowContent] = useState(false);

    // Animation for container: floating effect
    const containerVariants = {
        hidden: { opacity: 0, y: -50, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 1,
                type: "spring",
                stiffness: 80,
                damping: 10,
                when: "beforeChildren",
                staggerChildren: 0.4,
            },
        },
    };

    // Animation for text elements: fade in + slide up
    const textVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

   
    // Checkmark animation
    const checkmarkVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeInOut",
            },
        },
        exit: {
            scale: 0,
            opacity: 0,
            transition: { duration: 0.5, ease: "easeInOut" },
        },
    };

    // Delay the showing of the main content after checkmark animation
    useEffect(() => {

        dispatch(clearBookingDetails())
        navigate('/user/payment-success', { replace: true });

        const timer = setTimeout(() => {
            setShowContent(true);
        }, 1500); // Delay content for 1.5 seconds

        return () => clearTimeout(timer); // Cleanup the timer
    }, [dispatch, navigate]);

    return (
        <>
            <Navb />

            <div className="container mx-auto max-w-screen-xl px-4 flex flex-col items-center justify-center min-h-screen">
                {!showContent && (
                    <motion.div
                        className="flex justify-center items-center"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={checkmarkVariants}
                    >
                        <motion.div className="bg-green-600 rounded-full p-8 flex items-center justify-center">
                            <svg
                                className="w-24 h-24 text-white"  // Increased size of the checkmark
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </motion.div>
                    </motion.div>
                )}

                {showContent && (
                    <motion.div
                        className="p-12 bg-white rounded-md shadow-lg text-center"  // Centered content
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        {/* Fade and slide effect for the success message */}
                        <motion.h2
                            className="text-3xl font-semibold text-teal-700 mb-4 text-center"
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                        >
                          Booking Successful!
                        </motion.h2>

                        <motion.p
                            className="text-md text-teal-600 text-center"
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                        >
                            Your booking was completed successfully. Thank you for choosing our service!
                        </motion.p>
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                        >
                        <DotLottieReact
                            src="https://lottie.host/cfebd316-369c-44e0-8022-42ef1284edd8/odSGzefGhA.lottie"
                            loop
                            autoplay
                            className="w-60 h-60 mx-auto my-6"
                        />
                        </motion.div>

                        {/* Staggered buttons with bounce effect */}
                        <motion.div
                            className="flex justify-center space-x-4 mt-10 mb-10"
                            variants={textVariants}

                            
                        >
                            <motion.button
                                onClick={() => navigate('/user/show-booking-details')}
                                className="mt-2 border border-teal-700 text-teal-600 px-8 py-3 rounded-xl shadow-lg transition text-md font-medium hover:bg-teal-700 hover:text-white"
                                
                            >
                                View Booking
                            </motion.button>

                            <motion.button
                                onClick={() => navigate('/user/home')}
                                className="mt-2 border border-teal-700 text-teal-600 px-8 py-3 rounded-xl shadow-lg transition text-md font-medium hover:bg-teal-700 hover:text-white"
                            >
                                Back To Home
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </>
    );
}
