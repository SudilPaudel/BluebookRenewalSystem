const axios = require('axios');
require('dotenv').config();

// Demo Khalti API simulation for testing
class KhaltiDemoAPI {
    constructor() {
        this.baseUrl = 'https://a.khalti.com/api/v2';
        this.secretKey = process.env.KHALTI_SECRET_KEY || 'demo_secret_key';
        this.payments = new Map(); // Store demo payments
    }

    // Simulate payment initiation
    async initiatePayment(paymentData) {
        console.log('🚀 Simulating Khalti Payment Initiation...');
        
        // Generate a demo PIDX
        const pidx = `demo_pidx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Store payment data
        this.payments.set(pidx, {
            ...paymentData,
            pidx,
            status: 'Pending',
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
        });

        return {
            pidx,
            payment_url: `https://demo.khalti.com/pay/${pidx}`,
            expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
            status: 'Pending'
        };
    }

    // Simulate payment lookup
    async lookupPayment(pidx) {
        console.log('🔍 Simulating Khalti Payment Lookup...');
        
        const payment = this.payments.get(pidx);
        if (!payment) {
            throw new Error('Payment not found');
        }

        return {
            pidx: payment.pidx,
            status: payment.status,
            total_amount: payment.amount,
            transaction_id: payment.status === 'Completed' ? `TXN_${Date.now()}` : null,
            fee: 0,
            refunded: false
        };
    }

    // Simulate payment completion (for demo purposes)
    async completePayment(pidx) {
        const payment = this.payments.get(pidx);
        if (payment) {
            payment.status = 'Completed';
            payment.completed_at = new Date().toISOString();
            this.payments.set(pidx, payment);
        }
    }
}

// Test the demo API
async function testDemoKhaltiAPI() {
    console.log('🧪 Testing Demo Khalti API Integration...\n');
    
    const khaltiDemo = new KhaltiDemoAPI();
    
    try {
        // Test payment initiation
        const testData = {
            return_url: "http://localhost:5173/payment-verification/test",
            purchase_order_id: "DEMO_ORDER_123",
            amount: 1000, // 10 rupees in paisa
            website_url: "http://localhost:5173",
            purchase_order_name: "Demo Bluebook Tax Payment"
        };
        
        console.log('📋 Test Payment Data:');
        console.log(`   Order ID: ${testData.purchase_order_id}`);
        console.log(`   Amount: ${testData.amount / 100} NPR`);
        console.log(`   Return URL: ${testData.return_url}`);
        console.log('');
        
        const response = await khaltiDemo.initiatePayment(testData);
        
        console.log('✅ Demo Payment Initiation Successful!');
        console.log(`   PIDX: ${response.pidx}`);
        console.log(`   Payment URL: ${response.payment_url}`);
        console.log(`   Expires At: ${response.expires_at}`);
        console.log('');
        
        // Test payment lookup (before completion)
        console.log('🔍 Testing Payment Lookup (Pending)...');
        const lookupResponse1 = await khaltiDemo.lookupPayment(response.pidx);
        
        console.log('✅ Payment Lookup Successful!');
        console.log(`   Status: ${lookupResponse1.status}`);
        console.log(`   Amount: ${lookupResponse1.total_amount / 100} NPR`);
        console.log('');
        
        // Simulate payment completion
        console.log('💰 Simulating Payment Completion...');
        await khaltiDemo.completePayment(response.pidx);
        
        // Test payment lookup (after completion)
        console.log('🔍 Testing Payment Lookup (Completed)...');
        const lookupResponse2 = await khaltiDemo.lookupPayment(response.pidx);
        
        console.log('✅ Payment Completion Successful!');
        console.log(`   Status: ${lookupResponse2.status}`);
        console.log(`   Transaction ID: ${lookupResponse2.transaction_id}`);
        console.log('');
        
        console.log('🎉 Demo Khalti API Integration Test PASSED!');
        console.log('   Your payment system is ready for testing with demo mode.');
        
    } catch (error) {
        console.log('❌ Demo Khalti API Test Failed!');
        console.log(`   Error: ${error.message}`);
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
async function runDemoTests() {
    console.log('🔧 Bluebook Renewal System - Demo API Test Suite\n');
    console.log('=' .repeat(50));
    
    await testDemoKhaltiAPI();
    await testEmailConfig();
    
    console.log('\n' + '=' .repeat(50));
    console.log('📝 Demo Mode Instructions:');
    console.log('   1. Update your .env file with Gmail credentials');
    console.log('   2. The payment system will work in demo mode');
    console.log('   3. For real payments, get Khalti merchant credentials');
    console.log('   4. Check the KHALTI_SETUP_GUIDE.md for production setup');
    console.log('\n🎯 To test the full payment flow:');
    console.log('   1. Start your server: npm start');
    console.log('   2. Start your client: npm run dev');
    console.log('   3. Register and create a bluebook');
    console.log('   4. Try the payment process');
    console.log('   5. Use any mobile number and OTP for demo');
}

runDemoTests().catch(console.error); 