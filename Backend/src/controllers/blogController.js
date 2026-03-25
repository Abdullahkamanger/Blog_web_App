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
