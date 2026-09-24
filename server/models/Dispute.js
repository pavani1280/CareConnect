const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, required: true, unique: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    evidence: [{ type: String }],
    
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'WAITING', 'RESOLVED', 'REJECTED', 'CLOSED'],
      default: 'OPEN',
    },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    
    assignedAgentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolution: { type: String, default: '' },
    refundAmount: { type: Number, default: 0 },
    
    conversations: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        senderName: { type: String },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dispute', disputeSchema);
