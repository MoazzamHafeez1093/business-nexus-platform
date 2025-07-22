import axios from 'axios';

const testServer = async () => {
  try {
    console.log('Testing backend server...');
    
    // Test if server is responding
    const response = await axios.get('http://localhost:5001/api/auth/test');
    console.log('✅ Backend server is running:', response.data);
    
  } catch (error) {
    console.log('❌ Backend test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('Server is not running on port 5001');
    }
  }
};

testServer(); 