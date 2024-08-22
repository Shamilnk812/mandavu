import { useState,useEffect,useRef } from "react";
import SendMessage from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ChatUsersList from "./ListingUsers";
import { useSelector } from "react-redux";
import {jwtDecode} from 'jwt-decode'
import axios from "axios";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

export default function ChatLayout() {
    const [user, setUser] = useState('');
    const [username, setUsername] = useState('');
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const chatArea = useRef(null)

    const User_token = useSelector((state) => state.user.access_token);
    const Owner_token = useSelector((state) => state.owner.access_token);
    const access = User_token || Owner_token;
    const userId = access ? jwtDecode(access).user_id : null;

    const Chat = async ({ id, username }) => {
        console.log('button clicked');
        setUser(id);
        setUsername(username);
        console.log('id:', id);
        console.log('username', username);
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

        // const socketUrl = `ws://127.0.0.1:8000/ws/chat/${chatWithUserId}/?token=${access}`;
        const socketUrl = `ws://127.0.0.1:8000/ws/chat/${chatWithUserId}/?token=${access}`;
        const newWs = new WebSocket(socketUrl);
        console.log(newWs)

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


    const startAudioCall = () => {
        if (!user || !userId) {
            console.error('User or User ID is missing');
            return;
        }

        const appID = 1387710959; // Your ZEGOCLOUD App ID
        const serverSecret = "3b21f678591c4f04ee738ad015fcf82b"; // Your ZEGOCLOUD Server Secret

        // Ensure user is a string and properly formatted
        const roomID = String(user);

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, Date.now().toString(), userId);

        if (!kitToken) {
            console.error('Failed to generate ZEGOCLOUD token');
            return;
        }

        const zc = ZegoUIKitPrebuilt.create(kitToken);

        const container = document.createElement('div');
        container.id = 'zego-uikit-container';
        document.body.appendChild(container);

        zc.joinRoom({
            container: container,
            scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
            showScreenSharingButton: true,
            onLeaveRoom: () => {
                document.body.removeChild(container); // Clean up the container
                navigate('/'); // Navigate or perform any action
            },
            onError: (error) => {
                console.error('Error joining room:', error);
            }
        });
    };

    
    

    useEffect(() => {
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [ws]);
    
    useEffect(() => {
        // Scroll to the bottom of the chat area whenever messages update
        if (chatArea.current) {
            chatArea.current.scrollTop = chatArea.current.scrollHeight;
        }
    }, [messages]);


    return(
        <>
           <div className="flex flex-col flex-1 ml-64 mt-10 bg-customColor7 min-h-screen">
                <div className="p-10">
                    <div className="bg-customColor8 rounded-lg shadow-lg pb-10">
                        <h3 className="text-2xl font-semibold py-3 text-center text-white bg-gradient-to-r from-teal-500 to-gray-800 rounded-tl-lg rounded-tr-lg">
                            Inbox
                        </h3>

                        <div className="flex">
                            {/* Left side: User List */}
                              <ChatUsersList Chat={Chat}/>

                            {/* Right side: Chat Area */}
                            <div className="w-3/5 flex flex-col  h-[500px]">
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 bg-gray-300 shadow">
                                    <h1 className="text-xl font-semibold">
                                        {username ? `Chat with ${username}` : 'No chats'}
                                    </h1>
                                    {user && (
                                        <button
                                            onClick={startAudioCall}
                                            className="bg-teal-500 text-white px-4 py-2 rounded"
                                        >
                                            Start Audio Call
                                        </button>
                                    )}
                                </div>

                                {/* Chat messages area */}
                                <div ref={chatArea} className="flex-1 p-4 overflow-y-auto">
                                 <div className="flex flex-col space-y-4">
                                    {messages 
                                    .slice()
                                    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                                    .map((msg, index)=> (

                                        <ChatMessages key={index} text={msg.content} send={msg.user} sender={userId}/>
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
        </>
    )
}