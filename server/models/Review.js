const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    rating: { type: Number, required: true, min: 1, max: 5 },
    serviceQuality: { type: Number, default: 5, min: 1, max: 5 },
    professionalism: { type: Number, default: 5, min: 1, max: 5 },
    valueForMoney: { type: Number, default: 5, min: 1, max: 5 },
    
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
