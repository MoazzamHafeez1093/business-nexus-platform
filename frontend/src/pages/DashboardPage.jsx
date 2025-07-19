import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle, XCircle, Zap, TrendingUp, Users } from 'lucide-react';

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg transform transition-all duration-300 animate-slide-in-right ${
      type === 'success' 
        ? 'bg-emerald-500 text-white' 
        : 'bg-red-500 text-white'
    }`}>
      {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <span className="font-medium">{message}</span>
    </div>
  );
};

// Modern Button Component
const Button = ({ children, loading, variant = 'primary', size = 'lg', className = '', ...props }) => {
  const baseClasses = 'relative overflow-hidden font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 active:scale-95';
  
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl focus:ring-indigo-200',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-200',
    ghost: 'bg-transparent text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-200'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

// Dashboard Page Component
const DashboardPage = () => {
  const [toast, setToast] = useState(null);
  const [user] = useState({ name: 'John Doe', email: 'john@example.com', role: 'investor' });

  // Handle Logout
  const handleLogout = () => {
    setToast({ message: 'Logged out successfully!', type: 'success' });
  };

  // Sample data for demonstration
  const stats = {
    totalInvestments: '$2,450,000',
    activeProjects: 24,
    networkSize: 1247
  };

  const recentActivities = [
    {
      id: 1,
      type: 'investment',
      title: 'Investment completed',
      description: 'TechStart received $50,000 funding',
      icon: CheckCircle,
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    },
    {
      id: 2,
      type: 'connection',
      title: 'New connection',
      description: 'Sarah Johnson joined your network',
      icon: Users,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      id: 3,
      type: 'milestone',
      title: 'Project milestone',
      description: 'EcoTech reached 50% completion',
      icon: Zap,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 font-['Inter',sans-serif]">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FundFlow</h1>
                <p className="text-sm text-gray-500">Welcome back, {user.name}!</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleLogout} size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Investments</h3>
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalInvestments}</p>
            <p className="text-sm text-green-600">+12% from last month</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Projects</h3>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stats.activeProjects}</p>
            <p className="text-sm text-blue-600">3 new this week</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Network Size</h3>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stats.networkSize}</p>
            <p className="text-sm text-purple-600">Growing daily</p>
          </div>
        </div>
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`w-10 h-10 ${activity.bgColor} rounded-full flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 ${activity.iconColor}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Additional Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Investment Portfolio
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Explore Network
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Zap className="w-4 h-4 mr-2" />
                Discover Projects
              </Button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Portfolio Growth</span>
                <span className="text-sm font-medium text-green-600">+15.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="text-sm font-medium text-blue-600">87%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Risk Score</span>
                <span className="text-sm font-medium text-yellow-600">Medium</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DashboardPage; 