const Notification = require('../models/Notification');

// @desc Get user notifications
// @route GET /api/notifications
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const unreadCount = notifications.filter((n) => !n.read).length;

    res.json({
      success: true,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Mark notification as read
// @route PUT /api/notifications/:id/read
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    notification.read = true;
    await notification.save();

    res.json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};
