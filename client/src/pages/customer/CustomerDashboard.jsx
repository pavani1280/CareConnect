import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Calendar,
  FileText,
  DollarSign,
  ArrowRight,
  Phone,
  ShieldCheck,
  User,
  Star,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import NotificationHeader from '../../components/NotificationHeader';
import LiveTrackingMap from '../../components/LiveTrackingMap';
import InlineReviewSection from '../../components/InlineReviewSection';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeBooking, setActiveBooking] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const res = await API.get('/bookings');
        if (res.success && res.data.length > 0) {
          const active = res.data.find((b) => ['SCHEDULED', 'ON_THE_WAY', 'IN_PROGRESS'].includes(b.status));
          setActiveBooking(active || res.data[0]);
          setRecentBookings(res.data);
        }
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Notification & User Top Header */}
        <NotificationHeader
          title={`Good morning, ${user?.name ? user.name.split(' ')[0] : 'Customer'}`}
          subtitle="AI-powered home services, live tracking radar & verified technicians"
        />

        <main className="p-4 pb-24 sm:p-8 lg:pb-10 space-y-8 max-w-7xl">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                Customer Hub
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Welcome back, {user?.name ? user.name.split(' ')[0] : 'Valued Customer'}
              </h1>
              <p className="text-slate-200 text-sm sm:text-base max-w-lg">
                Manage your live active services, track expert technicians on map, and leave service reviews.
              </p>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              to="/ai-request"
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-lg transition-all flex flex-col items-start space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-sm">Book a Service</p>
                <p className="text-xs text-slate-500">AI problem analysis</p>
              </div>
            </Link>

            <Link
              to={activeBooking ? `/customer/track/${activeBooking._id}` : '/customer/requests'}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-lg transition-all flex flex-col items-start space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-sm">Track Booking</p>
                <p className="text-xs text-slate-500">Real-time GPS status</p>
              </div>
            </Link>

            <Link
              to="/customer/requests"
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-lg transition-all flex flex-col items-start space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-sm">View Quotes</p>
                <p className="text-xs text-slate-500">Compare provider bids</p>
              </div>
            </Link>

            <Link
              to="/customer/support"
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-lg transition-all flex flex-col items-start space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-sm">Contact Support</p>
                <p className="text-xs text-slate-500">24/7 Assistance</p>
              </div>
            </Link>
          </div>

          {/* TOP LIVE TRACKING GPS MAP SECTION */}
          {activeBooking && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                  <h2 className="text-lg font-extrabold text-slate-900">Live Active Job Radar & Tracking</h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-bold uppercase">
                  {activeBooking.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* LIVE MAP AT THE TOP */}
              <LiveTrackingMap booking={activeBooking} />
            </div>
          )}

          {/* ACTIVE BOOKING SUMMARY CARD */}
          {activeBooking && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900">Current Job Details</h3>
                <Link
                  to={`/customer/track/${activeBooking._id}`}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  Full Tracking Details Page
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Category</p>
                  <p className="font-extrabold text-slate-900">{activeBooking.serviceCategory}</p>
                  <p className="text-xs text-slate-500">#{activeBooking.bookingNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Assigned Technician</p>
                  <p className="font-extrabold text-slate-900">{activeBooking.providerId?.name || 'Rahul Kumar'}</p>
                  <p className="text-xs text-emerald-600 font-bold">★ 4.9 Verified Specialist</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Schedule</p>
                  <p className="font-extrabold text-slate-900">{activeBooking.schedule?.displaySlot || 'Today, 4:00 PM'}</p>
                  <p className="text-xs text-slate-500">{activeBooking.schedule?.date}</p>
                </div>
              </div>
            </div>
          )}

          {/* INLINE SERVICE RATING & COMMENT SECTION (AFTER REVIEW / ON THE SAME PAGE) */}
          {activeBooking && (
            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-slate-900">Rate & Review Your Service</h3>
              <p className="text-xs text-slate-500">Leave your feedback and comments directly below for your provider.</p>
              <InlineReviewSection
                bookingId={activeBooking._id}
                providerId={activeBooking.providerId}
                providerName={activeBooking.providerId?.name || 'Rahul Kumar'}
              />
            </div>
          )}

          {/* RECENT BOOKINGS TABLE */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-900">Your Service History</h3>
              <span className="text-xs text-slate-400 font-bold">{recentBookings.length} Total Bookings</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-3">Booking ID</th>
                    <th className="p-3">Service</th>
                    <th className="p-3">Provider</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-900 text-xs">{b.bookingNumber}</td>
                      <td className="p-3 font-bold text-slate-900">{b.serviceCategory}</td>
                      <td className="p-3">{b.providerId?.name || 'Rahul Kumar'}</td>
                      <td className="p-3 text-xs">{b.schedule?.date}</td>
                      <td className="p-3 font-bold text-slate-900">Rs. {b.price}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            b.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'ON_THE_WAY'
                              ? 'bg-brand-100 text-brand-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {b.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3">
                        <Link
                          to={`/customer/track/${b._id}`}
                          className="text-xs font-bold text-brand-600 hover:underline"
                        >
                          Details & Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;
