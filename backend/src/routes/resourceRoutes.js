const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { optionalAuth, authenticate } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, resourceController.getResources);
router.post('/', authenticate, resourceController.createResource);

module.exports = router;

