const ServiceRequest = require('../models/ServiceRequest');
const ProviderProfile = require('../models/ProviderProfile');
const Quote = require('../models/Quote');
const { analyzeServiceRequest, rankProvidersForRequest } = require('../services/aiService');
const { verifyRequestOwnership } = require('../middleware/ownership');

// @desc Create AI-analyzed Service Request
// @route POST /api/requests
const createRequest = async (req, res, next) => {
  try {
    const { categoryName, description, location, preferredDate, preferredTimeSlot, attachments } = req.body;

    if (!description) {
      return res.status(400).json({ success: false, message: 'Please describe your problem or service requirement.' });
    }

    // 1. Run AI Service Analysis
    const aiAnalysis = analyzeServiceRequest(description);

    const serviceRequest = await ServiceRequest.create({
      customerId: req.user._id,
      categoryName: categoryName || aiAnalysis.classifiedCategory,
      description,
      aiAnalysis,
      location: location || req.user.location || { address: '123 MG Road', city: 'Bangalore' },
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      preferredTimeSlot: preferredTimeSlot || '10:00 AM - 12:00 PM',
      attachments: attachments || [],
    });

    // 2. Fetch Providers & Rank with AI Matcher Algorithm
    const verifiedProviders = await ProviderProfile.find({
      verificationStatus: 'VERIFIED',
    }).populate('userId', 'name email phone avatar location');

    const rankedProviders = rankProvidersForRequest(serviceRequest.toObject(), verifiedProviders);

    res.status(201).json({
      success: true,
      message: 'Service request analyzed and created successfully.',
      data: {
        request: serviceRequest,
        aiAnalysis,
        recommendedProviders: rankedProviders.slice(0, 6), // Top 6 recommended
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get list of service requests
// @route GET /api/requests
const getRequests = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'CUSTOMER') {
      query.customerId = req.user._id;
    } else if (req.user.role === 'PROVIDER') {
      // Providers see open requests
      query.status = { $in: ['OPEN', 'QUOTED'] };
    }

    const requests = await ServiceRequest.find(query)
      .populate('customerId', 'name email phone avatar location')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
};

// @desc Get single service request details
// @route GET /api/requests/:id
const getRequestById = async (req, res, next) => {
  try {
    const serviceRequest = await ServiceRequest.findById(req.params.id).populate('customerId', 'name email phone avatar location');

    if (!serviceRequest) {
      return res.status(404).json({ success: false, message: 'Service request not found.' });
    }

    if (!verifyRequestOwnership(serviceRequest, req.user) && req.user.role === 'CUSTOMER') {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this request.' });
    }

    const quotes = await Quote.find({ requestId: serviceRequest._id })
      .populate('providerId', 'name avatar phone')
      .populate('providerProfileId');

    // Also include live AI provider match recommendations
    const verifiedProviders = await ProviderProfile.find({ verificationStatus: 'VERIFIED' }).populate('userId', 'name avatar email phone location');
    const recommendedProviders = rankProvidersForRequest(serviceRequest.toObject(), verifiedProviders);

    res.json({
      success: true,
      data: {
        request: serviceRequest,
        quotes,
        recommendedProviders: recommendedProviders.slice(0, 5),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getRequests,
  getRequestById,
};
