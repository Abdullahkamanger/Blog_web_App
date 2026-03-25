import express from 'express';
import db from '../config/db.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all pending authors (Admin only)
router.get('/pending-authors', verifyToken, isAdmin, async (req, res) => {
  try {
    const [authors] = await db.query("SELECT id, name, email, role, status FROM users WHERE role = 'AUTHOR' AND status = 'PENDING'");
    res.json(authors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve an author
router.put('/approve-author/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await db.query("UPDATE users SET status = 'APPROVED' WHERE id = ?", [req.params.id]);
    res.json({ message: "Author approved successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Publish/Approve a blog post
router.put('/publish-blog/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await db.query("UPDATE blogs SET is_published = true WHERE id = ?", [req.params.id]);
    res.json({ message: "Blog is now live!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get quick stats for dashboard
router.get('/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const [users] = await db.query("SELECT COUNT(*) as count FROM users");
    const [pending] = await db.query("SELECT COUNT(*) as count FROM users WHERE status = 'PENDING'");
    const [blogs] = await db.query("SELECT COUNT(*) as count FROM blogs");
    
    res.json({
      users: users[0].count,
      pending: pending[0].count,
      blogs: blogs[0].count
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users with optional search
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  const { search } = req.query;
  let query = "SELECT id, name, email, role, status FROM users";
  let params = [];

  if (search) {
    query += " WHERE name LIKE ? OR email LIKE ?";
    params = [`%${search}%`, `%${search}%`];
  }

  try {
    const [users] = await db.query(query, params);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a user
router.delete('/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Role (Make Admin, Author, or Reader)
router.put('/update-role/:id', verifyToken, isAdmin, async (req, res) => {
  const { role } = req.body;
  try {
    await db.query("UPDATE users SET role = ? WHERE id = ?", [role, req.params.id]);
    res.json({ message: "User role updated!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Chart Data: Blogs created in the last 7 days (Zero Padded)
router.get('/blog-stats-chart', verifyToken, isAdmin, async (req, res) => {
  try {
    // This query generates the last 7 days and joins them with your blog counts
    const query = `
      SELECT 
        DATE(d.date) as date, 
        COUNT(blogs.id) as count
      FROM (
        SELECT CURDATE() - INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY AS date
        FROM (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS a
        CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS b
        CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS c
      ) d
      LEFT JOIN blogs ON DATE(blogs.created_at) = d.date
      WHERE d.date BETWEEN CURDATE() - INTERVAL 6 DAY AND CURDATE()
      GROUP BY d.date
      ORDER BY d.date ASC;
    `;

    const [data] = await db.query(query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get ALL blogs for management
router.get('/all-blogs', verifyToken, isAdmin, async (req, res) => {
  try {
    const [blogs] = await db.query(`
      SELECT blogs.id, blogs.title, blogs.is_published, blogs.created_at, users.name as author 
      FROM blogs 
      JOIN users ON blogs.author_id = users.id
      ORDER BY blogs.created_at DESC
    `);
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle Publish Status
router.put('/toggle-publish/:id', verifyToken, isAdmin, async (req, res) => {
  const { status } = req.body; // Expecting boolean
  try {
    await db.query("UPDATE blogs SET is_published = ? WHERE id = ?", [status, req.params.id]);
    res.json({ message: `Blog ${status ? 'published' : 'unpublished'}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin-only: Get full blog details including unpublished ones
router.get('/blog-preview/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const [blogs] = await db.query(`
      SELECT blogs.*, users.name as author_name 
      FROM blogs 
      JOIN users ON blogs.author_id = users.id 
      WHERE blogs.id = ?
    `, [req.params.id]);

    if (blogs.length === 0) return res.status(404).json({ message: "Blog not found" });
    
    // Parse the JSON content back into an object for the frontend
    const blog = blogs[0];
    blog.content = JSON.parse(blog.content); 
    
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
