import { useState, useEffect, useRef } from "react";
import SendMessage from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ChatUsersList from "./ListingUsers";
// import { useWebSocket } from "../../Utils/ChatContext/ChatContext";
import axios from "axios";
import { axiosChatInstance } from "../../Utils/Axios/axiosInstance";
import { SOCKET, ChatUrl } from "../../Utils/Axios/EndPoints";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import DuoIcon from '@mui/icons-material/Duo';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

import { useSelector } from "react-redux";
import { useVideoCallWebSocket } from "../../Utils/VideoCallContext/VideoCallContext";
import ChatNotificationCmp from "./ChatNotificationCmp";



export default function ChatLayout() {
    const [user, setUser] = useState('');
    const [username, setUsername] = useState('');
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);

    const [showVideoCall, setShowVideoCall] = useState(false);
    const chatArea = useRef(null);
    const videoCallContainerRef = useRef(null);
    const navigate = useNavigate();

    const { vws } = useVideoCallWebSocket()

    const User_token = useSelector((state) => state.user.access_token);
    const Owner_token = useSelector((state) => state.owner.access_token);
    const access = User_token || Owner_token;
    const userId = access ? jwtDecode(access).user_id : null;


    // new states for sample 
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [selectedChat, setSelectedChat] = useState(null);

    const [notifications, setNotifications] = useState([]);



    const [isOnline, setIsOnline] = useState(null)
    const [lastSeen, setLastSeen] = useState("")

    const [trackId, setTrackId]  = useState(null)


    const closeNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };


    const sendHeartbeat = (ws) => {
        setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: "heartbeat" }));
            }
        }, 30000); // Send heartbeat every 30 seconds
    };

    // const openChat = () => {
    //     setIsChatOpen(true);
    //     // setSelectedUser(user);
    // };

    // const closeChat = () => {
    //     setIsChatOpen(false);
    //     // setSelectedUser(null);
    // };


    // console.log( "chat opened ",isChatOpen)

    
    const fetchUserOnlineStatus = async (uid) => {
        try {
            const response = await axiosChatInstance.get(`get_user_online_status/${uid}/`);
            console.log(response.data)
            setIsOnline(response.data.is_online)
        } catch (error) {
            console.error("Error fetching user online status:", error);
            return false;
        }
    };



    const Chat = async ({ id, username }) => {

    // here i want to call the funciotn 

        
        
        


        setUser(id);
        setUsername(username);
        setSelectedChat('selected')
        fetchUserOnlineStatus(id)
        setupWebSocket(id,  access);

        try {
            const response = await axiosChatInstance.get(`user_messages/${userId}/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            });
            console.log(response.data)
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


    console.log('it is working ', selectedChat)
    const setupWebSocket = (chatWithUserId, access) => {
        if (ws) {
            ws.close();
        }

        console.log("chat with user id is :", chatWithUserId)
        const socketUrl = `${SOCKET}chat/${chatWithUserId}/?token=${access}`;
        const newWs = new WebSocket(socketUrl);

        newWs.onopen = () => {
            console.log('Chat WebSocket connection opened');
            // sendHeartbeat(newWs); // Start heartbeat
        };

        newWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received message:', data);

            setMessages((prevMessages) => [...prevMessages, data]);

            // if (data.type === "message") {
               
            //     setMessages((prevMessages) => [...prevMessages, data]);
            // } else if (data.type === "user_status") {
            //     console.log('nooooooooww')
            //     console.log('user is ',user)
            //     console.log('chat with user',chatWithUserId)
            //     console.log('track id is ',trackedId)
            //     if (trackedId === chatWithUserId) {
            //         console.log('updatiiiiiiiiiiiiiiiiiiiiiiii')
            //         console.log(data.status)
            //         console.log(data.last_seen)
            //         setIsOnline(data.status === "online");

                  
                    
                   
            //     }
            // }

            

        };

        newWs.onclose = () => {
            console.log('Chat WebSocket connection closed');
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

    
    // const updateLastSeen = (status,lastSeen)=> {
    //     console.log('bosssee')
    //     setIsOnline(status)
    //     setLastSeen(lastSeen)
    //     console.log(' machhaaaaaaa')
    // }

    const startVideoCall = async () => {
        if (!user) return;

        if (vws.readyState === WebSocket.OPEN) {  // Ensure WebSocket is open
            const appID = 286512327;
            // const appID = 1387710959;
            const serverSecret = "d2a103004c8c2ede0275eea726818ba4";
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
                // <div className="flex flex-col flex-1 ml-64 mt-10 bg-customColor7 min-h-screen">
                <div className="flex flex-col lg:flex-row">
                    {/* <div className="p-10"> */}
                    <main className="flex-1 px-4 py-6 bg-gray-50 lg:ml-64">

                        <div className="max-w-4xl mx-auto bg-white mt-16 shadow-xl rounded-lg">
                            <h3 className="text-2xl font-semibold py-3 text-center text-white bg-gray-700 rounded-tl-lg rounded-tr-lg">
                                Inbox
                            </h3>

                            <div className="flex">
                                {/* Left side: User List */}

                                <ChatUsersList Chat={Chat} selectedChat={selectedChat} />

                                {/* Right side: Chat Area */}



                                {/* <div className="w-3/5 flex flex-col h-[500px]"> */}

                                <div
                                    className={`w-full lg:w-3/5 flex flex-col h-[500px] ${selectedChat ? 'block' : 'hidden lg:block'
                                        }`}
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between p-4 bg-gray-100 shadow">

                                        {selectedChat && (
                                            <button
                                                onClick={() => setSelectedChat(null)}
                                                className="lg:hidden text-teal-800 font-bold"
                                            >
                                                ← Back
                                            </button>
                                        )}
                                        <h1 className="text-lg text-gray-600 font-semibold">

                                            {/* {username ?  <AccountCircleIcon/> ` ${username}` : 'Chat Area'} */}
                                            {username ? (
                                                <>
                                                    <AccountCircleIcon className="mr-2" fontSize="large" />
                                                    {username}
                                                   

                                                </>
                                            ) : (
                                                'Chat Area'
                                            )}
                                        </h1>

                                        {username && (
                                            <div className="flex items-center mt-1">
                                                <span
                                                    className={`w-2 h-2 rounded-full mr-1 ${
                                                        isOnline ? 'bg-green-500' : 'bg-gray-400'
                                                    }`}
                                                ></span>
                                                <span className={`text-sm ${isOnline ? 'text-green-500' : 'text-gray-500'}`}>
                                                    {isOnline ? 'Online' : 'Offline'}
                                                </span>
                                            </div>
                                        )}



                                     


                                        {/* {user && (
                                            <button
                                                onClick={startVideoCall}
                                                className="bg-teal-700 text-white px-4 py-1 hover:bg-teal-800 transition-all duration-300 rounded"
                                            >
                                                <DuoIcon />
                                            </button>
                                        )} */}
                                    </div>

                                    {/* Chat messages area */}



                                    {user ? (
                                        <div ref={chatArea} className="flex-1 p-4  overflow-y-auto bg-gradient-to-b from-white to-teal-50">
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
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                            <QuestionAnswerIcon fontSize="large" />
                                            <p className="text-lg font-semibold">No messages yet</p>
                                            <p className="text-sm text-gray-400">Select a user to start a conversation</p>
                                        </div>
                                    )}


                                    {/* Input area */}
                                    {user && (
                                        <SendMessage sendMessage={sendMessage} />
                                    )}
                                </div>



                            </div>
                        </div>

                        <div>

                        </div>
                    </main>
                </div>
            )}


        </>
    );
}
