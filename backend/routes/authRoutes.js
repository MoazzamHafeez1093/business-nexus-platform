import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
// import auth from '../middleware/auth.js';
// import role from '../middleware/role.js';

const router = express.Router();

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// Example: router.get('/protected', auth, role('investor'), (req, res) => res.json({ message: 'Protected route' }));

export default router;
