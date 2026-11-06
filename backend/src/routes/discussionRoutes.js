const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController');
const { authenticate, optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, discussionController.getDiscussions);
router.get('/:id', optionalAuth, discussionController.getDiscussionById);
router.post('/', authenticate, discussionController.createDiscussion);
router.post('/:id/answers', authenticate, discussionController.createAnswer);
router.post('/answers/:answerId/comments', authenticate, discussionController.createComment);
router.post('/:id/like', authenticate, discussionController.toggleLikeDiscussion);
router.post('/answers/:answerId/helpful', authenticate, discussionController.markHelpful);

module.exports = router;
