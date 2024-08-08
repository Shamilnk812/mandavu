import BannerManagement from "./BannerManagement";
import { useEffect,useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import RegisterAlertMessage from "../../Components/Owner/RegisterAlertMessage";
import SuccessMessageForVenueRegister from "../../Components/Owner/SuccessVenueRegister";
import Sidebar from "../../Components/Owner/Sidebar";
import axios from "axios";

export default function BannerManage() {


  const ownerId = useSelector((state)=> state.owner.owner?.id);
  const [venueDetails,setVenueDetails] = useState(null)
  const [loading,setLoading] = useState(true)
  const dispatch = useDispatch();

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



    return(
        <>
          <Sidebar/>

          {!venueDetails &&  <RegisterAlertMessage/>}
          {venueDetails && venueDetails.is_verified === true && <BannerManagement/>}
          {venueDetails && venueDetails.is_verified === false && <SuccessMessageForVenueRegister/> }
         
        
        </>
    )
}