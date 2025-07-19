import CollaborationRequest from '../models/CollaborationRequest.js';
import User from '../models/User.js';

// Send collaboration request
export const sendRequest = async (req, res) => {
  try {
    const { entrepreneurId, message } = req.body;
    const investorId = req.user.id;
    
    // Check if entrepreneur exists
    const entrepreneur = await User.findById(entrepreneurId);
    if (!entrepreneur || entrepreneur.role !== 'entrepreneur') {
      return res.status(404).json({ message: 'Entrepreneur not found' });
    }
    
    // Check if request already exists
    const existingRequest = await CollaborationRequest.findOne({
      investorId,
      entrepreneurId
    });
    
    if (existingRequest) {
      return res.status(400).json({ message: 'Request already sent' });
    }
    
    const request = new CollaborationRequest({
      investorId,
      entrepreneurId,
      message
    });
    
    await request.save();
    
    res.status(201).json({
      message: 'Collaboration request sent successfully',
      request
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's requests (both sent and received)
export const getRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    let requests;
    
    if (user.role === 'investor') {
      // Get requests sent by investor
      requests = await CollaborationRequest.find({ investorId: userId })
        .populate('entrepreneurId', 'name email')
        .populate('investorId', 'name email');
    } else {
      // Get requests received by entrepreneur
      requests = await CollaborationRequest.find({ entrepreneurId: userId })
        .populate('investorId', 'name email')
        .populate('entrepreneurId', 'name email');
    }
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update request status (accept/reject)
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    
    const request = await CollaborationRequest.findById(id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    // Only entrepreneurs can update request status
    if (request.entrepreneurId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    request.status = status;
    await request.save();
    
    res.json({
      message: `Request ${status}`,
      request
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get pending requests for entrepreneur
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const requests = await CollaborationRequest.find({
      entrepreneurId: userId,
      status: 'pending'
    })
    .populate('investorId', 'name email')
    .populate('entrepreneurId', 'name email');
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 