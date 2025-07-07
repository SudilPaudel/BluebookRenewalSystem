const axios = require('axios');
require('dotenv').config();

// Test the demo payment system
async function testDemoPayment() {
    console.log('🧪 Testing Demo Payment System...\n');
    
    const baseURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const apiURL = `http://localhost:9005`;
    
    try {
        // Step 1: Test payment initiation
        console.log('1️⃣ Testing Payment Initiation...');
        
        // First, we need to create a test payment
        const testPaymentData = {
            return_url: `${baseURL}/payment-verification/test`,
            purchase_order_id: "TEST_ORDER_123",
            amount: 1000, // 10 rupees in paisa
            website_url: baseURL,
            purchase_order_name: "Test Bluebook Tax Payment"
        };
        
        // Simulate the payment initiation (this would normally come from your frontend)
        console.log('   Payment Data:', testPaymentData);
        
        // Step 2: Test payment completion
        console.log('\n2️⃣ Testing Payment Completion...');
        
        // Generate a demo PIDX
        const pidx = `demo_pidx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.log('   Generated PIDX:', pidx);
        
        // Complete the demo payment
        const completeResponse = await axios.post(`${apiURL}/payment/demo/complete`, {
            pidx: pidx
        });
        
        console.log('   ✅ Payment Completion Response:', completeResponse.data);
        
        // Step 3: Test payment verification
        console.log('\n3️⃣ Testing Payment Verification...');
        
        // This would normally be called by your frontend after payment
        const verifyResponse = await axios.post(`${apiURL}/payment/verify/test`, {
            pidx: pidx
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('   ✅ Payment Verification Response:', verifyResponse.data);
        
        console.log('\n🎉 Demo Payment System Test PASSED!');
        console.log('   Your payment system is working in demo mode.');
        
    } catch (error) {
        console.log('❌ Demo Payment Test Failed!');
        console.log(`   Error: ${error.message}`);
        
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
        }
    }
}

// Test the server health
async function testServerHealth() {
    console.log('🏥 Testing Server Health...\n');
    
    try {
        const response = await axios.get('http://localhost:9005/health');
        console.log('✅ Server is healthy:', response.data);
        return true;
    } catch (error) {
        console.log('❌ Server is not responding');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log('🔧 Bluebook Renewal System - Demo Payment Test Suite\n');
    console.log('=' .repeat(60));
    
    const serverHealthy = await testServerHealth();
    
    if (serverHealthy) {
        await testDemoPayment();
    } else {
        console.log('\n⚠️  Please start your server first:');
        console.log('   cd Server && npm start');
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log('📝 Demo Mode Instructions:');
    console.log('   1. Your system is now in demo payment mode');
    console.log('   2. No real Khalti API calls will be made');
    console.log('   3. All payments are simulated for testing');
    console.log('   4. Set USE_DEMO_PAYMENT=false for real payments');
    console.log('\n🎯 To test the full payment flow:');
    console.log('   1. Start your server: npm start');
    console.log('   2. Start your client: npm run dev');
    console.log('   3. Register and create a bluebook');
    console.log('   4. Try the payment process');
    console.log('   5. Use any mobile number and OTP for demo');
}

runAllTests().catch(console.error); 