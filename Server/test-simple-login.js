const axios = require('axios');

async function testSimpleLogin() {
  try {
    console.log('🧪 Testing Simple Login...');
    
    // Test with a user that should exist (from the registration logs)
    const loginData = {
      email: 'rajanpachhai2025@gmail.com',
      password: 'password123'
    };
    
    console.log(`📧 Attempting login with: ${loginData.email}`);
    
    const response = await axios.post('http://localhost:9005/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('✅ Login successful!');
    console.log('📋 Response structure:');
    console.log('- success:', response.data.success);
    console.log('- message:', response.data.message);
    console.log('- has tokens:', !!response.data.result?.tokens);
    console.log('- has user detail:', !!response.data.result?.detail);
    
    if (response.data.result?.detail) {
      console.log('👤 User details:');
      console.log('- Name:', response.data.result.detail.name);
      console.log('- Email:', response.data.result.detail.email);
      console.log('- Role:', response.data.result.detail.role);
      console.log('- Status:', response.data.result.detail.status);
    }
    
    if (response.data.result?.tokens) {
      console.log('🔑 Tokens received:');
      console.log('- Access token length:', response.data.result.tokens.accessToken?.length || 0);
      console.log('- Refresh token length:', response.data.result.tokens.refreshToken?.length || 0);
    }
    
  } catch (error) {
    console.error('❌ Login failed:');
    if (error.response) {
      console.error('- Status:', error.response.status);
      console.error('- Message:', error.response.data?.message);
      console.error('- Data:', error.response.data);
    } else {
      console.error('- Error:', error.message);
    }
  }
}

testSimpleLogin(); 