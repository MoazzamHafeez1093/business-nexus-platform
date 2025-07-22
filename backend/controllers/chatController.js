import Chat from '../models/Chat.js';
import User from '../models/User.js';

// Get all messages between two users
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    // Validate userId format
    if (!userId || userId === 'connected-users') {
      return res.json([]);
    }

    // Get messages where current user is either sender or receiver
    const messages = await Chat.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId }
      ]
    })
    .populate('senderId', 'name email')
    .populate('receiverId', 'name email')
    .sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    const currentUserId = req.user.id;

    // Verify the sender is the current user
    if (senderId !== currentUserId) {
      return res.status(403).json({ message: 'You can only send messages as yourself' });
    }

    // Validate required fields
    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Create and save the message
    const newMessage = new Chat({
      senderId,
      receiverId,
      message,
      timestamp: new Date()
    });

    const savedMessage = await newMessage.save();
    const populatedMessage = await savedMessage.populate('senderId', 'name email');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

// Get connected users
export const getConnectedUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    
    // Get all users except current user
    const users = await User.find({ _id: { $ne: currentUserId } })
      .select('name email role')
      .limit(10);
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching connected users:', error);
    res.status(500).json({ message: 'Error fetching connected users' });
  }
};

// Save message to database
export const saveMessage = async (messageData) => {
  try {
    const { senderId, receiverId, message } = messageData;
    
    const newMessage = new Chat({
      senderId,
      receiverId,
      message
    });

    const savedMessage = await newMessage.save();
    return await savedMessage.populate('senderId', 'name email');
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}; 