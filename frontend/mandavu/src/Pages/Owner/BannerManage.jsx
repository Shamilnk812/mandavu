import BannerManagement from "./VenuePhotosManagement";
import { useEffect,useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import RegisterAlertMessage from "../../Components/Owner/RegisterAlertMessage";
import SuccessMessageForVenueRegister from "../../Components/Owner/SuccessVenueRegister";
import Sidebar from "../../Components/Owner/Sidebar";
import axios from "axios";
import { axiosOwnerInstance } from "../../Utils/Axios/axiosInstance";

export default function BannerManage() {


  const ownerId = useSelector((state)=> state.owner.owner?.id);
  const [venueDetails,setVenueDetails] = useState(null)
  const [loading,setLoading] = useState(true)
  const dispatch = useDispatch();

  useEffect(()=> {
    const fetchVenueDetails = async ()=>{
      if (ownerId) {
        try {
          const response = await axiosOwnerInstance.get(`venue-details/${ownerId}/`);
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