const axios = require('axios');
require('dotenv').config();

// Test Khalti API integration
async function testKhaltiAPI() {
    console.log('🧪 Testing Khalti API Integration...\n');
    
    const khaltiSecretKey = process.env.KHALTI_SECRET_KEY || 'test_secret_key_583b0022d828403aa655b2ed39ccaed7';
    const khaltiBaseUrl = process.env.KHALTI_BASE_URL || 'https://a.khalti.com/api/v2';
    
    console.log('📋 Configuration:');
    console.log(`   Base URL: ${khaltiBaseUrl}`);
    console.log(`   Secret Key: ${khaltiSecretKey.substring(0, 10)}...`);
    console.log('');
    
    try {
        // Test payment initiation
        const testData = {
            return_url: "http://localhost:5173/payment-verification/test",
            purchase_order_id: "TEST_ORDER_123",
            amount: 1000, // 10 rupees in paisa
            website_url: "http://localhost:5173",
            purchase_order_name: "Test Payment"
        };
        
        console.log('🚀 Testing Payment Initiation...');
        const response = await axios.post(`${khaltiBaseUrl}/epayment/initiate/`, testData, {
            headers: {
                'Authorization': `key ${khaltiSecretKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Payment Initiation Successful!');
        console.log(`   Payment URL: ${response.data.payment_url}`);
        console.log(`   PIDX: ${response.data.pidx}`);
        console.log('');
        
        // Test payment lookup
        console.log('🔍 Testing Payment Lookup...');
        const lookupResponse = await axios.post(`${khaltiBaseUrl}/epayment/lookup/`, {
            pidx: response.data.pidx
        }, {
            headers: {
                'Authorization': `key ${khaltiSecretKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Payment Lookup Successful!');
        console.log(`   Status: ${lookupResponse.data.status}`);
        console.log(`   Amount: ${lookupResponse.data.total_amount / 100} NPR`);
        console.log('');
        
        console.log('🎉 Khalti API Integration Test PASSED!');
        console.log('   Your payment system is ready for testing.');
        
    } catch (error) {
        console.log('❌ Khalti API Test Failed!');
        console.log(`   Error: ${error.message}`);
        
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
        }
        
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Check your internet connection');
        console.log('   2. Verify Khalti API credentials');
        console.log('   3. Ensure Khalti service is available');
    }
}

// Test email configuration
async function testEmailConfig() {
    console.log('\n📧 Testing Email Configuration...\n');
    
    const smtpConfig = {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASSWORD,
        from: process.env.SMTP_FROM
    };
    
    console.log('📋 SMTP Configuration:');
    console.log(`   Host: ${smtpConfig.host}`);
    console.log(`   Port: ${smtpConfig.port}`);
    console.log(`   Secure: ${smtpConfig.secure}`);
    console.log(`   User: ${smtpConfig.user}`);
    console.log(`   From: ${smtpConfig.from}`);
    console.log(`   Password: ${smtpConfig.password ? '✅ Set' : '❌ Not Set'}`);
    
    if (!smtpConfig.password || smtpConfig.password === 'your_app_password') {
        console.log('\n⚠️  Email Configuration Issue:');
        console.log('   Please set up your Gmail App Password in .env file');
        console.log('   Follow the Gmail setup guide in KHALTI_SETUP_GUIDE.md');
    } else {
        console.log('\n✅ Email Configuration Looks Good!');
    }
}

// Run tests
async function runTests() {
    console.log('🔧 Bluebook Renewal System - API Test Suite\n');
    console.log('=' .repeat(50));
    
    await testKhaltiAPI();
    await testEmailConfig();
    
    console.log('\n' + '=' .repeat(50));
    console.log('📝 Next Steps:');
    console.log('   1. Update your .env file with Gmail credentials');
    console.log('   2. Test the payment flow in your application');
    console.log('   3. Check the KHALTI_SETUP_GUIDE.md for detailed instructions');
}

runTests().catch(console.error); 