// src/components/CreateChatRoom.jsx
import React, { useState } from 'react';
import api from '../api'; // Adjust the import according to your API setup

const CreateChatRoom = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('chat/add-chatrooms/', {
                name: name,
            });
            setSuccess('Chat room created successfully!');
            setName('');
        } catch (error) {
            setError('Failed to create chat room.');
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Create Chat Room</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Chat Room Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                
                <button type="submit">Create Chat Room</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </form>
        </div>
    );
};

export default CreateChatRoom;
