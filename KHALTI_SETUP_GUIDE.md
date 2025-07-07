# Khalti Payment Gateway Setup Guide

## 🚀 Quick Setup for Demo/Testing

### 1. Update Your Environment Variables

Copy the following to your `Server/.env` file:

```env
# Database Configuration
MONGODB_URL=mongodb://localhost:27017
MONGO_DB_NAME=bluebook_renewal

# Server Configuration
PORT=9005

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Khalti Payment Gateway Configuration (TEST CREDENTIALS)
KHALTI_SECRET_KEY=test_secret_key_583b0022d828403aa655b2ed39ccaed7
KHALTI_BASE_URL=https://a.khalti.com/api/v2

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=your_email@gmail.com
```

### 2. Gmail Setup for Email Notifications

#### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

#### Step 2: Generate App Password
1. Go to Google Account settings
2. Navigate to Security → 2-Step Verification
3. Click on "App passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character password
6. Replace `your_app_password` in your `.env` file

#### Step 3: Update Your .env File
Replace these values in your `Server/.env`:
```env
SMTP_USER=your_actual_gmail@gmail.com
SMTP_PASSWORD=your_16_character_app_password
SMTP_FROM=your_actual_gmail@gmail.com
```

### 3. Khalti API Configuration

#### For Testing/Demo (Current Setup)
The system is already configured with test credentials:
- **Secret Key**: `test_secret_key_583b0022d828403aa655b2ed39ccaed7`
- **Base URL**: `https://a.khalti.com/api/v2`

#### For Production
1. **Contact Khalti Business Team**:
   - Email: business@khalti.com
   - Phone: +977-1-5970015
   - Visit: [Khalti Business Page](https://khalti.com/business)

2. **Complete Business Registration**:
   - Submit business documents
   - Complete KYC verification
   - Sign merchant agreement

3. **Get API Credentials**:
   - **Secret Key**: Provided by Khalti team
   - **Base URL**: `https://khalti.com/api/v2`
   - **Test Environment**: `https://a.khalti.com/api/v2`

**Note**: Khalti requires business verification for live API access. For testing, use the demo credentials provided.

### 4. Test the Payment System

#### Test Payment Flow:
1. **Register/Login** to your application
2. **Create a Bluebook** with vehicle details
3. **Wait for Admin Verification** (or verify yourself if admin)
4. **Initiate Payment** - System will:
   - Calculate tax based on vehicle type and engine CC
   - Generate Khalti payment URL
   - Send OTP to your email
5. **Complete Payment** using Khalti test credentials
6. **Verify Payment** - System will update bluebook expiry date

#### Test Credentials for Khalti:
- **Mobile Number**: Any valid Nepali number (e.g., 9841234567)
- **OTP**: Any 6-digit number (e.g., 123456)
- **Amount**: Will be calculated automatically

### 5. API Endpoints

#### Payment Initiation
```
POST /payment/bluebook/:id
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "paymentMethod": "khalti"
}
```

#### Payment Verification
```
POST /payment/verify/:id
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "pidx": "payment_id_from_khalti"
}
```

#### OTP Verification
```
POST /payment/verify-otp
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "paymentId": "payment_id",
  "otp": "123456"
}
```

### 6. Troubleshooting

#### Email Issues:
- **Error**: "Invalid login: 535-5.7.8 Username and Password not accepted"
- **Solution**: Use App Password, not your regular Gmail password

#### Payment Issues:
- **Error**: "Payment gateway is temporarily unavailable"
- **Solution**: Check internet connection and Khalti API status

#### Database Issues:
- **Error**: "E11000 duplicate key error"
- **Solution**: The database schema has been fixed to handle null transaction IDs

### 7. Security Notes

1. **Never commit your `.env` file** to version control
2. **Use different credentials** for development and production
3. **Regularly rotate** your JWT secret and API keys
4. **Monitor payment logs** for suspicious activities

### 8. Production Checklist

- [ ] Update Khalti credentials to live keys
- [ ] Configure proper Gmail SMTP settings
- [ ] Set up SSL certificates
- [ ] Configure proper CORS settings
- [ ] Set up monitoring and logging
- [ ] Test payment flow thoroughly
- [ ] Set up backup database
- [ ] Configure proper error handling

## 🎯 Quick Test

After setup, test the payment flow:

1. Start your server: `npm start`
2. Start your client: `npm run dev`
3. Register a user account
4. Create a bluebook
5. Try making a payment
6. Check your email for OTP
7. Complete the payment verification

The system should now work without the previous errors! 