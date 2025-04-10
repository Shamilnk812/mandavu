import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CampaignIcon from '@mui/icons-material/Campaign';
import { SOCKET, notificationUrl } from '../../Utils/Axios/EndPoints';
import { useNotification } from '../../Utils/NotificationContext/NotificationContext';
import { motion, AnimatePresence } from "framer-motion";


const CommonNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { addNotification } = useNotification();

  const Admin_Token = useSelector((state) => state.admin.access_token);
  const User_token = useSelector((state) => state.user.access_token);
  const Owner_token = useSelector((state) => state.owner.access_token);

  const access = Admin_Token || User_token || Owner_token;
  const user_id = jwtDecode(access).user_id;

  useEffect(() => {
    const ws = new WebSocket(`${SOCKET}notifications/${user_id}/?token=${access}`);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received message:', data);

      if (data.type !== 'chat_notification') {
        console.log(data.type,'kjkjjlkjlk')
        setNotifications((prevNotifications) => [data, ...prevNotifications]);
        updateUnreadCount([data, ...notifications]);
      }


      const notification = {
        id: Date.now(), 
        username: data.message.username || 'New Message',
        content: data.message.content,
        timestamp: new Date().toISOString(),
    };

      addNotification(notification)
      fetchNotifications()


      
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, [user_id, access]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${notificationUrl}notification-list/`, {
        headers: {
          'Authorization': `Bearer ${access}`,
        },
      });
      const data = await response.json();
      setNotifications(data);
      console.log("this is the data", data)
      updateUnreadCount(data); // Update the unread count after fetching notifications
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const updateUnreadCount = (notificationsList) => {
    const count = notificationsList.filter(notification => !notification.is_read).length;
    setUnreadCount(count);
  };

  const markAsRead = async () => {
    try {
      await fetch(`${notificationUrl}notification-list/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${access}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id }),
      });
      fetchNotifications(); 
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [access]);

  const toggleDropdown = () => {
    if (dropdownOpen) {
      markAsRead(); 
    }
    setDropdownOpen(!dropdownOpen);
  };

  return (
    
    <div className="relative">
    <button
      id="dropdownHelperButton"
      onClick={toggleDropdown}
      className="flex items-center text-gray-900 rounded-lg dark:text-white  group"
      type="button"
    >
      <span className="flex-1 whitespace-nowrap">
        <NotificationsIcon className="text-teal-600" />
      </span>
      {unreadCount > 0 && (
        <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded-full">
          {unreadCount}
        </span>
      )}
    </button>

    <AnimatePresence>
      {dropdownOpen && (
        <motion.div
          id="dropdownHelper"
          className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-white divide-y divide-gray-100 rounded-lg shadow-xl dark:bg-white dark:divide-gray-300 z-50"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        >
          <ul
            className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownHelperButton"
          >
            {loading ? (
              <li className="text-center">Loading...</li>
            ) : notifications.length === 0 ? (
              <li className="text-center">No notifications</li>
            ) : (
              notifications.map((notification, index) => (
                <li key={index}>
                  <div
                    className={`p-3 rounded-lg shadow-xl mb-3 border transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl ${
                      notification.is_read ? "bg-gray-200" : "bg-gray-100"
                    }`}
                  >
                    <div className="flex border-b-2 pb-1">
                      <CampaignIcon className="text-teal-600" />
                      <div className="ml-3 font-normal text-gray-700 text-lg">
                        {notification.message2?.username || "New Message"}
                      </div>
                    </div>
                    <div className="ml-3 mt-2">
                      <div className="font-semibold text-gray-500 bg-white p-2 rounded shadow-lg">
                        {notification.message2?.content}
                      </div>
                      <div className="flex justify-between mt-4">
                        <p
                          className={`${
                            notification.is_read
                              ? "text-gray-500 "
                              : "text-green-500 font-semibold"
                          }`}
                        >
                          {notification.is_read ? "Seen" : "New"}
                        </p>
                        <p className="text-xs text-gray-900 dark:text-gray-600 mt-1">
                        {notification.message2?.timestamp
                          ? new Date(notification.message2?.timestamp).toLocaleString()
                          : new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
  );
};

export default CommonNotification;







