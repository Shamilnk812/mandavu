import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {jwtDecode} from 'jwt-decode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CampaignIcon from '@mui/icons-material/Campaign';
import { SOCKET,notificationUrl } from '../../Utils/Axios/EndPoints';





const CommonNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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

      setNotifications((prevNotifications) => [data, ...prevNotifications]);
      updateUnreadCount([data, ...notifications]); 
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
      fetchNotifications(); // Refetch to get updated notifications
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };
  
  useEffect(() => {
    fetchNotifications();
  }, [access]);

  const toggleDropdown = () => {
    if (dropdownOpen) {
      markAsRead(); // Mark as read when closing the dropdown
    }
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="relative">
      <button
    id="dropdownHelperButton"
    onClick={toggleDropdown}
    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-teal-500 dark:hover:bg-teal-500 group"
    type="button"
  >
    <span className=" flex-1 whitespace-nowrap"><NotificationsIcon/></span>
    {unreadCount > 0 && (
      <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded-full">
        {unreadCount}
      </span>
    )}
  </button>

      {dropdownOpen && (
      <div
      id="dropdownHelper"
      className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-300 dark:divide-gray-300 z-50"
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
                className={`flex items-start p-3 rounded-lg hover:bg-green-50 dark:hover:bg-teal-600 ${
                  notification.is_read
                    ? 'bg-green-800 dark:bg-teal-500'
                    : 'bg-green-800 dark:bg-green-400'
                }`}
              >
                <div className="flex-shrink-0">
                  <CampaignIcon/>
                </div>
                <div className="ml-3 text-sm">
                  <div className="font-semibold text-white dark:text-white">
                    {notification.message}
                  </div>
                  <p className="text-xs text-gray-900 dark:text-gray-900 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
      )}
    </div>
  );
};

export default CommonNotification;
