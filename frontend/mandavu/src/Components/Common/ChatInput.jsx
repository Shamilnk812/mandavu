import { useState } from "react"


export default function SendMessage({sendMessage}) {

    const [message, setMessage] =useState("") 

    const handleSendMessage = ()=> {
        sendMessage(message)
        setMessage("")
    }
    return(
    <div className="flex p-4 border-t border-gray-300 ">
         <input
                type="text"
                className="flex-1 border rounded-lg p-2"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
        <button 
        onClick={handleSendMessage}
        className="ml-2 bg-teal-500 text-white rounded-lg px-4 py-2">
            Send
        </button>
    </div>
    )
}