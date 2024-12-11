import { useEffect, useState } from "react"
import { axiosOwnerInstance, axiosUserInstance } from "../../Utils/Axios/axiosInstance"
import { toast } from "react-toastify"
import { motion, AnimatePresence } from 'framer-motion';
import SelectBookingPackagesCard from "./SelectBookingPackageCard";
import EventCard from "./EventCard";
import { useDispatch } from "react-redux";
import { setBookingDetails } from "../../Redux/Slices/User";
import { useNavigate } from "react-router-dom";



export default function SelectEventsModal({ venueId, isEventModalOpen, handleCloseEventModal }) {

  const [events, setEvents] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // get-all-booking-packages
  useEffect(() => {
    const fetchEventsDetails = async () => {
      try {
        const response = await axiosUserInstance.get(`venue-events-details/${venueId}/`);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events details:', error);
        toast.error('Failed to fetch events details! Please try again later.');
      }
    };

    const fetchBookingPackages = async () => {
      try {
        const response = await axiosOwnerInstance.get(`get-all-booking-packages/${venueId}/`);
        setPackages(response.data)
        console.log('packaaa', response.data)
      } catch (error) {
        toast.error('Failed to fetch booking packages. Please try again later.')
      }
    }
    if (isEventModalOpen) {
      fetchEventsDetails();
      fetchBookingPackages()
    }
  }, [venueId, isEventModalOpen]);


  const handleEventSelect = (event) => {
    setSelectedEvent(event.event_name);
  };

  const handlePackageSelect = (packageType) => {
    setSelectedPackage(packageType);
  };

  const handleBooking = () => {
    
    dispatch(setBookingDetails({selectedEvent,selectedPackage}))
    console.log("Booking event:", selectedEvent, "with package:", selectedPackage);
    handleCloseEventModal();
    navigate(`/user/venue-booking-step1/${venueId}`)
  };

  if (!isEventModalOpen) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };

  const packageVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } }
  };

  return (
    <>
      <AnimatePresence>
        {isEventModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-center items-center"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            {/* Dark Background */}
            <div className="fixed inset-0 bg-black opacity-50"></div>

            {/* Modal Container */}
            <motion.div
              className="relative bg-white rounded-lg p-8 shadow-lg w-4/5 md:w-2/5 max-h-[90vh] overflow-y-auto"
              variants={modalVariants}
            >
              <h2 className="text-2xl font-bold mb-12 text-gray-800 text-center relative">
                Select an Event
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-8px] w-1/2 h-0.5 bg-transparent border-b-2 border-teal-600 rounded-full" style={{ backgroundImage: 'radial-gradient(circle, teal 20%, transparent 20%)', backgroundSize: '10px 10px', backgroundPosition: '0 100%' }}></span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} handleEventSelect={handleEventSelect} selectedEvent={selectedEvent} />
                ))}
              </div>

              {/* Package Selection */}
              <AnimatePresence>
                {selectedEvent && (
                  <motion.div
                    className="mt-6"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={packageVariants}
                  >
                    <h2 className="text-xl font-bold pt-5 mb-12 text-gray-800 text-center relative">
                      Package Details
                      <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-8px] w-1/2 h-0.5 bg-transparent border-b-2 border-teal-600 rounded-full" style={{ backgroundImage: 'radial-gradient(circle, teal 20%, transparent 20%)', backgroundSize: '10px 10px', backgroundPosition: '0 100%' }}></span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {packages.map((bookingPackage) => (

                        <SelectBookingPackagesCard key={bookingPackage.id} bookingPackage={bookingPackage} selectedPackage={selectedPackage} handlePackageSelect={handlePackageSelect} />
                      ))}

                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                  onClick={handleCloseEventModal}
                >
                  Close
                </button>
                <button
                  className="bg-teal-500 text-white py-2 px-4 rounded"
                  onClick={handleBooking}
                  disabled={!selectedEvent || !selectedPackage}
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}