import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import Navb from '../../Components/User/Navb';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { toast } from 'react-toastify';


export default function ShowAllVenues() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [venuesList, setVenuesList] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [diningSeatCount, setDiningSeatCount] = useState(0);
  const [auditoriumSeatCount, setAuditoriumSeatCount] = useState(0);
  // const [priceRange, setPriceRange] = useState([0, 10000]); // Example range
  const [priceRange, setPriceRange] = useState([0,0]);

  const handleSliderChange = (values) => {
    setPriceRange(values);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchVenuesList = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/auth/venues-list/`, {
        params: {
          search: searchQuery,
          page: currentPage,
        },
      });
      setVenuesList(response.data.results);
      setTotalPages(response.data.total_pages);
      console.log(response.data);
    } catch (error) {
      console.error('fetching error', error);
    }
  };


  const fetchFilteredVenues = async () => {
    if (
      !diningSeatCount && // diningSeatCount is 0 or empty
      !auditoriumSeatCount && // auditoriumSeatCount is 0 or empty
      (priceRange[0] === 0 ) && // min price is default (assuming 0 or 1000 as default)
      (priceRange[1] === 0 ) // max price is default (assuming 1000000 as default)
    ) {
      // Show a toast error if all filters are empty
      toast.warn('Please fill in at least one filter before applying!');
      return; // Prevent the API call
    }
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/auth/venues-list/`, {
        params: {
          search: searchQuery,
          page: currentPage,
          dining_seat_count: diningSeatCount,
          auditorium_seat_count: auditoriumSeatCount,
          min_price: priceRange[0],
          max_price: priceRange[1],
        },
      });
      setVenuesList(response.data.results);
      setTotalPages(response.data.total_pages);
      console.log(response.data);
    } catch (error) {
      console.error('fetching error', error);
    }
  };

  useEffect(() => {
    
    fetchVenuesList();
  }, [searchQuery, currentPage]);

  
  return (
    <>
      <Navb />

      <div className="container mx-auto max-w-screen-xl px-4 py-4 border bg-customColor7">
        <div className='flex justify-center pt-5 bg-gradient-to-r from-teal-500 to-gray-800 rounded-t-lg'>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Find Your View</h1>
        </div>
        <div className="flex items-center justify-between py-8 px-2 bg-gradient-to-r from-teal-500 to-gray-800">
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
              <div className="mb-4">
                <label className="block text-gray-700">Dining Seat Count</label>
                <input
                  type="number"
                
                  onChange={(e) => setDiningSeatCount(parseInt(e.target.value, 10))}
                  className="border rounded-lg w-full py-2 px-4 mt-1"
                />
              </div>
              <div className="mb-4">
    <label className="block text-gray-700">Auditorium Seat Count</label>
    <input
      type="number"
  
      onChange={(e) => setAuditoriumSeatCount(parseInt(e.target.value, 10))}
      className="border rounded-lg w-full py-2 px-4 mt-1"
    />
  </div>
  
  {/* Price Range */}
  <div className="mb-4">
      <label className="block text-gray-700">Price Range</label>
      <Slider
        range
        min={0}
        max={1000000}
        step={100}
        defaultValue={priceRange}
        value={priceRange}
        onChange={handleSliderChange}
        // trackStyle={[{ backgroundColor: 'teal', height: 8 }]} // Track style
        // handleStyle={[
        //   { borderColor: 'teal', height: 14, width: 14, backgroundColor: 'white' }, // Left handle
        //   { borderColor: 'teal', height: 24, width: 24, marginTop: -8, backgroundColor: 'white' }, // Right handle
        // ]}
        // railStyle={{ backgroundColor: '#ddd', height: 8 }} // Inactive rail
        className="mt-2"
      />
      <p className="text-gray-600">
        From ${priceRange[0]} to ${priceRange[1]}
      </p>
    </div>
  
  {/* Apply Button */}
  <button
    onClick={fetchFilteredVenues}
    className="py-2 px-4 bg-teal-600 text-white rounded hover:bg-teal-700"
  >
    Apply
  </button>
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
                    <h3 className="text-xl font-semibold">{venue.convention_center_name}</h3>
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

        {venuesList.length > 0 && (
          <div className="flex justify-center mt-10 mb-5">
            <div className="p-4 flex items-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-full text-white transition-colors duration-300 text-sm
                ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'}`}
              >
                <NavigateBeforeIcon/>
              </button>
              <span className="mx-4 text-sm">Page <span className="bg-blue-300 p-1.5">{currentPage}</span> of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full text-white transition-colors duration-300 text-sm
                ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'}`}
              >
                <NavigateNextIcon/>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
