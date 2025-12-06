import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prodDB';

const connectDB = async () => {
  try {
    // Connect to MongoDB with prodDB database
    const connectionOptions = {
      dbName: 'prodDB' // Explicitly set the database name
    };
    
    await mongoose.connect(MONGODB_URI, connectionOptions);
    console.log('MongoDB connected successfully to database: prodDB');
    console.log('Collections available:', (await mongoose.connection.db.listCollections().toArray()).map(c => c.name));
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;

