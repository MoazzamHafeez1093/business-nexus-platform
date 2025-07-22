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
  User,
  Briefcase,
  MessageCircle,
  Mail,
  Phone
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/Button';
import Card from '../components/Card';
import Toast from '../components/Toast';
import { profileAPI, collaborationAPI } from '../services/api';

const ProfileInvestor = () => {
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
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUserId = localStorage.getItem('userId');
        
        setIsOwnProfile(id === currentUserId);
        
        const response = await profileAPI.getProfile(id);
        
        // Defensive: migrate investment.range to object if needed
        let data = response.data;
        if (data.investment) {
          let range = data.investment.range;
          if (typeof range === 'string') {
            const match = range.match(/\$?(\d+[\d,]*)[KkMm]?\s*-\s*\$?(\d+[\d,]*)[KkMm]?/);
            if (match) {
              range = {
                min: parseInt(match[1].replace(/,/g, '')),
                max: parseInt(match[2].replace(/,/g, ''))
              };
            } else {
              range = { min: '', max: '' };
            }
            data.investment.range = range;
          } else if (!range || typeof range !== 'object') {
            data.investment.range = { min: '', max: '' };
          }
          if (!Array.isArray(data.investment.stages)) data.investment.stages = [];
          if (!Array.isArray(data.investment.industries)) data.investment.industries = [];
        }
        setProfile(data);
        setFormData(data);
        setNotFound(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setNotFound(true);
        } else {
          setToast({ message: 'Error loading profile. Please try again.', type: 'error' });
        }
        setProfile(null);
        setFormData({});
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleEdit = () => {
    // Defensive: ensure investment.range is always an object { min, max }
    setFormData(prev => {
      let investment = prev.investment || {};
      let range = investment.range;
      if (typeof range === 'string') {
        // Try to parse string like "$50K - $500K"
        const match = range.match(/\$?(\d+[\d,]*)[KkMm]?\s*-\s*\$?(\d+[\d,]*)[KkMm]?/);
        if (match) {
          range = {
            min: parseInt(match[1].replace(/,/g, '')),
            max: parseInt(match[2].replace(/,/g, ''))
          };
        } else {
          range = { min: '', max: '' };
        }
      } else if (!range || typeof range !== 'object') {
        range = { min: '', max: '' };
      }
      return {
        ...prev,
        investment: {
          ...investment,
          range,
          stages: Array.isArray(investment.stages) ? investment.stages : [],
          industries: Array.isArray(investment.industries) ? investment.industries : [],
        }
      };
    });
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
        phone: formData.phone,
        website: formData.website,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        investment: {
          range: {
            min: formData.investment?.range?.min || '',
            max: formData.investment?.range?.max || ''
          },
          stages: Array.isArray(formData.investment?.stages) ? formData.investment.stages : [],
          industries: Array.isArray(formData.investment?.industries) ? formData.investment.industries : [],
          portfolio: formData.investment?.portfolio || ''
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

  const handleInvestmentChange = (field, value) => {
    setFormData(prev => {
      const newInvestment = { ...prev.investment };
      
      if (field === 'range.min') {
        newInvestment.range = { ...newInvestment.range, min: value };
      } else if (field === 'range.max') {
        newInvestment.range = { ...newInvestment.range, max: value };
      } else {
        newInvestment[field] = value;
      }
      
      return {
        ...prev,
        investment: newInvestment
      };
    });
  };

  const handleStageChange = (stage, checked) => {
    setFormData(prev => {
      const newStages = checked 
        ? [...prev.investment.stages, stage]
        : prev.investment.stages.filter(s => s !== stage);
      return {
        ...prev,
        investment: {
          ...prev.investment,
          stages: newStages
        }
      };
    });
  };

  const getStageLabel = (stage) => {
    switch (stage) {
      case 'idea': return 'Idea';
      case 'mvp': return 'MVP';
      case 'early-traction': return 'Early Traction';
      case 'growth': return 'Growth';
      case 'scaling': return 'Scaling';
      default: return stage;
    }
  };

  const handleRequestCollaboration = async () => {
    try {
      await collaborationAPI.sendRequest({
        entrepreneurId: id,
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (notFound && isOwnProfile) {
    // Auto-switch to edit mode for own profile creation
    return (
      <div className="max-w-2xl mx-auto py-16">
        <div className="flex flex-col items-center justify-center mb-8">
          <User className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">No Profile Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">You have not created your investor profile yet.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditing(true);
            setNotFound(false);
            setProfile({});
            setFormData({
              bio: '',
              location: '',
              phone: '',
              website: '',
              linkedin: '',
              twitter: '',
              investment: {
                range: { min: '', max: '' },
                stages: [],
                industries: [],
                portfolio: ''
              }
            });
          }}
          className="mx-auto"
        >
          Create Profile
        </Button>
      </div>
    );
  }

  if (notFound && !isOwnProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <User className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">Profile Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400">The requested investor profile does not exist.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 py-10 px-2 sm:px-6 flex justify-center">
      <div className="w-full max-w-2xl space-y-10">
        {/* Profile Header */}
        <Card className="mb-8 bg-gradient-to-r from-blue-400/80 via-indigo-300/80 to-cyan-200/80 dark:from-blue-900 dark:via-indigo-900 dark:to-cyan-900 border-0 shadow-xl rounded-2xl card-hover">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
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
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {profile?.userId?.role === 'investor' ? 'Investor' : 'Entrepreneur'}
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

        {/* Edit Form - Beautiful Modern Design */}
        {editing ? (
          <div className="space-y-6 animate-fade-in">
            {/* Personal Information */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 card-hover">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">About Me</label>
                  <textarea
                    value={formData.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="w-full p-4 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white resize-none transition-all duration-200 hover:border-green-400 form-input"
                    rows="4"
                    placeholder="Tell us about yourself and your investment philosophy..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white transition-all duration-200 hover:border-green-400 form-input"
                      placeholder="City, State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white transition-all duration-200 hover:border-green-400 form-input"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={formData.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white transition-all duration-200 hover:border-green-400 form-input"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      value={formData.linkedin || ''}
                      onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white transition-all duration-200 hover:border-green-400 form-input"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                  <input
                    type="url"
                    value={formData.twitter || ''}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white transition-all duration-200 hover:border-green-400 form-input"
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>
            </Card>

            {/* Investment Information */}
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 card-hover">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900">Investment Information</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Investment Range (Min)</label>
                    <input
                      type="number"
                      value={formData.investment?.range?.min || ''}
                      onChange={(e) => handleInvestmentChange('range.min', e.target.value === '' ? '' : parseInt(e.target.value))}
                      className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-all duration-200 hover:border-purple-400 form-input"
                      placeholder="Minimum amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Investment Range (Max)</label>
                    <input
                      type="number"
                      value={formData.investment?.range?.max || ''}
                      onChange={(e) => handleInvestmentChange('range.max', e.target.value === '' ? '' : parseInt(e.target.value))}
                      className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-all duration-200 hover:border-purple-400 form-input"
                      placeholder="Maximum amount"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Stages</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['idea', 'mvp', 'early-traction', 'growth', 'scaling'].map((stage) => (
                      <label key={stage} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.investment?.stages?.includes(stage) || false}
                          onChange={(e) => handleStageChange(stage, e.target.checked)}
                          className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm capitalize">{stage.replace('-', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Industries</label>
                  <textarea
                    value={formData.investment?.industries?.join(', ') || ''}
                    onChange={(e) => handleInputChange('investment.industries', e.target.value.split(',').map(s => s.trim()))}
                    className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white resize-none transition-all duration-200 hover:border-purple-400 form-input"
                    rows="3"
                    placeholder="e.g., Fintech, Healthcare, AI, SaaS (comma separated)"
                  />
                </div>
              </div>
            </Card>

            {/* Portfolio Information */}
            <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 card-hover">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-semibold text-gray-900">Portfolio Companies</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Description</label>
                  <textarea
                    value={formData.investment?.portfolio || ''}
                    onChange={(e) => handleInputChange('investment.portfolio', e.target.value)}
                    className="w-full p-4 border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white resize-none transition-all duration-200 hover:border-emerald-400 form-input"
                    rows="4"
                    placeholder="Describe your portfolio companies and investment track record..."
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

            {/* Investment Information Section */}
            <Card className="mb-8 bg-gradient-to-r from-purple-200/80 via-pink-100/80 to-pink-50/80 dark:from-purple-900 dark:via-pink-900 dark:to-pink-800 border-0 shadow-xl rounded-2xl card-hover">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">Investment Information</h2>
              </div>
              
              <div className="space-y-6">
                {/* Investment Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Investment Range</label>
                  <p className="text-gray-700 font-semibold">
                    {profile?.investment?.range?.min || profile?.investment?.range?.max ?
                      `$${profile?.investment?.range?.min?.toLocaleString() || 'Not specified'} - $${profile?.investment?.range?.max?.toLocaleString() || 'Not specified'}` :
                      'Not specified'}
                  </p>
                </div>

                {/* Preferred Stages */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Stages</label>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(profile?.investment?.stages) && profile.investment.stages.length > 0 ?
                      profile.investment.stages.map((stage, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {getStageLabel(stage)}
                        </span>
                      )) : <span className="text-gray-500">Not specified</span>}
                  </div>
                </div>

                {/* Preferred Industries */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Industries</label>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(profile?.investment?.industries) && profile.investment.industries.length > 0 ?
                      profile.investment.industries.map((industry, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {industry}
                        </span>
                      )) : <span className="text-gray-500">Not specified</span>}
                  </div>
                </div>
              </div>
            </Card>

            {/* Portfolio Section */}
            <Card className="mb-8 bg-gradient-to-r from-emerald-200/80 via-teal-100/80 to-cyan-100/80 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 border-0 shadow-xl rounded-2xl card-hover">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-semibold text-gray-900">Portfolio</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{profile?.investment?.portfolio || 'No portfolio information available'}</p>
            </Card>
          </div>
        )}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  </div>
);
};

export default ProfileInvestor;
