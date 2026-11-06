const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmapController');
const { optionalAuth, authenticate } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, roadmapController.getRoadmaps);
router.get('/:slug', optionalAuth, roadmapController.getRoadmapBySlug);
router.post('/progress', authenticate, roadmapController.toggleMilestoneProgress);

module.exports = router;

