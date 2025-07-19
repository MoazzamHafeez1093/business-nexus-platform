import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, User, MessageCircle } from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/Button';
import { Routes, Route } from 'react-router-dom';
import Settings from './Settings';

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

const RequestCard = ({ request, onStatusChange }) => {
  // Handle both API data and mock data structures
  const investorName = request.investorName || request.investorId?.name || 'Unknown Investor';
  const investorSnippet = request.investorSnippet || request.investorId?.profile?.bio || 'No description available';
  const status = request.status || 'pending';
  const message = request.message || 'No message available';
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{investorName}</h2>
              <p className="text-sm text-gray-600 mb-2">{investorSnippet}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                status === 'accepted' ? 'bg-green-100 text-green-700' : 
                status === 'rejected' ? 'bg-red-100 text-red-700' : 
                'bg-yellow-100 text-yellow-700'
              }`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-gray-700 text-sm italic">"{message}"</p>
          </div>
          {status === 'pending' && (
            <div className="flex gap-3">
              <Button 
                size="sm" 
                variant="success" 
                onClick={() => onStatusChange(request, 'accepted')}
                className="flex-1"
              >
                Accept Request
              </Button>
              <Button 
                size="sm" 
                variant="danger" 
                onClick={() => onStatusChange(request, 'rejected')}
                className="flex-1"
              >
                Decline Request
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PlaceholderPage = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
    <h2 className="text-3xl font-bold mb-4 text-indigo-700">{title}</h2>
    <p className="text-gray-500 text-lg">This feature is coming soon!</p>
  </div>
);

const DashboardEntrepreneur = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('🔍 Fetching collaboration requests...');
        console.log('Token:', token ? 'Present' : 'Missing');
        
        const response = await axios.get('http://localhost:5000/api/collaboration/requests', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Requests data:', response.data);
        setRequests(response.data);
      } catch (error) {
        console.error('❌ Error fetching requests:', error);
        console.log('📋 Using mock data fallback...');
        // Enhanced mock data fallback
        setRequests([
          { 
            id: 1, 
            investorName: 'David Kim', 
            investorSnippet: 'Fintech angel investor, 10+ portfolio companies.', 
            status: 'pending',
            message: 'I\'m interested in your sustainable technology approach. Would love to discuss potential investment opportunities.'
          },
          { 
            id: 2, 
            investorName: 'Emma Brown', 
            investorSnippet: 'Healthcare VC, passionate about digital health.', 
            status: 'accepted',
            message: 'Your healthcare platform aligns perfectly with our investment thesis. Let\'s explore collaboration.'
          },
          { 
            id: 3, 
            investorName: 'Lucas Wang', 
            investorSnippet: 'SaaS specialist, early-stage focus.', 
            status: 'rejected',
            message: 'Your agricultural technology is impressive. Would like to discuss investment possibilities.'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusChange = async (request, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      // Update the request status via API
      await axios.patch(`http://localhost:5000/api/collaboration/request/${request.id}`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setRequests(prev => prev.map(r => r.id === request.id ? { ...r, status: newStatus } : r));
      setToast({ 
        message: `Request ${newStatus.toLowerCase()} successfully!`, 
        type: 'success' 
      });
    } catch (error) {
      console.error('Error updating request status:', error);
      setToast({ 
        message: 'Failed to update request status. Please try again.', 
        type: 'error' 
      });
    }
  };

  return (
    <DashboardLayout title="Entrepreneur Dashboard" subtitle="Manage collaboration requests">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <Routes>
        <Route index element={
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Collaboration Requests</h2>
                <p className="text-gray-600 mt-1">Manage requests from investors</p>
              </div>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {requests.length} requests received
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : requests.length > 0 ? (
              <div className="space-y-6">
                {requests.map(r => (
                  <RequestCard key={r.id} request={r} onStatusChange={handleStatusChange} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Requests Yet</h3>
                <p className="text-gray-600 mb-6">You haven't received any collaboration requests yet.</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    💡 <strong>Tip:</strong> Complete your profile and add your startup details to attract investors!
                  </p>
                </div>
              </div>
            )}
          </div>
        } />
        <Route path="settings" element={<Settings />} />
        <Route path="messages" element={<PlaceholderPage title="Messages" />} />
        <Route path="help" element={<PlaceholderPage title="Help & Support" />} />
      </Routes>
      
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
    </DashboardLayout>
  );
};

export default DashboardEntrepreneur; 