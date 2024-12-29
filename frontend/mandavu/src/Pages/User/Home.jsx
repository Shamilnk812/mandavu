import React, { useEffect, useState } from 'react';
import Navb from "../../Components/User/Navb";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import Footer from '../../Components/User/Footer';
import FooterCmp from '../../Components/User/Footer';

import { useDispatch } from 'react-redux';
import { setUserLocation } from '../../Redux/Slices/User';
import { useSelector } from 'react-redux';
import SetUserLocationModal from '../../Utils/SetUserLocation/SetUserLocationModal';


export default function Home() {
    
    



    const dispatch = useDispatch();
    const [error, setError] = useState("")

    const [locationModalOpen, setLocationModalOpen] = useState(false)


    
   
    useEffect(()=> {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                dispatch(
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    })
                );
                setError(null); 
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    setError('Location access is needed to show nearby venues. Please enable location services in your browser or device settings.');
                    setLocationModalOpen(true)
                } else {
                    setError('An unexpected error occurred. Please try again.');
                }
            },
            { enableHighAccuracy: true }
        );
    } else {
        setError('Geolocation is not supported by your browser.');
    }
     
    },[dispatch])




    // const requestLocation = () => {
    //   if (navigator.geolocation) {
    //       navigator.geolocation.getCurrentPosition(
    //           (position) => {
    //               console.log("Location fetched:", position);
    //           },
    //           (error) => {
    //               if (error.code === error.PERMISSION_DENIED) {
    //                   setShowPrompt(true); // Show the prompt if denied
    //               }
    //           },
    //           { enableHighAccuracy: true }
    //       );
    //   }
    // }

    


    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Handle mouse movement for subtle interaction
    const handleMouseMove = (e) => {
        setMousePos({
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight,
        });
    };

    return (
        <>

      

            <div
    className="relative min-h-screen flex flex-col overflow-hidden"
    style={{
      backgroundImage: `url('/user/banner1.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
    onMouseMove={handleMouseMove}
  >
    {/* Black overlay */}
    <div className="absolute inset-0 bg-black opacity-40 z-0"></div>

    <Navb />

    <main className="flex-grow flex flex-col items-center justify-center relative z-10">
      <div className="text-center z-10">

      {/* <div>
            <button onClick={requestLocation}>Enable Location</button>

            {showPrompt && (
                <div className="modal">
                    <p>
                        Location access is needed to show nearby venues. Please enable location
                        services in your browser or device settings.
                    </p>
                    <button onClick={() => setShowPrompt(false)}>Close</button>
                </div>
            )}
        </div> */}
        {/* Main heading animation */}
        <motion.h1
          className="text-5xl font-bold mb-4 text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to <span className="text-orange-600 font-macondo">Mandavu</span>
        </motion.h1>

        {/* Subheading animation */}
        <motion.h2
          className="text-xl text-white mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Find Your Dream Venue
        </motion.h2>

        {/* Description animation */}
        <motion.p
          className="text-sm text-gray-300 mb-6 max-w-md mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          Discover the perfect venues for your weddings, receptions, and other special events.
          <br /> Mandavu offers the finest convention centers for unforgettable experiences.
        </motion.p>

        {/* Button with animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <Link
            className="mt-2 bg-teal-600 text-white py-3 px-8 rounded-full shadow-lg hover:bg-teal-800 hover:shadow-xl transition-colors duration-300 transform hover:scale-105"
            to="/user/show-all-venues"
          >
            View All Venues
          </Link>
        </motion.div>
      </div>
    </main>
  </div>

  {/* New section for cards with a different background */}
  <section
    className="pt-10 pb-24  relative z-20 rounded-xl"
    style={{
      marginTop: '-150px', // Adjust this value to control how much of the card section shows initially
      backgroundColor: 'rgb(255, 255, 255)', // Semi-transparent white
      backdropFilter: 'blur(2px)', // Blur effect
    //   boxShadow: 'inset 0 10px 20px rgba(75, 75, 75, 0.51)',
    //   backgroundImage: 'linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))', 
    }}
  >
            {/* <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white to-transparent"></div> */}

{/* <div
    className="absolute inset-0 bg-gradient-to-t from-white to-transparent z-0"
    // style={{
    //   backgroundColor: 'rgb(0, 0, 0)', // Semi-transparent white
    //   backdropFilter: 'blur(10px)', // Blur effect
    // }}
  ></div> */}
    <div className="text-center mb-12">
      <motion.h2
        className="text-xl font-semibold text-gray-700"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Explore Our Venues
      </motion.h2>
      <motion.p
        className="text-base text-gray-500 max-w-xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Browse through a curated selection of venues perfect for your next event.
      </motion.p>
    </div>

    {/* Cards Grid */}
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 lg:px-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.3 } },
      }}
    >
      {/* Card 1 */}
      <motion.div
        className="bg-white rounded shadow-md overflow-hidden transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <img
          src="https://via.placeholder.com/300"
          alt="Venue 1"
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-600">Venue 1</h3>
          <p className="mb-2 text-gray-500 text-base">A brief description of Venue 1.</p>
          <p className="text-lg text-gray-600 mb-3">$1000</p>
          <div className="flex justify-end">
            <Link
              to="/user/show-single-venue/1"
              className="mt-2 inline-block bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-all duration-300"
            >
              Book Now
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Card 2 */}
      <motion.div
        className="bg-white rounded shadow-md overflow-hidden transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <img
          src="https://via.placeholder.com/300"
          alt="Venue 2"
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-600">Venue 2</h3>
          <p className="mb-2 text-gray-500 text-base">A brief description of Venue 2.</p>
          <p className="text-lg text-gray-600 mb-3">$1200</p>
          <div className="flex justify-end">
            <Link
              to="/user/show-single-venue/2"
              className="mt-2 inline-block bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-all duration-300"
            >
              Book Now
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Card 3 */}
      <motion.div
        className="bg-white rounded shadow-md overflow-hidden transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <img
          src="https://via.placeholder.com/300"
          alt="Venue 3"
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-600">Venue 3</h3>
          <p className="mb-2 text-gray-500 text-base">A brief description of Venue 3.</p>
          <p className="text-lg text-gray-600 mb-3">$1500</p>
          <div className="flex justify-end">
            <Link
              to="/user/show-single-venue/3"
              className="mt-2 inline-block bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-all duration-300"
            >
              Book Now
            </Link>
          </div>
        </div>
      </motion.div>
            
   
     



    </motion.div>

    <motion.div
       
       initial={{ opacity: 0 }}
       whileInView={{ opacity: 1, scale: 1 }}  // Trigger animation when in view
       viewport={{ once: true }}  // Trigger animation only once
       transition={{ duration: 1, delay: 0.5 }}
        >
             <div className="flex justify-center mt-8">
          <Link
            className="mt-2 bg-teal-600 text-white py-3 px-8 rounded-full shadow-lg hover:bg-teal-800 hover:shadow-xl transition-colors duration-300 transform hover:scale-105"
            to="/user/show-all-venues"
          >
            View All Venues
          </Link>
          </div>
        </motion.div>
  </section>
                <FooterCmp />
        </>
    );
}









   {/* Soft, moving gradient blobs as live wallpaper effect */}
                {/* <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-teal-200 to-teal-400 opacity-50 rounded-full"
                        animate={{ x: [0, 100, -100, 0], y: [0, -50, 50, 0] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-teal-100 to-teal-200 opacity-40 rounded-full"
                        animate={{ x: [0, -50, 100, 0], y: [0, 50, -50, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-teal-500 to-teal-700 opacity-30 rounded-full"
                        animate={{ x: [0, 50, -100, 0], y: [0, -50, 50, 0] }}
                        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div> */}