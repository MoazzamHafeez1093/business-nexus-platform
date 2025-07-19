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
  User,
  Briefcase,
  Mail,
  Phone
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/Button';
import Card from '../components/Card';
import Toast from '../components/Toast';

const ProfileInvestor = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

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
          userId: { name: 'David Kim', email: 'david@example.com', role: 'investor' },
          bio: 'Experienced angel investor with 10+ years in fintech and healthcare startups.',
          location: 'San Francisco, CA',
          phone: '+1 (555) 123-4567',
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
                investmentDate: '2023-01-15'
              },
              {
                name: 'PayFlow',
                description: 'Payment processing solution for small businesses',
                investmentAmount: 150000,
                investmentDate: '2022-08-20'
              }
            ]
          }
        });
        setFormData({
          bio: 'Experienced angel investor with 10+ years in fintech and healthcare startups.',
          location: 'San Francisco, CA',
          phone: '+1 (555) 123-4567',
          website: 'https://davidkim.com',
          linkedin: 'https://linkedin.com/in/davidkim',
          twitter: 'https://twitter.com/davidkim',
          investment: {
            interests: ['Fintech', 'Healthcare', 'SaaS'],
            investmentRange: { min: 50000, max: 500000, currency: 'USD' },
            preferredStages: ['Seed', 'Series A'],
            preferredIndustries: ['Fintech', 'Healthcare', 'SaaS']
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
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      // Use the simpler endpoint
      const response = await axios.put('/api/profile/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Save response:', response.data);
      setProfile(formData);
      setEditing(false);
      setToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setToast({ 
        message: 'Error updating profile. Please try again.', 
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
    setFormData(prev => ({
      ...prev,
      investment: {
        ...prev.investment,
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <DashboardLayout title="Investor Profile">
        <div className="flex justify-center items-center py-16">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Investor Profile" subtitle={profile?.userId?.name}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Simple Header */}
        <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{profile?.userId?.name}</h1>
                <p className="text-indigo-100">{profile?.userId?.email}</p>
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
                      loading={saving}
                      icon={<Save className="w-4 h-4" />}
                    >
                      {saving ? 'Saving...' : 'Save'}
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

        {/* Simple Bio Section */}
        <Card>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            About Me
          </h3>
          {editing ? (
            <textarea
              value={formData.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows="4"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-gray-700">{profile?.bio || 'No bio available'}</p>
          )}
        </Card>

        {/* Contact Info */}
        <Card>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-600" />
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="City, State"
                  />
                </div>
              </>
            ) : (
              <>
                {profile?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{profile?.location || 'Location not specified'}</span>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Social Links */}
        <Card>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" />
            Social Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {editing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <input
                    type="url"
                    value={formData.linkedin || ''}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                  <input
                    type="url"
                    value={formData.twitter || ''}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
              </>
            ) : (
              <>
                {profile?.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
                    <Globe className="w-4 h-4" />
                    <span>Website</span>
                  </a>
                )}
                {profile?.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {profile?.twitter && (
                  <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
                    <Twitter className="w-4 h-4" />
                    <span>Twitter</span>
                  </a>
                )}
              </>
            )}
          </div>
        </Card>

        {/* Investment Preferences */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            Investment Preferences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Investment Range */}
            <div>
              <h4 className="font-medium mb-2">Investment Range</h4>
              {editing ? (
                <div className="space-y-2">
                  <input
                    type="number"
                    value={formData.investment?.investmentRange?.min || ''}
                    onChange={(e) => handleInvestmentChange('investmentRange', {
                      ...formData.investment?.investmentRange,
                      min: parseInt(e.target.value)
                    })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Minimum amount"
                  />
                  <input
                    type="number"
                    value={formData.investment?.investmentRange?.max || ''}
                    onChange={(e) => handleInvestmentChange('investmentRange', {
                      ...formData.investment?.investmentRange,
                      max: parseInt(e.target.value)
                    })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Maximum amount"
                  />
                </div>
              ) : (
                <p className="text-gray-700">
                  ${profile?.investment?.investmentRange?.min?.toLocaleString()} - ${profile?.investment?.investmentRange?.max?.toLocaleString()}
                </p>
              )}
            </div>

            {/* Preferred Stages */}
            <div>
              <h4 className="font-medium mb-2">Preferred Stages</h4>
              {editing ? (
                <input
                  type="text"
                  value={formData.investment?.preferredStages?.join(', ') || ''}
                  onChange={(e) => handleInvestmentChange('preferredStages', e.target.value.split(', ').filter(s => s.trim()))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Seed, Series A, Series B"
                />
              ) : (
                <div className="flex flex-wrap gap-1">
                  {profile?.investment?.preferredStages?.map((stage, index) => (
                    <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-sm">
                      {stage}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Investment Interests */}
            <div className="md:col-span-2">
              <h4 className="font-medium mb-2">Investment Interests</h4>
              {editing ? (
                <input
                  type="text"
                  value={formData.investment?.interests?.join(', ') || ''}
                  onChange={(e) => handleInvestmentChange('interests', e.target.value.split(', ').filter(s => s.trim()))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Fintech, Healthcare, SaaS"
                />
              ) : (
                <div className="flex flex-wrap gap-1">
                  {profile?.investment?.interests?.map((interest, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Portfolio Companies */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            Portfolio Companies
          </h3>
          {profile?.investment?.portfolioCompanies?.length > 0 ? (
            <div className="space-y-3">
              {profile.investment.portfolioCompanies.map((company, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{company.name}</h4>
                      <p className="text-sm text-gray-600">{company.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        ${company.investmentAmount?.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(company.investmentDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No portfolio companies listed</p>
          )}
        </Card>
      </div>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </DashboardLayout>
  );
};

export default ProfileInvestor;
