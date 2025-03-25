import { useSelector } from "react-redux"
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from "react";
import axios from "axios";
import { axiosChatInstance } from "../../Utils/Axios/axiosInstance";
import ChatIcon from '@mui/icons-material/Chat';
import FormatLastSeen from "../../Utils/Extras/FormatLastSeen";
import { SOCKET } from "../../Utils/Axios/EndPoints";
import ChatUserItem from "./ChatUserItem";



export default function ChatUsersList({ Chat, selectedChat }) {

    const User_token = useSelector((state) => state.user.access_token);
    const Owner_token = useSelector((state) => state.owner.access_token);
    const access = User_token || Owner_token
    const userId = access ? jwtDecode(access).user_id : null;
    const [cWS, setCWS] = useState(null);
    const [chatUsers, setChatUsers] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([])

    // const [lastSeen, setLastSeen] = useState({});




    useEffect(() => {
        const chatWS = new WebSocket(`${SOCKET}chat/notifications/?token=${access}`);
        chatWS.onopen = () => {
            console.log("chat notification WB opppen..");
        }

        chatWS.onmessage = (event) => {

            const data = JSON.parse(event.data);
            console.log('user staussssss', data)

            if (data.type === "unread_update") {
                const { sender_id, chat_room_id, unread_count, timestamp } = data;

                setChatUsers(prevChatUsers => {
                    const updatedChatUsers = prevChatUsers.map(chatUser => {
                        if (chatUser.id === chat_room_id) {
                            const isUser1 = chatUser.user1.id === sender_id;
                            const updatedChatUser = { ...chatUser };

                            if (isUser1) {
                                updatedChatUser.unread_count_user2 = unread_count;
                            } else {
                                updatedChatUser.unread_count_user1 = unread_count;
                            }
                            updatedChatUser.last_message_timestamp = timestamp
                            return updatedChatUser
                        }
                        return chatUser
                    })

                    updatedChatUsers.sort((a, b) => {
                        const aTimestamp = new Date(a.last_message_timestamp).getTime();
                        const bTimestamp = new Date(b.last_message_timestamp).getTime();
                        return bTimestamp - aTimestamp;
                    });

                    return updatedChatUsers;

                })
            } else if (data.type === "online_users") {
                console.log('user online statusssss', data)
                setOnlineUsers(data.online_users)
            }


        }

        chatWS.onclose = () => {
            console.log('chat notificatoin WB disconnected')

        }




        setCWS(chatWS)

        
        return () => {
            if (chatWS) {
                chatWS.close();
            }
        };


    }, [])


   

    useEffect(() => {
        const getChatUsers = async () => {
            if (userId) {
                try {
                    const response = await axiosChatInstance.get(
                        `chat_users/${userId}/`
                    );
                    setChatUsers(response.data);
                    console.log('all user', response.data)
                } catch (error) {
                    console.error("Error while fetching users", error);
                }
            }
        };
        getChatUsers();
    }, [userId]);





    return (
        // <div className="w-2/5 border-r border-gray-300 overflow-y-auto" style={{ maxHeight: '400px' }}>
        <div
            className={`w-full lg:w-2/5 border-r border-gray-300 overflow-y-auto h-[500px] lg:block ${selectedChat ? 'hidden' : 'block'
                }`}

        >
            <h2 className="text-lg font-semibold text-gray-600 p-4"><ChatIcon /> Chats</h2>
            <ul>

                {chatUsers.length > 0 ? (
                    chatUsers.map((user, index) => (
                        <ChatUserItem chatRoomId={user.id} user={user} userId={userId} key={user.id} Chat={Chat} index={index} cWS={cWS} onlineUsers={onlineUsers} />
                    ))
                ) : (
                    <li>No chat users available.</li>
                )}
            </ul>
        </div>
    )
}


// const ChatUserItem = ({ chatRoomId, user, userId, Chat, index, cWS, onlineUsers }) => {
//     const isUser = user.user1.id === userId;

//     const displayUser = !isUser ? user.user1 : user.user2;
//     const venueName = !isUser ? user.user1_venue : user.user2_venue;
//     const displayName = venueName ? venueName : `${displayUser.first_name} ${displayUser.last_name}`;
//     const unreadCount = isUser ? user.unread_count_user1 : user.unread_count_user2;
//     const isOnline = onlineUsers.includes(displayUser.id);
    

//     return (
//         <button
//             onClick={() => Chat({ id: displayUser.id, username: displayName, chatRoomId: chatRoomId, cWS: cWS, isOnline: isOnline })}
//             className="w-full bg-gray-100 border-b border-gray-300 shadow-lg"
//         >
//             <li key={index} className="flex items-center p-3 hover:bg-gray-300 hover:shadow-xl cursor-pointer relative">
//                 <img src="/user/user_avatar.png" alt="User" className="rounded-full mr-3 w-12 h-12" />
//                 <span className="font-medium text-gray-600"> {displayName}</span>
//                 {unreadCount > 0 && (
//                     <span className="absolute top-2 right-3 bg-red-500 text-white text-xs rounded-full px-2 py-1">
//                         {unreadCount}
//                     </span>
//                 )}

//                 <span className="absolute bottom-2 right-3 text-sm">
//                     <span className="text-gray-500">{FormatLastSeen(user.last_message_timestamp)}</span>
//                 </span>


//             </li>
//         </button>
//     )
// }