const express = require('express');
const promoCodeController = require('../controllers/promoCodeController');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

const router = express.Router();

router.post('/verify', promoCodeController.verify);

router.use(authenticateToken);
router.use(requireAdmin);

router.post('/', promoCodeController.create);
router.get('/', promoCodeController.list);
router.get('/:code', promoCodeController.getByCode);
router.patch('/:code/status', promoCodeController.updateStatus);

module.exports = router;
