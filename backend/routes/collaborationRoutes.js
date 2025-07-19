import express from 'express';
import { 
  sendRequest, 
  getRequests, 
  updateRequestStatus, 
  getPendingRequests 
} from '../controllers/collaborationController.js';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';

const router = express.Router();

// Send collaboration request (investors only)
router.post('/request', auth, role('investor'), sendRequest);

// Get user's requests
router.get('/requests', auth, getRequests);

// Get pending requests (entrepreneurs only)
router.get('/requests/pending', auth, role('entrepreneur'), getPendingRequests);

// Update request status (entrepreneurs only)
router.patch('/request/:id', auth, role('entrepreneur'), updateRequestStatus);

export default router; 