import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/Button';
import Card from '../components/Card';
import Toast from '../components/Toast';
import { profileAPI, collaborationAPI } from '../services/api';
import api from '../services/api';

const ProfileEntrepreneur = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [toast, setToast] = useState(null);
  const [hasRequestedCollaboration, setHasRequestedCollaboration] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUserId = localStorage.getItem('userId');
        
        setIsOwnProfile(id === currentUserId);
        
        const response = await profileAPI.getProfile(id);
        
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
      setSaving(true);
      
      // Structure the data properly for the API
      const updateData = {
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        startup: {
          name: formData.startup?.name,
          description: formData.startup?.description,
          industry: formData.startup?.industry,
          stage: formData.startup?.stage,
          fundingNeed: {
            amount: formData.startup?.fundingNeed?.amount,
            currency: formData.startup?.fundingNeed?.currency || 'USD',
            description: formData.startup?.fundingNeed?.description
          }
        }
      };
      
      console.log('Sending update data:', updateData);
      
      const response = await profileAPI.updateProfile(updateData);
      
      console.log('Save response:', response.data);
      
      setProfile(response.data.profile || response.data);
      setEditing(false);
      setToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setToast({ 
        message: error.response?.data?.message || 'Error updating profile. Please try again.', 
        type: 'error' 
      });
    } finally {
      setSaving(false);
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

  const handleRequestCollaboration = async () => {
    try {
      await collaborationAPI.sendRequest({
        investorId: id,
        message: `I'm interested in collaborating with ${profile?.userId?.name}.`
      });
      
      setHasRequestedCollaboration(true);
      setToast({ 
        message: `Collaboration request sent to ${profile?.userId?.name}!`, 
        type: 'success' 
      });
    } catch (error) {
      console.error('Error sending collaboration request:', error);
      setToast({ 
        message: 'Failed to send request. Please try again.', 
        type: 'error' 
      });
    }
  };

  const handlePitchDeckUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('pitchDeck', file);
      const token = localStorage.getItem('token');
      const res = await api.post('/profile/upload-pitch-deck', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setProfile(prev => ({
        ...prev,
        startup: {
          ...prev.startup,
          pitchDeck: res.data.url
        }
      }));
      setToast({ message: 'Pitch deck uploaded successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to upload pitch deck', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handlePublishProfile = async () => {
    setPublishing(true);
    try {
      const updateData = { published: true };
      const response = await profileAPI.updateProfile(updateData);
      setProfile(prev => ({ ...prev, published: true }));
      setToast({ message: 'Profile published and now visible to investors!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to publish profile', type: 'error' });
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublishProfile = async () => {
    setPublishing(true);
    try {
      const updateData = { published: false };
      const response = await profileAPI.updateProfile(updateData);
      setProfile(prev => ({ ...prev, published: false }));
      setToast({ message: 'Profile is now hidden from investors.', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to unpublish profile', type: 'error' });
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 py-10 px-2 sm:px-6 flex justify-center">
      <div className="w-full max-w-2xl space-y-10">
        {/* Profile Header */}
        <Card className="mb-8 bg-gradient-to-r from-purple-400/80 via-pink-300/80 to-pink-200/80 dark:from-purple-900 dark:via-pink-900 dark:to-pink-800 border-0 shadow-xl rounded-2xl card-hover">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                {profile?.profilePicture ? (
                  <img 
                    src={profile.profilePicture} 
                    alt={profile?.userId?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile?.userId?.name}</h1>
                <p className="text-gray-600">{profile?.userId?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {profile?.userId?.role === 'entrepreneur' ? 'Entrepreneur' : 'Investor'}
                  </span>
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{profile?.location || 'Location not specified'}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {!isOwnProfile && (
                <>
                  <Button
                    onClick={() => navigate(`/chat/${id}`)}
                    variant="primary"
                    size="sm"
                    icon={<MessageCircle className="w-4 h-4" />}
                    className="btn-hover"
                  >
                    Message
                  </Button>
                  <Button
                    onClick={() => handleRequestCollaboration()}
                    variant="success"
                    size="sm"
                    icon={<Briefcase className="w-4 h-4" />}
                    disabled={hasRequestedCollaboration}
                    className="btn-hover"
                  >
                    {hasRequestedCollaboration ? 'Request Pending' : 'Request Collaboration'}
                  </Button>
                </>
              )}
              {isOwnProfile && (
                <>
                  {editing ? (
                    <>
                      <Button
                        onClick={handleSave}
                        variant="success"
                        size="sm"
                        icon={<Save className="w-4 h-4" />}
                        disabled={saving}
                        className="btn-hover"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="ghost"
                        size="sm"
                        icon={<X className="w-4 h-4" />}
                        className="btn-hover"
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
                      className="btn-hover"
                    >
                      Edit Profile
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Publish/Unpublish Profile Section (only for own profile) */}
        {isOwnProfile && (
          <div className="flex items-center gap-4 mb-8">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${profile?.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {profile?.published ? 'Profile is visible to investors' : 'Profile is NOT published'}
            </span>
            {!profile?.published && (
              <button
                className="px-6 py-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800"
                onClick={handlePublishProfile}
                disabled={publishing}
              >
                {publishing ? 'Publishing...' : 'Publish Profile'}
              </button>
            )}
            {profile?.published && (
              <button
                className="px-6 py-3 rounded-full bg-gradient-to-r from-red-400 to-pink-500 text-white font-bold shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-red-200 dark:focus:ring-red-800"
                onClick={handleUnpublishProfile}
                disabled={publishing}
              >
                {publishing ? 'Unpublishing...' : 'Unpublish Profile'}
              </button>
            )}
          </div>
        )}

        {/* Edit Form - Beautiful Modern Design */}
        {editing ? (
          <div className="space-y-6 animate-fade-in">
            {/* Personal Information */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 card-hover">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">About Me</label>
                  <textarea
                    value={formData.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="w-full p-4 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-none transition-all duration-200 hover:border-blue-400 form-input"
                    rows="4"
                    placeholder="Tell us about yourself and your journey..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 hover:border-blue-400 form-input"
                      placeholder="City, State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={formData.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 hover:border-blue-400 form-input"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      value={formData.linkedin || ''}
                      onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 hover:border-blue-400 form-input"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                    <input
                      type="url"
                      value={formData.twitter || ''}
                      onChange={(e) => handleInputChange('twitter', e.target.value)}
                      className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 hover:border-blue-400 form-input"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Startup Information */}
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 card-hover">
              <div className="flex items-center gap-3 mb-6">
                <Building className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900">Startup Information</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Startup Name</label>
                  <input
                    type="text"
                    value={formData.startup?.name || ''}
                    onChange={(e) => handleStartupChange('name', e.target.value)}
                    className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-all duration-200 hover:border-purple-400 form-input"
                    placeholder="Your startup name"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <input
                      type="text"
                      value={formData.startup?.industry || ''}
                      onChange={(e) => handleStartupChange('industry', e.target.value)}
                      className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-all duration-200 hover:border-purple-400 form-input"
                      placeholder="e.g., Fintech, Healthcare"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                    <select
                      value={formData.startup?.stage || ''}
                      onChange={(e) => handleStartupChange('stage', e.target.value)}
                      className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-all duration-200 hover:border-purple-400 form-input"
                    >
                      <option value="">Select stage</option>
                      <option value="idea">Idea Stage</option>
                      <option value="mvp">MVP</option>
                      <option value="early-traction">Early Traction</option>
                      <option value="growth">Growth Stage</option>
                      <option value="scaling">Scaling</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.startup?.description || ''}
                    onChange={(e) => handleStartupChange('description', e.target.value)}
                    className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white resize-none transition-all duration-200 hover:border-purple-400 form-input"
                    rows="4"
                    placeholder="Describe your startup and its mission..."
                  />
                </div>
              </div>
            </Card>

            {/* Funding Information */}
            <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 card-hover">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-semibold text-gray-900">Funding Information</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Funding Amount Needed</label>
                  <input
                    type="number"
                    value={formData.startup?.fundingNeed?.amount || ''}
                    onChange={(e) => handleFundingChange('amount', e.target.value === '' ? '' : parseInt(e.target.value))}
                    className="w-full p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white transition-all duration-200 hover:border-emerald-400 form-input"
                    placeholder="Amount in USD"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Funding Purpose</label>
                  <textarea
                    value={formData.startup?.fundingNeed?.description || ''}
                    onChange={(e) => handleFundingChange('description', e.target.value)}
                    className="w-full p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white resize-none transition-all duration-200 hover:border-emerald-400 form-input"
                    rows="4"
                    placeholder="Describe how you plan to use the funding..."
                  />
                </div>
              </div>
            </Card>
          </div>
        ) : (
          /* View Mode - Existing Display */
          <div className="space-y-6">
            {/* Bio Section */}
            <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 card-hover">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">About Me</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{profile?.bio || 'No bio available'}</p>
            </Card>

            {/* Social Links Section */}
            <Card className="mb-8 bg-gradient-to-r from-blue-200/80 via-cyan-100/80 to-teal-100/80 dark:from-blue-900 dark:via-cyan-900 dark:to-teal-900 border-0 shadow-xl rounded-2xl card-hover">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Social Links</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <Card className="mb-8 bg-gradient-to-r from-purple-200/80 via-pink-100/80 to-pink-50/80 dark:from-purple-900 dark:via-pink-900 dark:to-pink-800 border-0 shadow-xl rounded-2xl card-hover">
              <div className="flex items-center gap-2 mb-6">
                <Building className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">Startup Information</h2>
              </div>
              
              <div className="space-y-6">
                {/* Startup Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Startup Name</label>
                  <p className="text-gray-700 font-semibold">{profile?.startup?.name || 'Not specified'}</p>
                </div>

                {/* Industry and Stage */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {profile?.startup?.industry || 'Not specified'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {getStageLabel(profile?.startup?.stage)}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <p className="text-gray-700 leading-relaxed">{profile?.startup?.description || 'No description available'}</p>
                </div>
              </div>
            </Card>

            {/* Funding Information Section */}
            <Card className="mb-8 bg-gradient-to-r from-emerald-200/80 via-teal-100/80 to-cyan-100/80 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 border-0 shadow-xl rounded-2xl card-hover">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-900">Funding Information</h2>
              </div>
              
              <div className="space-y-6">
                {/* Funding Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Funding Amount</label>
                  <p className="text-gray-700 font-semibold">
                    ${profile?.startup?.fundingNeed?.amount?.toLocaleString() || 'Not specified'}
                  </p>
                </div>

                {/* Funding Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Funding Purpose</label>
                  <p className="text-gray-700 leading-relaxed">{profile?.startup?.fundingNeed?.description || 'No description available'}</p>
                </div>
              </div>
            </Card>

            {/* Pitch Deck Section */}
            {profile?.startup?.pitchDeck ? (
              <Card className="mb-8 bg-gradient-to-r from-orange-200/80 via-pink-100/80 to-red-100/80 dark:from-orange-900 dark:via-pink-900 dark:to-red-900 border-0 shadow-xl rounded-2xl card-hover flex flex-col items-center justify-center py-10">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-8 h-8 text-orange-600" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Pitch Deck</h3>
                </div>
                <a 
                  href={profile.startup.pitchDeck} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-orange-400 to-red-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-pink-200 dark:focus:ring-pink-800"
                >
                  View Pitch Deck
                </a>
                {isOwnProfile && (
                  <label className="mt-6 cursor-pointer">
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handlePitchDeckUpload}
                      disabled={uploading}
                    />
                    <span className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-orange-400 to-red-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-pink-200 dark:focus:ring-pink-800">
                      {uploading ? 'Uploading...' : 'Replace Pitch Deck'}
                    </span>
                  </label>
                )}
              </Card>
            ) : (
              <Card className="mb-8 bg-gradient-to-r from-orange-200/80 via-pink-100/80 to-red-100/80 dark:from-orange-900 dark:via-pink-900 dark:to-red-900 border-0 shadow-xl rounded-2xl card-hover flex flex-col items-center justify-center py-10">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-8 h-8 text-orange-600" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Pitch Deck</h3>
                </div>
                <div className="text-gray-500 italic text-lg mb-4">No pitch deck uploaded yet.</div>
                {isOwnProfile && (
                  <label className="mt-2 cursor-pointer">
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handlePitchDeckUpload}
                      disabled={uploading}
                    />
                    <span className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-orange-400 to-red-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-pink-200 dark:focus:ring-pink-800">
                      {uploading ? 'Uploading...' : 'Upload Pitch Deck'}
                    </span>
                  </label>
                )}
              </Card>
            )}
          </div>
        )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  </div>
);
};

export default ProfileEntrepreneur;
