require('dotenv').config();

console.log('🔍 Environment Variables Check:');
console.log('DISABLE_EMAIL:', process.env.DISABLE_EMAIL);
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? 'SET' : 'NOT SET');

const condition = process.env.DISABLE_EMAIL === 'true' || !process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD;
console.log('\n📋 Demo mode condition:', condition);
console.log('DISABLE_EMAIL === true:', process.env.DISABLE_EMAIL === 'true');
console.log('!SMTP_HOST:', !process.env.SMTP_HOST);
console.log('!SMTP_USER:', !process.env.SMTP_USER);
console.log('!SMTP_PASSWORD:', !process.env.SMTP_PASSWORD); 