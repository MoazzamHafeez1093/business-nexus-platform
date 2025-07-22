import mongoose from 'mongoose';
import User from '../models/User.js';
import Profile from '../models/Profile.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/business';

const fixLinks = async () => {
  await mongoose.connect(MONGO_URI);
  const profiles = await Profile.find({}); // All profiles
  let fixed = 0;
  for (const profile of profiles) {
    const user = await User.findOne({ _id: profile.userId, role: 'entrepreneur' });
    if (user && (!user.profile || user.profile.toString() !== profile._id.toString())) {
      user.profile = profile._id;
      await user.save();
      fixed++;
    }
  }
  console.log(`Fixed ${fixed} entrepreneur user-profile links.`);
  process.exit(0);
};

fixLinks(); 