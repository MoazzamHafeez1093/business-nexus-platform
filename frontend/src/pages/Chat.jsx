import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  User, 
  MessageCircle, 
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Search
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { useParams, useNavigate } from 'react-router-dom';
import { chatAPI } from '../services/api';

const Chat = () => {
  const { messages, sendMessage, loading } = useChat();
  const { userId: receiverId } = useParams();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId');
  const selectedUser = users.find(u => u._id === receiverId) || {};

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    fetchUsers();
  }, [messages]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await chatAPI.getConnectedUsers();
      setUsers(res.data);
    } catch (err) {
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    setIsTyping(true);
    try {
      const senderId = localStorage.getItem('userId');
      const messageData = {
        senderId,
        receiverId,
        text: newMessage,
        // file: selectedFile // (optional, if you want to support attachments)
      };
      await sendMessage(messageData);
      setNewMessage('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const chatHeader = {
    name: 'Sarah Johnson',
    status: 'Online',
    avatar: 'SJ',
    role: 'Investor'
  };

  return (
    <div className="h-full flex">
      {/* Chat User List Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-shrink-0 hidden md:block">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Chats</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              // (Optional: implement search)
            />
            <Search className="absolute right-2 top-2 w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-120px)]">
          {loadingUsers ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">No users found.</div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((user) => (
                <li
                  key={user._id}
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors"
                  onClick={() => navigate(`/chat/${user._id}`)}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">{user.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">{selectedUser.name?.charAt(0).toUpperCase() || '?'}</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedUser.name || 'Select a user'}</h2>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-success-500`} />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Online • {selectedUser.role || ''}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Phone className="w-4 h-4" />}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Video className="w-4 h-4" />}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<MoreVertical className="w-4 h-4" />}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto mb-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No messages yet</h3>
                <p className="text-gray-500 dark:text-gray-400">Start a conversation by sending a message</p>
              </motion.div>
            ) : (
              messages.map((message, index) => {
                const isSent = message.senderId === currentUserId;
                const sender = isSent ? { name: 'You', avatar: localStorage.getItem('userName')?.charAt(0).toUpperCase() } : { name: selectedUser.name, avatar: selectedUser.name?.charAt(0).toUpperCase() };
                return (
                  <motion.div
                    key={message._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${
                      isSent
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    } rounded-2xl px-4 py-3 shadow-sm`}>
                      <div className="flex items-start gap-3">
                        {!isSent && (
                          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-semibold">{sender.avatar || '?'}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{!isSent && sender.name}</p>
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            isSent
                              ? 'text-primary-100'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-4">
            <form onSubmit={handleSendMessage} className="flex items-end gap-3">
              <div className="flex-1">
                <InputField
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  multiline
                  rows={3}
                  disabled={isTyping}
                />
                {selectedFile && (
                  <div className="mt-2 flex items-center gap-2 p-2 bg-primary-50 dark:bg-primary-900 rounded-lg">
                    <Paperclip className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    <span className="text-sm text-primary-700 dark:text-primary-300">{selectedFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    icon={<Paperclip className="w-4 h-4" />}
                  />
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon={<Smile className="w-4 h-4" />}
                />
                <Button
                  type="submit"
                  variant="primary"
                  icon={<Send className="w-4 h-4" />}
                  disabled={(!newMessage.trim() && !selectedFile) || isTyping}
                  loading={isTyping}
                />
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Chat; 