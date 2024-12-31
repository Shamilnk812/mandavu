import { useEffect, useState } from "react"
import Sidebar from "../../Components/Admin/Sidebar"
import axios from "axios"
import { axiosAdminInstance } from "../../Utils/Axios/axiosInstance"
import { toast } from "react-toastify"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AnnouncementIcon from '@mui/icons-material/Announcement';


export default function UserInquiry() {

    const [messages, setMessages] = useState([])
    useEffect(() => {
        fetchUserInquiries()
    }, [])


    const fetchUserInquiries = async () => {
        try {
            const response = await axiosAdminInstance.get('get-user-inquiries/')
            console.log(response.data)
            setMessages(response.data)
        } catch (error) {
            console.error("error", error)
            toast.error("Failed to fetch user inquiries. Please try again later.")
        }
    }


    return (
        <>
            <Sidebar />
            <div className="p-4 sm:ml-64  ">
                <div className="p-4 border-2 border-gray-200 border-solid  rounded-lg dark:border-gray-700 mt-14">

                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">User Inquiry</h2>

                    </div>


                    <div className=" p-10 h-[700px] overflow-y-auto">
                        {/* Displaying User Inquiries */}
                        {messages.length === 0 ? (
                            <p className="text-gray-500 text-center">No inquiries found.</p>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className="border bg-white rounded shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
                                    >
                                        {/* User Name and Date */}
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-base font-semibold text-teal-700">
                                                <AccountCircleIcon />  {message.user_name}
                                            </h3>
                                            <span className="text-sm text-gray-500">
                                                {new Date(message.created_at).toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Email */}
                                        <p className="text-gray-600 text-sm mb-3">
                                            <span className="font-semibold text-gray-600">Email: </span>
                                            {message.email}
                                        </p>

                                        {/* Message Content */}
                                        <p className="text-gray-700 bg-gray-100 p-2 rounded shadow">
                                            <span className="font-semibold text-gray-600 mr-1"><AnnouncementIcon /> </span>
                                            {message.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            </div>


        </>
    )
}