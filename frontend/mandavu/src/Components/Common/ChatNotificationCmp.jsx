

import React from 'react';
import { motion } from 'framer-motion';
import NotificationsIcon from '@mui/icons-material/Notifications';

const ChatNotificationCmp = ({username, content, timestamp, onClose }) => {
    return (
       
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="fixed top-10 right-5 bg-white shadow-xl rounded-lg p-5 z-50 w-96 border border-gray-200 "
        >
            <div className="flex justify-between items-center border-b pb-2 mb-3">
                <h4 className="font-semibold text-lg text-gray-600"><NotificationsIcon /> {username}</h4>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-700 focus:outline-none transition-colors"
                >
                    ✕
                </button>
            </div>
            <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded shadow-lg leading-relaxed mb-3">* {content}</p>
            <div className="flex justify-end">
                <p className="text-xs text-gray-500 italic">
                    {/* {new Date(timestamp).toLocaleString()} */}
                    {new Date().toLocaleString()}
                </p>
            </div>
        </motion.div>
    );
};

export default ChatNotificationCmp;
