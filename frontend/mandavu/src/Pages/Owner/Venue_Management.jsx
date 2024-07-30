import { useEffect, useState } from "react";
import Sidebar from "../../Components/Owner/Sidebar";
import VenueRegister from "../../Components/Owner/VenueRegister";
import SuccessRegisterPage from "./SuccessRegister";
import VenueDetails from "./VenueDetails";
import { useSelector } from "react-redux";
import axios from "axios";



export default function VenueManagement() {
    

  const ownerId = useSelector((state)=> state.owner.owner?.id);
  const [venueDetails,setVenueDetails] = useState(null)
  const [loading,setLoading] = useState(true)
  useEffect(()=> {
    const fetchVenueDetails = async ()=>{
      if (ownerId) {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/v2/auth/venue-details/${ownerId}/`);
          setVenueDetails(response.data)
        }catch(error){
          console.error('Error fetching venue details:', error);
        }finally{
          setLoading(false)
        }
      }else{
        setLoading(false);
      }
    }
    fetchVenueDetails()
  },[ownerId])

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
        <>
          <Sidebar/>
          {!venueDetails &&  <VenueRegister/>}
          {venueDetails && venueDetails.is_verified === true && <VenueDetails venueDetails={venueDetails}/>}
          {venueDetails && venueDetails.is_verified === false && <SuccessRegisterPage/> }
         
        </>
    )
}