const Review = require('../models/Review');
const Booking = require('../models/Booking');
const ProviderProfile = require('../models/ProviderProfile');

// @desc Create Customer Review
// @route POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, serviceQuality, professionalism, valueForMoney, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already submitted a review for this booking.' });
    }

    const review = await Review.create({
      bookingId,
      customerId: req.user._id,
      providerId: booking.providerId,
      rating: rating || 5,
      serviceQuality: serviceQuality || 5,
      professionalism: professionalism || 5,
      valueForMoney: valueForMoney || 5,
      comment,
    });

    // Recalculate provider average rating
    const providerReviews = await Review.find({ providerId: booking.providerId });
    const avgRating = providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length;

    await ProviderProfile.updateOne(
      { userId: booking.providerId },
      {
        rating: Number(avgRating.toFixed(1)),
        reviewCount: providerReviews.length,
      }
    );

    res.status(201).json({ success: true, message: 'Review submitted successfully!', data: review });
  } catch (error) {
    next(error);
  }
};

// @desc Get reviews for provider
// @route GET /api/reviews/provider/:providerId
const getProviderReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ providerId: req.params.providerId })
      .populate('customerId', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getProviderReviews,
};
