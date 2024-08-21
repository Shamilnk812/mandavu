

export default function ChatMessages({text,send,sender}) {
    const isSender = send === sender;
    return (
        <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`${
                    isSender ? 'bg-green-100' : 'bg-blue-100'
                } p-3 rounded-lg max-w-xs`}
            >
                <p className="text-gray-700">{text}</p>
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