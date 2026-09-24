const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ProviderProfile = require('../models/ProviderProfile');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'careconnect_super_secret_jwt_key_2026_capstone_hackathon', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc Register User
// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, profile } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '9876543210',
      role: role || 'CUSTOMER',
      location: profile?.location || { address: '123 Main St', city: 'Bangalore' },
    });

    if (user.role === 'PROVIDER') {
      await ProviderProfile.create({
        userId: user._id,
        title: profile?.title || 'Certified Service Professional',
        skills: profile?.skills || ['General Maintenance', 'Home Repair'],
        bio: profile?.bio || 'Experienced home service provider dedicated to quality.',
        experienceYears: profile?.experienceYears || 3,
        serviceAreas: profile?.serviceAreas || ['Bangalore', 'Indiranagar'],
        verificationStatus: 'PENDING',
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Login User
// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    let providerProfile = null;
    if (user.role === 'PROVIDER') {
      providerProfile = await ProviderProfile.findOne({ userId: user._id });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        status: user.status,
        providerProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get current user profile
// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let providerProfile = null;

    if (user.role === 'PROVIDER') {
      providerProfile = await ProviderProfile.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        providerProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
