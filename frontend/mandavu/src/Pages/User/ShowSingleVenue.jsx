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


export default function ShowSingleVenueDetails() {
    const navigate = useNavigate();
    const { venueId } = useParams();
    const [venue, setVenue] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [isEventModalOpen, setIsEventModalOpen] = useState(false)

    // const {handleChat} = useChat()

    const userId = useSelector((state) => state.user.user?.id);
    console.log('sondfdj',userId)

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

    const handleCloseEventModal = ()=> {
        setIsEventModalOpen(false);
    }

    if (!venue) {
        return <div>Loading...</div>;
    }

    return (
        <> 
            <Navb/>
            <div className="container mx-auto max-w-screen-xl px-4 py-4">

                <div id="controls-carousel" className="relative w-full">
                    <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg">
                        {venue.images && venue.images.length > 0 ? (
                            venue.images.map((image, index) => (
                                <div
                                    key={image.id}
                                    className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${
                                        index === currentIndex ? 'opacity-100' : 'opacity-0'
                                    }`}
                                >
                                    <img
                                        src={image.venue_photo}
                                        alt={`Venue ${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500">No images available</p>
                            </div>
                        )}
                    </div>
                    
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



            <div className="mt-8 rounded-lg bg-customColor8">
            <div className="text-center rounded-tl-lg rounded-tr-lg py-3 bg-gradient-to-r from-teal-500 to-gray-800">
                <p className="text-2xl font-bold text-white">Welcome to {venue.name}</p>
            </div>
            <div className="flex flex-col md:flex-row px-4 py-4 md:px-10 md:py-10">
                <div className="w-full md:w-2/5 bg-customColor8">
                {venue.images && venue.images.length > 0 ? (
                    <img
                    src={venue.images[0].venue_photo}
                    alt="Venue"
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                ) : (
                    <p>No image available</p>
                )}
                </div>
                <div className="w-full md:w-3/5 mt-4 md:mt-0 text-center md:text-left">
                <h1 className="text-gray-500 text-xl font-semi-bold">{venue.name}</h1>
                <p className="text-gray-800 px-4 md:px-10 py-5">{venue.description}</p>
                </div>
            </div>
            </div>


           
               

               <div className="mt-12 pb-10 rounded-lg bg-customColor8 flex flex-col md:flex-row">
                    <div className="w-full md:w-3/5">
                        <h2 className="text-xl text-white text-center p-3 rounded-tl-lg bg-gradient-to-r from-teal-500 to-gray-800 font-semibold mb-4">
                        Facilities
                        </h2>
                        {venue.facilities && venue.facilities.length > 0 ? (
                        venue.facilities.map((facility) =>
                            facility.is_active ? (
                            <div key={facility.id} className="mb-2 px-4 md:px-10 flex justify-between items-center">
                                <span className="text-md font-semibold text-gray-800">{facility.facility}</span>
                                <span className="text-gray-800">$ {facility.price || 'Included'}</span>
                            </div>
                            ) : null
                        )
                        ) : (
                        <p className="px-4 md:px-10">No facilities available</p>
                        )}
                    </div>
                    
                    <div className="w-full md:w-2/5 bg-customColor8 border-t md:border-t-0 md:border-l border-gray-400">
                        <h2 className="text-xl text-white text-center font-semibold py-3 rounded-tr-lg bg-gradient-to-r from-gray-800 to-teal-500 mb-4">
                        Location
                        </h2>
                        <div className="px-4 md:px-12 py-5">
                        <a
                            href={`https://www.google.com/maps?q=${venue.latitude},${venue.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mt-4"
                        >
                            <img
                            src="/user/location_img.jpeg"
                            alt="View on Google Maps"
                            className="w-full h-40 md:h-70 object-cover rounded transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl border-2 border-teal-500 rounded-lg"
                            />
                        </a>
                        <h3 className="text-gray-700 mt-2 font-semi-bold text-lg text-center">View on Map</h3>
                        <p className="text-gray-700 pl-4">{venue.address}</p>
                        </div>

                        <div className="flex justify-center md:justify-end px-4 md:px-8 pb-5 gap-2">
                        <button onClick={()=>setIsEventModalOpen(true)} className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800">
                            Book your venue
                        </button>
                        {/* <Link to={`/user/venue-booking/${venue.id}`} className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800">
                            Book your venue
                        </Link> */}
                        {/* <Link to={`/user/venue-booking-step1/${venue.id}`} className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800">
                            Book your venue
                        </Link> */}
                        <button
                            onClick={() => handleChat(venue.owner_id)}
                            className="mt-2 bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-500"
                        >
                            <ForumIcon /> Chat
                        </button>
                        </div>
                    </div>
                </div>


             {/* raitng  */}
 
                  <ShowRating venueId={venue.id}/>
            {/* <div className="mt-8  rounded-lg bg-customColor8   h-[400px]"></div> */}
              

            <SelectEventsModal venueId={venue.id} isEventModalOpen={isEventModalOpen} handleCloseEventModal={handleCloseEventModal} />

            </div>

            
        </>
    );
}
