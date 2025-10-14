const promoCodeService = require('../services/promoCodeService');

class PromoCodeController {
  async create(req, res) {
    try {
      const { prefix, length, description, maxUsage, singleUse } = req.body;
      const promoCode = await promoCodeService.createPromoCode({
        createdBy: req.user._id,
        prefix,
        length,
        description,
        maxUsage,
        singleUse
      });

      res.status(201).json({
        message: 'Promo code created successfully',
        promoCode
      });
    } catch (error) {
      console.error('Create promo code error:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          message: error.message || 'Invalid promo code data'
        });
      }
      res.status(500).json({
        message: error.message || 'Failed to create promo code'
      });
    }
  }

  async list(req, res) {
    try {
      const { page, limit, isActive, search } = req.query;
      const result = await promoCodeService.listPromoCodes({
        page,
        limit,
        isActive,
        search
      });

      res.json({
        message: 'Promo codes retrieved successfully',
        ...result
      });
    } catch (error) {
      console.error('List promo codes error:', error);
      res.status(500).json({
        message: 'Failed to retrieve promo codes'
      });
    }
  }

  async getByCode(req, res) {
    try {
      const { code } = req.params;
      const promoCode = await promoCodeService.getPromoCodeByCode(code);

      res.json({
        message: 'Promo code retrieved successfully',
        promoCode
      });
    } catch (error) {
      console.error('Get promo code error:', error);

      if (error.name === 'NotFoundError') {
        return res.status(404).json({ message: error.message });
      }

      res.status(500).json({
        message: 'Failed to retrieve promo code'
      });
    }
  }

  async updateStatus(req, res) {
    try {
      const { code } = req.params;
      const { isActive } = req.body;

      const promoCode = await promoCodeService.setPromoCodeStatus(code, isActive);

      res.json({
        message: `Promo code ${promoCode.isActive ? 'activated' : 'deactivated'} successfully`,
        promoCode
      });
    } catch (error) {
      console.error('Update promo code status error:', error);

      if (error.name === 'NotFoundError') {
        return res.status(404).json({ message: error.message });
      }

      res.status(500).json({
        message: 'Failed to update promo code status'
      });
    }
  }

  async verify(req, res) {
    try {
      const { code } = req.body;
      const { promoCode, isStatic } = await promoCodeService.assertPromoCodeIsValid(code);

      res.json({
        message: 'Promo code is valid',
        promoCode: {
          code: promoCode.code,
          isActive: promoCode.isActive,
          usageCount: promoCode.usageCount,
          maxUsage: promoCode.maxUsage,
          singleUse: promoCode.singleUse,
          lastUsedAt: promoCode.lastUsedAt,
          isReusable: isStatic
        }
      });
    } catch (error) {
      if (error.name === 'AuthError') {
        return res.status(400).json({ message: error.message });
      }

      console.error('Verify promo code error:', error);
      res.status(500).json({
        message: 'Failed to verify promo code'
      });
    }
  }
}

module.exports = new PromoCodeController();
