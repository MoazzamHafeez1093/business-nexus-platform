import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Briefcase, 
  DollarSign, 
  Eye,
  ArrowRight,
  Calendar,
  MapPin,
  Building,
  User,
  Settings,
  Search
} from 'lucide-react';
import { collaborationAPI, profileAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';

const DashboardInvestor = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [loadingEntrepreneurs, setLoadingEntrepreneurs] = useState(true);
  const [requesting, setRequesting] = useState({});
  const entrepreneurSectionRef = useRef(null);

  useEffect(() => {
    fetchRequests();
    fetchEntrepreneurs();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await collaborationAPI.getRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    setSaving(true);
    try {
      await collaborationAPI.updateRequestStatus(requestId, action);
      setToast({ message: `Request ${action}d successfully!`, type: 'success' });
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      setToast({ 
        message: error.response?.data?.message || `Failed to ${action} request. Please try again.`, 
        type: 'error' 
      });
    } finally {
      setSaving(false);
    }
  };

  const fetchEntrepreneurs = async () => {
    setLoadingEntrepreneurs(true);
    try {
      const res = await profileAPI.getEntrepreneurs();
      console.log('Entrepreneurs API response:', res.data);
      setEntrepreneurs(res.data);
    } catch (err) {
      setEntrepreneurs([]);
    } finally {
      setLoadingEntrepreneurs(false);
    }
  };

  const handleRequestCollaboration = async (entrepreneurId) => {
    setRequesting(prev => ({ ...prev, [entrepreneurId]: true }));
    try {
      const token = localStorage.getItem('token');
      await collaborationAPI.sendCollaborationRequest(entrepreneurId);
      setToast({ message: 'Collaboration request sent!', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to send request', type: 'error' });
    } finally {
      setRequesting(prev => ({ ...prev, [entrepreneurId]: false }));
    }
  };

  const stats = [
    {
      title: 'Portfolio Companies',
      value: '12',
      icon: Building,
      color: 'primary',
      change: '+2',
      changeType: 'positive'
    },
    {
      title: 'Total Investments',
      value: '$2.4M',
      icon: DollarSign,
      color: 'success',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Active Deals',
      value: '8',
      icon: Briefcase,
      color: 'warning',
      change: '+3',
      changeType: 'positive'
    },
    {
      title: 'Messages',
      value: '89',
      icon: MessageCircle,
      color: 'primary',
      change: '+12%',
      changeType: 'positive'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'investment',
      message: 'New investment in TechStartup Inc.',
      time: '1 hour ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'request',
      message: 'Collaboration request from GreenEnergy Co.',
      time: '3 hours ago',
      status: 'pending'
    },
    {
      id: 3,
      type: 'message',
      message: 'Message from Sarah Chen (CEO)',
      time: '1 day ago',
      status: 'read'
    }
  ];

  const topStartups = [
    {
      id: 1,
      name: 'TechStartup Inc.',
      industry: 'Fintech',
      stage: 'Series A',
      funding: '$500K',
      status: 'Active'
    },
    {
      id: 2,
      name: 'GreenEnergy Co.',
      industry: 'Clean Energy',
      stage: 'Seed',
      funding: '$250K',
      status: 'Due Diligence'
    },
    {
      id: 3,
      name: 'HealthTech Solutions',
      industry: 'Healthcare',
      stage: 'Series B',
      funding: '$1.2M',
      status: 'Active'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Investor Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your investment portfolio and startup connections</p>
        </div>
        <Button
          onClick={() => {
            const userId = localStorage.getItem('userId');
            navigate(`/profile/investor/${userId}`);
          }}
          variant="primary"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          View Profile
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
          >
            <Card className="p-6 hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-success-600' : 'text-error-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${stat.color}-100 dark:bg-${stat.color}-900`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Entrepreneurs List Section */}
      <div ref={entrepreneurSectionRef} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-800 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Discover Entrepreneurs</h2>
        {loadingEntrepreneurs ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : entrepreneurs.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">No entrepreneurs found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entrepreneurs.filter(user => user.profile && user.profile.published).map((user) => {
              const profile = user.profile || {};
              const startup = profile.startup || {};
              return (
                <div key={user._id} className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700 rounded-xl shadow p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{user.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{user.email}</p>
                    <div className="mb-2">
                      <span className="font-medium text-primary-700 dark:text-primary-300">Idea:</span> {startup.name || 'N/A'} - {startup.description || 'No pitch summary.'}
                    </div>
                    <div className="mb-2">
                      <span className="font-medium text-primary-700 dark:text-primary-300">Funding Ask:</span> {startup.fundingNeed?.amount ? `$${startup.fundingNeed.amount.toLocaleString()}` : 'N/A'}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/chat/${user._id}`)}
                    >
                      Message
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      loading={!!requesting[user._id]}
                      onClick={() => handleRequestCollaboration(user._id)}
                    >
                      Request
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Find Startups Button */}
      <div className="flex justify-center mt-12">
        <button
          className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-pink-200 dark:focus:ring-pink-800"
          onClick={() => entrepreneurSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
        >
          Find Startups
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Startups */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Top Portfolio Companies</h2>
              <Button
                onClick={() => navigate('/dashboard/investor')}
                variant="ghost"
                size="sm"
                icon={<Eye className="w-4 h-4" />}
              >
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {topStartups.map((startup, index) => (
                <motion.div
                  key={startup.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <Building className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{startup.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {startup.industry} • {startup.stage}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">{startup.funding}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      startup.status === 'Active' ? 'bg-success-100 text-success-700' :
                      startup.status === 'Due Diligence' ? 'bg-warning-100 text-warning-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {startup.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'investment' ? 'bg-success-100 dark:bg-success-900' :
                    activity.type === 'request' ? 'bg-primary-100 dark:bg-primary-900' :
                    'bg-warning-100 dark:bg-warning-900'
                  }`}>
                    {activity.type === 'investment' && <DollarSign className="w-4 h-4 text-success-600 dark:text-success-400" />}
                    {activity.type === 'request' && <Briefcase className="w-4 h-4 text-primary-600 dark:text-primary-400" />}
                    {activity.type === 'message' && <MessageCircle className="w-4 h-4 text-warning-600 dark:text-warning-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'pending' ? 'bg-warning-500' :
                    activity.status === 'read' ? 'bg-primary-500' :
                    'bg-success-500'
                  }`} />
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              onClick={() => navigate('/chat')}
              variant="outline"
              size="lg"
              icon={<MessageCircle className="w-5 h-5" />}
              className="justify-start"
            >
              Start Chat
            </Button>
            <Button
              onClick={() => {
                const userId = localStorage.getItem('userId');
                navigate(`/profile/investor/${userId}`);
              }}
              variant="outline"
              size="lg"
              icon={<User className="w-5 h-5" />}
              className="justify-start"
            >
              Edit Profile
            </Button>
            <Button
              onClick={() => navigate('/settings')}
              variant="outline"
              size="lg"
              icon={<Settings className="w-5 h-5" />}
              className="justify-start"
            >
              Settings
            </Button>
            <Button
              onClick={() => navigate('/dashboard/investor')}
              variant="outline"
              size="lg"
              icon={<Search className="w-5 h-5" />}
              className="justify-start"
            >
              Find Startups
            </Button>
          </div>
        </Card>
      </motion.div>

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-success-500 text-white' : 'bg-error-500 text-white'
          }`}
        >
          {toast.message}
        </motion.div>
      )}
    </div>
  );
};

export default DashboardInvestor; 