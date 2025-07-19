import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, User, MessageCircle, X, Send } from 'lucide-react';
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

const CollaborationModal = ({ entrepreneur, isOpen, onClose, onSend }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      await onSend(entrepreneur, message);
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error sending request:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Send Collaboration Request</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{entrepreneur?.name}</h4>
              <p className="text-sm text-gray-600">{entrepreneur?.startup}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows="4"
            placeholder="Introduce yourself and explain why you're interested in collaborating..."
          />
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="ghost"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            variant="primary"
            loading={loading}
            disabled={!message.trim()}
            icon={<Send className="w-4 h-4" />}
            className="flex-1"
          >
            Send Request
          </Button>
        </div>
      </div>
    </div>
  );
};

const EntrepreneurCard = ({ entrepreneur, onRequest }) => {
  // Handle both API data and mock data structures
  const name = entrepreneur.name || entrepreneur.userId?.name || 'Unknown';
  const startup = entrepreneur.startup || entrepreneur.profile?.startup?.name || 'Startup';
  const pitchSummary = entrepreneur.pitchSummary || entrepreneur.profile?.startup?.description || entrepreneur.profile?.bio || 'No description available';
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{name}</h2>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  {startup}
                </span>
              </div>
            </div>
            <Button 
              onClick={() => onRequest(entrepreneur)} 
              className="flex-shrink-0" 
              size="sm"
              variant="primary"
              icon={<MessageCircle className="w-4 h-4" />}
            >
              Request Collaboration
            </Button>
          </div>
          <p className="text-gray-600 leading-relaxed">{pitchSummary}</p>
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

const DashboardInvestor = () => {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [selectedEntrepreneur, setSelectedEntrepreneur] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchEntrepreneurs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/profile/entrepreneurs', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Entrepreneurs data:', response.data);
        setEntrepreneurs(response.data);
      } catch (error) {
        console.error('Error fetching entrepreneurs:', error);
        // Enhanced mock data fallback
        setEntrepreneurs([
          { 
            id: 1, 
            name: 'Alice Smith', 
            startup: 'EcoTech', 
            pitchSummary: 'Revolutionizing green energy with AI-powered solutions for sustainable living.',
            profile: { bio: 'Passionate entrepreneur building the future of sustainable technology.' }
          },
          { 
            id: 2, 
            name: 'Bob Lee', 
            startup: 'HealthSync', 
            pitchSummary: 'Connecting patients and doctors through a seamless digital platform.',
            profile: { bio: 'Healthcare innovator focused on improving patient outcomes.' }
          },
          { 
            id: 3, 
            name: 'Carla Gomez', 
            startup: 'AgroNext', 
            pitchSummary: 'Smart agriculture for the next generation of farmers.',
            profile: { bio: 'Agricultural technology expert helping farmers increase productivity.' }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEntrepreneurs();
  }, []);

  const handleRequest = (entrepreneur) => {
    setSelectedEntrepreneur(entrepreneur);
    setShowModal(true);
  };

  const handleSendRequest = async (entrepreneur, message) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/collaboration/request', {
        entrepreneurId: entrepreneur.id,
        message: message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setToast({ 
        message: `Collaboration request sent to ${entrepreneur.name}!`, 
        type: 'success' 
      });
    } catch (error) {
      console.error('Error sending collaboration request:', error);
      setToast({ 
        message: 'Failed to send request. Please try again.', 
        type: 'error' 
      });
      throw error;
    }
  };

  return (
    <DashboardLayout title="Investor Dashboard" subtitle="Discover and connect with entrepreneurs">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      
      <CollaborationModal
        entrepreneur={selectedEntrepreneur}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedEntrepreneur(null);
        }}
        onSend={handleSendRequest}
      />
      
      <Routes>
        <Route index element={
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Entrepreneurs</h2>
                <p className="text-gray-600 mt-1">Discover and connect with innovative startups</p>
              </div>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {entrepreneurs.length} entrepreneurs found
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : entrepreneurs.length > 0 ? (
              <div className="space-y-6">
                {entrepreneurs.map(e => (
                  <EntrepreneurCard key={e.id} entrepreneur={e} onRequest={handleRequest} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Entrepreneurs Found</h3>
                <p className="text-gray-600 mb-6">There are no entrepreneurs registered yet.</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    💡 <strong>Tip:</strong> Encourage entrepreneurs to join the platform to discover investment opportunities!
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

export default DashboardInvestor; 