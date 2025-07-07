const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Test registration with fresh data
async function testRegistration() {
  try {
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    
    console.log('🧪 Testing Registration...');
    console.log(`📧 Using email: ${testEmail}`);
    
    const formData = new FormData();
    formData.append('name', 'Test User');
    formData.append('email', testEmail);
    formData.append('citizenshipNo', '1234567890');
    formData.append('password', 'password123');
    formData.append('confirmPassword', 'password123');
    
    // Add a test image if available
    const testImagePath = path.join(__dirname, 'public', 'uploads', 'users', 'test.png');
    if (fs.existsSync(testImagePath)) {
      formData.append('image', fs.createReadStream(testImagePath));
    } else {
      console.log('⚠️  No test image found, skipping image upload');
    }
    
    const response = await axios.post('http://localhost:9005/auth/register', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    
    console.log('✅ Registration successful!');
    console.log('📋 Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.result && response.data.result.userId) {
      console.log('\n🔍 Testing OTP verification...');
      
      // Test OTP verification (you'll need to get the actual OTP from server logs)
      console.log('💡 Check server console for the OTP code');
      console.log('📝 You can test OTP verification manually in the browser');
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

// Test validation errors
async function testValidationErrors() {
  console.log('\n🧪 Testing Validation Errors...');
  
  const testCases = [
    {
      name: 'Missing confirmPassword',
      data: {
        name: 'Test User',
        email: 'test@example.com',
        citizenshipNo: '1234567890',
        password: 'password123'
        // Missing confirmPassword
      }
    },
    {
      name: 'Password mismatch',
      data: {
        name: 'Test User',
        email: 'test@example.com',
        citizenshipNo: '1234567890',
        password: 'password123',
        confirmPassword: 'wrongpassword'
      }
    },
    {
      name: 'Invalid email',
      data: {
        name: 'Test User',
        email: 'invalid-email',
        citizenshipNo: '1234567890',
        password: 'password123',
        confirmPassword: 'password123'
      }
    }
  ];
  
  for (const testCase of testCases) {
    try {
      console.log(`\n📝 Testing: ${testCase.name}`);
      
      const formData = new FormData();
      Object.entries(testCase.data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      const response = await axios.post('http://localhost:9005/auth/register', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
      
      console.log('✅ Unexpected success:', response.data);
      
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.log('✅ Validation error caught correctly');
        console.log('📋 Error details:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Registration Tests...\n');
  
  await testRegistration();
  await testValidationErrors();
  
  console.log('\n✨ Tests completed!');
}

runTests().catch(console.error); 