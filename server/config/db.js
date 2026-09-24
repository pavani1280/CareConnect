const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careconnect');
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    // If local mongodb is not running, inform user or fallback to standard log
    console.log('[Database] Note: Ensure MongoDB server is running on localhost:27017 or update MONGODB_URI in server/.env');
  }
};

module.exports = connectDB;
