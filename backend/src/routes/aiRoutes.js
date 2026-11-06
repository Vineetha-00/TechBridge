const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.post('/guidance', optionalAuth, aiController.getCareerGuidance);
router.post('/compare-advices', optionalAuth, aiController.compareSeniorAdvices);
router.get('/presets', aiController.getComparisonPresets);

module.exports = router;

