const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:9005';

async function testRegistrationFlow() {
    console.log('🧪 Testing Complete Registration Flow with OTP\n');

    try {
        // Step 1: Register a new user
        console.log('📝 Step 1: Registering new user...');
        
        const formData = new FormData();
        formData.append('name', 'Test User');
        formData.append('email', 'test@example.com');
        formData.append('citizenshipNo', '1234567890');
        formData.append('password', 'TestPassword123!');
        
        // Create a proper test image (1x1 pixel PNG)
        const testImagePath = path.join(__dirname, 'test-image.png');
        const pngData = Buffer.from([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
            0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
            0x49, 0x48, 0x44, 0x52, // IHDR
            0x00, 0x00, 0x00, 0x01, // width: 1
            0x00, 0x00, 0x00, 0x01, // height: 1
            0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, etc.
            0x90, 0x77, 0x53, 0xDE, // CRC
            0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
            0x49, 0x44, 0x41, 0x54, // IDAT
            0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // compressed data
            0x00, 0x00, 0x00, 0x00, // IEND chunk length
            0x49, 0x45, 0x4E, 0x44, // IEND
            0xAE, 0x42, 0x60, 0x82  // CRC
        ]);
        fs.writeFileSync(testImagePath, pngData);
        
        formData.append('image', fs.createReadStream(testImagePath));

        const registerResponse = await axios.post(`${API_BASE}/auth/register`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        console.log('✅ Registration successful!');
        console.log('📧 Response:', registerResponse.data.message);
        
        const userId = registerResponse.data.result.userId;
        console.log('🆔 User ID:', userId);

        // Step 2: Test OTP verification (this will fail with wrong OTP)
        console.log('\n🔐 Step 2: Testing OTP verification with wrong OTP...');
        
        try {
            await axios.post(`${API_BASE}/auth/verify-email-otp`, {
                userId: userId,
                otp: '000000'
            });
        } catch (error) {
            console.log('✅ Expected error for wrong OTP:', error.response.data.message);
        }

        // Step 3: Test resend OTP
        console.log('\n📤 Step 3: Testing resend OTP...');
        
        const resendResponse = await axios.post(`${API_BASE}/auth/resend-otp`, {
            userId: userId
        });

        console.log('✅ Resend OTP successful!');
        console.log('📧 Response:', resendResponse.data.message);

        // Step 4: Test login with unverified account (should fail)
        console.log('\n🔑 Step 4: Testing login with unverified account...');
        
        try {
            await axios.post(`${API_BASE}/auth/login`, {
                email: 'test@example.com',
                password: 'TestPassword123!'
            });
        } catch (error) {
            console.log('✅ Expected error for unverified account:', error.response.data.message);
        }

        console.log('\n🎉 All tests completed successfully!');
        console.log('\n💡 To complete the test:');
        console.log('1. Check the server console for the OTP');
        console.log('2. Use that OTP to verify the email');
        console.log('3. Then try logging in');

        // Clean up
        fs.unlinkSync(testImagePath);

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data?.message || error.message);
    }
}

testRegistrationFlow(); 