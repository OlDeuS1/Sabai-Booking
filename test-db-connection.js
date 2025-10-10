import db, { pool } from './src/server/db/db.js';

async function testConnection() {
  try {
    console.log('Testing PostgreSQL connection...');
    
    // Test basic connection
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('✅ Database connected successfully');
    console.log('Current time from database:', result.rows[0].current_time);
    
    // Test our adapter
    db.get('SELECT COUNT(*) as user_count FROM users', [], (err, row) => {
      if (err) {
        console.log('❌ Error querying users table:', err.message);
        console.log('💡 Make sure you have run the schema.sql file');
      } else {
        console.log('✅ Users table accessible');
        console.log('Total users:', row.user_count);
      }
      
      // Test hotels table
      db.get('SELECT COUNT(*) as hotel_count FROM hotels', [], (err, row) => {
        if (err) {
          console.log('❌ Error querying hotels table:', err.message);
        } else {
          console.log('✅ Hotels table accessible');
          console.log('Total hotels:', row.hotel_count);
        }
        
        // Close pool after all tests
        setTimeout(async () => {
          await pool.end();
        }, 1000);
      });
    });
    
    // Test connection pool info
    console.log('\n📊 Connection Pool Status:');
    console.log('Total connections:', pool.totalCount);
    console.log('Idle connections:', pool.idleCount);
    console.log('Waiting requests:', pool.waitingCount);
    
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check your .env file configuration');
    console.log('3. Verify database name and credentials');
    console.log('4. Run: CREATE DATABASE sabai_booking; in PostgreSQL');
    console.log('5. Run: psql -d sabai_booking -f database/schema.sql');
    await pool.end();
  }
}

testConnection();