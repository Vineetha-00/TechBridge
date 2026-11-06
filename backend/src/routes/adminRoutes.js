const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

// Protect all admin endpoints
router.use(authenticate, requireAdmin);

router.get('/stats', adminController.getPlatformStats);
router.get('/verifications', adminController.getVerificationRequests);
router.patch('/verifications/:id/review', adminController.reviewVerification);
router.get('/users', adminController.getAllUsers);
router.patch('/users/:userId/role', adminController.updateUserRole);
router.get('/reports', adminController.getReports);
router.patch('/reports/:id/resolve', adminController.resolveReport);

module.exports = router;
