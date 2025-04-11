import { useEffect, useState } from "react"
import Sidebar from "../../Components/Admin/Sidebar"
import axios from "axios"
import { axiosAdminInstance } from "../../Utils/Axios/axiosInstance"
import { toast } from "react-toastify"
import AnnouncementIcon from '@mui/icons-material/Announcement';
import PersonIcon from '@mui/icons-material/Person';
import UserInquiryReplayModal from "../../Components/Admin/UserInquiryReplayModal"
import ReplyIcon from '@mui/icons-material/Reply';
import ReportIcon from '@mui/icons-material/Report';


export default function UserInquiry() {


    const [inquiryReply, setInquiryReply] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [replaySending, setReplaySending] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [showReplyMessage, setShowReplayMessage] = useState(null);


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

    const handleSubmitReplay = async () => {
        try {
            setReplaySending(true);
            const response = await axiosAdminInstance.post(`sending-inquiry-reply/${selectedInquiry}/`, { inquiryReply: inquiryReply })
            console.log(response.data)
            fetchUserInquiries();
            handleCloseModal();
            toast.success('Your reply has been sent successfully.')
        } catch (error) {
            console.error('error', error)
            toast.error("Failed to sending reply message. plese try again later.")
        } finally {
            setReplaySending(false);
        }
    }

    const handleModalOpen = (inquiryId) => {
        console.log('selecedddd', inquiryId)
        setSelectedInquiry(inquiryId)
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setInquiryReply("");
        setSelectedInquiry(null);
        setIsModalOpen(false);
    }

    const handleShowReply = (msgId) => {
        setShowReplayMessage(prev => prev === msgId ? null : msgId)
    }

    return (
        <>
            <Sidebar />
            <div className="p-4 md:ml-64">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 mt-14">
                    <div className="flex flex-col md:flex-row mb-6 border-b">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-700">User Inquiries</h2>
                            <p className="text-gray-600">Customer messages and feedback</p>
                        </div>
                       
                    </div>

                  
                    <div className="h-[600px] overflow-y-auto pr-2">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full py-20">
                                <ReportIcon fontSize="large" className="text-gray-500"/>
                                <h3 className="text-lg font-medium text-gray-700 mb-2">No inquiries yet</h3>
                                <p className="text-gray-500">Customer messages will appear here</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                                    >
                                        {/* Message Header */}
                                        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                                                    <PersonIcon className="text-gray-500" />

                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="font-medium text-gray-900">{message.user_name}</h3>
                                                    <p className="text-sm text-gray-500">{message.email}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {new Date(message.created_at).toLocaleString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>

                                        {/* Message Content */}
                                        <div className="px-5 py-4  h-48 overflow-y-auto">

                                            {showReplyMessage === message.id ? (
                                                <div className="flex items-start bg-yellow-50 p-2 rounded">
                                                    <div className="flex-shrink-0 pt-1">
                                                        <ReplyIcon fontSize="small" className="text-gray-500"/>
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="text-gray-700 whitespace-pre-wrap">{message.reply_message}</p>
                                                    </div>
                                                </div>

                                            ) : (
                                                <div className="flex items-start bg-gray-100 p-2 rounded">
                                                    <div className="flex-shrink-0 pt-1">
                                                        <AnnouncementIcon fontSize="small" className="text-gray-400"/>
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                                                    </div>
                                                </div>

                                            )}




                                        </div>

                                        {/* Message Actions */}
                                        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
                                            {message.reply_message ? (
                                                <button
                                                    onClick={()=> handleShowReply(message.id)}
                                                    className="ml-2 inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50">

                                                    Show Reply
                                                </button>

                                            ) : (

                                                <button
                                                    onClick={() => handleModalOpen(message.id)}
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                                >
                                                    Reply
                                                </button>

                                            )}


                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {isModalOpen && (
                <UserInquiryReplayModal
                    isModalOpen={isModalOpen}
                    inquiryReply={inquiryReply}
                    setInquiryReply={setInquiryReply}
                    handleCloseModal={handleCloseModal}
                    loading={replaySending}
                    handleSubmit={handleSubmitReplay}
                />
            )}
        </>


    )
}






















