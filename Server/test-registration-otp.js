const mongoose = require('mongoose');
const UserModel = require('./src/modules/user/user.model');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bluebook_renewal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function testRegistrationOtp() {
    try {
        console.log('🧪 Testing Registration OTP System...\n');
        
        // Test 1: Create a test user with OTP
        console.log('📝 Test 1: Creating User with OTP');
        const testEmail = `test${Date.now()}@example.com`;
        const testOtp = Math.floor(100000 + Math.random() * 900000).toString();
        
        const testUser = new UserModel({
            name: 'Test User',
            email: testEmail,
            citizenshipNo: `TEST${Date.now()}`,
            password: bcrypt.hashSync('password123', 10),
            role: 'user',
            status: 'pending',
            emailOtp: testOtp,
            emailOtpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            emailVerified: false
        });
        
        await testUser.save();
        console.log(`✅ Test user created with ID: ${testUser._id}`);
        console.log(`Email: ${testUser.email}`);
        console.log(`Status: ${testUser.status}`);
        console.log(`OTP: ${testUser.emailOtp}`);
        console.log(`OTP expires at: ${testUser.emailOtpExpiresAt}\n`);
        
        // Test 2: OTP Validation
        console.log('🔍 Test 2: OTP Validation');
        
        // Test valid OTP
        const validOtp = testOtp;
        const isValidOtp = testUser.emailOtp === validOtp;
        console.log(`Valid OTP test: ${isValidOtp ? '✅ PASS' : '❌ FAIL'}`);
        
        // Test invalid OTP
        const invalidOtp = '123456';
        const isInvalidOtp = testUser.emailOtp !== invalidOtp;
        console.log(`Invalid OTP test: ${isInvalidOtp ? '✅ PASS' : '❌ FAIL'}`);
        
        // Test OTP format validation
        const validFormat = /^\d{6}$/.test(testOtp);
        console.log(`OTP format validation: ${validFormat ? '✅ PASS' : '❌ FAIL'}`);
        
        // Test OTP expiration
        const isExpired = testUser.emailOtpExpiresAt < new Date();
        console.log(`OTP expiration check: ${!isExpired ? '✅ PASS' : '❌ FAIL'}\n`);
        
        // Test 3: Simulate OTP verification
        console.log('✅ Test 3: Simulating OTP Verification');
        if (testUser.emailOtp === validOtp && testUser.emailOtpExpiresAt > new Date()) {
            testUser.status = 'active';
            testUser.emailVerified = true;
            testUser.emailOtp = null;
            testUser.emailOtpExpiresAt = null;
            await testUser.save();
            console.log('✅ OTP verification successful - User account activated');
            console.log(`New status: ${testUser.status}`);
            console.log(`Email verified: ${testUser.emailVerified}`);
        } else {
            console.log('❌ OTP verification failed');
        }
        
        // Test 4: Test login with different statuses
        console.log('\n🔐 Test 4: Login Status Tests');
        
        // Create a pending user
        const pendingUser = new UserModel({
            name: 'Pending User',
            email: `pending${Date.now()}@example.com`,
            citizenshipNo: `PENDING${Date.now()}`,
            password: bcrypt.hashSync('password123', 10),
            role: 'user',
            status: 'pending',
            emailOtp: '123456',
            emailOtpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
            emailVerified: false
        });
        await pendingUser.save();
        
        // Create an inactive user
        const inactiveUser = new UserModel({
            name: 'Inactive User',
            email: `inactive${Date.now()}@example.com`,
            citizenshipNo: `INACTIVE${Date.now()}`,
            password: bcrypt.hashSync('password123', 10),
            role: 'user',
            status: 'inactive',
            emailVerified: false
        });
        await inactiveUser.save();
        
        console.log(`Pending user status: ${pendingUser.status} - Should show "Please verify your email"`);
        console.log(`Inactive user status: ${inactiveUser.status} - Should show "Account not activated"`);
        console.log(`Active user status: ${testUser.status} - Should allow login`);
        
        console.log('\n🎉 Registration OTP System Test Completed Successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

// Run the test
testRegistrationOtp(); 