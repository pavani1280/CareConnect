/**
 * Server-Side Ownership Check Middleware
 * Ensures customers or providers can only view/modify their own requests, bookings, invoices, disputes
 * Elevated roles (ADMIN, OPERATIONS_MANAGER, SUPPORT_AGENT) bypass ownership restrictions.
 */

const verifyBookingOwnership = (booking, reqUser) => {
  if (!booking || !reqUser) return false;
  if (['ADMIN', 'OPERATIONS_MANAGER', 'SUPPORT_AGENT'].includes(reqUser.role)) {
    return true;
  }
  const customerId = booking.customerId
    ? (booking.customerId._id ? booking.customerId._id.toString() : booking.customerId.toString())
    : null;
  const providerId = booking.providerId
    ? (booking.providerId._id ? booking.providerId._id.toString() : booking.providerId.toString())
    : null;
  const userId = reqUser._id ? reqUser._id.toString() : reqUser.toString();

  return (customerId && customerId === userId) || (providerId && providerId === userId);
};

const verifyRequestOwnership = (serviceRequest, reqUser) => {
  if (!serviceRequest || !reqUser) return false;
  if (['ADMIN', 'OPERATIONS_MANAGER', 'SUPPORT_AGENT'].includes(reqUser.role)) {
    return true;
  }
  const customerId = serviceRequest.customerId
    ? (serviceRequest.customerId._id ? serviceRequest.customerId._id.toString() : serviceRequest.customerId.toString())
    : null;
  const userId = reqUser._id ? reqUser._id.toString() : reqUser.toString();
  return customerId && customerId === userId;
};

module.exports = {
  verifyBookingOwnership,
  verifyRequestOwnership,
};

