import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Edit3, 
  Save, 
  X, 
  MapPin, 
  Globe, 
  Linkedin, 
  Twitter, 
  DollarSign,
  Building,
  Calendar,
  User,
  Briefcase,
  FileText,
  TrendingUp
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/Button';
import Card from '../components/Card';
import Toast from '../components/Toast';

const ProfileEntrepreneur = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const currentUserId = localStorage.getItem('userId');
        
        setIsOwnProfile(id === currentUserId);
        
        const response = await axios.get(`/api/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setProfile(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Fallback to mock data
        setProfile({
          userId: { name: 'Alice Smith', email: 'alice@example.com', role: 'entrepreneur' },
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
        setFormData({
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
            stage: 'early-traction'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData(profile);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/profile/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProfile(formData);
      setEditing(false);
      setToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Error updating profile. Please try again.', type: 'error' });
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStartupChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      startup: {
        ...prev.startup,
        [field]: value
      }
    }));
  };

  const handleFundingChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      startup: {
        ...prev.startup,
        fundingNeed: {
          ...prev.startup?.fundingNeed,
          [field]: value
        }
      }
    }));
  };

  const getStageLabel = (stage) => {
    const stages = {
      'idea': 'Idea Stage',
      'mvp': 'MVP',
      'early-traction': 'Early Traction',
      'growth': 'Growth Stage',
      'scaling': 'Scaling'
    };
    return stages[stage] || stage;
  };

  if (loading) {
    return (
      <DashboardLayout title="Entrepreneur Profile">
        <div className="flex justify-center items-center py-16">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Entrepreneur Profile" subtitle={profile?.userId?.name}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile?.userId?.name}</h1>
                <p className="text-gray-600">{profile?.userId?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{profile?.location || 'Location not specified'}</span>
                </div>
              </div>
            </div>
            {isOwnProfile && (
              <div className="flex gap-2">
                {editing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      variant="success"
                      size="sm"
                      icon={<Save className="w-4 h-4" />}
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="ghost"
                      size="sm"
                      icon={<X className="w-4 h-4" />}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleEdit}
                    variant="primary"
                    size="sm"
                    icon={<Edit3 className="w-4 h-4" />}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Bio Section */}
        <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">About Me</h3>
          </div>
          {editing ? (
            <textarea
              value={formData.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="w-full p-4 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              rows="4"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">{profile?.bio || 'No bio available'}</p>
          )}
        </Card>

        {/* Social Links Section */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Social Links</h3>
          </div>
          <div className="flex gap-4">
            {profile?.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:scale-105 transition-transform">
                <Globe className="w-4 h-4" />
                Website
              </a>
            )}
            {profile?.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:scale-105 transition-transform">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            )}
            {profile?.twitter && (
              <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:scale-105 transition-transform">
                <Twitter className="w-4 h-4" />
                Twitter
              </a>
            )}
          </div>
        </Card>

        {/* Startup Information Section */}
        <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center gap-2 mb-6">
            <Building className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Startup Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Startup Name */}
            <div className="bg-white p-4 rounded-xl border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Building className="w-5 h-5 text-purple-600" />
                Startup Name
              </h3>
              {editing ? (
                <input
                  type="text"
                  value={formData.startup?.name || ''}
                  onChange={(e) => handleStartupChange('name', e.target.value)}
                  className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Your startup name"
                />
              ) : (
                <p className="text-gray-700 font-semibold">{profile?.startup?.name || 'Not specified'}</p>
              )}
            </div>

            {/* Industry */}
            <div className="bg-white p-4 rounded-xl border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Industry</h3>
              {editing ? (
                <input
                  type="text"
                  value={formData.startup?.industry || ''}
                  onChange={(e) => handleStartupChange('industry', e.target.value)}
                  className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Fintech, Healthcare"
                />
              ) : (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {profile?.startup?.industry || 'Not specified'}
                </span>
              )}
            </div>

            {/* Stage */}
            <div className="bg-white p-4 rounded-xl border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Stage
              </h3>
              {editing ? (
                <select
                  value={formData.startup?.stage || ''}
                  onChange={(e) => handleStartupChange('stage', e.target.value)}
                  className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select stage</option>
                  <option value="idea">Idea Stage</option>
                  <option value="mvp">MVP</option>
                  <option value="early-traction">Early Traction</option>
                  <option value="growth">Growth Stage</option>
                  <option value="scaling">Scaling</option>
                </select>
              ) : (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {getStageLabel(profile?.startup?.stage)}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="bg-white p-4 rounded-xl border border-purple-200 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              {editing ? (
                <textarea
                  value={formData.startup?.description || ''}
                  onChange={(e) => handleStartupChange('description', e.target.value)}
                  className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="3"
                  placeholder="Describe your startup..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{profile?.startup?.description || 'No description available'}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Funding Information Section */}
        <Card className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-900">Funding Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Funding Amount */}
            <div className="bg-white p-4 rounded-xl border border-emerald-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Funding Amount
              </h3>
              {editing ? (
                <input
                  type="number"
                  value={formData.startup?.fundingNeed?.amount || ''}
                  onChange={(e) => handleFundingChange('amount', parseInt(e.target.value))}
                  className="w-full p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Amount needed"
                />
              ) : (
                <p className="text-gray-700 font-semibold">
                  ${profile?.startup?.fundingNeed?.amount?.toLocaleString() || 'Not specified'}
                </p>
              )}
            </div>

            {/* Funding Description */}
            <div className="bg-white p-4 rounded-xl border border-emerald-200 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Funding Purpose</h3>
              {editing ? (
                <textarea
                  value={formData.startup?.fundingNeed?.description || ''}
                  onChange={(e) => handleFundingChange('description', e.target.value)}
                  className="w-full p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  rows="3"
                  placeholder="Describe how you plan to use the funding..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{profile?.startup?.fundingNeed?.description || 'No description available'}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Pitch Deck Section */}
        {profile?.startup?.pitchDeck && (
          <Card className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Pitch Deck</h3>
            </div>
            <a 
              href={profile.startup.pitchDeck} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 hover:scale-105 transition-transform"
            >
              <FileText className="w-4 h-4" />
              View Pitch Deck
            </a>
          </Card>
        )}
      </div>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </DashboardLayout>
  );
};

export default ProfileEntrepreneur;
