import React, { useState, useEffect } from 'react';
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
  Settings
} from 'lucide-react';
import { collaborationAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { apiHelper } from '../services/api';

const DashboardEntrepreneur = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [collabRequests, setCollabRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [updating, setUpdating] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
    fetchCollabRequests();
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

  const fetchCollabRequests = async () => {
    setLoadingRequests(true);
    try {
      const data = await apiHelper.getCollaborationRequests();
      setCollabRequests(data);
    } catch (err) {
      setCollabRequests([]);
    } finally {
      setLoadingRequests(false);
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

  const handleUpdateRequest = async (requestId, status) => {
    setUpdating(prev => ({ ...prev, [requestId]: true }));
    try {
      await apiHelper.updateCollaborationRequestStatus(requestId, status);
      setToast({ message: `Request ${status}`, type: 'success' });
      fetchCollabRequests();
    } catch (err) {
      setToast({ message: 'Failed to update request', type: 'error' });
    } finally {
      setUpdating(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const stats = [
    {
      title: 'Total Requests',
      value: requests.length,
      icon: Briefcase,
      color: 'primary',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Investors',
      value: '24',
      icon: Users,
      color: 'success',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Messages',
      value: '156',
      icon: MessageCircle,
      color: 'warning',
      change: '+23%',
      changeType: 'positive'
    },
    {
      title: 'Funding Raised',
      value: '$45.2K',
      icon: DollarSign,
      color: 'success',
      change: '+18%',
      changeType: 'positive'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'request',
      message: 'New collaboration request from TechVentures',
      time: '2 hours ago',
      status: 'pending'
    },
    {
      id: 2,
      type: 'message',
      message: 'Message received from Sarah Johnson',
      time: '4 hours ago',
      status: 'read'
    },
    {
      id: 3,
      type: 'funding',
      message: 'Funding milestone reached: $25K',
      time: '1 day ago',
      status: 'completed'
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Entrepreneur Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your startup and investor connections</p>
        </div>
        <Button
          onClick={() => {
            const userId = localStorage.getItem('userId');
            navigate(`/profile/entrepreneur/${userId}`);
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

      {/* Collaboration Requests Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-800 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Collaboration Requests</h2>
        {loadingRequests ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : collabRequests.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">No collaboration requests yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collabRequests.map((req) => {
              const investor = req.investorId || {};
              return (
                <div key={req._id} className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border border-green-100 dark:border-gray-700 rounded-xl shadow p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{investor.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{investor.email}</p>
                    <div className="mb-2">
                      <span className="font-medium text-primary-700 dark:text-primary-300">Bio:</span> {investor.profile?.bio || 'No bio.'}
                    </div>
                    <div className="mb-2">
                      <span className="font-medium text-primary-700 dark:text-primary-300">Interests:</span> {investor.profile?.investment?.industries?.join(', ') || 'N/A'}
                    </div>
                    <div className="mb-2">
                      <span className="font-medium text-primary-700 dark:text-primary-300">Message:</span> {req.message || 'No message.'}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : req.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{req.status}</span>
                    {req.status === 'pending' && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          loading={!!updating[req._id]}
                          onClick={() => handleUpdateRequest(req._id, 'accepted')}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          loading={!!updating[req._id]}
                          onClick={() => handleUpdateRequest(req._id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Collaboration Requests */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Collaboration Requests</h2>
              <Button
                onClick={() => navigate('/dashboard/entrepreneur')}
                variant="ghost"
                size="sm"
                icon={<Eye className="w-4 h-4" />}
              >
                View All
              </Button>
            </div>
            
            {requests.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No collaboration requests yet</p>
                <p className="text-sm text-gray-400 mt-1">Investors will appear here when they request collaboration</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.slice(0, 5).map((request) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {request.investorName || 'Investor'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {request.message || 'Collaboration request'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleRequestAction(request._id, 'accept')}
                        variant="success"
                        size="sm"
                        disabled={saving}
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleRequestAction(request._id, 'decline')}
                        variant="danger"
                        size="sm"
                        disabled={saving}
                      >
                        Decline
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
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
                    activity.type === 'request' ? 'bg-primary-100 dark:bg-primary-900' :
                    activity.type === 'message' ? 'bg-warning-100 dark:bg-warning-900' :
                    'bg-success-100 dark:bg-success-900'
                  }`}>
                    {activity.type === 'request' && <Briefcase className="w-4 h-4 text-primary-600 dark:text-primary-400" />}
                    {activity.type === 'message' && <MessageCircle className="w-4 h-4 text-warning-600 dark:text-warning-400" />}
                    {activity.type === 'funding' && <DollarSign className="w-4 h-4 text-success-600 dark:text-success-400" />}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                navigate(`/profile/entrepreneur/${userId}`);
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

export default DashboardEntrepreneur; 