const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema(
  {
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest', required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    providerProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProviderProfile' },
    price: { type: Number, required: true },
    estimatedDuration: { type: String, required: true }, // e.g., "1.5 hours"
    message: { type: String, default: 'Professional service guaranteed with 30-day warranty.' },
    warrantyDays: { type: Number, default: 30 },
    aiMatchScore: { type: Number, default: 92 },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quote', quoteSchema);
