import { useSelector } from "react-redux"
import {jwtDecode} from 'jwt-decode'
import { useEffect, useState } from "react";
import axios from "axios";
import { axiosChatInstance } from "../../Utils/Axios/axiosInstance";
import ChatIcon from '@mui/icons-material/Chat';


export default function ChatUsersList({Chat,selectedChat}) {

    const User_token = useSelector((state) => state.user.access_token);
    const Owner_token = useSelector((state) => state.owner.access_token);
    const access = User_token || Owner_token
    const userId = access ? jwtDecode(access).user_id : null ;
    console.log(userId)

    const [chatUsers, setChatUsers] = useState([]);

    useEffect(() => {
        const getChatUsers = async () => {
            if (userId) {
                try {
                    const response = await axiosChatInstance.get(
                        `chat_users/${userId}/`
                    );
                    setChatUsers(response.data);
                    console.log(response.data)
                } catch (error) {
                    console.error("Error while fetching users", error);
                }
            }
        };
        getChatUsers();
    }, [userId]);


    return(
        // <div className="w-2/5 border-r border-gray-300 overflow-y-auto" style={{ maxHeight: '400px' }}>
             <div
                    className={`w-full lg:w-2/5 border-r border-gray-300 overflow-y-auto h-[500px] lg:block ${
                        selectedChat ? 'hidden' : 'block'
                    }`}
                    // style={{ maxHeight: '400px' }}
                >
         <h2 className="text-lg font-semibold text-gray-600 p-4"><ChatIcon /> Chats</h2>
         <ul>
            
            {chatUsers.length > 0 ? (
             chatUsers.map((user, index) => (
            <ChatUserItem user={user} userId={userId} key={user.id} Chat={Chat} index={index} />
          ))
           ) : (
            <li>No chat users available.</li>
         )}
        </ul>
    </div>
    )
}


const ChatUserItem = ({user, userId, Chat, index}) => { 
    const isUser = user.user1.id === userId;
    const displayUser = !isUser ? user.user1 : user.user2;
    
    return (
        <button
        onClick={()=> Chat({id:displayUser.id, username: displayUser.first_name})}
        className="w-full bg-gray-200 border-b border-gray-400 shadow-lg"
        >
             <li key={index} className="flex items-center p-3 hover:bg-gray-300 hover:shadow-xl cursor-pointer">
                 <img src="/user/user_avatar.png" alt="User" className="rounded-full mr-3 w-12 h-12" />
                <span className="font-medium ">{displayUser.first_name} {displayUser.last_name}</span>
            </li>
        </button>
    )
}