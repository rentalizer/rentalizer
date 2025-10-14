const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000/api';
const STATIC_PROMO_CODE =
  (process.env.STATIC_PROMO_CODE || process.env.MULTI_USE_PROMO_CODE || 'TESTACCESS').trim().toUpperCase();

if (!STATIC_PROMO_CODE) {
  console.error('❌ STATIC_PROMO_CODE (or MULTI_USE_PROMO_CODE) environment variable must be set.');
  process.exit(1);
}

const buildTestUser = (label) => {
  const uniqueSuffix = Math.random().toString(36).slice(2, 8);
  return {
    email: `static-promo-${label}-${uniqueSuffix}@example.com`,
    password: 'StaticPromoPass123!',
    firstName: `Static${label}`,
    lastName: 'Tester',
    promoCode: STATIC_PROMO_CODE
  };
};

async function runStaticPromoTest() {
  console.log('🧪 Static Promo Code Registration Test\n');

  try {
    console.log('1. Verifying static promo code...');
    const verifyResponse = await axios.post(`${BASE_URL}/promo-codes/verify`, { code: STATIC_PROMO_CODE });
    console.log('   Promo code accepted:', verifyResponse.data.promoCode.code);
    console.log('   Reusable flag:', verifyResponse.data.promoCode.isReusable ? 'Yes' : 'No');
    console.log('');

    console.log('2. Registering first test user...');
    const firstUser = buildTestUser('first');
    const firstRegistration = await axios.post(`${BASE_URL}/auth/register`, firstUser);
    console.log('   ✅ First user registered:', firstRegistration.data.user.email);
    console.log('   Token issued:', firstRegistration.data.token ? 'Yes' : 'No');
    console.log('');

    console.log('3. Registering second test user with the same code...');
    const secondUser = buildTestUser('second');
    const secondRegistration = await axios.post(`${BASE_URL}/auth/register`, secondUser);
    console.log('   ✅ Second user registered:', secondRegistration.data.user.email);
    console.log('   Token issued:', secondRegistration.data.token ? 'Yes' : 'No');
    console.log('');

    console.log('🎉 Static promo code works for multiple signups. Cleanup users in the admin UI if desired.\n');
  } catch (error) {
    if (error.response) {
      console.error('❌ Request failed:', error.response.status, error.response.data);
    } else {
      console.error('❌ Unexpected error:', error.message);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  runStaticPromoTest();
}

module.exports = { runStaticPromoTest };
