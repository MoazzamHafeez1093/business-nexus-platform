import Profile from '../models/Profile.js';
import User from '../models/User.js';

console.log('profileController.js loaded');

// Get profile by ID
export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findOne({ userId: id }).populate('userId', 'name email role');
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile (handles both own profile and by user ID)
export const updateProfile = async (req, res) => {
  try {
    // Get user ID from params or from authenticated user
    const userId = req.params.userId || req.user.id;
    
    // Check if user is updating their own profile or has permission
    if (req.params.userId && req.params.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }
    
    const updateData = req.body;
    
    // Validate required fields
    if (!updateData) {
      return res.status(400).json({ message: 'No data provided for update' });
    }
    
    let profile = await Profile.findOne({ userId });
    
    if (!profile) {
      // Create new profile if it doesn't exist
      profile = new Profile({ 
        userId, 
        ...updateData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      // Update existing profile
      Object.assign(profile, updateData, { updatedAt: new Date() });
    }
    
    await profile.save();

    // Ensure the User document has a profile reference
    await User.findByIdAndUpdate(userId, { profile: profile._id });

    // Populate user data for response
    const populatedProfile = await Profile.findById(profile._id).populate('userId', 'name email role');
    
    res.json({
      message: 'Profile updated successfully',
      profile: populatedProfile
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      message: 'Server error updating profile',
      error: error.message 
    });
  }
};

// Get all entrepreneurs (for investors)
export const getEntrepreneurs = async (req, res) => {
  try {
    // Find all users with role 'entrepreneur' and populate their profile
    const entrepreneurs = await User.find({ role: 'entrepreneur' })
      .select('name email role profile')
      .populate({
        path: 'profile',
        match: { published: true }, // Only published profiles
        select: 'bio startup location published',
      });

    // Filter out users without a published profile (populate returns null if not matched)
    const publishedEntrepreneurs = entrepreneurs.filter(user => user.profile);

    res.json(publishedEntrepreneurs);
  } catch (error) {
    console.error('Error fetching entrepreneurs:', error);
    res.status(500).json({ message: 'Server error fetching entrepreneurs' });
  }
};

// Get all investors (for entrepreneurs)
export const getInvestors = async (req, res) => {
  try {
    const investors = await User.find({ role: 'investor' })
      .select('name email createdAt')
      .populate({
        path: 'profile',
        select: 'bio investment location'
      });
    
    res.json(investors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get own profile
export const getOwnProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    let profile = await Profile.findOne({ userId }).populate('userId', 'name email role');
    
    if (!profile) {
      // Return basic user info if no profile exists
      const user = await User.findById(userId).select('name email role');
      profile = { userId: user };
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 