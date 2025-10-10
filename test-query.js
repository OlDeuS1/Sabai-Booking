// Test script to debug the API
import { pool } from './src/server/db/db.js';

async function testQuery() {
  try {
    const query = `
      SELECT h.hotel_id, h.hotel_name, h.description, h.address, h.city, h.country, 
             h.contact_phone, h.contact_email, h.status, h.amenities, h.created_at,
             u.user_id as owner_id, u.first_name as owner_first_name, u.last_name as owner_last_name, 
             u.email as owner_email, u.phone_number as owner_phone
      FROM hotels h
      JOIN users u ON h.owner_id = u.user_id
      WHERE h.status != 'deleted'
      ORDER BY h.hotel_id DESC
    `;
    
    const result = await pool.query(query);
    console.log('Query successful! Results:');
    console.log(JSON.stringify(result.rows, null, 2));
    
  } catch (error) {
    console.error('Query failed:', error.message);
  } finally {
    await pool.end();
  }
}

testQuery();