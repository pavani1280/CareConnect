const User = require('../models/User');
const ProviderProfile = require('../models/ProviderProfile');
const Booking = require('../models/Booking');
const Invoice = require('../models/Invoice');
const Dispute = require('../models/Dispute');
const AuditLog = require('../models/AuditLog');
const ServiceCategory = require('../models/ServiceCategory');

// @desc Get Admin & Ops Platform Analytics
// @route GET /api/admin/analytics
const getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'CUSTOMER' });
    const totalProviders = await ProviderProfile.countDocuments({ verificationStatus: 'VERIFIED' });
    const pendingVerifications = await ProviderProfile.countDocuments({ verificationStatus: 'PENDING' });
    const totalBookings = await Booking.countDocuments();
    const openDisputes = await Dispute.countDocuments({ status: { $in: ['OPEN', 'IN_PROGRESS'] } });

    // Calculate total revenue from paid invoices
    const paidInvoices = await Invoice.find({ paymentStatus: 'PAID' });
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

    // Recent Audit Logs
    const recentAuditLogs = await AuditLog.find().populate('actorId', 'name role').sort({ createdAt: -1 }).limit(10);

    // Revenue by Category chart mock/aggregate
    const categories = await ServiceCategory.find();
    const categoryBreakdown = await Promise.all(
      categories.map(async (cat) => {
        const count = await Booking.countDocuments({ serviceCategory: cat.name });
        return {
          name: cat.name,
          bookingsCount: count,
          revenue: count * cat.basePrice,
        };
      })
    );

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProviders,
        pendingVerifications,
        totalBookings,
        openDisputes,
        totalRevenue,
      },
      categoryBreakdown,
      recentAuditLogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Manage Platform Users
// @route GET /api/admin/users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc Get System Audit Logs
// @route GET /api/admin/audit-logs
const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().populate('actorId', 'name role email').sort({ createdAt: -1 });
    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics,
  getUsers,
  getAuditLogs,
};
