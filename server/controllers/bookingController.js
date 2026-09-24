const Booking = require('../models/Booking');
const Invoice = require('../models/Invoice');
const ProviderProfile = require('../models/ProviderProfile');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const { verifyBookingOwnership } = require('../middleware/ownership');
const { checkProviderConflict } = require('../services/conflictChecker');

// @desc Get bookings
// @route GET /api/bookings
const getBookings = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'CUSTOMER') {
      query.customerId = req.user._id;
    } else if (req.user.role === 'PROVIDER') {
      query.providerId = req.user._id;
    }

    const bookings = await Booking.find(query)
      .populate('customerId', 'name email phone avatar location')
      .populate('providerId', 'name email phone avatar location')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

// @desc Get booking by ID
// @route GET /api/bookings/:id
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerId', 'name email phone avatar location')
      .populate('providerId', 'name email phone avatar location');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (!verifyBookingOwnership(booking, req.user)) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this booking.' });
    }

    const invoice = await Invoice.findOne({ bookingId: booking._id });

    res.json({
      success: true,
      data: {
        booking,
        invoice,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update booking status (ACCEPTED, ON_THE_WAY, IN_PROGRESS, COMPLETED)
// @route PUT /api/bookings/:id/status
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    booking.status = status;
    if (notes) booking.notes = notes;
    if (status === 'COMPLETED') {
      booking.completedAt = new Date();
      // Increment provider completed jobs count
      await ProviderProfile.updateOne({ userId: booking.providerId }, { $inc: { completedJobsCount: 1 } });
    }

    await booking.save();

    // Notify Customer
    await Notification.create({
      userId: booking.customerId,
      type: 'BOOKING_STATUS_UPDATED',
      title: `Job Status: ${status.replace(/_/g, ' ')}`,
      message: `Your ${booking.serviceCategory} booking is now ${status.replace(/_/g, ' ')}.`,
      link: `/customer/bookings/${booking._id}`,
    });

    res.json({ success: true, message: `Status updated to ${status}`, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc Upload Before / After evidence photos
// @route POST /api/bookings/:id/evidence
const uploadEvidence = async (req, res, next) => {
  try {
    const { type, imageUrls } = req.body; // type: 'before' or 'after'
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (type === 'before') {
      booking.beforeEvidence = [...(booking.beforeEvidence || []), ...(imageUrls || [])];
    } else {
      booking.afterEvidence = [...(booking.afterEvidence || []), ...(imageUrls || [])];
    }

    await booking.save();

    res.json({ success: true, message: `${type} evidence uploaded successfully.`, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc Confirm completion by Customer
// @route PUT /api/bookings/:id/confirm
const confirmCompletion = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    booking.customerConfirmed = true;
    booking.status = 'COMPLETED';
    booking.completedAt = new Date();
    await booking.save();

    await ProviderProfile.updateOne({ userId: booking.providerId }, { $inc: { completedJobsCount: 1 } });

    res.json({ success: true, message: 'Job completion confirmed by customer.', data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc Operations Manager Reassign Provider
// @route PUT /api/bookings/:id/reassign
const reassignProvider = async (req, res, next) => {
  try {
    const { newProviderId, reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Check conflict for new provider
    const conflict = await checkProviderConflict(
      newProviderId,
      booking.schedule.date,
      booking.schedule.startTime,
      booking.schedule.endTime,
      booking._id
    );

    if (conflict.hasConflict) {
      return res.status(409).json({ success: false, message: conflict.message });
    }

    const previousProviderId = booking.providerId;
    booking.providerId = newProviderId;
    booking.assignedByOps = true;
    booking.opsNotes = reason || 'Reassigned by Operations Manager';
    await booking.save();

    // Audit log
    await AuditLog.create({
      actorId: req.user._id,
      actorRole: req.user.role,
      action: 'BOOKING_REASSIGNED',
      entity: 'Booking',
      entityId: booking._id.toString(),
      metadata: { previousProviderId, newProviderId, reason },
    });

    res.json({ success: true, message: 'Provider reassigned successfully.', data: booking });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBookings,
  getBookingById,
  updateBookingStatus,
  uploadEvidence,
  confirmCompletion,
  reassignProvider,
};
