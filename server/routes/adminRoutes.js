const express = require('express');
const router = express.Router();
const { getAnalytics, getUsers, getAuditLogs } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.get('/analytics', protect, authorize('ADMIN', 'OPERATIONS_MANAGER'), getAnalytics);
router.get('/users', protect, authorize('ADMIN'), getUsers);
router.get('/audit-logs', protect, authorize('ADMIN'), getAuditLogs);

module.exports = router;
