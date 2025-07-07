const mongoose = require('mongoose');
require('dotenv').config();

async function fixMongoDBIndex() {
    try {
        // Connect to MongoDB
        const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017';
        const dbName = process.env.MONGO_DB_NAME || 'bluebook_renewal';
        const fullUrl = `${mongoUrl}/${dbName}`;
        
        await mongoose.connect(fullUrl);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('payments');

        // Drop the problematic index
        try {
            await collection.dropIndex('transactionId_1');
            console.log('✅ Dropped problematic transactionId_1 index');
        } catch (error) {
            if (error.code === 27) {
                console.log('ℹ️  Index transactionId_1 does not exist, skipping...');
            } else {
                console.log('⚠️  Error dropping index:', error.message);
            }
        }

        // Create a new sparse index that handles null values properly
        try {
            await collection.createIndex(
                { transactionId: 1 }, 
                { 
                    unique: true, 
                    sparse: true
                }
            );
            console.log('✅ Created new sparse index for transactionId');
        } catch (error) {
            console.log('⚠️  Error creating new index:', error.message);
        }

        console.log('✅ MongoDB index fix completed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing MongoDB index:', error.message);
        process.exit(1);
    }
}

fixMongoDBIndex(); 