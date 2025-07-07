const axios = require('axios');

async function testPaymentError() {
  try {
    console.log('🧪 Testing Payment Error...');
    
    // First, let's try to login to get a token
    const loginData = {
      email: 'rajanpachhai2025@gmail.com',
      password: 'password123'
    };
    
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post('http://localhost:9005/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const accessToken = loginResponse.data.result.tokens.accessToken;
    console.log('✅ Login successful, got access token');
    
    // Now test the payment endpoint
    const bluebookId = '6868b86c7a66933c4d3bc5ef'; // From the error URL
    const paymentData = {
      paymentMethod: 'khalti'
    };
    
    console.log(`💳 Testing payment for bluebook: ${bluebookId}`);
    
    const paymentResponse = await axios.post(
      `http://localhost:9005/payment/bluebook/${bluebookId}`,
      paymentData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      }
    );
    
    console.log('✅ Payment successful!');
    console.log('Response:', JSON.stringify(paymentResponse.data, null, 2));
    
  } catch (error) {
    console.log('❌ Error occurred:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error message:', error.response.data.message);
      console.log('Full response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

testPaymentError(); 