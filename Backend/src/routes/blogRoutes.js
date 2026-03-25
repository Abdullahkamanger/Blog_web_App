import express from 'express';
import multer from 'multer';
import path from 'path';
import { createBlog, getPublicBlogs } from '../controllers/blogController.js';
import { verifyToken, isAuthor } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Configure how & where to store files (standard professional approach)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    // timestamp-originalname.jpg
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Public can see approved blogs
router.get('/', getPublicBlogs);

// Only Approved Authors or Admins can create
router.post('/', verifyToken, isAuthor, createBlog);

// 2. The Image Upload Endpoint (Secured and Standardized)
router.post('/upload-image', verifyToken, isAuthor, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: 0, message: 'No file uploaded' });
  
  res.json({
    success: 1,
    file: { 
      url: `http://localhost:8000/uploads/${req.file.filename}` 
    },
  });
});

export default router;
