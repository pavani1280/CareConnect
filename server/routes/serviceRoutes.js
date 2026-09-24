const express = require('express');
const router = express.Router();
const { getServices, getServiceById, createService, updateService } = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.get('/', getServices);
router.get('/:id', getServiceById);
router.post('/', protect, authorize('ADMIN'), createService);
router.put('/:id', protect, authorize('ADMIN'), updateService);

module.exports = router;
