import { useState } from "react"
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import EmojiPicker from 'emoji-picker-react';



export default function SendMessage({sendMessage}) {

    const [message, setMessage] =useState("") 
    const [showPicker, setShowPicker] = useState(false);

    const handleSendMessage = ()=> {
        sendMessage(message)
        setMessage("")
    }
    const addEmoji = (emojiObject) => {
        setMessage((prevMessage) => prevMessage + emojiObject.emoji);
        setShowPicker(false);
    };


    return(
        <div className="relative flex p-4 border-t border-gray-300 items-center">
       
        <div className="relative">
            <button
                onClick={() => setShowPicker(!showPicker)}
                className="mr-2 text-gray-500"
            >
                <EmojiEmotionsOutlinedIcon fontSize="large" />
            </button>
            {showPicker && (
                <div className="absolute bottom-12 left-0 z-10">
                    <EmojiPicker 
                    searchDisabled
                    theme="light"
                    onEmojiClick={addEmoji} />
                </div>
            )}
        </div>

      
        <input
            type="text"
            className="flex-1 border outline-none focus:ring-1 focus:ring-gray-300  rounded-lg p-2"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />

      
        <button
            onClick={handleSendMessage}
            className="ml-2 bg-teal-600 text-white rounded-lg px-4 py-2"
        >
            <SendIcon />
        </button>
    </div>
   
    )
}