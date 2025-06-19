const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");
const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(`[LOGIN ATTEMPT] Email: ${email}`);

  if (!email || !password) {
    console.log(`[LOGIN FAILED] Missing credentials`);
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      console.error("[LOGIN ERROR]", err);
      return res.status(500).json({ error: "Erro no servidor" });
    }

    if (!user) {
      console.log(`[LOGIN FAILED] User not found: ${email}`);
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log(`[LOGIN FAILED] Invalid password for: ${email}`);
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    delete user.password;
    console.log(`[LOGIN SUCCESS] User ID: ${user.id}`);
    res.json({ message: "Login bem-sucedido!", user });
  });
});


router.post("/register", async (req, res) => {
  const { name, birthday, course, university, email, password } = req.body;
  console.log(`[REGISTER ATTEMPT] Email: ${email}`);

  if (!name || !birthday || !course || !university || !email || !password) {
    console.log(`[REGISTER FAILED] Missing field(s)`);
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (name, birthday, course, university, email, password) VALUES (?, ?, ?, ?, ?, ?)",
    [name, birthday, course, university, email, hashedPassword],
    function (err) {
      if (err) {
        console.error("[REGISTER ERROR]", err);
        return res.status(400).json({ error: err });
      }

      console.log(`[REGISTER SUCCESS] New user ID: ${this.lastID}`);
      res.status(201).json({ id: this.lastID });
    }
  );
});

module.exports = router;
