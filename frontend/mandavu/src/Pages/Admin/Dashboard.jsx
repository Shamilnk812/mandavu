import Sidebar from "../../Components/Admin/Sidebar";
import ChartBox from "../../Components/Common/ChartBox";
import ShowBookingDetailsChart from "../../Components/Common/ShowBookingDetailsChart";
import OwnersList from "./OwnersList";
import UserList from "./UserList";


export default function Dashboard() {
    return (
        <>

           <Sidebar/>
           <div className="p-4 sm:ml-64  ">
           <div className="p-4 border-2 border-gray-200 border-solid  rounded-lg dark:border-gray-700 mt-14">
            <ChartBox/>
             <ShowBookingDetailsChart/>

             </div>
             </div>
    
        </>
    )
}