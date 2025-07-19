import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const testAPI = async () => {
  console.log('🧪 Testing Business Nexus APIs...\n');

  try {
    // Test 1: Register a new user
    console.log('1. Testing user registration...');
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123',
      role: 'investor'
    });
    console.log('✅ Registration successful:', registerResponse.data.message);

    // Test 2: Login with the user
    console.log('\n2. Testing user login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'TestPass123'
    });
    console.log('✅ Login successful:', loginResponse.data.user.name);

    const token = loginResponse.data.token;

    // Test 3: Get entrepreneurs (requires authentication)
    console.log('\n3. Testing authenticated endpoint...');
    const entrepreneursResponse = await axios.get(`${API_BASE_URL}/profile/entrepreneurs`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Entrepreneurs endpoint working');

    console.log('\n🎉 All API tests passed! The backend is working correctly.');
    console.log('\n📋 Available endpoints:');
    console.log('- POST /api/auth/register');
    console.log('- POST /api/auth/login');
    console.log('- GET /api/profile/:id');
    console.log('- PUT /api/profile/profile');
    console.log('- GET /api/profile/entrepreneurs');
    console.log('- GET /api/profile/investors');
    console.log('- POST /api/collaboration/request');
    console.log('- GET /api/collaboration/requests');
    console.log('- PATCH /api/collaboration/request/:id');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data?.message || error.message);
  }
};

testAPI(); 