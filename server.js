const express = require("express");
const db = require("./db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const participationRoutes = require("./routes/participationRoutes");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/api/posts", postRoutes);
app.use("/participations", participationRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
