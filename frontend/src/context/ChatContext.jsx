import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../services/api';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const newSocket = io('http://localhost:5005', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });
    
    setSocket(newSocket);

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnected(false);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('messageReceived', (message) => {
      console.log('Received message:', message);
      setMessages(prev => {
        // Check if message already exists to prevent duplicates
        const messageExists = prev.some(msg => msg._id === message._id);
        if (messageExists) {
          return prev;
        }
        return [...prev, message];
      });
    });

    socket.on('userTyping', (data) => {
      if (data.isTyping) {
        setTypingUsers(prev => new Set([...prev, data.userId]));
      } else {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      }
    });

    return () => {
      socket.off('messageReceived');
      socket.off('userTyping');
    };
  }, [socket]);

  const joinRoom = (userId) => {
    if (socket && connected) {
      console.log('Joining room for user:', userId);
      socket.emit('join', userId);
    }
  };

  const sendMessage = async (messageData) => {
    try {
      // Create a temporary message ID for immediate display
      const tempId = `temp_${Date.now()}_${Math.random()}`;
      
      // Create the new message object
      const newMessage = {
        ...messageData,
        _id: tempId,
        timestamp: new Date().toISOString(),
        senderId: messageData.senderId
      };
      
      // Add to local state immediately for instant feedback
      setMessages(prev => [...prev, newMessage]);
      
      // First save to database
      const token = localStorage.getItem('token');
      const response = await api.post('/chat/message', messageData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Message saved to database:', response.data);
      
      // Update the message with the real ID from database
      setMessages(prev => prev.map(msg => 
        msg._id === tempId 
          ? { ...msg, _id: response.data._id }
          : msg
      ));
      
      // Then emit to socket if connected
      if (socket && connected) {
        socket.emit('sendMessage', {
          ...messageData,
          _id: response.data._id,
          timestamp: new Date().toISOString()
        });
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the temporary message if save failed
      setMessages(prev => prev.filter(msg => msg._id !== `temp_${Date.now()}_${Math.random()}`));
      throw error;
    }
  };

  const startTyping = (data) => {
    if (socket && connected) {
      socket.emit('typing', data);
    }
  };

  const stopTyping = (data) => {
    if (socket && connected) {
      socket.emit('stopTyping', data);
    }
  };

  const value = {
    socket,
    messages,
    setMessages,
    isTyping,
    setIsTyping,
    typingUsers,
    connected,
    joinRoom,
    sendMessage,
    startTyping,
    stopTyping
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}; 