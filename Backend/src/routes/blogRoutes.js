import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { createBlog, getPublicBlogs, getBlogById, toggleLike, toggleDislike, toggleSave } from '../controllers/blogController.js';
import { verifyToken, isAuthor } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Set up Cloudinary Storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog_covers', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
  },
});

const upload = multer({ storage: storage });

// Public can see approved blogs
router.get('/', getPublicBlogs);

// Get single blog
router.get('/:id', getBlogById);

// Only Approved Authors or Admins can create
router.post('/', verifyToken, isAuthor, createBlog);

// Interaction routes
router.post('/:id/like', verifyToken, toggleLike);
router.post('/:id/dislike', verifyToken, toggleDislike);
router.post('/:id/save', verifyToken, toggleSave);

// Image Upload Endpoint (EditorJS integration with Cloudinary)
router.post('/upload-image', verifyToken, isAuthor, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: 0, message: 'No file uploaded' });
  
  // Cloudinary returns secure HTTPS URL directly
  res.json({
    success: 1,
    file: { 
      url: req.file.path // This is already a full HTTPS URL from Cloudinary
    },
  });
});

export default router;
