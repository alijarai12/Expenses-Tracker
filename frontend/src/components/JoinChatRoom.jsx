// src/components/JoinChatRoom.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

import api from '../api';

const JoinChatRoom = () => {
    const { chatRoomId } = useParams();
    const [chatRoom, setChatRoom] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchChatRoom = async () => {
            try {
                const response = await api.get(`/chat/chatrooms/${chatRoomId}/`);
                setChatRoom(response.data);
            } catch (error) {
                setError('Error fetching chat room details');
            }
        };

        fetchChatRoom();
    }, [chatRoomId]);

    const handleJoinChatRoom = async () => {
        const tokenString  = localStorage.getItem('token');
        if (!tokenString) {
            setError('No token found. Please log in again.');
            return;
          }
        
        const token = JSON.parse(tokenString);
        try {
            const response = await api.post('chat/chatrooms/add_user/', 
                { chat_room: chatRoomId }, 
                {
                    headers: {
                        'Authorization': `Bearer ${token.access}`
                    }
                }
            );
            setMessage(response.data.message);
        } catch (error) {
            setError(error.response?.data?.error || 'Unable to join chat room');
        }
    };


    return (
        <div >
            <Navbar />
            <div className="join-chatroom-container">
            {error && <p className="error">{error}</p>}
            {chatRoom ? (
                <>
                    <h2>{chatRoom.name}</h2>
                    <p>Created At: {new Date(chatRoom.created_at).toLocaleString()}</p>
                    <button onClick={handleJoinChatRoom}>Join</button>
                    {message && <p>{message}</p>}
                </>
            ) : (
                <p>Loading...</p>
            )}
            </div>
        </div>
    );
};

export default JoinChatRoom;
