const express = require('express');
const router = express.Router();
const {
  getProviders,
  getProviderById,
  updateProviderProfile,
  updateAvailability,
  verifyProvider,
} = require('../controllers/providerController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.get('/', getProviders);
router.get('/:id', getProviderById);

router.put('/profile', protect, authorize('PROVIDER'), updateProviderProfile);
router.post('/availability', protect, authorize('PROVIDER'), updateAvailability);

router.put('/:id/verify', protect, authorize('ADMIN', 'OPERATIONS_MANAGER'), verifyProvider);

module.exports = router;
