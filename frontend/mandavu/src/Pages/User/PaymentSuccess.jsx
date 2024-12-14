import Navb from "../../Components/User/Navb";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearBookingDetails } from "../../Redux/Slices/User";

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

    // Animation for buttons: bounce effect on hover
    const buttonVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.6, ease: "easeOut" },
        },
        hover: {
            scale: 1.1,
            boxShadow: "0px 8px 15px rgba(0, 128, 128, 0.4)",
            transition: { duration: 0.3, ease: "easeInOut" },
        },
        tap: { scale: 0.95, transition: { duration: 0.2 } },
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
    }, [dispatch,navigate]);

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
                        className="p-8 bg-green-100 border border-green-300 rounded-md shadow-lg text-center"  // Centered content
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        {/* Fade and slide effect for the success message */}
                        <motion.h2
                            className="text-3xl font-bold text-green-700 mb-4 text-center"
                            variants={textVariants}
                        >
                            🎉 Booking Successful!
                        </motion.h2>

                        <motion.p
                            className="text-lg text-green-600 text-center"
                            variants={textVariants}
                        >
                            Your booking was completed successfully. Thank you for choosing our service!
                        </motion.p>

                        {/* Staggered buttons with bounce effect */}
                        <motion.div
                            className="flex justify-center space-x-4 mt-10 mb-10"
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                        >
                            <motion.button
                                onClick={() => navigate('/user/show-booking-details')}
                                className="mt-2 bg-teal-600 text-white text-sm py-2 px-4 rounded-full hover:bg-gradient-to-r from-teal-500 to-gray-800"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                View Booking
                            </motion.button>

                            <motion.button
                                onClick={() => navigate('/user/home')}
                                className="mt-2 bg-teal-600 text-white text-sm py-2 px-4 rounded-full hover:bg-gradient-to-r from-teal-500 to-gray-800"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                Go Back To Home
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </>
    );
}
