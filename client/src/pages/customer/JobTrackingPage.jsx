import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  Star,
  FileText,
  AlertTriangle,
  ArrowLeft,
  Calendar,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import NotificationHeader from '../../components/NotificationHeader';
import InlineReviewSection from '../../components/InlineReviewSection';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

const JobTrackingPage = () => {
  const { id } = useParams();
  const { addToast } = useToast();

  const [booking, setBooking] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const res = await API.get(`/bookings/${id}`);
        if (res.success) {
          setBooking(res.data.booking);
          setInvoice(res.data.invoice);
        } else {
          // Fallback mock booking data matching Screen 3 mockup
          setBooking({
            _id: id || 'b18472',
            bookingNumber: 'CCB18472',
            serviceCategory: 'AC Repair',
            problemDescription: 'AC not cooling properly. Please check and fix the issue.',
            status: 'ON_THE_WAY',
            schedule: {
              date: 'Today, 22 Apr 2025',
              displaySlot: '2:00 PM - 4:00 PM',
            },
            address: 'Hitech City, Hyderabad',
            price: 1200,
            providerId: {
              name: 'Ravi Kumar',
              phone: '9876543210',
              rating: 4.8,
              reviewCount: 246,
            },
          });
        }
      } catch (err) {
        // Mock fallback
        setBooking({
          _id: id || 'b18472',
          bookingNumber: 'CCB18472',
          serviceCategory: 'AC Repair',
          problemDescription: 'AC not cooling properly. Please check and fix the issue.',
          status: 'ON_THE_WAY',
          schedule: {
            date: 'Today, 22 Apr 2025',
            displaySlot: '2:00 PM - 4:00 PM',
          },
          address: 'Hitech City, Hyderabad',
          price: 1200,
          providerId: {
            name: 'Ravi Kumar',
            phone: '9876543210',
            rating: 4.8,
            reviewCount: 246,
          },
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [id]);

  const timelineSteps = [
    {
      title: 'Request Created',
      time: '10:15 AM',
      subtitle: 'Service request submitted',
      status: 'completed',
    },
    {
      title: 'Provider Found',
      time: '10:32 AM',
      subtitle: 'Ravi Kumar matched',
      status: 'completed',
    },
    {
      title: 'Quote Accepted',
      time: '11:00 AM',
      subtitle: '₹800 - ₹1,200 • 2 hours',
      status: 'completed',
    },
    {
      title: 'Scheduled',
      time: '11:20 AM',
      subtitle: 'Today: 2:00 PM - 4:00 PM',
      status: 'completed',
    },
    {
      title: 'Provider On the Way',
      time: '1:48 PM',
      subtitle: 'Arriving in 12 min',
      status: 'active',
    },
    {
      title: 'Arrived',
      time: '--:--',
      subtitle: 'Pending arrival',
      status: 'upcoming',
    },
    {
      title: 'Service Started',
      time: '--:--',
      subtitle: 'In progress',
      status: 'upcoming',
    },
    {
      title: 'Completed',
      time: '--:--',
      subtitle: 'Job completion',
      status: 'upcoming',
    },
  ];

  if (loading) {
    return (
      <div className="flex bg-slate-50 min-h-screen font-sans">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <NotificationHeader title="Live Job Tracking" subtitle="Loading tracking details..." />
          <div className="p-10 flex items-center justify-center flex-1">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00a86b]"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <NotificationHeader
          title={`Job Tracking #${booking?.bookingNumber || 'CCB18472'}`}
          subtitle={`Live GPS status for ${booking?.serviceCategory || 'AC Repair'}`}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] w-full">
          {/* Top Navigation Link */}
          <div>
            <Link
              to="/customer/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-600 hover:text-[#00a86b] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Bookings</span>
            </Link>
          </div>

          {/* MAIN 3-COLUMN LAYOUT MATCHING SCREEN 3 MOCKUP */}
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr_320px] gap-6 items-start">
            {/* LEFT COLUMN: SERVICE & PROVIDER DETAILS */}
            <div className="space-y-4">
              {/* Status Banner Card */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#00a86b]">
                  <span className="w-3 h-3 rounded-full bg-[#00a86b] animate-ping" />
                  <span className="font-extrabold text-xs uppercase tracking-wider">Service in Progress</span>
                </div>
                <p className="text-sm font-bold text-emerald-950">Your provider is on the way</p>
              </div>

              {/* Booking Details Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Booking ID</span>
                  <h2 className="text-xl font-black text-slate-900 font-mono">#{booking?.bookingNumber}</h2>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#00a86b] flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{booking?.serviceCategory}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{booking?.problemDescription}</p>
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-slate-600 space-y-1.5 border-t border-slate-100 font-medium">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{booking?.schedule?.date} • {booking?.schedule?.displaySlot}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{booking?.address}</span>
                    </div>
                  </div>
                </div>

                {/* Assigned Provider Card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#07221e] text-white font-black text-sm flex items-center justify-center">
                        RK
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-slate-900 text-xs">Ravi Kumar</h4>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00a86b]" />
                        </div>
                        <p className="text-[10px] text-slate-500">Verified Provider</p>
                        <p className="text-[10px] font-bold text-amber-500">★ 4.8 (246 reviews)</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${booking?.providerId?.phone || '9876543210'}`}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        title="Call"
                      >
                        <Phone className="w-4 h-4 text-[#00a86b]" />
                      </a>
                      <button
                        onClick={() => addToast('Opening live chat with Ravi Kumar...', 'info')}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        title="Message"
                      >
                        <MessageSquare className="w-4 h-4 text-brand-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Estimated Cost Card */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Estimated Cost</span>
                    <p className="text-base font-black text-slate-900">₹800 - ₹1,200</p>
                  </div>
                  <button
                    onClick={() => addToast('Quote Breakdown: Inspection ₹300, Labor ₹500, Tax included.', 'info')}
                    className="text-xs font-bold text-[#00a86b] hover:underline"
                  >
                    View Quote Details
                  </button>
                </div>

                {/* Need Help Card */}
                <div className="p-3.5 rounded-2xl bg-cyan-50/60 border border-cyan-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-extrabold text-slate-900">Need Help?</p>
                    <p className="text-[10px] text-slate-500">Contact Support</p>
                  </div>
                  <Link
                    to="/customer/support"
                    className="px-3 py-1.5 rounded-xl bg-white border border-cyan-200 font-bold text-cyan-800 hover:bg-cyan-100"
                  >
                    Support
                  </Link>
                </div>
              </div>
            </div>

            {/* CENTER COLUMN: LARGE REAL-TIME MAP */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden flex flex-col justify-between h-[640px] relative">
              {/* Map Canvas */}
              <div className="relative w-full h-full bg-slate-100">
                <svg className="w-full h-full" viewBox="0 0 540 640" preserveAspectRatio="none">
                  <defs>
                    <pattern id="gridMapCenter" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                    </pattern>
                  </defs>

                  <rect width="100%" height="100%" fill="#f8fafc" />
                  <rect width="100%" height="100%" fill="url(#gridMapCenter)" />

                  {/* Roads */}
                  <g stroke="#cbd5e1" strokeWidth="8" fill="none">
                    <path d="M 120 0 L 120 640" />
                    <path d="M 420 0 L 420 640" />
                    <path d="M 0 220 L 540 220" stroke="#94a3b8" strokeWidth="12" />
                    <path d="M 0 440 L 540 440" />
                  </g>

                  {/* Labels */}
                  <text x="140" y="200" fill="#94a3b8" fontSize="12" fontWeight="bold">MADHAPUR</text>
                  <text x="260" y="380" fill="#94a3b8" fontSize="12" fontWeight="bold">HITECH CITY</text>

                  {/* Route Curve Line */}
                  <path
                    d="M 280 180 Q 220 280 340 380"
                    fill="none"
                    stroke="#00a86b"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="6 4"
                    className="animate-pulse"
                  />

                  {/* Customer Destination Marker */}
                  <g transform="translate(340, 380)">
                    <circle cx="0" cy="0" r="16" fill="#00a86b" opacity="0.2" className="animate-ping" />
                    <circle cx="0" cy="0" r="10" fill="#00a86b" stroke="#ffffff" strokeWidth="3" />
                  </g>

                  {/* Provider Live Moving Marker */}
                  <g transform="translate(280, 180)">
                    <circle cx="0" cy="0" r="22" fill="#07221e" opacity="0.25" className="animate-ping" />
                    <circle cx="0" cy="0" r="14" fill="#07221e" stroke="#ffffff" strokeWidth="3" />
                    <rect x="-35" y="-35" width="70" height="20" rx="10" fill="#ffffff" stroke="#00a86b" strokeWidth="1.5" />
                    <text x="0" y="-21" fill="#0f172a" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Ravi Kumar
                    </text>
                  </g>
                </svg>

                {/* Bottom Overlay Info Cards */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#00a86b]" />
                    <div>
                      <p className="font-extrabold text-slate-900">Provider Location</p>
                      <p className="text-[10px] text-slate-500">2.1 km away</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                    <Clock className="w-4 h-4 text-brand-600" />
                    <div>
                      <p className="font-extrabold text-slate-900">ETA</p>
                      <p className="text-[10px] text-slate-500 font-bold text-[#00a86b]">12 min</p>
                    </div>
                  </div>
                </div>

                {/* Green Security Protection Badge at Bottom */}
                <div className="absolute bottom-20 left-4 right-4 bg-emerald-50/90 backdrop-blur-md p-3 rounded-2xl border border-emerald-200 text-[11px] text-emerald-950 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#00a86b] shrink-0" />
                    <div>
                      <p className="font-extrabold">Your booking is protected</p>
                      <p className="text-[9px] text-emerald-700">We ensure secure payments, verified providers and quality service.</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-bold text-[#00a86b] hover:underline shrink-0">
                    Learn more
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: BOOKING TIMELINE STEPPER (SCREEN 3 MOCKUP) */}
            <aside className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-6">
              <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">
                Booking Timeline
              </h3>

              <div className="relative space-y-6 pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {timelineSteps.map((step, idx) => (
                  <div key={step.title} className="relative flex items-start justify-between text-xs">
                    {/* Circle Indicator */}
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        step.status === 'completed'
                          ? 'bg-[#00a86b] text-white'
                          : step.status === 'active'
                          ? 'bg-[#00a86b] text-white ring-4 ring-emerald-100 animate-pulse'
                          : 'bg-slate-100 border border-slate-300 text-slate-400'
                      }`}
                    >
                      {step.status === 'completed' ? '✓' : idx + 1}
                    </div>

                    <div>
                      <p className={`font-extrabold ${step.status === 'active' ? 'text-[#00a86b]' : 'text-slate-900'}`}>
                        {step.title}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{step.subtitle}</p>
                    </div>

                    <span className="text-[10px] font-bold text-slate-400">{step.time}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          {/* INLINE SERVICE RATING & COMMENT SECTION */}
          <div className="pt-4">
            <InlineReviewSection
              bookingId={booking?._id || 'b18472'}
              providerId={booking?.providerId}
              providerName={booking?.providerId?.name || 'Ravi Kumar'}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobTrackingPage;
