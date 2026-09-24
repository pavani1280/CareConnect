const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    categoryName: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory' },
    description: { type: String, required: true },
    
    // AI Analysis output fields
    aiAnalysis: {
      classifiedCategory: { type: String },
      extractedSkills: [{ type: String }],
      urgency: { type: String, enum: ['Low', 'Medium', 'High', 'Emergency'], default: 'Medium' },
      suggestedDuration: { type: String, default: '1–2 hours' },
      confidence: { type: Number, default: 0.92 },
    },
    
    location: {
      address: { type: String, required: true },
      city: { type: String, default: 'Bangalore' },
      zipCode: { type: String, default: '560001' },
      lat: { type: Number },
      lng: { type: Number },
    },
    
    preferredDate: { type: String, required: true }, // "YYYY-MM-DD"
    preferredTimeSlot: { type: String, required: true }, // "10:00 AM - 12:00 PM"
    
    attachments: [{ type: String }], // Array of image URLs or file paths
    
    status: {
      type: String,
      enum: ['OPEN', 'QUOTED', 'BOOKED', 'CANCELLED', 'EXPIRED'],
      default: 'OPEN',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
