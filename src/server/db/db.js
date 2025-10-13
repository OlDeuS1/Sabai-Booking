import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// สร้าง connection pool สำหรับ PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'sabai_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '12345',
  max: 20, // จำนวน connection สูงสุดใน pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Helper class เพื่อให้ใช้งานใกล้เคียงกับ SQLite API
class DatabaseAdapter {
  // แปลง callback style เป็น Promise และเลียนแบบ SQLite API
  
  // แปลง SQLite query parameters (?) เป็น PostgreSQL format ($1, $2, ...)
  _convertQuery(sql, params = []) {
    let paramIndex = 1;
    const convertedSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
    return { sql: convertedSql, params };
  }

  // Core promise-based query (compatible with both $1 and ? placeholders)
  query(sql, params = []) {
    const { sql: convertedSql, params: convertedParams } = this._convertQuery(sql, params);
    return pool.query(convertedSql, convertedParams);
  }
  
  // สำหรับ query ที่ return หลาย rows (เหมือน db.all)
  all(sql, params = [], callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    this.query(sql, params)
      .then(result => callback(null, result.rows))
      .catch(err => callback(err));
  }

  // สำหรับ query ที่ return row เดียว (เหมือน db.get)
  get(sql, params = [], callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    this.query(sql, params)
      .then(result => callback(null, result.rows[0] || null))
      .catch(err => callback(err));
  }

  // สำหรับ INSERT, UPDATE, DELETE (เหมือน db.run)
  run(sql, params = [], callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    this.query(sql, params)
      .then(result => {
        // เลียนแบบ SQLite callback context
        const context = {
          changes: result.rowCount,
          lastID: result.rows && result.rows.length > 0 && (result.rows[0].id || result.rows[0].last_insert_rowid)
            ? (result.rows[0].id || result.rows[0].last_insert_rowid)
            : null
        };
        callback.call(context, null);
      })
      .catch(err => callback(err));
  }

  // Method สำหรับปิด connection pool
  close() {
    return pool.end();
  }
}

const db = new DatabaseAdapter();

export default db;
export { pool };
