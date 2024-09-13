import { useState, useEffect, useRef } from "react";
import SendMessage from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ChatUsersList from "./ListingUsers";
// import { useWebSocket } from "../../Utils/ChatContext/ChatContext";
import axios from "axios";
import { axiosChatInstance } from "../../Utils/Axios/axiosInstance";
import { SOCKET,ChatUrl } from "../../Utils/Axios/EndPoints";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import {  useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import VideoCallIcon from '@mui/icons-material/VideoCall';

import { useSelector } from "react-redux";
import { useVideoCallWebSocket } from "../../Utils/VideoCallContext/VideoCallContext";



export default function ChatLayout() {
    const [user, setUser] = useState('');
    const [username, setUsername] = useState('');
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);

    const [showVideoCall, setShowVideoCall] = useState(false);
    const chatArea = useRef(null);
    const videoCallContainerRef = useRef(null);
    const navigate = useNavigate();
    
    const {vws} = useVideoCallWebSocket()

    const User_token = useSelector((state) => state.user.access_token);
    const Owner_token = useSelector((state) => state.owner.access_token);
    const access = User_token || Owner_token;
    const userId = access ? jwtDecode(access).user_id : null;



    const Chat = async ({ id, username }) => {
        setUser(id);
        setUsername(username);
        setupWebSocket(id, access);
    
        try {
            const response = await axiosChatInstance.get(`user_messages/${userId}/${id}/`,{
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            });
            const data = response.data;
    
            if (Array.isArray(data)) {
                setMessages(data);
            } else {
                console.error('Unexpected data format:', data);
                setMessages([]);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        }
    };



    const setupWebSocket = (chatWithUserId, access) => {
        if (ws) {
            ws.close();
        }

        const socketUrl = `${SOCKET}chat/${chatWithUserId}/?token=${access}`;
        const newWs = new WebSocket(socketUrl);

        newWs.onopen = () => {
            console.log('WebSocket connection opened');
        };

        newWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received message:', data);
            setMessages((prevMessages) => [...prevMessages, data]);
            
        };

        newWs.onclose = () => {
            console.log('WebSocket connection closed');
        };

        newWs.onerror = (event) => {
            console.error('WebSocket error:', event);
        };

        setWs(newWs);
    }





    const sendMessage = (message) => {
        if (ws && message.trim() !== "") {
            ws.send(JSON.stringify({ message }));
        }
    };



   const startVideoCall = async () => {
    if (!user) return;

    if (vws.readyState === WebSocket.OPEN) {  // Ensure WebSocket is open
        const appID = 1387710959;
        const serverSecret = "3b21f678591c4f04ee738ad015fcf82b";
        const meetingId = `${user}-${userId}`;

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, meetingId, Date.now().toString(), userId);
        const zc = ZegoUIKitPrebuilt.create(kitToken);

        zc.joinRoom({
            container: videoCallContainerRef.current,
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
            showScreenSharingButton: true,
            onLeaveRoom: () => {
                window.location.reload(); 
            }
        });

        const meetingLink = `${ChatUrl}join_call/${meetingId}/?token=${kitToken}`;
        setShowVideoCall(true);
        
        vws.send(JSON.stringify({ 
            type: 'video_call', 
            link: meetingLink,
            recipient_id: user  // Recipient's user ID
        }));
    } else {
        console.error('WebSocket is not open');
    }
};

   

    useEffect(() => {
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [ws]);

    useEffect(() => {
        if (chatArea.current) {
            chatArea.current.scrollTop = chatArea.current.scrollHeight;
        }
    }, [messages]);

    return (
        <>
            {showVideoCall ? (
               <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
               <div className="relative w-full max-w-4xl h-4/5 bg-white shadow-lg rounded-lg">
                   <div className="absolute top-0 w-full bg-teal-600 p-4 rounded-t-lg">
                       <h1 className="text-white text-center text-2xl font-semibold">Video Call</h1>
                   </div>
                   <div className="w-1/2" id="root" ref={videoCallContainerRef}>
                       {/* Zego UI Kit Prebuilt interface will be injected here */}
                   </div>
                   {/* Close Button */}
                   <div className="absolute top-4 right-4 border-2 border-gray-300 rounded-md p-1 bg-white">
                       <button
                           // onClick={handleClosePopup}
                           className="text-red-600 font-bold text-lg"
                       >
                           X
                       </button>
                   </div>
               </div>
           </div>
            ) : (
                <div className="flex flex-col flex-1 ml-64 mt-10 bg-customColor7 min-h-screen">
                    <div className="p-10">
                        <div className="bg-customColor8 rounded-lg shadow-lg pb-10">
                            <h3 className="text-2xl font-semibold py-3 text-center text-white bg-gradient-to-r from-teal-500 to-gray-800 rounded-tl-lg rounded-tr-lg">
                                Inbox
                            </h3>

                            <div className="flex">
                                {/* Left side: User List */}
                                <ChatUsersList Chat={Chat} />

                                {/* Right side: Chat Area */}
                                <div className="w-3/5 flex flex-col h-[500px]">
                                    {/* Header */}
                                    <div className="flex items-center justify-between p-4 bg-gray-300 shadow">
                                        <h1 className="text-xl font-semibold">
                                            {username ? `Chat with ${username}` : 'No chats'}
                                        </h1>
                                        {user && (
                                            <button
                                                onClick={startVideoCall}
                                                className="bg-teal-500 text-white px-4 py-2 rounded"
                                            >
                                               <VideoCallIcon/> Video Call
                                            </button>
                                        )}
                                    </div>

                                    {/* Chat messages area */}
                                    <div ref={chatArea} className="flex-1 p-4 overflow-y-auto">
                                    <div className="flex flex-col space-y-4">
                                    {Array.isArray(messages) &&
                                        messages
                                            .slice()
                                            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                                            .map((msg, index) => (
                                                msg && msg.content ? (
                                                    <ChatMessages
                                                        key={index}
                                                        text={msg.content}
                                                        send={msg.user}
                                                        sender={userId}
                                                        timestamp={msg.timestamp}
                                                        seen={msg.seen}
                                                    />
                                                ) : (
                                                    <div key={index} className="text-red-500">
                                                        Message content missing
                                                    </div>
                                                )
                                            ))
                                    }
                                    </div>
                                    </div>
                                    {/* Input area */}
                                    {user && (
                                        <SendMessage sendMessage={sendMessage} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

           
        </>
    );
}
