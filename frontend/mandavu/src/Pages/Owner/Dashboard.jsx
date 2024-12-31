import Navbar from "../../Components/Owner/Navbar";
import OwnerChartBox1 from "../../Components/Owner/OwnerChartBox1";
import Sidebar from "../../Components/Owner/Sidebar";
import OwnerDetails from "./OwnerDetails";
import { useSelector } from "react-redux";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AnalyticsIcon from '@mui/icons-material/Analytics';

import OwnerRevenueChart from "../../Components/Owner/OwnerRevenueChart";
import OwnerChartBox2 from "../../Components/Owner/OwnerChartBox2";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import ShowBookingStatusChart from "../../Components/Common/Charts/ShowBookingDetailsChart";
import { axiosOwnerInstance } from "../../Utils/Axios/axiosInstance";




export default function Dashboard_Owner() {
  const venueId = useSelector((state) => state.owner?.venueId);
  const [bookingStatus,setBookingStatus] = useState([])
  const [totalRevenue, setTotalRevenue] = useState('')
  const [maintenanceStatus, setMaintenanceStatus] = useState(null)

  const fetchBookingStatus = async ()=> {
    try{
      const response = await axiosOwnerInstance.get('get-booking-status',{params:{
        venue_id :venueId,
      }})
      const data = response.data
      setBookingStatus(data.slice(0, 3))
      console.log(response.data)
      const totalRevenue = data[3]?.total_revenue;
      setTotalRevenue(totalRevenue)
      const maintenanceStatus = data[4]?.maintenance_status;
      setMaintenanceStatus(maintenanceStatus)
      
    }catch(error){
      console.log('error is ',error)
      toast.error('Failed to fetch bookingStatus. Please try again later')
    }
  }

  useEffect(()=> {
    fetchBookingStatus();
  },[])

  console.log('venjesdjfk',venueId)
    return (
        <>
     
          <Sidebar/>
          <div className="p-4 sm:ml-64  ">
          <div className="p-4 border-2 border-gray-200 border-solid  rounded-lg dark:border-gray-700 mt-14">     
              <OwnerChartBox1 
                title={'Revenue'} 
                icon={<LeaderboardIcon/>} 
                bchart={<OwnerRevenueChart/>} 
                totalRevenue={totalRevenue} 
                maintenanceStatus={maintenanceStatus}
                fetchBookingStatus={fetchBookingStatus}
                 />

              <OwnerChartBox2 
                title={'Booking Status'} 
                icon={<AnalyticsIcon/>} 
                pchart={<ShowBookingStatusChart 
                bookingStatus={bookingStatus}/>}
              />

            </div>
            </div>


        </>
    )
}