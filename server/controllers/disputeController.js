const Dispute = require('../models/Dispute');
const Booking = require('../models/Booking');
const Invoice = require('../models/Invoice');
const AuditLog = require('../models/AuditLog');

// @desc Create Dispute / Support Ticket
// @route POST /api/disputes
const createDispute = async (req, res, next) => {
  try {
    const { bookingId, reason, evidence, priority } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const ticketNumber = `TKT-${Date.now().toString().slice(-6)}`;

    const dispute = await Dispute.create({
      ticketNumber,
      bookingId,
      raisedBy: req.user._id,
      reason,
      evidence: evidence || [],
      priority: priority || 'Medium',
      conversations: [
        {
          sender: req.user._id,
          senderName: req.user.name,
          message: reason,
        },
      ],
    });

    booking.status = 'DISPUTED';
    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Support ticket submitted successfully.',
      data: dispute,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get Disputes
// @route GET /api/disputes
const getDisputes = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'CUSTOMER' || req.user.role === 'PROVIDER') {
      query.raisedBy = req.user._id;
    }

    const disputes = await Dispute.find(query)
      .populate('bookingId')
      .populate('raisedBy', 'name email phone avatar role')
      .populate('assignedAgentId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: disputes.length, data: disputes });
  } catch (error) {
    next(error);
  }
};

// @desc Get single dispute details
// @route GET /api/disputes/:id
const getDisputeById = async (req, res, next) => {
  try {
    const dispute = await Dispute.findById(req.params.id)
      .populate('bookingId')
      .populate('raisedBy', 'name email phone avatar role')
      .populate('assignedAgentId', 'name email');

    if (!dispute) {
      return res.status(404).json({ success: false, message: 'Dispute ticket not found.' });
    }

    res.json({ success: true, data: dispute });
  } catch (error) {
    next(error);
  }
};

// @desc Resolve Dispute / Issue Refund
// @route PUT /api/disputes/:id
const resolveDispute = async (req, res, next) => {
  try {
    const { status, resolution, refundAmount, message } = req.body;

    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) {
      return res.status(404).json({ success: false, message: 'Dispute ticket not found.' });
    }

    if (status) dispute.status = status;
    if (resolution) dispute.resolution = resolution;
    if (refundAmount) dispute.refundAmount = refundAmount;
    dispute.assignedAgentId = req.user._id;

    if (message) {
      dispute.conversations.push({
        sender: req.user._id,
        senderName: req.user.name,
        message,
      });
    }

    await dispute.save();

    // If refund was processed, update invoice status
    if (refundAmount && refundAmount > 0) {
      await Invoice.updateOne(
        { bookingId: dispute.bookingId },
        { paymentStatus: refundAmount >= 499 ? 'REFUNDED' : 'PARTIALLY_REFUNDED' }
      );
    }

    // Audit Log
    await AuditLog.create({
      actorId: req.user._id,
      actorRole: req.user.role,
      action: 'DISPUTE_RESOLVED',
      entity: 'Dispute',
      entityId: dispute._id.toString(),
      metadata: { status, resolution, refundAmount },
    });

    res.json({
      success: true,
      message: `Dispute updated to ${status}.`,
      data: dispute,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDispute,
  getDisputes,
  getDisputeById,
  resolveDispute,
};
