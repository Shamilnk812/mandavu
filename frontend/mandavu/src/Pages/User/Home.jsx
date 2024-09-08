import React, { useState } from 'react';
import Navb from "../../Components/User/Navb";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import Footer from '../../Components/User/Footer';

export default function Home() {
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
               className="relative min-h-screen flex flex-col bg-gradient-to-r from-white via-teal-700 to-white overflow-hidden"



                onMouseMove={handleMouseMove}
            >
                <Navb />

                {/* Soft, moving gradient blobs as live wallpaper effect */}
                <div className="absolute inset-0 overflow-hidden">
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
                </div>

                <main className="flex-grow flex items-center justify-center relative">
                    <div className="text-center z-10">
                        {/* Main heading animation */}
                        <motion.h1 
                            className="text-5xl font-bold mb-4 text-white"
                            initial={{ opacity: 0, y: -50 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 1 }}
                        >
                            Welcome to Mandavu
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
                            className="text-sm text-gray-800 mb-6 max-w-md mx-auto leading-relaxed"
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
        to='/user/show-all-venues'
    >
        View All Venues
    </Link>
</motion.div>
                    </div>
                </main>
            </div>
                {/* <Footer/> */}
        </>
    );
}
