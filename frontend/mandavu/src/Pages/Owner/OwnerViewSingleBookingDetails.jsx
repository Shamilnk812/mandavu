import { useEffect, useState } from "react"
import Sidebar from "../../Components/Owner/Sidebar"
import { useParams } from "react-router-dom"
import ViewSingleBookingDetailsCmp from "../../Components/Common/ViewSingleBookingDetailsCmp"
import axios from "axios"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import { axiosOwnerInstance } from "../../Utils/Axios/axiosInstance"



export default function OwnerViewSingleBookingDetails(){
    const {id} = useParams()
    const venueId = useSelector((state) => state.owner.venueId);
    const [bookingDetails,setBookingDetails] = useState('')

    const fetchBookingDetails = async ()=> {
        try{
            const response = await axiosOwnerInstance.get(`get-single-booking-details/${id}/`);
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
                    <div className="bg-white rounded-lg shadow-lg py-10 mt-16">
                          <div className="flex justify-center ">
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