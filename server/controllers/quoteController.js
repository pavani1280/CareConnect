const Quote = require('../models/Quote');
const ServiceRequest = require('../models/ServiceRequest');
const Booking = require('../models/Booking');
const Invoice = require('../models/Invoice');
const ProviderProfile = require('../models/ProviderProfile');
const Notification = require('../models/Notification');
const { checkProviderConflict } = require('../services/conflictChecker');

// @desc Provider submits quote
// @route POST /api/quotes
const createQuote = async (req, res, next) => {
  try {
    const { requestId, price, estimatedDuration, message, warrantyDays } = req.body;

    const request = await ServiceRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found.' });
    }

    const providerProfile = await ProviderProfile.findOne({ userId: req.user._id });
    if (!providerProfile) {
      return res.status(400).json({ success: false, message: 'Provider profile required to send quotes.' });
    }

    // Check if provider already quoted
    const existingQuote = await Quote.findOne({ requestId, providerId: req.user._id });
    if (existingQuote) {
      return res.status(400).json({ success: false, message: 'You have already submitted a quote for this request.' });
    }

    const quote = await Quote.create({
      requestId,
      providerId: req.user._id,
      providerProfileId: providerProfile._id,
      price: price || 499,
      estimatedDuration: estimatedDuration || '1–2 hours',
      message: message || 'Verified professional ready to service your home with 30-day warranty.',
      warrantyDays: warrantyDays || 30,
      aiMatchScore: Math.floor(Math.random() * 10) + 90, // 90-99%
    });

    // Update request status
    request.status = 'QUOTED';
    await request.save();

    // Create Notification for Customer
    await Notification.create({
      userId: request.customerId,
      type: 'QUOTE_RECEIVED',
      title: 'New Quote Received!',
      message: `${req.user.name} submitted a quote of ₹${price} for your ${request.categoryName} request.`,
      link: `/customer/requests/${request._id}`,
    });

    res.status(201).json({ success: true, data: quote });
  } catch (error) {
    next(error);
  }
};

// @desc Get quotes for a request
// @route GET /api/quotes/request/:requestId
const getQuotesByRequest = async (req, res, next) => {
  try {
    const quotes = await Quote.find({ requestId: req.params.requestId })
      .populate('providerId', 'name avatar phone location')
      .populate('providerProfileId');

    res.json({ success: true, count: quotes.length, data: quotes });
  } catch (error) {
    next(error);
  }
};

// @desc Customer Accepts Quote -> Creates Booking & Invoice with Conflict Check
// @route PUT /api/quotes/:id/accept
const acceptQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findById(req.params.id).populate('requestId');
    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found.' });
    }

    const request = quote.requestId;
    if (!request) {
      return res.status(404).json({ success: false, message: 'Associated request not found.' });
    }

    // Provider Calendar Conflict Check before booking confirmation!
    const preferredDate = request.preferredDate || new Date().toISOString().split('T')[0];
    const startTime = '10:00';
    const endTime = '12:00';

    const conflict = await checkProviderConflict(quote.providerId, preferredDate, startTime, endTime);
    if (conflict.hasConflict) {
      return res.status(409).json({
        success: false,
        message: conflict.message,
      });
    }

    quote.status = 'ACCEPTED';
    await quote.save();

    // Mark other quotes as rejected
    await Quote.updateMany({ requestId: request._id, _id: { $ne: quote._id } }, { status: 'REJECTED' });

    // Update request status
    request.status = 'BOOKED';
    await request.save();

    // Generate Booking
    const bookingNumber = `BK-${Date.now().toString().slice(-6)}`;
    const booking = await Booking.create({
      bookingNumber,
      requestId: request._id,
      quoteId: quote._id,
      customerId: request.customerId,
      providerId: quote.providerId,
      serviceCategory: request.categoryName,
      schedule: {
        date: preferredDate,
        startTime,
        endTime,
        displaySlot: request.preferredTimeSlot || '10:00 AM - 12:00 PM',
      },
      location: request.location,
      price: quote.price,
      status: 'SCHEDULED',
    });

    // Generate Invoice
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
    const platformFee = 49;
    const totalAmount = quote.price + platformFee;

    const invoice = await Invoice.create({
      invoiceNumber,
      bookingId: booking._id,
      customerId: request.customerId,
      providerId: quote.providerId,
      serviceName: request.categoryName,
      baseServiceCost: quote.price,
      platformFee,
      totalAmount,
      items: [
        { description: `${request.categoryName} Base Labor & Diagnostics`, amount: quote.price },
        { description: 'CareConnect Platform Convenience Fee', amount: platformFee },
      ],
      paymentStatus: 'UNPAID',
    });

    // Notify Provider
    await Notification.create({
      userId: quote.providerId,
      type: 'BOOKING_ASSIGNED',
      title: 'Quote Accepted & Job Scheduled!',
      message: `Your quote for ${request.categoryName} was accepted. Booking ${bookingNumber} is scheduled for ${preferredDate}.`,
      link: `/provider/jobs/${booking._id}`,
    });

    res.json({
      success: true,
      message: 'Quote accepted! Booking and invoice created successfully.',
      data: {
        quote,
        booking,
        invoice,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createQuote,
  getQuotesByRequest,
  acceptQuote,
};
