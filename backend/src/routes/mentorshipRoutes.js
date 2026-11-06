const express = require('express');
const router = express.Router();
const mentorshipController = require('../controllers/mentorshipController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/requests', mentorshipController.getRequests);
router.post('/requests', mentorshipController.sendRequest);
router.patch('/requests/:id/status', mentorshipController.updateRequestStatus);
router.get('/sessions', mentorshipController.getSessions);
router.post('/sessions', mentorshipController.scheduleSession);

module.exports = router;

