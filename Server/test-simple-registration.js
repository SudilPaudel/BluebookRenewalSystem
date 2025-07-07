const axios = require('axios');
const FormData = require('form-data');

async function testSimpleRegistration() {
  try {
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    
    console.log('🧪 Testing Simple Registration...');
    console.log(`📧 Using email: ${testEmail}`);
    
    const formData = new FormData();
    formData.append('name', 'Test User');
    formData.append('email', testEmail);
    formData.append('citizenshipNo', '1234567890');
    formData.append('password', 'password123');
    formData.append('confirmPassword', 'password123');
    
    const response = await axios.post('http://localhost:9005/auth/register', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    
    console.log('✅ Registration successful!');
    console.log('📋 Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.result && response.data.result.userId) {
      console.log('\n🔍 Next steps:');
      console.log('1. Check server console for OTP code');
      console.log('2. Use the OTP to verify email in browser');
      console.log('3. Then try logging in');
    }
    
  } catch (error) {
    console.error('❌ Registration failed:');
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📋 Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('🚫 Error:', error.message);
    }
  }
}

testSimpleRegistration(); 