
import { motion } from "framer-motion";



export default function ChatMessages({ text, send, sender, timestamp, seen }) {
    const isSender = send === sender;
    return (

        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`${isSender ? 'bg-green-600' : 'bg-gray-500'
                    } py-1 px-4 rounded-lg max-w-xs sm:max-w-md md:max-w-xs`}
            >
                {/* Message Text */}
                <p className="text-white break-words whitespace-normal word-break">
                    {text}
                </p>

                {/* Timestamp & Seen Status */}
                <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-300 text-xs">
                        {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>

                    {isSender && (
                        <span className={`ml-2 text-xs ${seen ? 'text-white' : 'text-gray-600'}`}>
                            {seen ? '✓✓' : '✓'}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>

    );




}