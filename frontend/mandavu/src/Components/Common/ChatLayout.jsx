import { useState, useEffect, useRef } from "react";
import SendMessage from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ChatUsersList from "./ListingUsers";
import { useSelector } from "react-redux";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useNavigate } from 'react-router-dom';


export default function ChatLayout() {
    const [user, setUser] = useState('');
    const [username, setUsername] = useState('');
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const [showVideoCall, setShowVideoCall] = useState(false);
    const [videoCallLink, setVideoCallLink] = useState('');
    const chatArea = useRef(null);
    const navigate = useNavigate();
    const User_token = useSelector((state) => state.user.access_token);
    const Owner_token = useSelector((state) => state.owner.access_token);
    const access = User_token || Owner_token;
    const userId = access ? jwtDecode(access).user_id : null;

    const Chat = async ({ id, username }) => {
        setUser(id);
        setUsername(username);
        setupWebSocket(id, access);

        try {
            const response = await axios.get(`http://127.0.0.1:8000/chat/user_messages/${userId}/${id}/`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }

    const setupWebSocket = (chatWithUserId, access) => {
        if (ws) {
            ws.close();
        }

        const socketUrl = `ws://127.0.0.1:8000/ws/chat/${chatWithUserId}/?token=${access}`;
        const newWs = new WebSocket(socketUrl);

        newWs.onopen = () => {
            console.log('WebSocket connection opened');
        };

        newWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received message:', data);
            if (data.type === 'video_call') {
                setVideoCallLink(data.link);
            } else {
                setMessages((prevMessages) => [...prevMessages, data]);
            }
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
    
        const appID = 1387710959;
        const serverSecret = "3b21f678591c4f04ee738ad015fcf82b";
        const meetingId = `${userId}-${user}`;
    
        // Generate a unique token for the current user for this specific meetingId
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, meetingId, Date.now().toString(), userId);
        const zc = ZegoUIKitPrebuilt.create(kitToken);
    
        zc.joinRoom({
            container: document.getElementById('video-call-container'),
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
            showScreenSharingButton: true,
            onLeaveRoom:()=>{
                window.location.reload(); 
            }
        });
    
        const meetingLink = `http://127.0.0.1:8000/chat/join_call/${meetingId}/?token=${kitToken}`;
    
        setShowVideoCall(true);
    
        if (ws) {
            ws.send(JSON.stringify({ type: 'video_call', link: meetingLink }));
        }
    }
    
    const joinVideoCall = async () => {
        if (videoCallLink) {
            // Extract the meeting ID from the link (ensure both users use the same meeting ID)
            const appID = 1387710959;
            const serverSecret = "3b21f678591c4f04ee738ad015fcf82b";
            const meetingId = videoCallLink.split('/join_call/')[1].split('/?token=')[0];
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, meetingId, Date.now().toString(), userId);
            const zc = ZegoUIKitPrebuilt.create(kitToken);
    
            zc.joinRoom({
                container: document.getElementById('video-call-container'),
                scenario: {
                    mode: ZegoUIKitPrebuilt.OneONoneCall,
                },
                showScreenSharingButton: true,
                onLeaveRoom:()=>{
                    window.location.reload(); 
                }  
            });
    
            setShowVideoCall(true);
            setVideoCallLink('');
        }
    };
    const handleClosePopup = () => {
        setVideoCallLink('');
        setShowVideoCall(false);
        const videoCallContainer = document.getElementById('video-call-container');
        videoCallContainer.innerHTML = '';  // Clear the container
    }

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
                // <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                //     <div id="video-call-container" className="w-full h-full">
                //         {/* Zego UI Kit Prebuilt interface will be injected here */}

                //         <h1>vide Call</h1>
                //     </div>
                //     <button
                //         onClick={handleClosePopup}
                //         className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded"
                //     >
                //         Close
                //     </button>
                // </div>
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <div className="relative w-full max-w-4xl h-4/5 bg-white shadow-lg rounded-lg">
                    <div className="absolute top-0 w-full bg-teal-600 p-4 rounded-t-lg">
                        <h1 className="text-white text-center text-2xl font-semibold">Video Call</h1>
                        <button
                            onClick={handleClosePopup}
                            className="absolute top-2 right-2 bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                    <div id="video-call-container" className="w-full h-full pt-16">
                        {/* Zego UI Kit Prebuilt interface will be injected here */}
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
                                                Start Video Call
                                            </button>
                                        )}
                                    </div>

                                    {/* Chat messages area */}
                                    <div ref={chatArea} className="flex-1 p-4 overflow-y-auto">
                                        <div className="flex flex-col space-y-4">
                                            {messages
                                                .slice()
                                                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                                                .map((msg, index) => (
                                                    <ChatMessages key={index} text={msg.content} send={msg.user} sender={userId} />
                                                ))
                                            }
                                        </div>
                                    </div>
                                    {/* Input area */}
                                    <SendMessage sendMessage={sendMessage} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Call Link Popup */}
            {videoCallLink && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="bg-white w-1/2 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Video Call Invitation</h2>
                        <p className="mb-4">
                            You have been invited to join a video call.
                        </p>
                        <button
                            onClick={joinVideoCall}
                            className="bg-teal-500 text-white px-4 py-2 rounded mr-2"
                        >
                            Join the Video Call
                        </button>
                        <button
                            onClick={handleClosePopup}
                            className="bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
