import mongoose from 'mongoose';

const collaborationRequestSchema = new mongoose.Schema({
  investorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  entrepreneurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
collaborationRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure unique requests between same investor and entrepreneur
collaborationRequestSchema.index({ investorId: 1, entrepreneurId: 1 }, { unique: true });

export default mongoose.model('CollaborationRequest', collaborationRequestSchema); 