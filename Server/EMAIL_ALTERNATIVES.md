# 📧 Alternative Email Services Guide

## 🎯 **Quick Solutions for Email Sending**

### **Option 1: Outlook/Hotmail (Easiest)**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your_email@outlook.com
SMTP_PASSWORD=your_regular_password
SMTP_FROM=your_email@outlook.com
```

### **Option 2: Yahoo Mail**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your_email@yahoo.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=your_email@yahoo.com
```

### **Option 3: SendGrid (Free Tier - 100 emails/day)**
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create API Key
3. Use this configuration:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
SMTP_FROM=your_verified_email@domain.com
```

### **Option 4: Mailgun (Free Tier - 5,000 emails/month)**
1. Sign up at [Mailgun](https://mailgun.com/)
2. Get API Key
3. Use this configuration:
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASSWORD=your_mailgun_password
SMTP_FROM=noreply@your-domain.com
```

## 🔧 **Quick Setup Steps**

### **For Outlook/Hotmail:**
1. Use your regular Outlook password
2. No 2FA required
3. Works immediately

### **For Yahoo:**
1. Enable 2FA
2. Generate App Password
3. Use App Password instead of regular password

### **For SendGrid:**
1. Sign up for free account
2. Verify your sender email
3. Create API Key
4. Use `apikey` as username and API key as password

## 🧪 **Test Your Configuration**

Run the test script after setting up:
```bash
node test-email.js
```

## ✅ **Success Indicators**

- ✅ No "Email transport error" in logs
- ✅ Test email received in inbox
- ✅ OTP emails sent during registration

## 🚀 **Recommended for Demo/Testing**

**Outlook/Hotmail** is the easiest option because:
- ✅ No 2FA required
- ✅ Works with regular password
- ✅ Free and reliable
- ✅ Good for testing

## 📞 **Need Help?**

1. Try Outlook first (easiest)
2. Check the test script output
3. Verify your credentials
4. Check spam folder for test emails 