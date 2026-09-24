const express = require('express');
const router = express.Router();
const { createDispute, getDisputes, getDisputeById, resolveDispute } = require('../controllers/disputeController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.post('/', protect, createDispute);
router.get('/', protect, getDisputes);
router.get('/:id', protect, getDisputeById);
router.put('/:id', protect, authorize('ADMIN', 'SUPPORT_AGENT', 'OPERATIONS_MANAGER'), resolveDispute);

module.exports = router;
