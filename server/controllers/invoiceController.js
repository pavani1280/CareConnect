const Invoice = require('../models/Invoice');
const Booking = require('../models/Booking');

// @desc Get user invoices
// @route GET /api/invoices
const getInvoices = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'CUSTOMER') {
      query.customerId = req.user._id;
    } else if (req.user.role === 'PROVIDER') {
      query.providerId = req.user._id;
    }

    const invoices = await Invoice.find(query)
      .populate('customerId', 'name email phone')
      .populate('providerId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    next(error);
  }
};

// @desc Get single invoice
// @route GET /api/invoices/:id
const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customerId', 'name email phone location')
      .populate('providerId', 'name email phone location')
      .populate('bookingId');

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }

    res.json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

// @desc Mock Pay Invoice
// @route PUT /api/invoices/:id/pay
const payInvoice = async (req, res, next) => {
  try {
    const { paymentMethod } = req.body;
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }

    invoice.paymentStatus = 'PAID';
    invoice.paymentMethod = paymentMethod || 'UPI / Card';
    invoice.transactionId = `TXN-${Date.now().toString().slice(-8)}`;
    invoice.paidAt = new Date();

    await invoice.save();

    res.json({
      success: true,
      message: 'Payment received successfully!',
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
  payInvoice,
};
