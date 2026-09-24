const mongoose = require('mongoose');

const availabilitySlotSchema = new mongoose.Schema({
  dayOfWeek: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
  startTime: { type: String, required: true }, // e.g., "09:00"
  endTime: { type: String, required: true },   // e.g., "17:00"
  isAvailable: { type: Boolean, default: true }
});

const blockedDateSchema = new mongoose.Schema({
  date: { type: String, required: true }, // "YYYY-MM-DD"
  reason: { type: String, default: 'Personal Off' }
});

const providerProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    title: { type: String, default: 'Certified Home Specialist' },
    bio: { type: String, default: '' },
    skills: [{ type: String }], // e.g., ["HVAC", "AC Diagnostics", "Cooling System Repair", "Plumbing"]
    experienceYears: { type: Number, default: 3 },
    serviceAreas: [{ type: String }], // e.g., ["Indiranagar", "Koramangala", "HSR Layout", "Central Bangalore"]
    serviceCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory' }],
    
    // Pricing
    baseHourlyRate: { type: Number, default: 499 },
    
    // Availability & Conflict management
    weeklySlots: [availabilitySlotSchema],
    blockedDates: [blockedDateSchema],
    
    // Verification documents
    documents: {
      governmentId: { type: String, default: '' },
      skillCertificate: { type: String, default: '' },
      addressProof: { type: String, default: '' },
      experienceCertificate: { type: String, default: '' },
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED', 'NEEDS_INFO'],
      default: 'PENDING',
    },
    verificationNotes: { type: String, default: '' },
    
    // Performance & Stats
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 0 },
    completedJobsCount: { type: Number, default: 0 },
    onTimeRate: { type: Number, default: 98 }, // Percentage
    
    // Distance/Location helper
    serviceRadiusKm: { type: Number, default: 15 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProviderProfile', providerProfileSchema);
