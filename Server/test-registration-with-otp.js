const axios = require('axios');
const FormData = require('form-data');

async function testRegistrationWithOtp() {
  try {
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    
    console.log('🧪 Testing Registration with OTP...');
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
      console.log('1. The OTP should be shown in the server console');
      console.log('2. Check the terminal where you ran "npm start" for the OTP');
      console.log('3. Use that OTP to verify the email');
      
      // Test OTP verification with a dummy OTP
      console.log('\n🧪 Testing OTP verification endpoint...');
      try {
        const otpResponse = await axios.post('http://localhost:9005/auth/verify-email-otp', {
          userId: response.data.result.userId,
          otp: '123456' // Dummy OTP
        });
        console.log('❌ OTP verification should fail with dummy OTP');
      } catch (otpError) {
        if (otpError.response && otpError.response.status === 400) {
          console.log('✅ OTP verification correctly rejected invalid OTP');
          console.log('📋 Error:', otpError.response.data.message);
        }
      }
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

testRegistrationWithOtp(); 