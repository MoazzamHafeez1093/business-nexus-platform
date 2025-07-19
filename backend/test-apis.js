import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const testAPIs = async () => {
  console.log('🧪 Testing Business Nexus APIs...\n');

  try {
    // Test 1: Register a test investor
    console.log('1. Testing user registration...');
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
      name: 'Test Investor',
      email: 'testinvestor@example.com',
      password: 'TestPass123',
      role: 'investor'
    });
    console.log('✅ Registration successful:', registerResponse.data.message);

    // Test 2: Login with the investor
    console.log('\n2. Testing user login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'testinvestor@example.com',
      password: 'TestPass123'
    });
    console.log('✅ Login successful:', loginResponse.data.user.name);

    const token = loginResponse.data.token;

    // Test 3: Get entrepreneurs (requires authentication)
    console.log('\n3. Testing entrepreneurs endpoint...');
    try {
      const entrepreneursResponse = await axios.get(`${API_BASE_URL}/profile/entrepreneurs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Entrepreneurs endpoint working');
      console.log('📊 Found', entrepreneursResponse.data.length, 'entrepreneurs');
    } catch (error) {
      console.log('⚠️ Entrepreneurs endpoint error:', error.response?.data?.message || error.message);
    }

    // Test 4: Register a test entrepreneur
    console.log('\n4. Testing entrepreneur registration...');
    const entrepreneurResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
      name: 'Test Entrepreneur',
      email: 'testentrepreneur@example.com',
      password: 'TestPass123',
      role: 'entrepreneur'
    });
    console.log('✅ Entrepreneur registration successful');

    // Test 5: Login as entrepreneur
    console.log('\n5. Testing entrepreneur login...');
    const entrepreneurLoginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'testentrepreneur@example.com',
      password: 'TestPass123'
    });
    console.log('✅ Entrepreneur login successful');

    const entrepreneurToken = entrepreneurLoginResponse.data.token;

    // Test 6: Get requests for entrepreneur
    console.log('\n6. Testing collaboration requests endpoint...');
    try {
      const requestsResponse = await axios.get(`${API_BASE_URL}/collaboration/requests`, {
        headers: { Authorization: `Bearer ${entrepreneurToken}` }
      });
      console.log('✅ Collaboration requests endpoint working');
      console.log('📊 Found', requestsResponse.data.length, 'requests');
    } catch (error) {
      console.log('⚠️ Collaboration requests endpoint error:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 API testing completed!');
    console.log('\n📋 Test Accounts Created:');
    console.log('- Investor: testinvestor@example.com / TestPass123');
    console.log('- Entrepreneur: testentrepreneur@example.com / TestPass123');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data?.message || error.message);
  }
};

testAPIs(); 