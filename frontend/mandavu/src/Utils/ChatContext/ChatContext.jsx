import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [ws, setWs] = useState(null);
    const [videoCallLink, setVideoCallLink] = useState('');
    const [connectedUser, setConnectedUser] = useState(null); // Track connected user for chat
    const [messages, setMessages] = useState([]);
    const User_token = useSelector((state) => state.user.access_token);
    const Owner_token = useSelector((state) => state.owner.access_token);
    const access = User_token || Owner_token;

    // Function to initialize WebSocket connection
    const setupWebSocket = (userId) => {
        if (ws) {
            ws.close();
        }

        const socketUrl = `ws://127.0.0.1:8000/ws/chat/${userId}/?token=${access}`;
        const newWs = new WebSocket(socketUrl);

        newWs.onopen = () => {
            console.log('WebSocket connection opened');
        };

        newWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received message:', data);
            if (data.type === 'video_call') {
                setVideoCallLink(data.link);
            } else {
                setMessages((prevMessages) => [...prevMessages, data]);
            }
        };


        newWs.onclose = () => {
            console.log('WebSocket connection closed');
        };

        newWs.onerror = (event) => {
            console.error('WebSocket error:', event);
        };

        setWs(newWs);
    };

    const startChat = (userId) => {
        setConnectedUser(userId);
        setupWebSocket(userId);
    };

    useEffect(() => {
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [ws]);

    return (
        <WebSocketContext.Provider value={{ ws, videoCallLink, setVideoCallLink, startChat , messages, setMessages}}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
