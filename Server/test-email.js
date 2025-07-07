const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmailConfiguration() {
    console.log('🧪 Testing Email Configuration...\n');
    
    // Check if email configuration exists
    const smtpConfig = {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASSWORD,
        from: process.env.SMTP_FROM
    };
    
    console.log('📧 Email Configuration Check:');
    console.log(`SMTP Host: ${smtpConfig.host || '❌ Not set'}`);
    console.log(`SMTP Port: ${smtpConfig.port || '❌ Not set'}`);
    console.log(`SMTP User: ${smtpConfig.user || '❌ Not set'}`);
    console.log(`SMTP Password: ${smtpConfig.password ? '✅ Set' : '❌ Not set'}`);
    console.log(`SMTP From: ${smtpConfig.from || '❌ Not set'}\n`);
    
    // Check if all required fields are present
    const missingFields = [];
    if (!smtpConfig.host) missingFields.push('SMTP_HOST');
    if (!smtpConfig.port) missingFields.push('SMTP_PORT');
    if (!smtpConfig.user) missingFields.push('SMTP_USER');
    if (!smtpConfig.password) missingFields.push('SMTP_PASSWORD');
    if (!smtpConfig.from) missingFields.push('SMTP_FROM');
    
    if (missingFields.length > 0) {
        console.log('❌ Missing email configuration:');
        missingFields.forEach(field => console.log(`   - ${field}`));
        console.log('\n📝 Please create a .env file with the required email configuration.');
        console.log('📖 See GMAIL_SETUP_GUIDE.md for detailed instructions.\n');
        return;
    }
    
    // Create transporter
    const transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: false, // true for 465, false for other ports
        auth: {
            user: smtpConfig.user,
            pass: smtpConfig.password
        }
    });
    
    console.log('🔗 Testing SMTP Connection...');
    
    try {
        // Verify connection
        await transporter.verify();
        console.log('✅ SMTP connection successful!\n');
        
        // Send test email
        console.log('📤 Sending test email...');
        
        const testEmail = {
            from: smtpConfig.from,
            to: smtpConfig.user, // Send to yourself for testing
            subject: '🧪 Email Test - Bluebook Renewal System',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #007bff;">✅ Email Test Successful!</h2>
                    <p>Hello,</p>
                    <p>This is a test email from your Bluebook Renewal System.</p>
                    <p>If you received this email, your email configuration is working correctly!</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p><strong>Test Details:</strong></p>
                    <ul>
                        <li>SMTP Host: ${smtpConfig.host}</li>
                        <li>SMTP Port: ${smtpConfig.port}</li>
                        <li>From: ${smtpConfig.from}</li>
                        <li>Sent at: ${new Date().toLocaleString()}</li>
                    </ul>
                    <p style="color: #666; font-size: 12px;">
                        This email was sent automatically by the Bluebook Renewal System email test.
                    </p>
                </div>
            `
        };
        
        const info = await transporter.sendMail(testEmail);
        
        console.log('✅ Test email sent successfully!');
        console.log(`📧 Message ID: ${info.messageId}`);
        console.log(`📬 Check your inbox: ${smtpConfig.user}\n`);
        
        console.log('🎉 Email configuration is working perfectly!');
        console.log('📝 You can now register users and they will receive OTP emails.\n');
        
    } catch (error) {
        console.log('❌ Email test failed:');
        console.log(`   Error: ${error.message}`);
        
        if (error.code === 'EAUTH') {
            console.log('\n🔧 Authentication Error - Common Solutions:');
            console.log('1. Make sure you\'re using an App Password (not regular password)');
            console.log('2. Enable 2-Factor Authentication on your Gmail account');
            console.log('3. Generate a new App Password');
            console.log('4. Check that your email address is correct');
        } else if (error.code === 'ECONNECTION') {
            console.log('\n🔧 Connection Error - Common Solutions:');
            console.log('1. Check your internet connection');
            console.log('2. Verify SMTP host and port are correct');
            console.log('3. Try a different email service');
        }
        
        console.log('\n📖 See GMAIL_SETUP_GUIDE.md for detailed troubleshooting steps.\n');
    }
}

// Run the test
testEmailConfiguration(); 