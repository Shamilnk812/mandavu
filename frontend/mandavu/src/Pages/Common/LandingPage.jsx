import { motion } from "framer-motion";
import StoreIcon from '@mui/icons-material/Store';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { useNavigate } from "react-router-dom";


export default function LandingPageV5() {

  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-teal-50 to-white text-teal-900 flex flex-col items-center overflow-hidden">
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-10 w-full flex justify-center ">
        <img src="/user/mandavu-logo.png" alt="Mandavu Logo" className="w-52 md:w-52 lg:w-64" />
      </motion.div>



      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-40 text-center max-w-4xl px-6 relative z-10"
      >
        <h1 className="text-4xl font-bold leading-tight text-teal-800">
          Find. Connect. Celebrate.
        </h1>
        <p className="mt-5 text-lg text-gray-700">
          Your dream venue is just a few clicks away. Browse, book, and experience seamless event planning like never before.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 border border-teal-700 text-teal-600 px-8 py-4 rounded-xl shadow-lg transition text-md font-medium hover:bg-teal-700 hover:text-white"
          onClick={() => navigate('/user/login')}
        >
          <TouchAppIcon /> Get Started
        </motion.button>
      </motion.div>

      {/* Features Section */}
      <div id="features" className="mt-28 w-full max-w-6xl px-6 grid md:grid-cols-2 gap-12 text-lg relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="p-8 bg-gradient-to-br from-white to-teal-50 rounded-3xl shadow-lg hover:shadow-xl transition transform hover:scale-[1.02] border border-teal-100"
        >
          <h2 className="text-2xl font-semibold text-teal-700"><AccountCircleIcon fontSize="large" /> For Event Seekers</h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Mandavu transforms how you plan your events. From creating an account in seconds to exploring hand-picked venues that match your style, everything is designed for ease. Discover exclusive event packages, read honest reviews, and even chat with venue owners—all in one place. And when it's time to book, you only need to pay a small advance to secure your dream venue.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="p-8 bg-gradient-to-br from-white to-teal-50 rounded-3xl shadow-lg hover:shadow-xl transition transform hover:scale-[1.02] border border-teal-100"
        >
          <h2 className="text-2xl font-semibold text-teal-700"> <StoreIcon fontSize="large" /> For Venue Owners</h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Managing your venue has never been easier. List your space effortlessly, connect with eager customers, and track your bookings seamlessly. Our powerful dashboard helps you analyze sales trends, respond to inquiries instantly, and create unforgettable experiences for your guests. Your venue, your rules—simplified.
          </p>
        </motion.div>
      </div>


      <motion.div
        // id="cta"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="mt-32 w-full bg-teal-900 py-16 text-center"
      >
        <h3 className="text-3xl font-semibold text-white">Join Mandavu Today</h3>
        <p className="mt-4 text-lg text-teal-100">
          Whether you're planning an event or managing a venue, we're here to make it seamless.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 bg-white text-teal-700 px-8 py-4 rounded-xl shadow-lg hover:bg-teal-50 transition text-lg font-medium"
          onClick={() => (window.location.href = "/login")}
        >
          <TouchAppIcon />  Get Started
        </motion.button>
      </motion.div>

      {/* Footer */}
      <footer className="mt-16 w-full bg-white py-8 text-center text-gray-600">
        <p>© {new Date().getFullYear()} Mandavu. All rights reserved.</p>
      </footer>


    </div>
  );
}