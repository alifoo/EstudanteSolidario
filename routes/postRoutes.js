const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/", (req, res) => {
  db.all("SELECT * FROM posts ORDER BY created_at DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar todos os posts" });
    }
    res.json(rows);
  });
});

router.get("/feed", (req, res) => {
  db.all("SELECT * FROM posts ORDER BY created_at DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).send("Erro ao carregar posts.");
    }

    // Build HTML manually
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

router.post("/", (req, res) => {
  const { user_id, title, content } = req.body;

  if (!user_id || !content) {
    return res
      .status(400)
      .json({ error: "user_id e content são obrigatórios." });
  }

  const createdAt = new Date().toISOString();

  const query = `
    INSERT INTO posts (user_id, title, content, created_at)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [user_id, title, content, createdAt], function (err) {
    if (err) {
      return res.status(500).json({ error: "Erro ao criar post." });
    }

    res.status(201).json({
      message: "Post criado com sucesso!",
      post_id: this.lastID,
    });
  });
});

module.exports = router;
