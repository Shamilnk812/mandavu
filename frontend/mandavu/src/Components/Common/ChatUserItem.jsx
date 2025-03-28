import FormatLastSeen from "../../Utils/Extras/FormatLastSeen";


const ChatUserItem = ({ chatRoomId, user, userId, Chat, index, cWS, onlineUsers }) => {
    const isUser = user.user1.id === userId;

    const displayUser = !isUser ? user.user1 : user.user2;
    const venueName = !isUser ? user.user1_venue : user.user2_venue;
    const displayName = venueName ? venueName : `${displayUser.first_name} ${displayUser.last_name}`;
    const unreadCount = isUser ? user.unread_count_user1 : user.unread_count_user2;
    const isOnline = onlineUsers.includes(displayUser.id);
    

    return (
        <button
            onClick={() => Chat({ id: displayUser.id, username: displayName, chatRoomId: chatRoomId, cWS: cWS})}
            className="w-full bg-gray-100 border-b border-gray-300 shadow-lg"
        >
            <li key={index} className="flex items-center p-3 hover:bg-gray-300 hover:shadow-xl cursor-pointer relative">
                <img src="/user/user_avatar.png" alt="User" className="rounded-full mr-3 w-12 h-12" />
                <span className="font-medium text-gray-600"> {displayName}</span>
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-3 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {unreadCount}
                    </span>
                )}

                <span className="absolute bottom-2 right-3 text-sm">
                    {isOnline ? <span className="text-green-600">• Online</span> : 
                    <span className="text-gray-500">{FormatLastSeen(user.last_message_timestamp)}</span>
                    }
                </span>


            </li>
        </button>
    )
}



export default ChatUserItem;