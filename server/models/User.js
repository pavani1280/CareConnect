const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ['CUSTOMER', 'PROVIDER', 'OPERATIONS_MANAGER', 'SUPPORT_AGENT', 'ADMIN'],
      default: 'CUSTOMER',
      required: true,
    },
    avatar: { type: String, default: '' },
    location: {
      address: { type: String, default: '' },
      city: { type: String, default: 'Bangalore' },
      state: { type: String, default: 'Karnataka' },
      zipCode: { type: String, default: '560001' },
      lat: { type: Number, default: 12.9716 },
      lng: { type: Number, default: 77.5946 },
    },
    status: { type: String, enum: ['ACTIVE', 'SUSPENDED', 'PENDING'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
