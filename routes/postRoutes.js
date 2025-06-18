const express = require("express");
const db = require("../db");
const router = express.Router();

// GET all posts (accessible at /posts/ or /api/posts/)
router.get("/", (req, res) => {
  db.all("SELECT * FROM posts ORDER BY created_at DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar todos os posts" });
    }
    res.json(rows);
  });
});

// POST create new post (accessible at /posts/ or /api/posts/)
router.post("/", async (req, res) => {
  try {
    const { title, content, course, creator_type } = req.body;
    const user_id = 1; // You should get this from authentication
    
    const result = await db.run(
      'INSERT INTO posts (user_id, title, content, course, creator_type) VALUES (?, ?, ?, ?, ?)',
      [user_id, title, content, course, creator_type]
    );
    
    res.status(201).json({
      id: result.lastID,
      title,
      content,
      course,
      creator_type,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// HTML feed route (accessible at /posts/feed or /api/posts/feed)
router.get("/feed", (req, res) => {
  db.all("SELECT * FROM posts ORDER BY created_at DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).send("Erro ao carregar posts.");
    }

    let html = "<h1>Feed</h1>";
    rows.forEach((post) => {
      html += `
        <div style="border:1px solid #ccc; padding:10px; margin:10px;">
          <h2>${post.title}</h2>
          <p>${post.content}</p>
          <small>Postado em: ${post.created_at}</small>
        </div>
      `;
    });

    res.send(html);
  });
});

module.exports = router;
