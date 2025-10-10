import { pool } from './src/server/db/db.js';
import fs from 'fs';

async function setupDatabase() {
  try {
    console.log('Setting up database schema...');
    
    // Read the schema file
    const schema = fs.readFileSync('./database/schema.sql', 'utf8');
    
    // Execute the schema
    await pool.query(schema);
    
    console.log('✅ Database schema created successfully');
    
    // Try to import sample data
    try {
      const sampleData = fs.readFileSync('./database/migrate_data.sql', 'utf8');
      await pool.query(sampleData);
      console.log('✅ Sample data imported successfully');
    } catch (error) {
      console.log('⚠️ Sample data import failed (this is optional):', error.message);
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  } finally {
    await pool.end();
  }
}

setupDatabase();