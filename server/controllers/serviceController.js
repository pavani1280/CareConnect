const ServiceCategory = require('../models/ServiceCategory');
const ProviderProfile = require('../models/ProviderProfile');

// @desc Get all service categories
// @route GET /api/services
const getServices = async (req, res, next) => {
  try {
    const services = await ServiceCategory.find({ status: 'ACTIVE' }).sort({ popular: -1, name: 1 });
    
    // Attach provider count for each category dynamically
    const servicesWithCount = await Promise.all(
      services.map(async (svc) => {
        const providerCount = await ProviderProfile.countDocuments({
          skills: { $in: svc.skillsRequired || [svc.name] },
        });
        return {
          ...svc.toObject(),
          providerCount: Math.max(providerCount, 12),
        };
      })
    );

    res.json({ success: true, count: servicesWithCount.length, data: servicesWithCount });
  } catch (error) {
    next(error);
  }
};

// @desc Get single service category by ID or slug
// @route GET /api/services/:id
const getServiceById = async (req, res, next) => {
  try {
    let service;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      service = await ServiceCategory.findById(req.params.id);
    } else {
      service = await ServiceCategory.findOne({ slug: req.params.id });
    }

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service category not found.' });
    }

    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

// @desc Create service category (Admin only)
// @route POST /api/services
const createService = async (req, res, next) => {
  try {
    const { name, description, icon, basePrice, popular, skillsRequired } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const service = await ServiceCategory.create({
      name,
      slug,
      description,
      icon: icon || 'Wrench',
      basePrice,
      popular: popular || false,
      skillsRequired: skillsRequired || [name],
    });

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

// @desc Update service category (Admin only)
// @route PUT /api/services/:id
const updateService = async (req, res, next) => {
  try {
    const service = await ServiceCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service category not found.' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
};
