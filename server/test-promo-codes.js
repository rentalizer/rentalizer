const axios = require('axios');
const crypto = require('crypto');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@rentalizer.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123';

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required to run this test.');
  console.error('   Example: ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=StrongPass node test-promo-codes.js');
  process.exit(1);
}

const logSection = (title) => {
  console.log('\n==============================');
  console.log(title);
  console.log('==============================');
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const buildTestUser = (label) => {
  const uniqueSuffix = crypto.randomBytes(4).toString('hex');
  return {
    email: `promo-${label}-${uniqueSuffix}@example.com`,
    password: 'StrongPass123',
    firstName: `Promo${label}`,
    lastName: 'Tester'
  };
};

async function runPromoCodeFlow() {
  logSection('Promo Code End-to-End Test');

  try {
    console.log('1. Checking API health...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log(`✅ Health check: ${healthResponse.data.message}`);

    console.log('\n2. Logging in as admin...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    const adminToken = loginResponse.data.token;
    console.log('✅ Admin login successful');

    const authHeaders = {
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    };

    console.log('\n3. Generating a new promo code...');
    const promoCodeResponse = await axios.post(`${BASE_URL}/promo-codes`, {
      description: 'Automated test code'
    }, authHeaders);
    const promoCode = promoCodeResponse.data.promoCode.code;
    console.log(`✅ Promo code created: ${promoCode}`);
    if (promoCodeResponse.data.promoCode.singleUse || promoCodeResponse.data.promoCode.maxUsage) {
      console.log('   Type:', promoCodeResponse.data.promoCode.singleUse ? 'Single-use' : `Limited (${promoCodeResponse.data.promoCode.maxUsage} uses)`);
    } else {
      console.log('   Type: Reusable');
    }

    console.log('\n4. Verifying promo code availability...');
    const verifyResponse = await axios.post(`${BASE_URL}/promo-codes/verify`, { code: promoCode });
    const remainingUses = verifyResponse.data.promoCode.maxUsage
      ? verifyResponse.data.promoCode.maxUsage - verifyResponse.data.promoCode.usageCount
      : 'unlimited';
    console.log(`✅ Promo code valid. Usage count: ${verifyResponse.data.promoCode.usageCount}. Remaining: ${remainingUses}`);

    const userWithoutCode = buildTestUser('missing');
    console.log('\n5. Attempting registration without promo code (should fail)...');
    try {
      await axios.post(`${BASE_URL}/auth/register`, userWithoutCode);
      console.error('❌ Registration without promo code unexpectedly succeeded');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Registration correctly rejected without promo code');
      } else {
        throw error;
      }
    }

    const firstUser = { ...buildTestUser('first'), promoCode };
    console.log('\n6. Registering first user with promo code...');
    const firstRegisterResponse = await axios.post(`${BASE_URL}/auth/register`, firstUser);
    console.log(`✅ First user registered: ${firstRegisterResponse.data.user.email}`);

    console.log('\n   Waiting briefly to ensure usage tracking updates...');
    await delay(500);

    const secondUser = { ...buildTestUser('second'), promoCode };
    console.log('\n7. Registering second user with same promo code...');
    const secondRegisterResponse = await axios.post(`${BASE_URL}/auth/register`, secondUser);
    console.log(`✅ Second user registered: ${secondRegisterResponse.data.user.email}`);

    console.log('\n8. Fetching promo code details to confirm usage count...');
    const promoDetailResponse = await axios.get(`${BASE_URL}/promo-codes/${promoCode}`, authHeaders);
    console.log(`✅ Promo code usage count: ${promoDetailResponse.data.promoCode.usageCount}`);

    console.log('\n9. Deactivating promo code...');
    await axios.patch(`${BASE_URL}/promo-codes/${promoCode}/status`, {
      isActive: false
    }, authHeaders);
    console.log('✅ Promo code deactivated');

    console.log('\n10. Attempting registration with deactivated promo code (should fail)...');
    const thirdUser = { ...buildTestUser('third'), promoCode };
    try {
      await axios.post(`${BASE_URL}/auth/register`, thirdUser);
      console.error('❌ Registration with inactive promo code unexpectedly succeeded');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Registration correctly rejected with inactive promo code');
      } else {
        throw error;
      }
    }

    console.log('\n11. Reactivating promo code to leave system in a clean state...');
    await axios.patch(`${BASE_URL}/promo-codes/${promoCode}/status`, {
      isActive: true
    }, authHeaders);
    console.log('✅ Promo code reactivated');

    console.log('\n🎉 Promo code flow test completed successfully!');
    console.log(`   Created promo code: ${promoCode}`);
    console.log(`   Test users: ${firstUser.email}, ${secondUser.email}`);
  } catch (error) {
    console.error('\n❌ Promo code flow test failed.');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  runPromoCodeFlow();
}

module.exports = {
  runPromoCodeFlow
};
