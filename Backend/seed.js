import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: { rejectUnauthorized: true }
});

console.log('✅ Connected to TiDB Cloud');

// ─── Create Tables ────────────────────────────────────────────────────────────
await db.execute(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'AUTHOR', 'READER') DEFAULT 'READER',
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'APPROVED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

await db.execute(`
  CREATE TABLE IF NOT EXISTS blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    content TEXT,
    cover_image VARCHAR(500),
    category VARCHAR(100),
    author_id INT NOT NULL,
    is_published BOOLEAN DEFAULT false,
    likes_count INT DEFAULT 0,
    dislikes_count INT DEFAULT 0,
    saves_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
  )
`);

// Add columns if they don't exist (for existing tables)
try {
  await db.execute(`ALTER TABLE blogs ADD COLUMN IF NOT EXISTS likes_count INT DEFAULT 0`);
  await db.execute(`ALTER TABLE blogs ADD COLUMN IF NOT EXISTS dislikes_count INT DEFAULT 0`);
  await db.execute(`ALTER TABLE blogs ADD COLUMN IF NOT EXISTS saves_count INT DEFAULT 0`);
} catch (err) {
  console.log('Columns might already exist:', err.message);
}

await db.execute(`
  CREATE TABLE IF NOT EXISTS interactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    blog_id INT,
    type ENUM('LIKE', 'DISLIKE', 'SAVE'),
    UNIQUE KEY user_blog_interaction (user_id, blog_id, type),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE
  )
`);

console.log('✅ Tables created (or already exist)');

// ─── Seed Users ───────────────────────────────────────────────────────────────
const adminPass   = await bcrypt.hash('admin123', 10);
const authorPass  = await bcrypt.hash('author123', 10);

const [adminResult] = await db.execute(
  `INSERT IGNORE INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)`,
  ['Admin User', 'admin@blog.com', adminPass, 'ADMIN', 'APPROVED']
);

const [authorResult] = await db.execute(
  `INSERT IGNORE INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)`,
  ['Abdullah (Author)', 'author@blog.com', authorPass, 'AUTHOR', 'APPROVED']
);

// Fetch author id (handles INSERT IGNORE case where row already existed)
const [[author]] = await db.execute(`SELECT id FROM users WHERE email = ?`, ['author@blog.com']);
const authorId = author.id;

console.log(`✅ Users seeded  (author id = ${authorId})`);

// ─── Seed Blogs ───────────────────────────────────────────────────────────────
const blogs = [
  {
    title: 'Getting Started with Node.js',
    slug: 'getting-started-with-nodejs-001',
    content: 'Node.js is a powerful JavaScript runtime built on Chrome\'s V8 engine. In this post we will explore how to set up a Node.js project from scratch, install packages with npm, and create your first HTTP server.',
    cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    category: 'Technology'
  },
  {
    title: 'Understanding REST APIs',
    slug: 'understanding-rest-apis-002',
    content: 'REST (Representational State Transfer) is an architectural style for designing networked applications. This guide covers the six constraints of REST, HTTP methods (GET, POST, PUT, DELETE), status codes, and how to design clean endpoints.',
    cover_image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    category: 'Web Development'
  },
  {
    title: 'React Hooks Explained',
    slug: 'react-hooks-explained-003',
    content: 'React Hooks revolutionised how we write React components. We will deep-dive into useState, useEffect, useContext, and custom hooks — with practical examples you can use in your projects today.',
    cover_image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    category: 'React'
  },
  {
    title: 'MySQL vs TiDB: What\'s the Difference?',
    slug: 'mysql-vs-tidb-004',
    content: 'TiDB is a distributed SQL database fully compatible with the MySQL protocol. In this post we compare TiDB Cloud with traditional MySQL — covering scalability, high availability, HTAP workloads, and when to choose each.',
    cover_image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
    category: 'Database'
  },
  {
    title: 'Building a Full-Stack MERN App',
    slug: 'building-mern-app-005',
    content: 'MERN stands for MongoDB, Express, React, and Node.js. But what if you swap MongoDB for MySQL/TiDB? In this tutorial we build a complete blog application with authentication, role-based access control, and a cloud database.',
    cover_image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800',
    category: 'Tutorial'
  }
];

for (const blog of blogs) {
  await db.execute(
    `INSERT IGNORE INTO blogs (title, slug, content, cover_image, category, author_id, is_published) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [blog.title, blog.slug, blog.content, blog.cover_image, blog.category, authorId, true]
  );
}

console.log(`✅ ${blogs.length} blog posts seeded (all published)`);

// ─── Print summary ────────────────────────────────────────────────────────────
const [[{ userCount }]]  = await db.execute('SELECT COUNT(*) AS userCount FROM users');
const [[{ blogCount }]]  = await db.execute('SELECT COUNT(*) AS blogCount FROM blogs');

console.log(`\n📊 Database Summary:`);
console.log(`   Users : ${userCount}`);
console.log(`   Blogs : ${blogCount}`);
console.log(`\n🔑 Login Credentials:`);
console.log(`   Admin  → admin@blog.com  / admin123`);
console.log(`   Author → author@blog.com / author123`);

await db.end();
