const axios = require('axios');

const API_BASE = 'http://localhost:9005';

// Test the public news endpoint
async function testPublicNews() {
  try {
    console.log('Testing public news endpoint...');
    const response = await axios.get(`${API_BASE}/news/public/active?limit=3`);
    console.log('✅ Public news endpoint working:', response.data);
  } catch (error) {
    console.log('❌ Public news endpoint failed:', error.response?.data || error.message);
  }
}

// Test the admin news endpoint (will fail without auth)
async function testAdminNews() {
  try {
    console.log('\nTesting admin news endpoint (should fail without auth)...');
    const response = await axios.get(`${API_BASE}/news`);
    console.log('❌ Admin news endpoint should have failed:', response.data);
  } catch (error) {
    console.log('✅ Admin news endpoint correctly requires auth:', error.response?.status);
  }
}

async function runTests() {
  console.log('🧪 Testing News API Endpoints\n');
  
  await testPublicNews();
  await testAdminNews();
  
  console.log('\n✨ News API tests completed!');
}

runTests(); 