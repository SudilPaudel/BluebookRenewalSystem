# Khalti Demo Credentials & Setup Guide

## 🎯 **Khalti Demo Account Information**

### **Official Khalti Demo Credentials**

Khalti provides demo credentials for testing purposes. Here are the correct credentials:

#### **Test Environment**
- **Base URL**: `https://a.khalti.com/api/v2`
- **Secret Key**: `test_secret_key_583b0022d828403aa655b2ed39ccaed7`
- **Public Key**: `test_public_key_583b0022d828403aa655b2ed39ccaed7`

#### **Live Environment**
- **Base URL**: `https://khalti.com/api/v2`
- **Secret Key**: Your live secret key (after business verification)
- **Public Key**: Your live public key (after business verification)

## 🚀 **How to Get Khalti Demo Access**

### **Method 1: Contact Khalti Support**
1. **Email**: support@khalti.com
2. **Phone**: +977-1-5970015
3. **Request**: Demo account for development/testing

### **Method 2: Business Registration**
1. **Visit**: [Khalti Business Page](https://khalti.com/business)
2. **Email**: business@khalti.com
3. **Complete**: Business verification process

### **Method 3: Developer Portal**
1. **Visit**: [Khalti Developer Portal](https://docs.khalti.com/)
2. **Register**: As a developer
3. **Get**: Test credentials

## 🔧 **Updated Environment Configuration**

Update your `Server/.env` file with these settings:

```env
# Khalti Payment Gateway Configuration
USE_DEMO_PAYMENT=false
KHALTI_SECRET_KEY=test_secret_key_583b0022d828403aa655b2ed39ccaed7
KHALTI_BASE_URL=https://a.khalti.com/api/v2

# For production (after getting live credentials)
# USE_DEMO_PAYMENT=false
# KHALTI_SECRET_KEY=your_live_secret_key_here
# KHALTI_BASE_URL=https://khalti.com/api/v2
```

## 🧪 **Testing with Khalti Demo**

### **Test Payment Flow**
1. **Initiate Payment**: Use the demo secret key
2. **Payment URL**: Will redirect to Khalti test environment
3. **Test Credentials**:
   - **Mobile Number**: Any valid Nepali number (e.g., 9841234567)
   - **OTP**: Any 6-digit number (e.g., 123456)
   - **Amount**: Will be calculated automatically

### **Test API Endpoints**

#### **Payment Initiation**
```bash
curl -X POST https://a.khalti.com/api/v2/epayment/initiate/ \
  -H "Authorization: key test_secret_key_583b0022d828403aa655b2ed39ccaed7" \
  -H "Content-Type: application/json" \
  -d '{
    "return_url": "http://localhost:5173/payment-verification/test",
    "purchase_order_id": "TEST_ORDER_123",
    "amount": 1000,
    "website_url": "http://localhost:5173",
    "purchase_order_name": "Test Payment"
  }'
```

#### **Payment Lookup**
```bash
curl -X POST https://a.khalti.com/api/v2/epayment/lookup/ \
  -H "Authorization: key test_secret_key_583b0022d828403aa655b2ed39ccaed7" \
  -H "Content-Type: application/json" \
  -d '{
    "pidx": "your_pidx_here"
  }'
```

## 📋 **Khalti API Documentation**

### **Official Documentation**
- **API Docs**: [https://docs.khalti.com/](https://docs.khalti.com/)
- **SDK**: [https://github.com/khalti/khalti-sdk](https://github.com/khalti/khalti-sdk)
- **Support**: [https://khalti.com/support](https://khalti.com/support)

### **API Endpoints**
- **Payment Initiation**: `POST /api/v2/epayment/initiate/`
- **Payment Lookup**: `POST /api/v2/epayment/lookup/`
- **Payment Verification**: `POST /api/v2/epayment/verify/`

## 🔒 **Security Notes**

1. **Never commit** your live Khalti credentials to version control
2. **Use environment variables** for all sensitive data
3. **Test thoroughly** with demo credentials before going live
4. **Monitor payments** in Khalti dashboard
5. **Handle errors** gracefully in your application

## 🎯 **Next Steps**

1. **Update your `.env` file** with the demo credentials above
2. **Set `USE_DEMO_PAYMENT=false`** to use real Khalti API
3. **Test the payment flow** with demo credentials
4. **Contact Khalti** for live credentials when ready for production

## 📞 **Khalti Contact Information**

- **General Support**: support@khalti.com
- **Business Inquiries**: business@khalti.com
- **Phone**: +977-1-5970015
- **Website**: [https://khalti.com](https://khalti.com)
- **Documentation**: [https://docs.khalti.com](https://docs.khalti.com)

---

**Note**: The demo credentials provided above are for testing purposes. For production use, you must complete Khalti's business verification process and get your own live credentials. 

📧 DEMO MODE: Email not configured
📱 OTP for rajanpachhai2025@gmail.com: 126922
💡 To enable real email sending, configure SMTP settings in .env file 