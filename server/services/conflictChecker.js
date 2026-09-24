const Booking = require('../models/Booking');

/**
 * Converts HH:MM or HH:MM AM/PM string into total minutes from 00:00
 */
const timeToMinutes = (timeStr = '') => {
  if (!timeStr) return 0;
  
  // Format check if contains AM/PM
  let cleaned = timeStr.trim().toUpperCase();
  const isPM = cleaned.includes('PM');
  const isAM = cleaned.includes('AM');
  cleaned = cleaned.replace('AM', '').replace('PM', '').trim();

  const parts = cleaned.split(':');
  let hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

/**
 * Parses time slot strings like "10:00 AM - 12:00 PM" or { startTime: "10:00", endTime: "12:00" }
 */
const parseSlotTimes = (slotOrStart, end) => {
  if (typeof slotOrStart === 'object' && slotOrStart.startTime) {
    return {
      startMin: timeToMinutes(slotOrStart.startTime),
      endMin: timeToMinutes(slotOrStart.endTime),
    };
  }

  if (typeof slotOrStart === 'string' && slotOrStart.includes('-')) {
    const [s, e] = slotOrStart.split('-').map((str) => str.trim());
    return {
      startMin: timeToMinutes(s),
      endMin: timeToMinutes(e),
    };
  }

  return {
    startMin: timeToMinutes(slotOrStart),
    endMin: timeToMinutes(end),
  };
};

/**
 * Checks whether a provider has any existing active booking that overlaps with the proposed date and slot.
 * Overlap formula: (NewStart < ExistEnd) AND (NewEnd > ExistStart)
 */
const checkProviderConflict = async (providerId, date, startTime, endTime, excludeBookingId = null) => {
  const query = {
    providerId,
    'schedule.date': date,
    status: { $in: ['ACCEPTED', 'SCHEDULED', 'ON_THE_WAY', 'IN_PROGRESS'] },
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const existingBookings = await Booking.find(query);
  const newTimes = parseSlotTimes(startTime, endTime);

  for (const booking of existingBookings) {
    const existingTimes = parseSlotTimes(booking.schedule.startTime, booking.schedule.endTime);

    // Overlap condition
    if (newTimes.startMin < existingTimes.endMin && newTimes.endMin > existingTimes.startMin) {
      return {
        hasConflict: true,
        conflictingBooking: booking,
        message: `This time slot (${startTime} - ${endTime} on ${date}) is unavailable because you already have an active booking (${booking.schedule.displaySlot || booking.schedule.startTime + '-' + booking.schedule.endTime}).`,
      };
    }
  }

  return { hasConflict: false };
};

module.exports = {
  timeToMinutes,
  parseSlotTimes,
  checkProviderConflict,
};
