const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { optionalAuth, authenticate } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, projectController.getProjects);
router.post('/teams', authenticate, projectController.createProjectTeam);
router.post('/teams/:teamId/apply', authenticate, projectController.joinTeamRequest);

module.exports = router;
