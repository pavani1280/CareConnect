const mongoose = require('mongoose');

const serviceCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'Wrench' }, // Lucide icon name
    image: { type: String, default: '' },
    basePrice: { type: Number, required: true },
    popular: { type: Boolean, default: false },
    skillsRequired: [{ type: String }],
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceCategory', serviceCategorySchema);
