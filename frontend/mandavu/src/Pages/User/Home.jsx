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
import { axiosUserInstance } from '../../Utils/Axios/axiosInstance';
import { locale } from 'dayjs';
import LoadingAnimation from '../../Components/Common/LoadingAnimation';
import SectionForShowingVenuesOnHomePage from '../../Components/User/SectionForShowingVenuesOnHomePage';



export default function Home() {


  const dispatch = useDispatch();
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(false)
  const userLocation = useSelector((state) => state.user.userLocation);



  const scrollVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };




  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch(
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })
          );
          // setError(null);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            // setError('Location access is needed to show nearby venues. Please enable location services in your browser or device settings.');
            setLocationModalOpen(true)
          } else {
            // Dispatch default latitude and longitude 
            dispatch(
              setUserLocation({
                latitude: 11.0401,
                longitude: 76.0822,
              })
            );
          }
        },
        { enableHighAccuracy: true }
      );
    } else {

      console.log('Geolocation is not supported by your browser.')
      // Dispatch default latitude and longitude 
      dispatch(
        setUserLocation({
          latitude: 11.0401,
          longitude: 76.0822,
        })
      );
    }

  }, [dispatch])


  useEffect(() => {
    if (userLocation) {
      setLocationModalOpen(false)
      fetchNearByVenues();
    }
  }, [userLocation])


  // useEffect(() => {
  //   if (userLocation) {
  //     fetchNearByVenues();
  //   }

  // }, []); 



  const fetchNearByVenues = async () => {
    try {

      setLoading(true)
      const { latitude, longitude } = userLocation;

      if (latitude && longitude) {
        const response = await axiosUserInstance.get('venues-list/', {
          params: {
            latitude,
            longitude,
          },
        });

        setVenues(response.data.results)
      } else {
        console.warn("User location is not available");
      }
    } catch (error) {
      console.error("An error occurred while fetching nearby venues:", error);
    } finally {
      setLoading(false)
    }
  }




  if (loading) {
    return <LoadingAnimation />
  }

  return (
    <>



      <div
        className="relative min-h-screen flex flex-col overflow-hidden"
        style={{
          backgroundImage: `url('/user/banner1.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        // onMouseMove={handleMouseMove}
      >
        {/* Black overlay */}
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>

        <Navb />

        <main className="flex-grow flex flex-col items-center justify-center relative z-10">
          <div className="text-center z-10">

            {/* Main heading animation */}
            <motion.h1
              className="text-5xl font-semibold mb-4 text-white"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Welcome to <span className="text-orange-600 text-6xl font-macondo">Mandavu</span>
            </motion.h1>

            {/* Subheading animation */}
            <motion.h2
              className="text-xl text-white mb-6"
              initial="hidden"
              whileInView="visible"
              variants={scrollVariants}
              viewport={{ once: true }}
            >
              Find Your Dream Venue
            </motion.h2>

            {/* Description animation */}
            <motion.p
              className="text-base text-gray-200 mb-6 max-w-md mx-auto leading-relaxed"
              initial="hidden"
              whileInView="visible"
              variants={scrollVariants}
              viewport={{ once: true }}
            >
              Discover the perfect venues for your weddings, receptions, and other special events.
              <br /> Mandavu offers the finest convention centers for unforgettable experiences.
            </motion.p>
          </div>
        </main>
      </div>



      {/* Section for showing venues */}

      <SectionForShowingVenuesOnHomePage scrollVariants={scrollVariants} venues={venues} />



      <FooterCmp />

      {locationModalOpen && (
        <SetUserLocationModal isOpen={locationModalOpen} />
      )}
    </>
  );
}











