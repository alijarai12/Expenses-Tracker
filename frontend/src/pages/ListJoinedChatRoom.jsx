import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Navbar from '../components/Navbar';
import api from '../api'; // Adjust the path based on your project structure

const ListJoinedChatRoom = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChatRooms = async () => {
      const tokenString = localStorage.getItem('token');
      console.log('Stored token:', tokenString);
      if (!tokenString) {
        setError('No token found. Please log in again.');
        return;
      }

      const token = JSON.parse(tokenString);
      console.log('Parsed token:', token);
      try {
        const response = await api.get('chat/chatrooms/list-joined-chat-rooms/', { // Adjust the endpoint based on your backend configuration
          headers: {
            'Authorization': `Bearer ${token.access}`,
          },
        });
        setChatRooms(response.data);
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
        setError('Error fetching joined chat rooms');
      }
    };

    fetchChatRooms();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="chat-room-list-container">
        <h2>List of Joined Chat Rooms</h2>
        {error && <p className="error">{error}</p>}
        {chatRooms.length > 0 ? (
          <ul>
            {chatRooms.map((chatRoom) => (
              <li key={chatRoom.id}>
                <Link to={`/chatroom/${chatRoom.id}`}>{chatRoom.name}</Link>
              </li>
        ))}
          </ul>
        ) : (
          <p>You have not joined any chat rooms.</p>
        )}
      </div>
    </div>
  );
};

export default ListJoinedChatRoom;
