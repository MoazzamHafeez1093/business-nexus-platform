import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    default: ''
  },
  published: {
    type: Boolean,
    default: false
  },
  // Entrepreneur specific fields
  startup: {
    name: String,
    description: String,
    fundingNeed: {
      amount: Number,
      currency: { type: String, default: 'USD' },
      description: String
    },
    pitchDeck: String, // URL to pitch deck
    industry: String,
    stage: { type: String, enum: ['idea', 'mvp', 'early-traction', 'growth', 'scaling'] }
  },
  // Investor specific fields
  investment: {
    interests: [String],
    portfolioCompanies: [{
      name: String,
      description: String,
      investmentAmount: Number,
      investmentDate: Date
    }],
    investmentRange: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'USD' }
    },
    preferredStages: [String],
    preferredIndustries: [String]
  },
  // Common fields
  location: String,
  website: String,
  linkedin: String,
  twitter: String,
  avatar: String,
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
profileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Profile', profileSchema); 