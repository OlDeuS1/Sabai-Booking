import sqlite3 from "sqlite3";
const { Database } = sqlite3;
const db = new Database("./db/database.sqlite"); // ไฟล์ SQLite อยู่ใน project

// // สร้าง table ถ้ายังไม่มี
// db.serialize(() => {
//   db.run(`
//     CREATE TABLE IF NOT EXISTS users (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT
//     )
//   `);

//   // ตัวอย่าง insert ข้อมูลถ้ายังไม่มี
//   db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
//     if (row.count === 0) {
//       db.run(`INSERT INTO users (name) VALUES (?)`, ["Alice"]);
//       db.run(`INSERT INTO users (name) VALUES (?)`, ["Bob"]);
//     }
//   });
// });

export default db;
