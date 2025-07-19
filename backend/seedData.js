import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Profile from './models/Profile.js';
import CollaborationRequest from './models/CollaborationRequest.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Profile.deleteMany({});
    await CollaborationRequest.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create test users
    const hashedPassword = await bcrypt.hash('TestPass123', 10);

    // Create investors
    const investor1 = await User.create({
      name: 'David Kim',
      email: 'david@investor.com',
      password: hashedPassword,
      role: 'investor'
    });

    const investor2 = await User.create({
      name: 'Emma Brown',
      email: 'emma@investor.com',
      password: hashedPassword,
      role: 'investor'
    });

    const investor3 = await User.create({
      name: 'Lucas Wang',
      email: 'lucas@investor.com',
      password: hashedPassword,
      role: 'investor'
    });

    // Create entrepreneurs
    const entrepreneur1 = await User.create({
      name: 'Alice Smith',
      email: 'alice@entrepreneur.com',
      password: hashedPassword,
      role: 'entrepreneur'
    });

    const entrepreneur2 = await User.create({
      name: 'Bob Lee',
      email: 'bob@entrepreneur.com',
      password: hashedPassword,
      role: 'entrepreneur'
    });

    const entrepreneur3 = await User.create({
      name: 'Carla Gomez',
      email: 'carla@entrepreneur.com',
      password: hashedPassword,
      role: 'entrepreneur'
    });

    console.log('👥 Created test users');

    // Create investor profiles
    await Profile.create({
      userId: investor1._id,
      bio: 'Experienced angel investor with 10+ years in fintech and healthcare startups.',
      location: 'San Francisco, CA',
      website: 'https://davidkim.com',
      linkedin: 'https://linkedin.com/in/davidkim',
      twitter: 'https://twitter.com/davidkim',
      investment: {
        interests: ['Fintech', 'Healthcare', 'SaaS'],
        investmentRange: { min: 50000, max: 500000, currency: 'USD' },
        preferredStages: ['Seed', 'Series A'],
        preferredIndustries: ['Fintech', 'Healthcare', 'SaaS'],
        portfolioCompanies: [
          {
            name: 'HealthSync',
            description: 'Digital health platform connecting patients and doctors',
            investmentAmount: 200000,
            investmentDate: new Date('2023-01-15')
          },
          {
            name: 'PayFlow',
            description: 'Payment processing solution for small businesses',
            investmentAmount: 150000,
            investmentDate: new Date('2022-08-20')
          }
        ]
      }
    });

    await Profile.create({
      userId: investor2._id,
      bio: 'Healthcare VC, passionate about digital health and medical technology.',
      location: 'Boston, MA',
      website: 'https://emmabrown.com',
      linkedin: 'https://linkedin.com/in/emmabrown',
      investment: {
        interests: ['Healthcare', 'Digital Health', 'MedTech'],
        investmentRange: { min: 100000, max: 1000000, currency: 'USD' },
        preferredStages: ['Series A', 'Series B'],
        preferredIndustries: ['Healthcare', 'Digital Health']
      }
    });

    await Profile.create({
      userId: investor3._id,
      bio: 'SaaS specialist, early-stage focus with expertise in B2B software.',
      location: 'Austin, TX',
      website: 'https://lucaswang.com',
      linkedin: 'https://linkedin.com/in/lucaswang',
      investment: {
        interests: ['SaaS', 'B2B', 'Enterprise Software'],
        investmentRange: { min: 25000, max: 250000, currency: 'USD' },
        preferredStages: ['Seed', 'Early Traction'],
        preferredIndustries: ['SaaS', 'B2B']
      }
    });

    // Create entrepreneur profiles
    await Profile.create({
      userId: entrepreneur1._id,
      bio: 'Passionate entrepreneur building the future of sustainable technology.',
      location: 'Austin, TX',
      website: 'https://ecotech.com',
      linkedin: 'https://linkedin.com/in/alicesmith',
      twitter: 'https://twitter.com/alicesmith',
      startup: {
        name: 'EcoTech',
        description: 'Revolutionizing green energy with AI-powered solutions for sustainable living.',
        fundingNeed: {
          amount: 500000,
          currency: 'USD',
          description: 'Series A funding for product development and market expansion'
        },
        industry: 'Clean Technology',
        stage: 'early-traction',
        pitchDeck: 'https://ecotech.com/pitch-deck.pdf'
      }
    });

    await Profile.create({
      userId: entrepreneur2._id,
      bio: 'Healthcare innovator focused on improving patient outcomes through technology.',
      location: 'Boston, MA',
      website: 'https://healthsync.com',
      linkedin: 'https://linkedin.com/in/boblee',
      startup: {
        name: 'HealthSync',
        description: 'Connecting patients and doctors through a seamless digital platform.',
        fundingNeed: {
          amount: 300000,
          currency: 'USD',
          description: 'Seed funding for platform development and user acquisition'
        },
        industry: 'Healthcare',
        stage: 'mvp',
        pitchDeck: 'https://healthsync.com/pitch-deck.pdf'
      }
    });

    await Profile.create({
      userId: entrepreneur3._id,
      bio: 'Agricultural technology expert helping farmers increase productivity sustainably.',
      location: 'Denver, CO',
      website: 'https://agronext.com',
      linkedin: 'https://linkedin.com/in/carlagomez',
      startup: {
        name: 'AgroNext',
        description: 'Smart agriculture for the next generation of farmers.',
        fundingNeed: {
          amount: 750000,
          currency: 'USD',
          description: 'Series A funding for IoT hardware development and market expansion'
        },
        industry: 'Agriculture Technology',
        stage: 'growth',
        pitchDeck: 'https://agronext.com/pitch-deck.pdf'
      }
    });

    console.log('📝 Created user profiles');

    // Create collaboration requests
    await CollaborationRequest.create({
      investorId: investor1._id,
      entrepreneurId: entrepreneur1._id,
      message: 'I\'m interested in your sustainable technology approach. Would love to discuss potential investment opportunities.',
      status: 'pending'
    });

    await CollaborationRequest.create({
      investorId: investor2._id,
      entrepreneurId: entrepreneur2._id,
      message: 'Your healthcare platform aligns perfectly with our investment thesis. Let\'s explore collaboration.',
      status: 'accepted'
    });

    await CollaborationRequest.create({
      investorId: investor3._id,
      entrepreneurId: entrepreneur3._id,
      message: 'Your agricultural technology is impressive. Would like to discuss investment possibilities.',
      status: 'rejected'
    });

    console.log('🤝 Created collaboration requests');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('Investors:');
    console.log('- david@investor.com / TestPass123');
    console.log('- emma@investor.com / TestPass123');
    console.log('- lucas@investor.com / TestPass123');
    console.log('\nEntrepreneurs:');
    console.log('- alice@entrepreneur.com / TestPass123');
    console.log('- bob@entrepreneur.com / TestPass123');
    console.log('- carla@entrepreneur.com / TestPass123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData(); 