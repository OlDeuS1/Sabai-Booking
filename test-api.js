import axios from 'axios';

async function testAPI() {
  try {
    console.log('Testing hotels admin API...');
    const response = await axios.get('http://localhost:3000/api/hotels/admin');
    console.log('✅ Success! Hotels data:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
  }
}

testAPI();