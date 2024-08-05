import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import Navb from '../../Components/User/Navb';




export default function ShowAllVenues() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [venuesPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  // const [filteredVenues, setFilteredVenues] = useState(venues);

  const [venuesList, setVenuesList] = useState([])
  console.log(venuesList)

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


  // const indexOfLastVenue = currentPage * venuesPerPage;
  // const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;
  // const currentVenues = filteredVenues.slice(indexOfFirstVenue, indexOfLastVenue);

  // const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
     <>
    <Navb/>

    <div className="container  mx-auto max-w-screen-xl px-4 py-4  bg-customColor1">
        <div className='flex justify-center'>
            <h1> find your view</h1>
        </div>
      <div className="flex items-center justify-between py-4">
        <input
          type="text"
          placeholder="Search..."
          className="border w-1/2 rounded py-2 px-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={toggleSidebar}
          className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Toggle Sidebar
        </button>
      </div>

      <div className="flex">
        {isSidebarOpen && (
          <div className="w-1/4 bg-gray-100 p-4">
            <h2 className="text-xl font-semibold mb-4">Sidebar</h2>
            <p>Future values to change</p>
            {/* Add more sidebar content here */}
          </div>
        )}

        <div className={`grid grid-cols-1 px-2 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full ${isSidebarOpen ? 'ml-4' : ''}`}>

          {venuesList.map(venue => (
            <div key={venue.id} className="bg-white rounded shadow-md overflow-hidden">

              {venue.images.length > 0 && (
                  <img src={venue.images[0].venue_photo} alt={venue.images[0].name} className="w-full h-48 object-cover" />
                )}
              <div className="p-4">
                <h3 className="text-xl font-semibold">{venue.name}</h3>
                <p className="text-gray-600">${venue.price}</p>
                <p class="mb-4 text-base">
                    Some quick example text to build on the card title and make up the
                    bulk of the card's content.
                    </p>
                <Link to={`/user/show-single-venue/${venue.id}`} className="mt-2 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                  View & Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>





      {/* <div className="flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="py-2 px-4 bg-gray-300 text-gray-700 rounded-l hover:bg-gray-400"
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredVenues.length / venuesPerPage)}
          className="py-2 px-4 bg-gray-300 text-gray-700 rounded-r hover:bg-gray-400"
        >
          Next
        </button>
      </div> */}
    </div>
    </>
  );

}
