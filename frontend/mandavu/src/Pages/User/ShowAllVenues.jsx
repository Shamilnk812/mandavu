import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import Navb from '../../Components/User/Navb';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { toast } from 'react-toastify';
import { axiosUserInstance } from '../../Utils/Axios/axiosInstance';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FooterCmp from '../../Components/User/Footer';
import toPascalCase from '../../Utils/Extras/ConvertToPascalCase';
import LoadingAnimation from '../../Components/Common/LoadingAnimation';
import PaginationCmp from '../../Components/Admin/PaginationCmp';


export default function ShowAllVenues() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [venuesList, setVenuesList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [diningSeatCount, setDiningSeatCount] = useState(0);
  const [auditoriumSeatCount, setAuditoriumSeatCount] = useState(0);
  // const [priceRange, setPriceRange] = useState([0, 10000]); // Example range
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [loading, setLoading] = useState(false)

  const scrollVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };


  const handleSliderChange = (values) => {
    setPriceRange(values);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchVenuesList = async () => {
    setLoading(true)
    try {
      const response = await axiosUserInstance.get(`venues-list/`, {
        params: {
          search: searchQuery,
          page: currentPage,
        },
      });
      setVenuesList(response.data.results);
      console.log(response.data.results)
      setTotalPages(response.data.total_pages);
      console.log(response.data);
    } catch (error) {
      console.error('fetching error', error);
    } finally {
      setLoading(false)
    }
  };


  const fetchFilteredVenues = async () => {
    if (
      !diningSeatCount && // diningSeatCount is 0 or empty
      !auditoriumSeatCount && // auditoriumSeatCount is 0 or empty
      (priceRange[0] === 0) && // min price is default (assuming 0 or 1000 as default)
      (priceRange[1] === 0) // max price is default (assuming 1000000 as default)
    ) {
      // Show a toast error if all filters are empty
      toast.warn('Please fill in at least one filter before applying!');
      return; // Prevent the API call
    }
    try {
      const response = await axiosUserInstance.get(`venues-list/`, {
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



  if (loading) {
    return <LoadingAnimation />
  }

  return (
    <>
      <Navb />

      <div className="container mx-auto max-w-screen-xl px-4 py-4 border bg-customColor7">

        <div className="py-6 px-2 bg-gradient-to-r from-teal-800 to-gray-800 shadow-xl rounded-t-lg">

          <div className='flex justify-center  rounded-t-lg mb-4'>
            <h1 className="text-2xl font-semibold text-white ">Find Your Dream Venues</h1>
          </div>

          <div className='flex items-center gap-1'>
            <button
              onClick={toggleSidebar}
              className="py-2 px-4 bg-white text-teal-600 rounded hover:bg-gray-200 transition-all duration-300"
            >
              <TuneRoundedIcon />
            </button>
            <div className="flex-1 flex justify-center">
              <input
                type="text"
                placeholder="Search..."
                className="border w-2/3 sm:w-1/2 rounded-lg outline-teal-500 py-2 px-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

        </div>






        <div className="flex">
          {isSidebarOpen && (
            // <div className="w-1/4 bg-gray-200 p-4 fixed top-[225px] left-[140px] h-full overflow-auto z-50">
            <motion.div
              className="w-1/4 bg-gray-200 p-4 shadow "
              initial="hidden"
              whileInView="visible"
              variants={scrollVariants}
              viewport={{ once: true }}
            >

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
            </motion.div>
          )}


          <motion.div
            className={`grid grid-cols-1 px-2 py-10 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full ${isSidebarOpen ? 'ml-4' : ''}`}
            initial="hidden"
            whileInView="visible"
            variants={scrollVariants}
            viewport={{ once: true }}
          >
            {venuesList.length === 0 ? (
              <div className="flex items-center justify-center w-full h-64">
                <p className="text-xl font-semibold text-gray-600">No results found</p>
              </div>
            ) : (
              venuesList.map(venue => (
                <div key={venue.id} className="bg-white rounded shadow-md overflow-hidden transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
                  {venue.images.length > 0 && (
                    <img src={venue.images[0].venue_photo} alt={venue.images[0].name} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-600 text-center border-b border-gray-300 pb-1 mb-3 ">{venue.convention_center_name}</h3>

                    <p className="mb-2 text-gray-500 text-base">
                      {/* {venue.short_description} */}
                      {venue.short_description.slice(0, 80)}{venue.short_description.length > 80 ? "..." : ""}

                    </p>
                    <p className="text-sm text-gray-500 "><LocationOnIcon className="text-teal-600 inline-block mr-1" /> {venue.address}</p>
                    <p className="text-sm text-gray-500 ml-6 mb-3">{toPascalCase(venue.city)},{toPascalCase(venue.district)}, {toPascalCase(venue.state)}</p>
                    <p className="text-lg font-semibold text-gray-500 mb-3 ml-2">${venue.price}</p>
                    {venue.is_under_maintenance ? (
                      <div className="text-red-500 text-center ">
                        <p className="text-base font-semibold">This venue is under maintenance. <br /> <span className='text-sm '>12/12/2024 to 19/12/2024 </span></p>

                      </div>
                    ) : (

                      <div className='flex justify-end'>
                        <Link to={`/user/show-single-venue/${venue.id}`} className="mt-2 inline-block bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-all duration-300">
                          <CalendarMonthRoundedIcon className='mr-2' />  Book Now
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </div>




        {venuesList.length > 0 && (
          <PaginationCmp setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />
        )}
      </div>

      <FooterCmp />
    </>
  );
}




