import express from 'express';
import { getMessages, sendMessage, getConnectedUsers } from '../controllers/chatController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/chat/connected-users - get connected users
router.get('/connected-users', auth, getConnectedUsers);

// GET /api/chat/:userId - get all messages between users
router.get('/:userId', auth, getMessages);

// POST /api/chat/message - send a new message
router.post('/message', auth, sendMessage);

export default router; 