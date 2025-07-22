import axios from 'axios';

const API_BASE_URL = 'http://localhost:5005/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Profile APIs
export const profileAPI = {
  getProfile: (id) => api.get(`/profile/${id}`),
  getOwnProfile: () => api.get('/profile/me/profile'),
  updateProfile: (profileData) => api.put('/profile/profile', profileData),
  getEntrepreneurs: () => api.get('/profile/entrepreneurs'),
  getInvestors: () => api.get('/profile/investors'),
};

// Collaboration APIs
export const collaborationAPI = {
  sendRequest: (requestData) => api.post('/collaboration/request', requestData),
  getRequests: () => api.get('/collaboration/requests'),
  getPendingRequests: () => api.get('/collaboration/requests/pending'),
  updateRequestStatus: (id, status) => api.patch(`/collaboration/request/${id}`, { status }),
};

// User management
export const userAPI = {
  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id,
        role: payload.role,
        name: localStorage.getItem('userName'),
      };
    } catch (error) {
      return null;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
  },
  
  setUserData: (userData) => {
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userId', userData.id);
    localStorage.setItem('role', userData.role);
  },
};

export const apiHelper = {
  getEntrepreneurs: async () => {
    const token = localStorage.getItem('token');
    return await fetch('/api/profile/entrepreneurs', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json());
  },
  sendCollaborationRequest: async (entrepreneurId) => {
    const token = localStorage.getItem('token');
    return await fetch('/api/collaboration/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ entrepreneurId })
    }).then(res => {
      if (!res.ok) throw new Error('Failed to send request');
      return res.json();
    });
  },
  getCollaborationRequests: async () => {
    const token = localStorage.getItem('token');
    return await fetch('/api/collaboration/requests', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json());
  },
  updateCollaborationRequestStatus: async (requestId, status) => {
    const token = localStorage.getItem('token');
    return await fetch(`/api/collaboration/request/${requestId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    }).then(res => {
      if (!res.ok) throw new Error('Failed to update request');
      return res.json();
    });
  },
};

export const chatAPI = {
  getConnectedUsers: () => api.get('/chat/connected-users'),
};

export default api;
