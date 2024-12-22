import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import { axiosUserInstance } from '../../Utils/Axios/axiosInstance';
import { useParams } from 'react-router-dom';
import Navb from '../../Components/User/Navb';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShowRating from '../../Components/User/ShowRating';
// import { useChat } from '../../Utils/ChatContext/CreateChat';
import ForumIcon from '@mui/icons-material/Forum';
import { axiosChatInstance } from '../../Utils/Axios/axiosInstance';
import SelectEventsModal from '../../Components/User/SelectEvents';
import { Button } from '@mui/material';

import { motion } from "framer-motion";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/swiper-bundle.min.css';
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/free-mode'
import './SwiperStylee.css'
import { FreeMode, Pagination } from 'swiper/modules'
import LoadingAnimation from '../../Components/Common/LoadingAnimation';
import FooterCmp from '../../Components/User/Footer';

export default function ShowSingleVenueDetails() {
  const navigate = useNavigate();
  const { venueId } = useParams();
  const [venue, setVenue] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);



  const [isEventModalOpen, setIsEventModalOpen] = useState(false)

  // const {handleChat} = useChat()

  const userId = useSelector((state) => state.user.user?.id);
  console.log('sondfdj', userId)

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        const response = await axiosUserInstance.get(`single-venue-details/${venueId}/`);
        setVenue(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching venue details:', error);
      }
    };

    fetchVenueDetails();
  }, [venueId]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? (venue.images.length - 1) : (prevIndex - 1)));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === venue.images.length - 1 ? 0 : (prevIndex + 1)));
  };


  const handleChat = async (venueOwnerId) => {
    try {
      const response = await axiosChatInstance.post('add_chat_rooms/', {
        user_id1: userId,
        user_id2: venueOwnerId,
      });

      if (response.status === 200 || response.status === 201) {
        const chatRoomId = response.data.id; // Assuming `id` is the field representing the chat room's ID
        // navigate(`/chat/${chatRoomId}`);
        navigate('/user/chat')


      }
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  }

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false);
  }


  const scrollVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };




  if (!venue) {
    return  <LoadingAnimation />
  }

  return (
    <>
      <Navb />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={scrollVariants}
        className="container mx-auto max-w-screen-xl px-4 py-4">

        <div id="controls-carousel" className="relative w-full rounded-lg shadow-lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={scrollVariants}
            viewport={{ once: true }}
            className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg">
            {venue.images && venue.images.length > 0 ? (
              venue.images.map((image, index) => (
                <motion.div
                  key={image.id}
                  className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                  <img
                    src={image.venue_photo}
                    alt={`Venue ${index}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No images available</p>
              </ div>
            )}
          </motion.div>

          {/* Previous button */}
          <button
            type="button"
            className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            onClick={handlePrev}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-teal-600/70 group-hover:bg-teal-800/70 group-focus:ring-4 group-focus:ring-white focus:outline-none">
              <svg
                className="w-4 h-4 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
              <span className="sr-only">Previous</span>
            </span>
          </button>

          {/* Next button */}
          <button
            type="button"
            className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            onClick={handleNext}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-teal-600/70 group-hover:bg-teal-800/70 group-focus:ring-4 group-focus:ring-white focus:outline-none">
              <svg
                className="w-4 h-4 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="sr-only">Next</span>
            </span>
          </button>
        </div>






        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={scrollVariants}
          viewport={{ once: true }}
          className="mt-12 rounded-lg shadow-md bg-white">
          {/* <div className="bg-gradient-to-r from-teal-500 to-gray-800 text-center py-3 rounded-tl-lg rounded-tr-lg">
    <h2 className="text-2xl font-bold text-white">Welcome to {venue.convention_center_name}</h2>
  </div> */}
          <div className="flex flex-col md:flex-row px-4 py-4 md:px-10 md:py-10 gap-4"> {/* Added gap */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={scrollVariants}
              viewport={{ once: true }}

              className="w-full md:w-2/5">
              {venue.images && venue.images.length > 0 ? (
                <img
                  src={venue.images[0].venue_photo}
                  alt="Venue"
                  //   className="w-full h-64 object-cover rounded-lg"
                  className="w-full h-32 sm:h-48 md:h-64 lg:h-72 object-cover  rounded-lg shadow-xl"
                />
              ) : (
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center"> {/* Placeholder */}
                  <p className="text-gray-500">No image available</p>
                </div>
              )}
            </motion.div>

            < motion.div
              initial="hidden"
              whileInView="visible"
              variants={scrollVariants}
              viewport={{ once: true }}
              className="w-full md:w-3/5">
              <h3 className="text-gray-600 text-2xl text-center font-semibold mb-2">{venue.convention_center_name}</h3>
              <p className="text-gray-700 bg-gray-100 p-5 rounded-lg shadow-lg leading-relaxed">{venue.description}</p> {/* Added leading-relaxed */}
            </motion.div>

          </div>
        </motion.div>


        {/* Section for showing venue events */}


        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={scrollVariants}
          viewport={{ once: true }}
          className="mt-12 rounded-lg shadow-md bg-white p-4"
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-600 text-center">Explore Events</h2>
            <p className="text-gray-600 text-sm mt-2">
              Discover amazing events happening at our venues.
            </p>
          </div>
          <div className="flex items-center justify-center flex-col">
            <Swiper
              breakpoints={{
                340: {
                  slidesPerView: 2,
                  spaceBetween: 15,
                },
                700: {
                  slidesPerView: 3,
                  spaceBetween: 15,
                },
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 20,
                },
              }}
              freeMode={true}
              pagination={{
                clickable: true,
              }}
              modules={[FreeMode, Pagination]}
              className="w-full"
            >
              {venue.events.map((event) => (
                <SwiperSlide key={event.id}>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    variants={scrollVariants}
                    viewport={{ once: true }}
                    className="flex flex-col items-center gap-4 group overflow-hidden cursor-pointer"
                  >
                    {/* Image Section */}
                    <div
                      className="relative w-[250px] h-[150px] lg:w-[300px] lg:h-[200px] bg-cover bg-center transition-transform duration-300 ease-in-out transform hover:scale-105"
                      style={{ backgroundImage: `url(${event.event_photo})` }}
                    >
                      {/* Overlay with Venue Name */}
                      <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-center py-2 text-sm font-semibold">
                        {event.event_name}
                      </div>
                    </div>

                    <div className="text-center px-4">
                      <h3 className="text-gray-600 text-sm py-8 md:text-lg font-semibold">
                        {/* {event.event_name} */}
                      </h3>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.div>











        <motion.div
          className="mt-12 pb-12 pt-4 rounded-lg shadow-lg bg-white flex flex-col md:flex-row"
          initial="hidden"
          whileInView="visible"
          variants={scrollVariants}
          viewport={{ once: true }}
        >
          {/* Facilities Section */}
          <motion.div
            className="w-full md:w-3/5 px-4 md:px-5 py-2"
            initial="hidden"
            whileInView="visible"
            variants={scrollVariants}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-gray-600 text-center mb-4">Facilities</h3>
            <div className="bg-gray-50 rounded-lg shadow-lg p-4 h-[350px] overflow-y-auto">
              {venue.facilities && venue.facilities.length > 0 ? (
                venue.facilities.map((facility) =>
                  facility.is_active ? (
                    <div
                      key={facility.id}
                      className="flex justify-between items-center border-b border-gray-300 py-2"
                    >
                      <span className="text-md font-medium text-gray-600"> <PlayArrowRoundedIcon /> {facility.facility}</span>
                      <span className="text-gray-800">$ {facility.price || 'Included'}</span>
                    </div>
                  ) : null
                )
              ) : (
                <p className="text-gray-600">No facilities available</p>
              )}
            </div>
          </motion.div>

          {/* Location Section */}
          <motion.div
            className="w-full md:w-2/5 p-4"
            initial="hidden"
            whileInView="visible"
            variants={scrollVariants}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-gray-600 mb-4 text-center">Location</h3>
            <div className="bg-white-100 shadow-lg rounded-lg">
              <div className="px-4 md:px-12 py-6">
                <a
                  href={`https://www.google.com/maps?q=${venue.latitude},${venue.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src="/user/location_img.jpeg"
                    alt="View on Google Maps"
                    className="w-full h-40 md:h-70 object-cover rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl border-2 border-teal-500"
                  />
                </a>
                <h4 className="text-gray-700 mt-4 font-medium text-center">View on Map</h4>
                <p className="text-gray-600 text-center mt-2">{venue.address}</p>
              </div>
              <div className="mt-2 p-6 rounded-lg items-center">
                <div className="px-12 gap-2 flex flex-col">
                  <button
                    onClick={() => setIsEventModalOpen(true)}
                    className="bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 w-full md:w-full h-12 flex items-center justify-center"
                  >
                    <CalendarMonthOutlinedIcon className="inline-block mr-2" /> Book Now
                  </button>

                  <button
                    onClick={() => handleChat(venue.owner_id)}
                    className="border-2 border-teal-600 text-teal-600 py-3 px-6 rounded-lg hover:bg-teal-50 hover:text-teal-600 w-full md:w-full h-12 flex items-center justify-center"
                  >
                    <ForumIcon className="inline-block mr-2" /> Chat With Us
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>







        {/* <Link to={`/user/venue-booking/${venue.id}`} className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800">
                            Book your venue
                        </Link> */}
        {/* <Link to={`/user/venue-booking-step1/${venue.id}`} className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800">
                            Book your venue
                        </Link> */}

        {/* raitng  */}

        <ShowRating venueId={venue.id} scrollVariants={scrollVariants}/>
        {/* <div className="mt-8  rounded-lg bg-customColor8   h-[400px]"></div> */}


        <SelectEventsModal venueId={venue.id} isEventModalOpen={isEventModalOpen} handleCloseEventModal={handleCloseEventModal} />

      </motion.div>

      <FooterCmp />


    </>
  );
}
