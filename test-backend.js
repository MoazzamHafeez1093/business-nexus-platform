import axios from 'axios';

const testBackend = async () => {
  try {
    console.log('Testing backend connection...');
    
    // Test basic server response
    const response = await axios.get('http://localhost:5001/api/auth/test');
    console.log('✅ Backend is running:', response.data);
    
  } catch (error) {
    console.log('❌ Backend test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('Server is not running on port 5001');
    }
  }
};

testBackend(); 