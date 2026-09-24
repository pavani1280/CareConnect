const express = require('express');
const router = express.Router();
const { getInvoices, getInvoiceById, payInvoice } = require('../controllers/invoiceController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getInvoices);
router.get('/:id', protect, getInvoiceById);
router.put('/:id/pay', protect, payInvoice);

module.exports = router;
