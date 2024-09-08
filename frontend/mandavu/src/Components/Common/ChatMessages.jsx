

export default function ChatMessages({text,send,sender,timestamp,seen}) {
    const isSender = send === sender;
    return (
        <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`${
                    isSender ? 'bg-green-500' : 'bg-blue-500'
                } p-3 rounded-lg max-w-xs`}
            >
               <p className="text-white flex justify-between items-center">
                    <span>{text}</span>
                    <span className="text-gray-900 ml-4 mt-2 whitespace-nowrap" style={{ fontSize: '10px' }}>
                        {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isSender &&(
                    <span className={`ml-2 mt-1 text-sm ${seen ? 'text-white' : 'text-gray-500'}`}  style={{ fontSize: '14px' }}>
                        {seen ? '✓✓' : '✓'}
                    </span>
                    )}
                </p>
            </div>
            
        </div>
        
    );


            
   
    // <div className="flex-1 p-4 overflow-y-auto">
    //     <div className="flex flex-col space-y-4">
    //         {/* Sample messages */}

    //         {messages.map((message, index) => (
    //                 <div
    //                     key={index}
    //                     className={`flex ${message.user === sender ? 'justify-end' : 'justify-start'}`}
    //                 >
    //                     <div
    //                         className={`${
    //                             message.user === sender ? 'bg-green-100' : 'bg-blue-100'
    //                         } p-3 rounded-lg max-w-xs`}
    //                     >
    //                         <p className="text-gray-700">{message.content}</p>
    //                     </div>
    //                 </div>
    //             ))}


            
    //     </div>
    // </div>

    
}