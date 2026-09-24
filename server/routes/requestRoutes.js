const express = require('express');
const router = express.Router();
const { createRequest, getRequests, getRequestById } = require('../controllers/requestController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.post('/', protect, authorize('CUSTOMER'), createRequest);
router.get('/', protect, getRequests);
router.get('/:id', protect, getRequestById);

module.exports = router;
