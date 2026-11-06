const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/conversations', chatController.getConversations);
router.post('/conversations', chatController.startConversation);
router.get('/conversations/:conversationId/messages', chatController.getMessages);
router.post('/conversations/:conversationId/messages', chatController.sendMessage);
router.post('/block', chatController.blockUser);

module.exports = router;
