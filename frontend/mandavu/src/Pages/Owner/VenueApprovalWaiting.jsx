import { useNavigate } from "react-router-dom"
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion } from "framer-motion";




export default function VenueApprovalWaiting() {
  const navigate = useNavigate()
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

  
  return (
    <>
      <div 
       
      className="min-h-screen bg-gray-50 flex justify-center items-center">
        <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
         className="py-12 px-12 bg-white rounded-xl shadow-xl z-20">
          
            <h3 className="text-2xl font-semibold mb-4 text-center text-teal-700">Registration Successful!</h3>
            <p className="text-md text-gray-600 mb-1 text-center">Your venue registration is being processed and undergoing validation.</p>
            <p className="text-md text-gray-600 mb-2 text-center">You will receive an email notification once the admin approves your venue.</p>


            <DotLottieReact
              src="https://lottie.host/2ada6774-6f39-43aa-86f0-b8b019ed371b/ocMqcVnBHM.lottie"

              loop
              autoplay
              className="w-60 h-60 mx-auto my-6"
            />
            <div
             className="flex justify-center mt-8">
              <button
                onClick={() => navigate('/owner/login')}
                className="mt-2 border border-teal-700 text-teal-600 px-8 py-3 rounded-xl shadow-lg transition text-md font-medium hover:bg-teal-700 hover:text-white"
                >Go Back</button>
            </div>
         


        </motion.div>

      </div>
    </>
  )
}