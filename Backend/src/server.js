import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import db from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import blogRoutes from './routes/blogRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middleware - robust CORS for both browser and serverless environments
app.use(cors({
  origin: (origin, callback) => {
    // Allow same-origin or explicit frontend app origin in production
    if (!origin || origin === 'https://abdullah-codeblog.vercel.app' || origin === 'https://blog-web-app-eight-omega.vercel.app') {
      callback(null, true);
    } else {
      callback(null, true); // set to false to restrict origins
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Auth Routes
app.use('/api/auth', authRoutes);

// Admin Routes
app.use('/api/admin', adminRoutes);

// Blog Routes
app.use('/api/blogs', blogRoutes);

// Test Route to check DB connection
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json({ status: "OK", database: "Connected", data: rows });
  } catch (err) {
    res.status(500).json({ status: "Error", message: err.message });
  }
});

const PORT = process.env.PORT || 8000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () =>  console.log(`🚀 Server running on http://localhost:${PORT}`));
}
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack || err);
  res.status(500).json({ success: 0, message: err.message || 'Internal Server Error' });
});

// THIS IS THE MOST IMPORTANT LINE FOR VERCEL
export default app;
