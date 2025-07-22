import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import collaborationRoutes from './routes/collaborationRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { saveMessage } from './controllers/chatController.js';

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/collaboration', collaborationRoutes);
app.use('/api/chat', chatRoutes);

// Socket.io connection handling with JWT authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    next();
  } catch (err) {
    return next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id} (User ID: ${socket.userId})`);

  // Join user to their personal room
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Handle new message
  socket.on('sendMessage', async (messageData) => {
    try {
      const { senderId, receiverId, message } = messageData;
      
      // Save message to database
      const savedMessage = await saveMessage(messageData);
      
      // Emit to sender
      socket.emit('messageReceived', savedMessage);
      
      // Emit to receiver if they're online
      socket.to(receiverId).emit('messageReceived', savedMessage);
      
      console.log(`Message sent from ${senderId} to ${receiverId}`);
    } catch (error) {
      console.error('Error handling message:', error);
      socket.emit('messageError', { message: 'Failed to send message' });
    }
  });

  // Handle typing events
  socket.on('typing', (data) => {
    socket.to(data.receiverId).emit('userTyping', {
      userId: data.senderId,
      isTyping: true
    });
  });

  socket.on('stopTyping', (data) => {
    socket.to(data.receiverId).emit('userTyping', {
      userId: data.senderId,
      isTyping: false
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5001;

// Use a completely different port to avoid conflicts
const SERVER_PORT = 5005;

// Check if required environment variables are set
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI environment variable is not set!");
  console.error("Please create a .env file with MONGO_URI=mongodb://localhost:27017/business_nexus");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET environment variable is not set!");
  console.error("Please create a .env file with JWT_SECRET=your_secret_key");
  process.exit(1);
}

console.log("🔧 Environment check passed");
console.log(`📡 Server will run on port: ${SERVER_PORT}`);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ MongoDB connected successfully");
  server.listen(SERVER_PORT, () => {
    console.log(`✅ Backend server running at http://localhost:${SERVER_PORT}`);
    console.log(`✅ Socket.io server ready for real-time chat`);
    console.log(`🌐 API endpoints available at http://localhost:${SERVER_PORT}/api`);
  });
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
  console.error("Please check your MONGO_URI in .env file");
  process.exit(1);
});
