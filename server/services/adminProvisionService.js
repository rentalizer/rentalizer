const User = require('../models/User');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ensureSuperAdminUser = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn(
      '⚠️  ADMIN_EMAIL and ADMIN_PASSWORD are not set. ' +
      'Skipping automatic superadmin provisioning.'
    );
    return;
  }

  const firstName = process.env.ADMIN_FIRST_NAME || 'Rentalizer';
  const lastName = process.env.ADMIN_LAST_NAME || 'Team';

  const attempts = Number(process.env.ADMIN_PROVISION_ATTEMPTS || 5);
  const baseDelay = Number(process.env.ADMIN_PROVISION_DELAY_MS || 1000);

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      let user = await User.findOne({ email });

      if (user) {
        let needsUpdate = false;

        if (user.role !== 'superadmin') {
          user.role = 'superadmin';
          needsUpdate = true;
        }

        if (!user.isActive) {
          user.isActive = true;
          needsUpdate = true;
        }

        if (user.firstName !== firstName) {
          user.firstName = firstName;
          needsUpdate = true;
        }

        if (user.lastName !== lastName) {
          user.lastName = lastName;
          needsUpdate = true;
        }

        // Always update password to ensure we know the credentials
        user.password = password;
        needsUpdate = true;

        if (needsUpdate) {
          await user.save();
          console.log(`✅ Superadmin "${email}" updated or confirmed.`);
        } else {
          console.log(`✅ Superadmin "${email}" already up to date.`);
        }

        return;
      }

      await User.create({
        email,
        password,
        firstName,
        lastName,
        role: 'superadmin',
        isActive: true
      });

      console.log(`✅ Superadmin "${email}" created.`);
      return;
    } catch (error) {
      const isLastAttempt = attempt === attempts;
      const isTlsError = /tls/i.test(error.message);

      if (isLastAttempt || !isTlsError) {
        console.error('❌ Failed to ensure superadmin user:', error.message);
        return;
      }

      const waitFor = baseDelay * attempt;
      console.warn(
        `⚠️  Superadmin provisioning attempt ${attempt} failed (${error.message}). ` +
        `Retrying in ${waitFor}ms...`
      );
      await delay(waitFor);
    }
  }
};

module.exports = {
  ensureSuperAdminUser
};
