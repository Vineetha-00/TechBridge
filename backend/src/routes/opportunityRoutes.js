const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunityController');
const { optionalAuth, authenticate } = require('../middleware/authMiddleware');
const { requireSeniorOrPlaced } = require('../middleware/roleMiddleware');

router.get('/', optionalAuth, opportunityController.getOpportunities);
router.post('/', authenticate, requireSeniorOrPlaced, opportunityController.createOpportunity);
router.get('/experiences', optionalAuth, opportunityController.getInterviewExperiences);
router.post('/experiences', authenticate, requireSeniorOrPlaced, opportunityController.createInterviewExperience);

module.exports = router;
