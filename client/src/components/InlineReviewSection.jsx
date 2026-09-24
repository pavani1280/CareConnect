import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, MessageSquare, Send, ThumbsUp } from 'lucide-react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';

const InlineReviewSection = ({ bookingId, providerId, providerName = 'Rahul Kumar' }) => {
  const { addToast } = useToast();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [serviceQuality, setServiceQuality] = useState(5);
  const [professionalism, setProfessionalism] = useState(5);
  const [valueForMoney, setValueForMoney] = useState(5);

  const [existingReview, setExistingReview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReview();
  }, [bookingId]);

  const fetchReview = async () => {
    try {
      const res = await API.get('/reviews');
      if (res.success && res.data) {
        const found = res.data.find((r) => r.bookingId?._id === bookingId || r.bookingId === bookingId);
        if (found) {
          setExistingReview(found);
        }
      }
    } catch (err) {
      console.error('Fetch review error:', err);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      addToast('Please write a short comment about your service experience.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/reviews', {
        bookingId,
        providerId: providerId?._id || providerId,
        rating,
        serviceQuality,
        professionalism,
        valueForMoney,
        comment,
      });

      if (res.success) {
        setExistingReview(res.data);
        addToast('Thank you! Your service review and rating have been published.', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to submit review.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (existingReview) {
    return (
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
          <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Your Submitted Review & Feedback</span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase">
            VERIFIED REVIEW
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${star <= existingReview.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                />
              ))}
            </div>
            <span className="font-extrabold text-slate-900 text-sm">{existingReview.rating} out of 5</span>
          </div>

          <p className="text-sm text-slate-700 italic bg-white p-3.5 rounded-2xl border border-emerald-100">
            "{existingReview.comment}"
          </p>

          <div className="grid grid-cols-3 gap-3 text-xs text-slate-600 pt-1">
            <div className="bg-white p-2 rounded-xl text-center border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-bold">QUALITY</span>
              <span className="font-bold text-slate-900">★ {existingReview.serviceQuality || 5}</span>
            </div>
            <div className="bg-white p-2 rounded-xl text-center border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-bold">PROFESSIONALISM</span>
              <span className="font-bold text-slate-900">★ {existingReview.professionalism || 5}</span>
            </div>
            <div className="bg-white p-2 rounded-xl text-center border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-bold">VALUE</span>
              <span className="font-bold text-slate-900">★ {existingReview.valueForMoney || 5}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-600" />
          <span>Rate & Comment on Your Service</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          How was your experience with <span className="font-bold text-slate-800">{providerName}</span>? Share your feedback below.
        </p>
      </div>

      <form onSubmit={handleSubmitReview} className="space-y-6">
        {/* Star Rating Control */}
        <div className="space-y-2 text-center sm:text-left">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Overall Rating
          </label>
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-200 hover:text-amber-300'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 font-extrabold text-slate-900 text-base">{rating} / 5</span>
          </div>
        </div>

        {/* Sub-Ratings Slider/Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Service Quality</label>
            <select
              value={serviceQuality}
              onChange={(e) => setServiceQuality(Number(e.target.value))}
              className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl p-2 focus:outline-none"
            >
              <option value={5}>★★★★★ Excellent (5)</option>
              <option value={4}>★★★★☆ Good (4)</option>
              <option value={3}>★★★☆☆ Average (3)</option>
              <option value={2}>★★☆☆☆ Poor (2)</option>
              <option value={1}>★☆☆☆☆ Terrible (1)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Professionalism</label>
            <select
              value={professionalism}
              onChange={(e) => setProfessionalism(Number(e.target.value))}
              className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl p-2 focus:outline-none"
            >
              <option value={5}>★★★★★ Punctual & Polite (5)</option>
              <option value={4}>★★★★☆ Good (4)</option>
              <option value={3}>★★★☆☆ Neutral (3)</option>
              <option value={2}>★★☆☆☆ Unprofessional (2)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Value for Money</label>
            <select
              value={valueForMoney}
              onChange={(e) => setValueForMoney(Number(e.target.value))}
              className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl p-2 focus:outline-none"
            >
              <option value={5}>★★★★★ Great Value (5)</option>
              <option value={4}>★★★★☆ Fair Price (4)</option>
              <option value={3}>★★★☆☆ Average (3)</option>
              <option value={2}>★★☆☆☆ Expensive (2)</option>
            </select>
          </div>
        </div>

        {/* Comment Textarea */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Add Service Review Comment
          </label>
          <textarea
            rows={3}
            required
            placeholder="Describe how the provider handled the repair, cleanliness, punctuality, and overall satisfaction..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3.5 rounded-2xl border border-slate-300 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 text-xs font-medium focus:outline-none placeholder-slate-400"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>{submitting ? 'Submitting...' : 'Post Review & Rate Service'}</span>
        </button>
      </form>
    </div>
  );
};

export default InlineReviewSection;
