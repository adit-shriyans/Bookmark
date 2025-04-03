import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/authRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js'

// Database
import { pool, connect } from './config/db.js';
import initializeDatabase from './config/initDb.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev')); // HTTP request logger
app.use(express.json());

// Connect to database and initialize
const startServer = async () => {
  try {
    const client = await connect();
    console.log('Connected to database');
    
    // Create tables if they don't exist
    await initializeDatabase();
    
    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/bookmarks', bookmarkRoutes);

    // Root route
    app.get('/', (req, res) => {
      res.json({ message: 'Welcome to Library Management System API' });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
