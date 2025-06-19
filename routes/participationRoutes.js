const express = require("express");
const db = require("../db");
const router = express.Router();

router.post("/", (req, res) => {
  const { user_id, post_id } = req.body;

  if (!user_id || !post_id) {
    return res.status(400).json({ 
      error: "user_id and post_id are required" 
    });
  }

  db.get("SELECT id FROM users WHERE id = ?", [user_id], (err, user) => {
    if (err) {
      console.error("Error checking user:", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    db.get("SELECT id FROM posts WHERE id = ?", [post_id], (err, post) => {
      if (err) {
        console.error("Error checking post:", err);
        return res.status(500).json({ error: "Database error" });
      }
      
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      db.run(
        "INSERT INTO participations (user_id, post_id) VALUES (?, ?)",
        [user_id, post_id],
        function(err) {
          if (err) {
            if (err.message.includes("UNIQUE constraint failed")) {
              return res.status(409).json({ 
                error: "User already participating in this post" 
              });
            }
            console.error("Error inserting participation:", err);
            return res.status(500).json({ error: "Database error" });
          }
          
          res.status(201).json({
            id: this.lastID,
            user_id,
            post_id,
            message: "Participation recorded successfully"
          });
        }
      );
    });
  });
});

router.get("/:post_id", (req, res) => {
  const { post_id } = req.params;

  db.all(
    `SELECT p.id, p.user_id, p.created_at, u.name, u.email 
     FROM participations p 
     JOIN users u ON p.user_id = u.id 
     WHERE p.post_id = ?
     ORDER BY p.created_at DESC`,
    [post_id],
    (err, participations) => {
      if (err) {
        console.error("Error fetching participations:", err);
        return res.status(500).json({ error: "Database error" });
      }
      
      res.json(participations);
    }
  );
});

router.get("/user/:user_id", (req, res) => {
  const { user_id } = req.params;

  db.all(
    `SELECT p.id, p.post_id, p.created_at, posts.title, posts.content 
     FROM participations p 
     JOIN posts ON p.post_id = posts.id 
     WHERE p.user_id = ?
     ORDER BY p.created_at DESC`,
    [user_id],
    (err, participations) => {
      if (err) {
        console.error("Error fetching user participations:", err);
        return res.status(500).json({ error: "Database error" });
      }
      
      res.json(participations);
    }
  );
});

router.delete("/", (req, res) => {
  const { user_id, post_id } = req.body;

  if (!user_id || !post_id) {
    return res.status(400).json({ 
      error: "user_id and post_id are required" 
    });
  }

  db.run(
    "DELETE FROM participations WHERE user_id = ? AND post_id = ?",
    [user_id, post_id],
    function(err) {
      if (err) {
        console.error("Error removing participation:", err);
        return res.status(500).json({ error: "Database error" });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ 
          error: "Participation not found" 
        });
      }
      
      res.json({ message: "Participation removed successfully" });
    }
  );
});

module.exports = router;
