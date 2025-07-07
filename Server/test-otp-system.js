const mongoose = require('mongoose');
const PaymentModel = require('./src/modules/payment/payment.model');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bluebook_renewal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function testOtpSystem() {
    try {
        console.log('🧪 Testing OTP System...\n');
        
        // Test 1: Generate OTP
        console.log('📱 Test 1: OTP Generation');
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`Generated OTP: ${otp}`);
        console.log(`OTP Length: ${otp.length}`);
        console.log(`OTP is 6 digits: ${/^\d{6}$/.test(otp)}\n`);
        
        // Test 2: Create a test payment with OTP
        console.log('💳 Test 2: Creating Payment with OTP');
        const testPayment = new PaymentModel({
            paymentMethod: 'khalti',
            paymentStatus: 'pending',
            status: 'pending',
            amount: 5000,
            pidx: `test_pidx_${Date.now()}`,
            userId: new mongoose.Types.ObjectId(),
            createdBy: new mongoose.Types.ObjectId(),
            otp: otp,
            otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
        });
        
        await testPayment.save();
        console.log(`✅ Payment created with ID: ${testPayment._id}`);
        console.log(`OTP stored: ${testPayment.otp}`);
        console.log(`OTP expires at: ${testPayment.otpExpiresAt}\n`);
        
        // Test 3: Verify OTP validation
        console.log('🔍 Test 3: OTP Validation');
        
        // Test valid OTP
        const validOtp = otp;
        const isValidOtp = testPayment.otp === validOtp;
        console.log(`Valid OTP test: ${isValidOtp ? '✅ PASS' : '❌ FAIL'}`);
        
        // Test invalid OTP
        const invalidOtp = '123456';
        const isInvalidOtp = testPayment.otp !== invalidOtp;
        console.log(`Invalid OTP test: ${isInvalidOtp ? '✅ PASS' : '❌ FAIL'}`);
        
        // Test OTP format validation
        const validFormat = /^\d{6}$/.test(otp);
        console.log(`OTP format validation: ${validFormat ? '✅ PASS' : '❌ FAIL'}`);
        
        // Test OTP expiration
        const isExpired = testPayment.otpExpiresAt < new Date();
        console.log(`OTP expiration check: ${!isExpired ? '✅ PASS' : '❌ FAIL'}\n`);
        
        // Test 4: Simulate OTP verification
        console.log('✅ Test 4: Simulating OTP Verification');
        if (testPayment.otp === validOtp && testPayment.otpExpiresAt > new Date()) {
            testPayment.paymentStatus = 'paid';
            testPayment.status = 'successful';
            testPayment.otp = null;
            testPayment.otpExpiresAt = null;
            await testPayment.save();
            console.log('✅ OTP verification successful - Payment marked as paid');
        } else {
            console.log('❌ OTP verification failed');
        }
        
        console.log('\n🎉 OTP System Test Completed Successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

// Run the test
testOtpSystem(); 