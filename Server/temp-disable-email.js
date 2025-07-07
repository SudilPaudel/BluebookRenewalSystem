const fs = require('fs');
const path = require('path');

// Read current .env file
const envPath = path.join(__dirname, '.env');
let envContent = '';

try {
    envContent = fs.readFileSync(envPath, 'utf8');
    console.log('📖 Current .env file read successfully');
} catch (error) {
    console.log('❌ Error reading .env file:', error.message);
    process.exit(1);
}

// Add DISABLE_EMAIL=true to disable email sending
if (!envContent.includes('DISABLE_EMAIL=true')) {
    envContent += '\n# Temporarily disable email sending for testing\nDISABLE_EMAIL=true\n';
    console.log('📧 Added DISABLE_EMAIL=true to .env file');
} else {
    console.log('ℹ️  DISABLE_EMAIL=true already exists in .env file');
}

// Write back to .env file
try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated successfully');
    console.log('📧 Email sending is now disabled for testing');
    console.log('🔧 You can test registration without Gmail setup');
} catch (error) {
    console.error('❌ Error writing .env file:', error.message);
} 