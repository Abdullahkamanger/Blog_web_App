import db from '../config/db.js';

export const createBlog = async (req, res) => {
  const { title, content, cover_image, category } = req.body;
  const author_id = req.user.id; // Taken from the JWT token!

  // Simple Slugify: "My First Blog" -> "my-first-blog"
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();

  try {
    const [result] = await db.query(
      'INSERT INTO blogs (title, slug, content, cover_image, category, author_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, slug, JSON.stringify(content), cover_image, category, author_id]
    );

    res.status(201).json({
      message: "Blog created and pending approval!",
      blogId: result.insertId,
      slug
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPublicBlogs = async (req, res) => {
  try {
    // Only fetch blogs that the ADMIN has approved (is_published = true)
    const [blogs] = await db.query(`
      SELECT blogs.*, users.name as author_name 
      FROM blogs 
      JOIN users ON blogs.author_id = users.id 
      WHERE is_published = true 
      ORDER BY created_at DESC
    `);
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const [blogs] = await db.query(`
      SELECT blogs.*, users.name as author_name 
      FROM blogs 
      JOIN users ON blogs.author_id = users.id 
      WHERE blogs.id = ? AND is_published = true
    `, [id]);
    
    if (blogs.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    res.json(blogs[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleLike = async (req, res) => {
  const blogId = req.params.id;
  const userId = req.user.id;

  try {
    // Check if user already liked it
    const [existing] = await db.query(
      "SELECT * FROM interactions WHERE user_id = ? AND blog_id = ? AND type = 'LIKE'", 
      [userId, blogId]
    );

    if (existing.length > 0) {
      // If already liked, UNLIKE it
      await db.query("DELETE FROM interactions WHERE user_id = ? AND blog_id = ? AND type = 'LIKE'", [userId, blogId]);
      await db.query("UPDATE blogs SET likes_count = likes_count - 1 WHERE id = ?", [blogId]);
      const [[{ likes_count }]] = await db.query("SELECT likes_count FROM blogs WHERE id = ?", [blogId]);
      return res.json({ message: "Unliked", likes_count });
    } else {
      // Add new like
      await db.query("INSERT INTO interactions (user_id, blog_id, type) VALUES (?, ?, 'LIKE')", [userId, blogId]);
      await db.query("UPDATE blogs SET likes_count = likes_count + 1 WHERE id = ?", [blogId]);
      const [[{ likes_count }]] = await db.query("SELECT likes_count FROM blogs WHERE id = ?", [blogId]);
      return res.json({ message: "Liked", likes_count });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleDislike = async (req, res) => {
  const blogId = req.params.id;
  const userId = req.user.id;

  try {
    const [existing] = await db.query(
      "SELECT * FROM interactions WHERE user_id = ? AND blog_id = ? AND type = 'DISLIKE'", 
      [userId, blogId]
    );

    if (existing.length > 0) {
      await db.query("DELETE FROM interactions WHERE user_id = ? AND blog_id = ? AND type = 'DISLIKE'", [userId, blogId]);
      await db.query("UPDATE blogs SET dislikes_count = dislikes_count - 1 WHERE id = ?", [blogId]);
      const [[{ dislikes_count }]] = await db.query("SELECT dislikes_count FROM blogs WHERE id = ?", [blogId]);
      return res.json({ message: "Undisliked", dislikes_count });
    } else {
      await db.query("INSERT INTO interactions (user_id, blog_id, type) VALUES (?, ?, 'DISLIKE')", [userId, blogId]);
      await db.query("UPDATE blogs SET dislikes_count = dislikes_count + 1 WHERE id = ?", [blogId]);
      const [[{ dislikes_count }]] = await db.query("SELECT dislikes_count FROM blogs WHERE id = ?", [blogId]);
      return res.json({ message: "Disliked", dislikes_count });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleSave = async (req, res) => {
  const blogId = req.params.id;
  const userId = req.user.id;

  try {
    const [existing] = await db.query(
      "SELECT * FROM interactions WHERE user_id = ? AND blog_id = ? AND type = 'SAVE'", 
      [userId, blogId]
    );

    if (existing.length > 0) {
      await db.query("DELETE FROM interactions WHERE user_id = ? AND blog_id = ? AND type = 'SAVE'", [userId, blogId]);
      await db.query("UPDATE blogs SET saves_count = saves_count - 1 WHERE id = ?", [blogId]);
      const [[{ saves_count }]] = await db.query("SELECT saves_count FROM blogs WHERE id = ?", [blogId]);
      return res.json({ message: "Unsaved", saves_count });
    } else {
      await db.query("INSERT INTO interactions (user_id, blog_id, type) VALUES (?, ?, 'SAVE')", [userId, blogId]);
      await db.query("UPDATE blogs SET saves_count = saves_count + 1 WHERE id = ?", [blogId]);
      const [[{ saves_count }]] = await db.query("SELECT saves_count FROM blogs WHERE id = ?", [blogId]);
      return res.json({ message: "Saved", saves_count });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
