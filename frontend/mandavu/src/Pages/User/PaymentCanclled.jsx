import Navb from "../../Components/User/Navb";
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { useSelector } from "react-redux";



export default function PaymentCanclled() {
    const location = useLocation();
    const navigate = useNavigate();
    const errorMessage = location.state?.message || "Your payment was canceled. Please try again or contact support if you need assistance.";
    const selectedPackage = useSelector((state) => state.user.selectedPackage)

    const handleTryAgain = () => {
         if (selectedPackage?.venue) {
        navigate(`/user/venue-booking-step2/${selectedPackage.venue}`);
        } else {
            navigate('/user/home');
        }
    };

   

    return(
        <>
        <Navb/>
            <div className="container mx-auto max-w-screen-xl px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl mx-auto"
                >
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </motion.div>
                        <h1 className="text-3xl font-bold text-red-600 mb-2">Oops! Payment Failed</h1>
                        <p className="text-gray-600">We encountered an issue with your payment</p>
                    </div>

                    {/* Error Message Card */}
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 shadow-sm">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                                <h3 className="text-lg font-semibold text-red-800 mb-2">What happened?</h3>
                                <p className="text-red-700 leading-relaxed">{errorMessage}</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">What can you do?</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleTryAgain}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                                Try Booking Again
                            </button>
                            <button
                                onClick={() => navigate('/user/home')}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Back to home
                            </button>
                        </div>
                    </div>

                   
                </motion.div>
            </div>
        </>

    
    )
}