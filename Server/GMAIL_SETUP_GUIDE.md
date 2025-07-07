# 📧 Gmail Email Setup Guide

## ✅ **Step-by-Step Gmail Configuration**

### 1. **Enable 2-Factor Authentication**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click "Security" in the left sidebar
3. Under "Signing in to Google", click "2-Step Verification"
4. Follow the steps to enable 2FA

### 2. **Generate App Password**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click "Security" → "2-Step Verification"
3. Scroll down and click "App passwords"
4. Select "Mail" and "Other (Custom name)"
5. Enter "Bluebook Renewal System" as the name
6. Click "Generate"
7. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### 3. **Create .env File**
Create a `.env` file in your Server directory:

```env
# Server Configuration
PORT=9005
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/bluebook_renewal

# Frontend URL
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_16_character_app_password
SMTP_FROM=your_email@gmail.com

# Khalti Payment Configuration
USE_DEMO_PAYMENT=true
KHALTI_SECRET_KEY=test_secret_key_583b0022d828403aa655b2ed39ccaed7
KHALTI_PUBLIC_KEY=test_public_key_583b0022d828403aa655b2ed39ccaed7
KHALTI_BASE_URL=https://a.khalti.com/api/v2

# File Upload Configuration
UPLOAD_PATH=./public/uploads
MAX_FILE_SIZE=5242880
```

### 4. **Replace Placeholders**
- Replace `your_email@gmail.com` with your actual Gmail address
- Replace `your_16_character_app_password` with the app password from step 2

### 5. **Restart Server**
```bash
cd Server
npm start
```

## 🔍 **Testing Email Sending**

### Test Script
Run this to test email configuration:

```bash
node test-email.js
```

### Manual Test
Try registering a new user - you should receive an OTP email!

## ⚠️ **Common Issues & Solutions**

### Issue 1: "Invalid login" Error
**Solution**: Make sure you're using the App Password, not your regular Gmail password

### Issue 2: "Less secure app access" Error
**Solution**: Use App Passwords (2FA required) instead of less secure apps

### Issue 3: "Username and Password not accepted"
**Solution**: 
1. Double-check the app password (16 characters, no spaces)
2. Ensure 2FA is enabled
3. Make sure the email address is correct

## 🚀 **Alternative Email Services**

If Gmail doesn't work, try these alternatives:

### Option 1: Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your_email@outlook.com
SMTP_PASSWORD=your_password
```

### Option 2: Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your_email@yahoo.com
SMTP_PASSWORD=your_app_password
```

### Option 3: SendGrid (Free Tier)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
```

## ✅ **Success Indicators**

When email is working correctly, you should see:
- ✅ No "Email transport error" in server logs
- ✅ "Email sent successfully" messages
- ✅ OTP emails received in your inbox
- ✅ Professional email formatting

## 🔧 **Troubleshooting**

### Check Server Logs
Look for these messages:
- ✅ "Email sent successfully"
- ❌ "Email transport error"
- ❌ "Invalid login"

### Test Connection
```bash
# Test SMTP connection
telnet smtp.gmail.com 587
```

### Verify .env File
Make sure:
- No extra spaces in values
- No quotes around values
- File is in the correct location (Server/.env)

## 🎯 **Quick Setup Checklist**

- [ ] 2-Factor Authentication enabled
- [ ] App Password generated
- [ ] .env file created with correct credentials
- [ ] Server restarted
- [ ] Test registration with real email
- [ ] OTP email received

## 📞 **Need Help?**

If you're still having issues:
1. Check the server logs for specific error messages
2. Verify your Gmail account settings
3. Try a different email service
4. Test with a simple email first 