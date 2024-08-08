import Navb from "../../Components/User/Navb";
import { useNavigate } from "react-router-dom";



export default function PaymentSuccess() {
    const navigate = useNavigate()
    return(
        <>
        <Navb/>
            <div className="container mx-auto max-w-screen-xl px-4 pt-10 ">
               <div className="p-6 bg-green-100 border border-green-300 rounded-md">
                    <h2 className="text-2xl font-bold text-green-700 mb-4">Booking Successful!</h2>
                    <p className="text-lg text-green-600">Your booking was completed successfully. Thank you for choosing our service!</p>
                    <div className="flex justify-center space-x-4 mt-10 mb-10">

                    <button onClick={()=> navigate('/user/show-booking-details')} className="mt-2 bg-teal-600 text-white text-sm py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800">View Booking</button>
                    <button onClick={()=> navigate('/user/home')} className="mt-2 bg-teal-600 text-white text-sm py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800">Go Back To Home</button>
                    </div>
                </div>
            </div>   

        </>
    )
}