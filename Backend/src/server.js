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

// Middleware
app.use(cors());
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


// THIS IS THE MOST IMPORTANT LINE FOR VERCEL
export default app;
