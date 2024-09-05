import { useEffect, useState } from "react"
import Sidebar from "../../Components/Owner/Sidebar"
import { useParams } from "react-router-dom"
import ViewSingleBookingDetailsCmp from "../../Components/Common/ViewSingleBookingDetailsCmp"
import axios from "axios"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"

export default function OwnerViewSingleBookingDetails(){
    const {id} = useParams()
    const venueId = useSelector((state) => state.owner.venueId);
    const [bookingDetails,setBookingDetails] = useState('')
    console.log('boooooo',bookingDetails)

    const fetchBookingDetails = async ()=> {
        try{
            const response = await axios.get(`http://127.0.0.1:8000/api/v2/auth/get-single-booking-details/${id}/`);
            const bookingData = response.data.length > 0 ? response.data[0] : {};
            setBookingDetails(bookingData)
            console.log(bookingData)

        }catch(error){
            toast.error('Failed to fetch bookingdetails. Please try again later')
        }
    }

    useEffect(()=> {
        fetchBookingDetails();
    },[])

    return(
        <>
           <Sidebar/>
           <div className="bg-customColor7 flex">
                <div className="flex-1 p-10 text-2xl ml-64">
                    <div className="bg-customColor8 rounded-lg shadow-lg pb-10 mt-16">
                        <h3 className="text-2xl bg-gradient-to-r from-teal-500 to-gray-800 font-semibold mb-4 py-3 text-center text-white rounded-tl-lg rounded-tr-lg">Booking Details</h3>
                          <div className="flex justify-center py-10 ">
                          <div className="w-3/5">
                          <ViewSingleBookingDetailsCmp booking={bookingDetails} id={venueId}/>
                          </div>
                          </div>
                    </div>             
               </div>             
            </div>             
        </>
    )
}