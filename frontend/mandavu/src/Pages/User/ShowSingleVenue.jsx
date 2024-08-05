import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navb from '../../Components/User/Navb';
import { Link } from 'react-router-dom';

export default function ShowSingleVenueDetails() {
    const { venueId } = useParams();
    const [venue, setVenue] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchVenueDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/v1/auth/single-venue-details/${venueId}/`);
                setVenue(response.data);
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

    if (!venue) {
        return <div>Loading...</div>;
    }

    return (
        <> 
            <Navb/>
            <div className="container mx-auto max-w-screen-xl px-4 py-4">
                <div id="controls-carousel" className="relative w-full">
                    <div className="relative h-[500px]  overflow-hidden rounded-lg md:h-[600px]">
                        {venue.images && venue.images.length > 0 ? (
                            venue.images.map((image, index) => (
                                <div key={image.id} className={`absolute w-full transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
                                    <img src={image.venue_photo} alt={`Venue ${index}`} className="w-full h-full object-cover" />
                                </div>
                            ))
                        ) : (
                            <div>No images available</div>
                        )}
                    </div>
                    <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" onClick={handlePrev}>
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white focus:outline-none">
                            <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
                            </svg>
                            <span className="sr-only">Previous</span>
                        </span>
                    </button>
                    <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" onClick={handleNext}>
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white focus:outline-none">
                            <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                            </svg>
                            <span className="sr-only">Next</span>
                        </span>
                    </button>
                </div>

                <div className="mt-8 p-4 rounded-lg bg-gray-100 flex">
                    <div className="w-3/5 p-4">
                        <h2 className="text-xl font-semibold mb-4">Facilities</h2>
                        {venue.facilities && venue.facilities.length > 0 ? (
                            venue.facilities.map((facility) => (
                                facility.is_active ? (
                                    <div key={facility.id} className="mb-2 p-2 border border-gray-300 rounded">
                                        <h3 className="text-lg font-semibold">{facility.facility}</h3>
                                        <p>Price: ${facility.price || 'Not available'}</p>
                                    </div>
                                ) : null
                            ))
                        ) : (
                            <p>No facilities available</p>
                        )}
                    </div>

                    <div className="w-2/5 p-4 bg-blue-100 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Location</h2>
                        <p className="text-gray-700">{venue.address}</p>
                        <p className="text-gray-700">Latitude: {venue.latitude}</p>
                        <p className="text-gray-700">Longitude: {venue.longitude}</p>

                        {/* <a href={`https://www.google.com/maps?q=${venue.latitude},${venue.longitude}`} target="_blank" rel="noopener noreferrer" className="text-blue-600">View on Google Maps</a> */}

                        <Link to={`/user/venue-booking/${venue.id}`}  className="mt-2 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"> book your venue</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
