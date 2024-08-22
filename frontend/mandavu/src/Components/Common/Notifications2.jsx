import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {jwtDecode} from 'jwt-decode';

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
    const ws = new WebSocket(`ws://localhost:8000/ws/notifications/${user_id}/?token=${access}`);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received message:', data);

      setNotifications((prevNotifications) => [data, ...prevNotifications]);
      updateUnreadCount([data, ...notifications]); // Update the unread count with the new notification
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
      const response = await fetch('http://localhost:8000/notification/notification-list/', {
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
      await fetch('http://localhost:8000/notification/notification-list/', {
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
    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
    type="button"
  >
    <svg
      className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
    </svg>
    <span className="ms-2 flex-1 whitespace-nowrap">Inbox</span>
    {unreadCount > 0 && (
      <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded-full">
        {unreadCount}
      </span>
    )}
  </button>

      {dropdownOpen && (
      <div
      id="dropdownHelper"
      className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600 z-50"
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
                className={`flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 ${
                  notification.is_read
                    ? 'bg-green-800 dark:bg-green-800'
                    : 'bg-green-800 dark:bg-green-700'
                }`}
              >
                <div className="flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-blue-500 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-3m4-4h-1l2-2-2-2m2 16v2a4 4 0 00-4-4H8m0 4v-4H7a4 4 0 00-4 4v2h4"
                    />
                  </svg>
                </div>
                <div className="ml-3 text-sm">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {notification.message}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
