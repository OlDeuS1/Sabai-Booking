// const express = require("express");
// const cors = require("cors");
// const db = require("./db.js"); // import SQLite
import express from "express";
import cors from "cors";
import db from "./db/db.js"; // import SQLite

const app = express();
app.use(cors());
app.use(express.json());

// API ดึง user ทั้งหมด
app.get("/api/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.listen(3000, () =>
  console.log("🚀 Server running at http://localhost:3000")
);
