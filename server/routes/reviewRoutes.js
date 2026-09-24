const express = require('express');
const router = express.Router();
const { createReview, getProviderReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.post('/', protect, authorize('CUSTOMER'), createReview);
router.get('/provider/:providerId', getProviderReviews);

module.exports = router;
