const crypto = require('crypto');
const PromoCode = require('../models/PromoCode');

// Reusable promo code for testing/onboarding; override via environment variables if needed.
const DEFAULT_STATIC_PROMO_CODE = 'RENTALIZER281';
const STATIC_PROMO_CODE = (
  process.env.STATIC_PROMO_CODE ||
  process.env.MULTI_USE_PROMO_CODE ||
  DEFAULT_STATIC_PROMO_CODE
).trim().toUpperCase();

class PromoCodeService {
  async generateRandomCode(length = 12, prefix = '') {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const bytes = crypto.randomBytes(length);
    let code = '';

    for (let i = 0; i < length; i += 1) {
      code += alphabet.charAt(bytes[i] % alphabet.length);
    }

    const combined = `${prefix || ''}${code}`;
    return combined.toUpperCase();
  }

  async createPromoCode({ createdBy, prefix, length = 12, description, maxUsage, singleUse } = {}) {
    if (!createdBy) {
      throw new Error('createdBy is required to create a promo code');
    }

    const parsedLength = parseInt(length, 10);
    const codeLength = Math.max(6, Math.min(Number.isNaN(parsedLength) ? 12 : parsedLength, 24));

    const singleUseFlag = singleUse === true || singleUse === 'true';

    let resolvedMaxUsage = null;
    if (singleUseFlag) {
      resolvedMaxUsage = 1;
    } else if (typeof maxUsage !== 'undefined' && maxUsage !== null && maxUsage !== '') {
      const parsedMaxUsage = parseInt(maxUsage, 10);
      if (Number.isNaN(parsedMaxUsage) || parsedMaxUsage < 1) {
        const error = new Error('maxUsage must be a positive integer when provided');
        error.name = 'ValidationError';
        throw error;
      }
      resolvedMaxUsage = parsedMaxUsage;
    }
    const finalSingleUse = singleUseFlag || resolvedMaxUsage === 1;

    let code;
    let attempts = 0;
    const maxAttempts = 5;

    do {
      code = await this.generateRandomCode(codeLength, prefix);
      // eslint-disable-next-line no-await-in-loop
      const exists = await PromoCode.exists({ code });
      if (!exists) {
        break;
      }
      attempts += 1;
    } while (attempts < maxAttempts);

    if (attempts === maxAttempts) {
      throw new Error('Failed to generate a unique promo code');
    }

    const promoCode = new PromoCode({
      code,
      description: description || null,
      createdBy,
      maxUsage: resolvedMaxUsage,
      singleUse: finalSingleUse
    });

    await promoCode.save();
    return promoCode;
  }

  async listPromoCodes({ page = 1, limit = 10, isActive, search } = {}) {
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

    const query = {};

    if (typeof isActive !== 'undefined') {
      query.isActive = isActive === 'true' || isActive === true;
    }

    if (search) {
      query.code = { $regex: new RegExp(search, 'i') };
    }

    const [promoCodes, total] = await Promise.all([
      PromoCode.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .populate('createdBy', 'email firstName lastName role'),
      PromoCode.countDocuments(query)
    ]);

    return {
      promoCodes,
      pagination: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize) || 1
      }
    };
  }

  async getPromoCodeByCode(code) {
    const normalizedCode = this.normalizeCode(code);
    const promoCode = await PromoCode.findOne({ code: normalizedCode })
      .populate('createdBy', 'email firstName lastName role')
      .populate('usageHistory.user', 'email firstName lastName');

    if (!promoCode) {
      const error = new Error('Promo code not found');
      error.name = 'NotFoundError';
      throw error;
    }

    return promoCode;
  }

  normalizeCode(code) {
    if (typeof code !== 'string') {
      return '';
    }
    return code.trim().toUpperCase();
  }

  async assertPromoCodeIsValid(code) {
    const normalizedCode = this.normalizeCode(code);

    if (!normalizedCode) {
      const error = new Error('A promo code is required');
      error.name = 'AuthError';
      throw error;
    }

    if (STATIC_PROMO_CODE && normalizedCode === STATIC_PROMO_CODE) {
      return {
        promoCode: {
          code: STATIC_PROMO_CODE,
          isActive: true,
          usageCount: 0,
          maxUsage: null,
          singleUse: false,
          lastUsedAt: null
        },
        isStatic: true
      };
    }

    const promoCode = await PromoCode.findOne({ code: normalizedCode });

    if (!promoCode) {
      const error = new Error('Invalid promo code');
      error.name = 'AuthError';
      throw error;
    }

    if (promoCode.maxUsage && promoCode.usageCount >= promoCode.maxUsage) {
      if (promoCode.isActive) {
        promoCode.isActive = false;
        await promoCode.save();
      }
      const error = new Error('Promo code has already been used');
      error.name = 'AuthError';
      throw error;
    }

    if (!promoCode.isActive) {
      const error = new Error('Promo code is no longer active');
      error.name = 'AuthError';
      throw error;
    }

    return { promoCode, isStatic: false };
  }

  async recordUsage({ promoCode, userId }) {
    let promo = null;

    if (promoCode && typeof promoCode === 'string') {
      promo = await PromoCode.findOne({ code: this.normalizeCode(promoCode) });
    } else if (promoCode && promoCode._id) {
      promo = await PromoCode.findById(promoCode._id);
    }

    if (!promo) {
      const error = new Error('Promo code not found for usage tracking');
      error.name = 'NotFoundError';
      throw error;
    }

    const update = {
      $inc: { usageCount: 1 },
      $set: { lastUsedAt: new Date() }
    };

    if (userId) {
      update.$push = {
        usageHistory: {
          user: userId,
          usedAt: new Date()
        }
      };
    }

    let updatedPromo = await PromoCode.findByIdAndUpdate(
      promo._id,
      update,
      { new: true }
    );

    if (
      updatedPromo &&
      updatedPromo.maxUsage &&
      updatedPromo.usageCount >= updatedPromo.maxUsage &&
      updatedPromo.isActive
    ) {
      updatedPromo = await PromoCode.findByIdAndUpdate(
        promo._id,
        { $set: { isActive: false } },
        { new: true }
      );
    }

    return updatedPromo;
  }

  async setPromoCodeStatus(code, isActive) {
    const normalizedCode = this.normalizeCode(code);
    const promoCode = await PromoCode.findOne({ code: normalizedCode });

    if (!promoCode) {
      const error = new Error('Promo code not found');
      error.name = 'NotFoundError';
      throw error;
    }

    const desiredStatus = isActive === true || isActive === 'true';
    promoCode.isActive = desiredStatus;
    await promoCode.save();

    return promoCode;
  }
}

module.exports = new PromoCodeService();
