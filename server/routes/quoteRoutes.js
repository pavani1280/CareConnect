const express = require('express');
const router = express.Router();
const { createQuote, getQuotesByRequest, acceptQuote } = require('../controllers/quoteController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.post('/', protect, authorize('PROVIDER'), createQuote);
router.get('/request/:requestId', protect, getQuotesByRequest);
router.put('/:id/accept', protect, authorize('CUSTOMER'), acceptQuote);

module.exports = router;
