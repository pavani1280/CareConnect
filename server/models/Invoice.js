const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    serviceName: { type: String, required: true },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    
    items: [
      {
        description: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
    
    baseServiceCost: { type: Number, required: true },
    additionalCharges: { type: Number, default: 0 },
    platformFee: { type: Number, default: 49 },
    tax: { type: Number, default: 0 }, // GST / Tax
    totalAmount: { type: Number, required: true },
    
    paymentStatus: {
      type: String,
      enum: ['UNPAID', 'PAID', 'REFUNDED', 'PARTIALLY_REFUNDED'],
      default: 'UNPAID',
    },
    paymentMethod: { type: String, default: 'Online / Card / UPI' },
    transactionId: { type: String, default: '' },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
