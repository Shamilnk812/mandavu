import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { axiosChatInstance } from '../Axios/axiosInstance';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const navigate = useNavigate();

    const handleChat = async (userId, venueOwnerId) => {
        try {
            const response = await axiosChatInstance.post('add_chat_rooms/', {
                user_id1: userId,
                user_id2: venueOwnerId,
            });

            if (response.status === 200 || response.status === 201) {
                navigate('/user/chat');
            }
        } catch (error) {
            console.error('Error starting chat:', error);
        }
    };

    return (
        <ChatContext.Provider value={{ handleChat }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
