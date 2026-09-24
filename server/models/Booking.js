const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: { type: String, required: true, unique: true },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest' },
    quoteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quote' },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceCategory: { type: String, required: true },
    
    // Exact Schedule timing for calendar conflict validation
    schedule: {
      date: { type: String, required: true }, // "YYYY-MM-DD"
      startTime: { type: String, required: true }, // "10:00"
      endTime: { type: String, required: true },   // "12:00"
      displaySlot: { type: String, default: '10:00 AM - 12:00 PM' },
    },
    
    location: {
      address: { type: String, required: true },
      city: { type: String, default: 'Bangalore' },
      zipCode: { type: String, default: '560001' },
    },
    
    price: { type: Number, required: true },
    
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'SCHEDULED', 'ON_THE_WAY', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED'],
      default: 'SCHEDULED',
    },
    
    // Photo Evidence & Verification
    beforeEvidence: [{ type: String }],
    afterEvidence: [{ type: String }],
    notes: { type: String, default: '' },
    customerConfirmed: { type: Boolean, default: false },
    completedAt: { type: Date },
    
    // Assigning/Escalation details for Ops
    assignedByOps: { type: Boolean, default: false },
    opsNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
