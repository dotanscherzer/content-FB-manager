import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import emailRoutes from './routes/emailRoutes.js';
import fbPostRoutes from './routes/fbPostRoutes.js';
import newsletterTopicRoutes from './routes/newsletterTopicRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

