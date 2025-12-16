import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/database.js';
import emailRoutes from './routes/emailRoutes.js';
import fbPostRoutes from './routes/fbPostRoutes.js';
import newsletterTopicRoutes from './routes/newsletterTopicRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://contentmanagerdashboard.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean); // Remove undefined values

// Log CORS configuration on startup
console.log('CORS Configuration:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  FRONTEND_URL:', process.env.FRONTEND_URL || 'not set');
console.log('  Allowed origins:', allowedOrigins.length > 0 ? allowedOrigins : 'all origins');

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // In production, check against allowed origins
    if (process.env.NODE_ENV === 'production') {
      // If origin is in allowed list, allow it
      if (allowedOrigins.length > 0 && allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // If FRONTEND_URL is not set, allow all (fallback)
      if (allowedOrigins.length === 0) {
        console.warn('⚠️  CORS: FRONTEND_URL not set, allowing all origins');
        return callback(null, true);
      }
      // Log blocked origin but still allow (for debugging)
      console.warn(`⚠️  CORS: Origin ${origin} not in allowed list, but allowing anyway`);
      return callback(null, true);
    } else {
      // In development, allow all origins
      return callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/emails', emailRoutes);
app.use('/api/fb-posts', fbPostRoutes);
app.use('/api/newsletter-topics', newsletterTopicRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Debug endpoint - check database connection and collections
app.get('/api/debug/db-info', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Get counts for each collection
    const counts = {};
    for (const collName of collectionNames) {
      try {
        const count = await db.collection(collName).countDocuments();
        counts[collName] = count;
      } catch (err) {
        counts[collName] = `Error: ${err.message}`;
      }
    }
    
    res.json({
      database: mongoose.connection.name,
      collections: collectionNames,
      counts: counts,
      connectionState: mongoose.connection.readyState
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

