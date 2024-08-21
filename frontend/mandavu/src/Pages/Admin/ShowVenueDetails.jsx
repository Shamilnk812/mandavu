import { useParams } from "react-router-dom";
import Sidebar from "../../Components/Admin/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import ShowOwnerDetailsCmp from "../../Components/Admin/ShowOwnerDetailsCmp";
import ShowVenueDetailsCmp from "../../Components/Admin/ShowVenueDetailsCmp";
import { toast } from "react-toastify";
import ShowFacilitiesCmp from "../../Components/Admin/ShowFacilitiesCmp";



export default function ShowVenueDetails() {

    const {venueId} = useParams()
    const [owner, setOwner] = useState('')
    const [facilities, setFacilities] = useState([])
    const [events, setEvents] = useState([])
    
    useEffect(()=> {
        const fetchVenueDetails =  async ()=> {
            try{
                const response = await axios.get(`http://localhost:8000/api/admin_dash/auth/venue-details/${venueId}/`)
                setOwner(response.data)
                console.log(response.data)
            }catch(error) {
                console.error('Error fetching venue details', error);
            }
        }
        fetchVenueDetails()
    },[venueId])

    useEffect(()=> {
        const fetchFacilities = async () => {
            try{
              const response = await axios.get(`http://localhost:8000/api/v2/auth/get-facility/${venueId}/`)
              setFacilities(response.data)
            }catch(error) {
                toast.error('Failed to fetch facilities. Plase try again later')
            }
        }
        fetchFacilities();
     },[venueId])


     useEffect(()=> {
        const fetchEvents = async ()=> {
            try{
                const response = await axios.get(`http://127.0.0.1:8000/api/v2/auth/get-all-events/${venueId}/`)
                setEvents(response.data)
                console.log(response.data)
            }catch(error) {
                toast.error('Failed to fetch facilities. Plase try again later')
            }
        }
        fetchEvents();
     },[venueId])

    return(
        <>
        <Sidebar/>
        <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-solid rounded-lg dark:border-gray-700 mt-14">
            <div className="flex justify-center items-center mb-4">
                <h2 className="text-xl font-semibold">Venue Details</h2>
            </div>

          <div className="flex bg-gray-800 p-14 gap-8">
                <ShowOwnerDetailsCmp owner={owner}/>

              {/* <div className="w-1/2 bg-red-200"> */}
                    <ShowVenueDetailsCmp owner={owner}/>
              {/* </div> */}
          </div>  

          <div className="flex bg-gray-800 mt-10 p-14 gap-8">
                 <ShowFacilitiesCmp facilities={facilities}/>


               <div className="w-1/2">
               <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Event Photo
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Event Name
                                </th>
                            </tr>
                        </thead>
        <tbody>
            {events.map((event,index) =>(
                <tr key={event.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <img src={event.event_photo} alt={event.event_name} className="w-20 h-auto" />
                </th>
                <td className="px-6 py-4">
                   {event.event_name}
                </td>
                
                
               
            </tr>
            ))}
             
            
          
        </tbody>
    </table>
</div>
               </div>
            </div>  

        





    </div>
</div>


        </>
    )
}