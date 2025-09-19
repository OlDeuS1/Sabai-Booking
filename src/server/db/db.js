import sqlite3 from "sqlite3";
const { Database } = sqlite3;
const db = new Database("./db/database.sqlite"); // ไฟล์ SQLite อยู่ใน project


export default db;
