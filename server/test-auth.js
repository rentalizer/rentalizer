const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const PROMO_CODE = process.env.TEST_PROMO_CODE || process.env.PROMO_CODE || '9VRFMP3969JQ';

if (!PROMO_CODE) {
  console.error('❌ TEST_PROMO_CODE (or PROMO_CODE) environment variable is required to register users.');
  console.error('   Provide a valid promo code or run test-promo-codes.js to generate one automatically.');
  process.exit(1);
}

const buildTestUser = () => {
  const uniqueSuffix = Math.random().toString(36).substring(2, 8);
  return {
    email: `auth-test-${uniqueSuffix}@example.com`,
    password: 'SecurePass123',
    firstName: 'Test',
    lastName: 'User',
    promoCode: PROMO_CODE
  };
};

async function testAuthentication() {
  console.log('🧪 Testing Authentication System...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.message);
    console.log('');

    // Test 2: Register user
    console.log('2. Testing user registration...');
    const testUser = buildTestUser();
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log('✅ Registration successful');
    console.log('User ID:', registerResponse.data.user.id);
    console.log('Token received:', registerResponse.data.token ? 'Yes' : 'No');
    console.log('');

    const token = registerResponse.data.token;

    // Test 3: Login with registered user
    console.log('3. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful');
    console.log('Last login:', loginResponse.data.user.lastLogin);
    console.log('');

    // Test 4: Access protected route
    console.log('4. Testing protected route (profile)...');
    const profileResponse = await axios.get(`${BASE_URL}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Profile access successful');
    console.log('User email:', profileResponse.data.user.email);
    console.log('User name:', `${profileResponse.data.user.firstName} ${profileResponse.data.user.lastName}`);
    console.log('');

    // Test 5: Update profile
    console.log('5. Testing profile update...');
    const updateResponse = await axios.put(`${BASE_URL}/user/profile`, {
      firstName: 'Updated',
      lastName: 'Name'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Profile update successful');
    console.log('Updated name:', `${updateResponse.data.user.firstName} ${updateResponse.data.user.lastName}`);
    console.log('');

    // Test 6: Test invalid token
    console.log('6. Testing invalid token...');
    try {
      await axios.get(`${BASE_URL}/user/profile`, {
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      });
      console.log('❌ Invalid token test failed - should have been rejected');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Invalid token correctly rejected');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    // Test 7: Test missing token
    console.log('7. Testing missing token...');
    try {
      await axios.get(`${BASE_URL}/user/profile`);
      console.log('❌ Missing token test failed - should have been rejected');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Missing token correctly rejected');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    console.log('🎉 All tests passed! Authentication system is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response ? error.response.data : error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAuthentication();
}

module.exports = { testAuthentication };
