const express = require('express');
const router = express.Router();
const techUpdateController = require('../controllers/techUpdateController');
const { optionalAuth, authenticate } = require('../middleware/authMiddleware');
const { requireSeniorOrPlaced } = require('../middleware/roleMiddleware');

router.get('/', optionalAuth, techUpdateController.getTechUpdates);
router.post('/', authenticate, requireSeniorOrPlaced, techUpdateController.createTechUpdate);

module.exports = router;
