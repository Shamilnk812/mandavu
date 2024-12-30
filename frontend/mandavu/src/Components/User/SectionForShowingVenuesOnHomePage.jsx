
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import toPascalCase from "../../Utils/Extras/ConvertToPascalCase";

const SectionForShowingVenuesOnHomePage = ({scrollVariants,venues}) => {
    return (

        <>
            <section
                className="pt-10 pb-24 bg-gray-100 relative z-20 rounded-xl"
                style={{
                    marginTop: '-140px',
                    // backgroundColor: 'rgb(255, 255, 255)',
                    backdropFilter: 'blur(5px)',
                }}
            >
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={scrollVariants}
                    viewport={{ once: true }}
                >
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <motion.h2
                            className="text-2xl font-semibold border-b-2 border-gray-200 inline-block pb-1  text-gray-500 mb-2"
                            initial="hidden"
                            whileInView="visible"
                            variants={scrollVariants}
                            viewport={{ once: true }}
                        >
                            Explore Our Venues
                        </motion.h2>
                       
                        <motion.p
                            className="text-base text-gray-500 max-w-xl mx-auto"
                            initial="hidden"
                            whileInView="visible"
                            variants={scrollVariants}
                            viewport={{ once: true }}
                        >
                            Browse through a curated selection of venues perfect for your next event.
                        </motion.p>
                    </div>

                    {/* Cards Grid */}
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 lg:px-16"
                        initial="hidden"
                        whileInView="visible"
                        variants={scrollVariants}
                        viewport={{ once: true }}
                    >
                        {venues.map((venue) => (
                            <motion.div
                                key={venue.id}
                                className="bg-white rounded shadow-md overflow-hidden transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
                           
                            >
                                <img
                                    src={venue.images && venue.images[0]?.venue_photo}
                                    alt={venue.images && venue.images[0]?.name || "Venue Image"}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-gray-600 text-center border-b border-gray-300 pb-1 mb-3">{venue.convention_center_name}</h3>
                                    <p className="mb-2 text-gray-500 text-base mb-3">{venue.short_description.slice(0, 80)}{venue.short_description.length > 80 ? "..." : ""}</p>
                                    <p className="text-sm text-gray-500 "><LocationOnIcon className="text-teal-600 inline-block mr-1"/> {venue.address}</p>
                                    <p className="text-sm text-gray-500 ml-6 mb-3">{toPascalCase(venue.city)},{toPascalCase(venue.district)}, {toPascalCase(venue.state)}</p>

                                    <p className="text-lg font-semibold text-gray-500 mb-3 ml-2">${venue.price}</p>
                                    <div className="flex justify-end">
                                        <Link
                                            to={`/user/show-single-venue/${venue.id}`}
                                            className="mt-2 inline-block bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-all duration-300"
                                        >
                                           <CalendarMonthIcon/>  Book Now
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* View All Venues Button */}
                    <motion.div
                        
                        initial="hidden"
                        whileInView="visible"
                        variants={scrollVariants}
                        viewport={{ once: true }}
                    >
                        <div className="flex justify-center mt-16">
                            <Link
                                className="mt-2 border-2 border-teal-600 text-teal-600 py-3 px-8 rounded-lg shadow-lg hover:bg-teal-600 hover:text-white hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
                                to="/user/show-all-venues"
                            >
                                Explore More
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </section>
        </>
    )
}



export default SectionForShowingVenuesOnHomePage;