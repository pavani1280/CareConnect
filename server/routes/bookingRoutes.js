const express = require('express');
const router = express.Router();
const {
  getBookings,
  getBookingById,
  updateBookingStatus,
  uploadEvidence,
  confirmCompletion,
  reassignProvider,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.get('/', protect, getBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, updateBookingStatus);
router.post('/:id/evidence', protect, uploadEvidence);
router.put('/:id/confirm', protect, authorize('CUSTOMER'), confirmCompletion);
router.put('/:id/reassign', protect, authorize('ADMIN', 'OPERATIONS_MANAGER'), reassignProvider);

module.exports = router;
