const express = require('express');
const promoCodeRequestController = require('../controllers/promoCodeRequestController');

const router = express.Router();

/**
 * @route   POST /api/promo-code-requests
 * @desc    Submit a request for a promo code
 * @access  Public
 */
router.post('/', promoCodeRequestController.submitRequest);

module.exports = router;
