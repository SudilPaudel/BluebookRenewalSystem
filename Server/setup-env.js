const fs = require('fs');
const path = require('path');

const envContent = `# Database Configuration
MONGODB_URL=mongodb://localhost:27017
MONGO_DB_NAME=bluebook_renewal

# Server Configuration
PORT=9005

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Khalti Payment Gateway Configuration
# For testing with real Khalti demo credentials
USE_DEMO_PAYMENT=false
KHALTI_SECRET_KEY=test_secret_key_583b0022d828403aa655b2ed39ccaed7
KHALTI_BASE_URL=https://a.khalti.com/api/v2

# For production, get these from Khalti team
# USE_DEMO_PAYMENT=false
# KHALTI_SECRET_KEY=your_live_secret_key_here
# KHALTI_BASE_URL=https://khalti.com/api/v2

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail)
# For Gmail, you need to:
# 1. Enable 2-factor authentication
# 2. Generate an App Password (not your regular password)
# 3. Use the App Password here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=nishantdahit4@gmail.com
SMTP_PASSWORD=your_app_password_here
SMTP_FROM=nishantdahit4@gmail.com

# Optional: For development, you can disable email sending
# DISABLE_EMAIL=true
`;

const envPath = path.join(__dirname, '.env');

try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    console.log('📧 Your Gmail email is set to: nishantdahit4@gmail.com');
    console.log('🔑 Please update SMTP_PASSWORD with your Gmail App Password');
    console.log('📖 Follow the GMAIL_SETUP_GUIDE.md for instructions');
} catch (error) {
    console.error('❌ Error creating .env file:', error.message);
} 