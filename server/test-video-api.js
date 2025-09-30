const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5000/api';
const TEST_VIDEO = {
  title: 'Test Video API',
  description: 'This is a test video created via API',
  thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
  duration: '10:30',
  category: 'Market Research',
  videoUrl: 'https://www.loom.com/share/test123',
  tags: ['test', 'api', 'demo'],
  featured: false,
  handouts: [
    {
      name: 'Test Document.pdf',
      url: 'https://example.com/test-doc.pdf'
    }
  ]
};

// Test functions
async function testPublicEndpoints() {
  console.log('🧪 Testing Public Endpoints...\n');

  try {
    // Test get all videos
    console.log('1. Testing GET /api/videos');
    const response1 = await axios.get(`${BASE_URL}/videos`);
    console.log(`✅ Status: ${response1.status}, Videos count: ${response1.data.data.length}\n`);

    // Test get featured videos
    console.log('2. Testing GET /api/videos/featured');
    const response2 = await axios.get(`${BASE_URL}/videos/featured`);
    console.log(`✅ Status: ${response2.status}, Featured videos: ${response2.data.data.length}\n`);

    // Test get categories
    console.log('3. Testing GET /api/videos/categories');
    const response3 = await axios.get(`${BASE_URL}/videos/categories`);
    console.log(`✅ Status: ${response3.status}, Categories: ${response3.data.data.join(', ')}\n`);

    // Test search videos
    console.log('4. Testing GET /api/videos/search?q=test');
    const response4 = await axios.get(`${BASE_URL}/videos/search?q=test`);
    console.log(`✅ Status: ${response4.status}, Search results: ${response4.data.data.length}\n`);

    // Test get videos by category
    console.log('5. Testing GET /api/videos/category/Market Research');
    const response5 = await axios.get(`${BASE_URL}/videos/category/Market Research`);
    console.log(`✅ Status: ${response5.status}, Category videos: ${response5.data.data.length}\n`);

  } catch (error) {
    console.error('❌ Public endpoint test failed:', error.response?.data || error.message);
  }
}

async function testVideoValidation() {
  console.log('🧪 Testing Video Validation...\n');

  try {
    // Test invalid video creation (should fail)
    console.log('1. Testing invalid video creation (no auth)');
    const invalidVideo = {
      title: '', // Empty title should fail
      description: 'Test',
      videoUrl: 'invalid-url' // Invalid URL should fail
    };

    try {
      await axios.post(`${BASE_URL}/videos`, invalidVideo);
      console.log('❌ Should have failed validation');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected - authentication required');
      } else if (error.response?.status === 400) {
        console.log('✅ Correctly rejected - validation failed');
      } else {
        console.log(`❌ Unexpected error: ${error.response?.status}`);
      }
    }

  } catch (error) {
    console.error('❌ Validation test failed:', error.response?.data || error.message);
  }
}

async function testServerHealth() {
  console.log('🧪 Testing Server Health...\n');

  try {
    const response = await axios.get(`${BASE_URL}/../health`);
    console.log(`✅ Server is running: ${response.data.message}`);
    console.log(`✅ Timestamp: ${response.data.timestamp}\n`);
  } catch (error) {
    console.error('❌ Server health check failed:', error.response?.data || error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Video API Tests\n');
  console.log('=' .repeat(50));

  await testServerHealth();
  await testPublicEndpoints();
  await testVideoValidation();

  console.log('=' .repeat(50));
  console.log('✅ All tests completed!\n');
  console.log('📝 Note: Admin endpoints require authentication token');
  console.log('📝 To test admin endpoints, you need to:');
  console.log('   1. Create an admin user');
  console.log('   2. Login to get a JWT token');
  console.log('   3. Use the token in Authorization header');
  console.log('\n🔗 API Documentation: server/VIDEO_API.md');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testPublicEndpoints,
  testVideoValidation,
  testServerHealth,
  runTests
};
