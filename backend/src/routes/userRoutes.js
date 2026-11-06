const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { optionalAuth, authenticate } = require('../middleware/authMiddleware');

router.get('/mentors', optionalAuth, userController.getMentors);
router.get('/colleges', userController.getColleges);
router.get('/dashboard-summary', authenticate, userController.getDashboardSummary);
router.get('/:id', optionalAuth, userController.getUserById);

module.exports = router;

