import { useEffect, useState } from "react";
import Sidebar from "../../Components/Admin/Sidebar";
import AnalyticsIcon from '@mui/icons-material/Analytics';
import axios from "axios";
import { toast } from "react-toastify";
import ChartBox1 from "../../Components/Common/Charts/ChartBox1";
import ChartBox2 from "../../Components/Common/Charts/ChartBox2";
import ShowBookingStatusChart from "../../Components/Common/Charts/ShowBookingDetailsChart";
import ShowRevenueChart from "../../Components/Common/Charts/ShowRevenueChart";
import GroupIcon from '@mui/icons-material/Group';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AllUsersCountChart from "../../Components/Common/Charts/ShowUsersCountChart";


export default function Dashboard() {
    
    const [bookingStatus, setBookingStatus] = useState([])
    const [allUsersCount, setAllUsersCount] = useState([])

    const fetchBookingStatus = async()=> {
        try{
            const response = await axios.get('http://localhost:8000/api/admin_dash/auth/get-booking-status')
            // console.log(response.data)
            setBookingStatus(response.data)
        }catch(error) {
            toast.error('Failed to fetch Bookings Status. Please try again later')
        }
    }
    

    const fetchAllUesrsCount = async()=> {
        try{
            const response = await axios.get('http://localhost:8000/api/admin_dash/auth/get-allusers-status')
            // console.log(response.data)
            setAllUsersCount(response.data)
            
        }catch(error) {
            toast.error('Failed to fetch All Users stats. Plase try again later')
        }
    }




    useEffect(()=> {
        fetchBookingStatus();
        fetchAllUesrsCount();

    },[])

    return (
        <>

           <Sidebar/>
           <div className="p-4 sm:ml-64  ">
           <div className="p-4 border-2 border-gray-200 border-solid  rounded-lg dark:border-gray-700 mt-14">
          <ChartBox2  icon3={<LeaderboardIcon/>} titel={'Revenue Report'} baarchart={<ShowRevenueChart/>}></ChartBox2> 
          <ChartBox1 
          icon1={<AnalyticsIcon/>} title1={'Bookings Details'} chart1={<ShowBookingStatusChart bookingStatus={bookingStatus}/>} icon2={<GroupIcon/>} title2={'All Users'} chart2={<AllUsersCountChart allUsersCount={allUsersCount}/>}
          
          ></ChartBox1>
            

             </div>
             </div>
    
        </>
    )
}