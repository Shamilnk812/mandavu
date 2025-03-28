import { useState, useEffect, useRef } from "react";
import SendMessage from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ChatUsersList from "./ListingUsers";
// import { useWebSocket } from "../../Utils/ChatContext/ChatContext";
import axios from "axios";
import { axiosChatInstance } from "../../Utils/Axios/axiosInstance";
import { SOCKET, ChatUrl } from "../../Utils/Axios/EndPoints";
import { jwtDecode } from 'jwt-decode';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { useSelector } from "react-redux";




export default function ChatLayout() {
    const [user, setUser] = useState('');
    const [username, setUsername] = useState('');
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const chatArea = useRef(null);
    const User_token = useSelector((state) => state.user.access_token);
    const Owner_token = useSelector((state) => state.owner.access_token);
    const access = User_token || Owner_token;
    const userId = access ? jwtDecode(access).user_id : null;
    const [selectedChat, setSelectedChat] = useState(null);
    




    const Chat = async ({ id, username, chatRoomId, cWS }) => {
        setUser(id);
        setUsername(username);
        setSelectedChat('selected')
       
        // if (cWS.readyState === WebSocket.OPEN) {
        cWS.send(JSON.stringify({
            action: "mark_as_read",
            chat_room_id: chatRoomId,
            'recipient_id': id,
        }));


        //    }

        setupWebSocket(id, access);



        try {
            const response = await axiosChatInstance.get(`user_messages/${userId}/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            });
            console.log('all_messages', response.data)
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






    // console.log('it is working ', selectedChat)
    const setupWebSocket = (chatWithUserId, access) => {
        if (ws) {
            ws.close();
        }

        console.log("chat with user id is :", chatWithUserId)
        const socketUrl = `${SOCKET}chat/${chatWithUserId}/?token=${access}`;
        const newWs = new WebSocket(socketUrl);

        newWs.onopen = () => {
            console.log('Chat WebSocket connection opened');
        };



        newWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received message:', data);
            setMessages((prevMessages) => [...prevMessages, data]);
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
            ws.send(JSON.stringify({

                message
            }));
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

            <div className="flex flex-col lg:flex-row">
                {/* <div className="p-10"> */}
                <main className="flex-1 px-4 py-6 bg-gray-50 lg:ml-64">

                    <div className="max-w-4xl mx-auto bg-white mt-16 shadow-xl rounded-lg">
                        <h3 className="text-2xl font-semibold py-3 text-center text-white bg-gray-700 rounded-tl-lg rounded-tr-lg">Inbox </h3>

                        <div className="flex">

                            {/* Left side: User List */}
                            <ChatUsersList Chat={Chat} selectedChat={selectedChat}  />



                            {/* Right side: Chat Area */}
                            <div className={`w-full lg:w-3/5 flex flex-col h-[500px] ${selectedChat ? 'block' : 'hidden lg:block'}`} >
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



        </>
    );
}
