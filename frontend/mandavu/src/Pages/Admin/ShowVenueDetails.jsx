import { useParams } from "react-router-dom";
import Sidebar from "../../Components/Admin/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";



export default function ShowVenueDetails() {

    const {venueId} = useParams()
    const [venue, setVenue] = useState('')
    
    useEffect(()=> {
        const fetchVenueDetails =  async ()=> {
            try{
                const response = await axios.get(`http://localhost:8000/api/admin_dash/auth/venue-details/${venueId}/`)
                setVenue(response.data)
                console.log(response.data)
            }catch(error) {
                console.error('Error fetching venue details', error);
            }
        }
        fetchVenueDetails()
    },[venueId])


    return(
        <>
        <Sidebar/>
        <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-solid rounded-lg dark:border-gray-700 mt-14">
            <div className="flex justify-center items-center mb-4">
                <h2 className="text-xl font-semibold">Venue Details</h2>
            
            </div>

        <div className="flex space-x-4">
            
            <div className="flex-1 p-4 border-2 border-gray-200 border-solid rounded-lg dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                <h3 className="text-lg text-white font-semibold mb-4">Venue</h3>
                <div className="space-y-4">

                   <div>
                        <label htmlFor="venueName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Venue Name
                        </label>
                        <input
                            type="text"
                            id="venueName"
                            value={venue.name}
                            disabled
                            name="venue"
                            className="block w-full px-3 py-1.5 border rounded dark:bg-gray-800 dark:text-gray-300 text-sm"
                        />
                    </div>
                   <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email Address
                        </label>
                        <input
                            type="text"
                            id="email"
                            value={venue.email}
                            disabled
                            name="email"
                            className="block w-full px-3 py-1.5 border rounded dark:bg-gray-800 dark:text-gray-300 text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={venue.description}
                            disabled
                            name="description"
                            rows="4"
                            className="block w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-300 text-sm"
                            placeholder="Enter the address here..."
                        ></textarea>
                    </div>
                    <div className="flex flex-col md:flex-row md:space-x-4">
                        <div className="flex-1">
                            <label htmlFor="venueOwnerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Venue Onwer Name
                            </label>
                            <input
                                type="text"
                                id="venueOwnerName"
                                // value={formValues.name}
                                // onChange={handleInputChange}
                                name="venueOwnerName"
                                className="block w-full px-3 py-1.5 border rounded dark:bg-gray-800 dark:text-gray-300 text-sm"
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Phone
                            </label>
                            <input
                                type="text"
                                id="phone"
                                value={venue.phone}
                                disabled
                                name="phone"
                                className="block w-full px-3 py-1.5 border rounded dark:bg-gray-800 dark:text-gray-300 text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:space-x-4">
                        <div className="flex-1">
                            <label htmlFor="diningSeatCount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Dining Seat Count
                            </label>
                            <input
                                type="text"
                                id="diningSeatCount"
                                value={venue.dining_seat_count}
                                disabled
                                name="diningSeatCount"
                                className="block w-full px-3 py-1.5 border rounded dark:bg-gray-800 dark:text-gray-300 text-sm"
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="auditoriamSeatCount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Auditoriam Seat Count
                            </label>
                            <input
                                type="text"
                                id="auditoriamSeatCount"
                                value={venue.auditorium_seat_count}
                                disabled
                                name="auditoriamSeatCount"
                                className="block w-full px-3 py-1.5 border rounded dark:bg-gray-800 dark:text-gray-300 text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:space-x-4">
                        <div className="flex-1">
                            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Condition
                            </label>
                            <input
                                type="text"
                                id="condition"
                                value={venue.condition}
                                disabled
                                name="name"
                                className="block w-full px-3 py-1.5 border rounded dark:bg-gray-800 dark:text-gray-300 text-sm"
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Price
                            </label>
                            <input
                                type="text"
                                id="price"
                                value={venue.price}
                                disabled
                                name="email"
                                className="block w-full px-3 py-1.5 border rounded dark:bg-gray-800 dark:text-gray-300 text-sm"
                            />
                        </div>
                    </div>

                    
                    <div>
                        <label htmlFor="venueAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Address
                        </label>
                        <textarea
                            id="venueAddress"
                            value={`${venue.address}, ${venue.district}, ${venue.state}`}
                            disabled
                            name="address"
                            rows="4"
                            className="block w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-300 text-sm"
                            
                        ></textarea>
                    </div>
                   
                </div>
            </div>

            <div className="flex-1 p-4 border-2 border-gray-200 border-solid rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <h3 className="text-lg font-semibold mb-4">Facilities and Events</h3>
                {/* <Placeholder for future content  */}
                <p className="text-gray-500 dark:text-gray-400">Facilities.</p>
            </div>
        </div>
    </div>
</div>


        </>
    )
}