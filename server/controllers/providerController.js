const ProviderProfile = require('../models/ProviderProfile');
const User = require('../models/User');
const Review = require('../models/Review');
const AuditLog = require('../models/AuditLog');

// @desc Get filterable providers
// @route GET /api/providers
const getProviders = async (req, res, next) => {
  try {
    const { category, skill, search, verificationStatus, minRating } = req.query;

    let query = {};
    if (verificationStatus) {
      query.verificationStatus = verificationStatus;
    } else {
      // Default: Show verified providers first
      query.verificationStatus = { $in: ['VERIFIED', 'PENDING'] };
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    if (skill) {
      query.skills = { $regex: skill, $options: 'i' };
    }

    let profiles = await ProviderProfile.find(query).populate('userId', 'name email phone avatar location status');

    if (category) {
      profiles = profiles.filter((p) =>
        p.skills.some((s) => s.toLowerCase().includes(category.toLowerCase())) ||
        p.title.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (search) {
      const term = search.toLowerCase();
      profiles = profiles.filter(
        (p) =>
          p.userId?.name?.toLowerCase().includes(term) ||
          p.skills.some((s) => s.toLowerCase().includes(term)) ||
          p.bio.toLowerCase().includes(term)
      );
    }

    res.json({ success: true, count: profiles.length, data: profiles });
  } catch (error) {
    next(error);
  }
};

// @desc Get provider profile details by ID (user ID or profile ID)
// @route GET /api/providers/:id
const getProviderById = async (req, res, next) => {
  try {
    let profile = await ProviderProfile.findById(req.params.id).populate('userId', 'name email phone avatar location status');

    if (!profile) {
      profile = await ProviderProfile.findOne({ userId: req.params.id }).populate('userId', 'name email phone avatar location status');
    }

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Provider profile not found.' });
    }

    const reviews = await Review.find({ providerId: profile.userId._id })
      .populate('customerId', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        ...profile.toObject(),
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update provider's own profile
// @route PUT /api/providers/profile
const updateProviderProfile = async (req, res, next) => {
  try {
    const { title, bio, skills, experienceYears, serviceAreas, baseHourlyRate, documents } = req.body;

    let profile = await ProviderProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new ProviderProfile({ userId: req.user._id });
    }

    if (title) profile.title = title;
    if (bio) profile.bio = bio;
    if (skills) profile.skills = skills;
    if (experienceYears) profile.experienceYears = experienceYears;
    if (serviceAreas) profile.serviceAreas = serviceAreas;
    if (baseHourlyRate) profile.baseHourlyRate = baseHourlyRate;
    if (documents) {
      profile.documents = { ...profile.documents, ...documents };
      profile.verificationStatus = 'PENDING'; // Re-trigger review if docs uploaded
    }

    await profile.save();

    res.json({ success: true, message: 'Profile updated successfully.', data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc Manage provider availability and block dates
// @route POST /api/providers/availability
const updateAvailability = async (req, res, next) => {
  try {
    const { weeklySlots, blockedDates } = req.body;

    let profile = await ProviderProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Provider profile not found.' });
    }

    if (weeklySlots) profile.weeklySlots = weeklySlots;
    if (blockedDates) profile.blockedDates = blockedDates;

    await profile.save();

    res.json({ success: true, message: 'Availability schedule saved.', data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc Admin verification of provider documents
// @route PUT /api/providers/:id/verify
const verifyProvider = async (req, res, next) => {
  try {
    const { verificationStatus, verificationNotes } = req.body;

    const profile = await ProviderProfile.findById(req.params.id) || await ProviderProfile.findOne({ userId: req.params.id });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Provider profile not found.' });
    }

    profile.verificationStatus = verificationStatus;
    if (verificationNotes) profile.verificationNotes = verificationNotes;
    await profile.save();

    // Audit Log
    await AuditLog.create({
      actorId: req.user._id,
      actorRole: req.user.role,
      action: 'PROVIDER_VERIFICATION_UPDATED',
      entity: 'ProviderProfile',
      entityId: profile._id.toString(),
      metadata: { verificationStatus, verificationNotes },
    });

    res.json({
      success: true,
      message: `Provider status set to ${verificationStatus}.`,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProviders,
  getProviderById,
  updateProviderProfile,
  updateAvailability,
  verifyProvider,
};
