import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  getEntrepreneurs, 
  getInvestors, 
  getOwnProfile 
} from '../controllers/profileController.js';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';

const router = express.Router();

// Get profile by ID
router.get('/:id', getProfile);

// Get own profile
router.get('/me/profile', auth, getOwnProfile);

// Update own profile
router.put('/profile', auth, updateProfile);

// Update profile by user ID (for frontend compatibility)
router.put('/:userId', auth, updateProfile);

// Get all entrepreneurs (for investors)
router.get('/entrepreneurs', auth, role('investor'), getEntrepreneurs);

// Get all investors (for entrepreneurs)
router.get('/investors', auth, role('entrepreneur'), getInvestors);

export default router; 