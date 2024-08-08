import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import Navb from '../../Components/User/Navb';

export default function ShowAllVenues() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [venuesList, setVenuesList] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchVenuesList = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/auth/venues-list/?search=${searchQuery}`);
        setVenuesList(response.data);
      } catch (error) {
        console.error('fetching error', error);
      }
    };
    fetchVenuesList();
  }, [searchQuery]);

  return (
    <>
      <Navb />

      <div className="container mx-auto max-w-screen-xl px-4 py-4 border bg-customColor7">
        <div className='flex justify-center pt-5  bg-gradient-to-r from-teal-500 to-gray-800 rounded-t-lg'>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Find Your View</h1>
        </div>
        <div className="flex items-center justify-between py-8 px-2  bg-gradient-to-r from-teal-500 to-gray-800">
          <button
            onClick={toggleSidebar}
            className="py-2 px-4 bg-gradient-to-r from-teal-600 to-gray-800 text-white rounded hover:bg-blue-700"
          >
            Filter
          </button>
          <div className="flex-1 flex justify-center">
            <input
              type="text"
              placeholder="Search..."
              className="border w-1/2 rounded-lg outline-teal-500 py-2 px-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex">
          {isSidebarOpen && (
            <div className="w-1/4 bg-gray-200 p-4">
              <h2 className="text-xl font-semibold mb-4">Sidebar</h2>
              <p>Future values to change</p>
            </div>
          )}

          <div className={`grid grid-cols-1 px-2 py-10 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full ${isSidebarOpen ? 'ml-4' : ''}`}>
            {venuesList.length === 0 ? (
              <div className="flex items-center justify-center w-full h-64">
                <p className="text-2xl font-bold text-gray-700">No results found</p>
              </div>
            ) : (
              venuesList.map(venue => (
                <div key={venue.id} className="bg-customColor8 rounded shadow-md overflow-hidden transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
                  {venue.images.length > 0 && (
                    <img src={venue.images[0].venue_photo} alt={venue.images[0].name} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{venue.name}</h3>
                    <p className="text-gray-600">${venue.price}</p>
                    <p className="mb-4 text-base">
                      Some quick example text to build on the card title and make up the
                      bulk of the card's content.
                    </p>
                    <Link to={`/user/show-single-venue/${venue.id}`} className="mt-2 inline-block bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700">
                      View & Book
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
