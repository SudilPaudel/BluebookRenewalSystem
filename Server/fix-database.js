const mongoose = require('mongoose');
require('dotenv').config();

async function fixDatabaseIndex() {
    try {
        console.log('🔧 Fixing database index issue...\n');
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: process.env.MONGO_DB_NAME
        });
        
        console.log('✅ Connected to MongoDB');
        
        // Get the database instance
        const db = mongoose.connection.db;
        
        // List all indexes on the payments collection
        console.log('\n📋 Current indexes on payments collection:');
        const indexes = await db.collection('payments').indexes();
        indexes.forEach((index, i) => {
            console.log(`   ${i + 1}. ${JSON.stringify(index.key)} - ${index.unique ? 'UNIQUE' : 'NON-UNIQUE'}`);
        });
        
        // Drop the problematic transactionId index if it exists
        const transactionIdIndex = indexes.find(index => 
            index.key && index.key.transactionId === 1
        );
        
        if (transactionIdIndex) {
            console.log('\n🗑️  Dropping problematic transactionId index...');
            await db.collection('payments').dropIndex('transactionId_1');
            console.log('✅ Successfully dropped transactionId index');
        } else {
            console.log('\n✅ No problematic transactionId index found');
        }
        
        // Verify indexes after fix
        console.log('\n📋 Indexes after fix:');
        const newIndexes = await db.collection('payments').indexes();
        newIndexes.forEach((index, i) => {
            console.log(`   ${i + 1}. ${JSON.stringify(index.key)} - ${index.unique ? 'UNIQUE' : 'NON-UNIQUE'}`);
        });
        
        console.log('\n🎉 Database index fix completed successfully!');
        console.log('   You can now start your server without the duplicate key error.');
        
    } catch (error) {
        console.error('❌ Error fixing database index:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

fixDatabaseIndex(); 