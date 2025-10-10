import { pool } from './src/server/db/db.js';

async function createAdminUser() {
  try {
    // Check if admin user exists
    const checkAdmin = await pool.query(
      "SELECT * FROM users WHERE role = 'admin' LIMIT 1"
    );
    
    if (checkAdmin.rows.length > 0) {
      console.log('✅ Admin user already exists:');
      console.log('Email:', checkAdmin.rows[0].email);
      console.log('Name:', checkAdmin.rows[0].first_name, checkAdmin.rows[0].last_name);
    } else {
      // Create admin user
      const adminData = {
        email: 'admin@sabai-booking.com',
        password_hash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // hashed 'admin123'
        first_name: 'Admin',
        last_name: 'User',
        phone_number: '099-999-9999',
        role: 'admin'
      };
      
      await pool.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone_number, role) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [adminData.email, adminData.password_hash, adminData.first_name, 
         adminData.last_name, adminData.phone_number, adminData.role]
      );
      
      console.log('✅ Admin user created successfully!');
      console.log('Email: admin@sabai-booking.com');
      console.log('Password: admin123');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

createAdminUser();