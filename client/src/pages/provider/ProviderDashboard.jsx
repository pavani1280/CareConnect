import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  DollarSign,
  Star,
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Search,
  Bell,
  User,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [availableForJobs, setAvailableForJobs] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get('/bookings');
        if (res.success && res.data.length > 0) {
          setJobs(res.data);
        }
      } catch (err) {
        console.error('Failed to load provider jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const chartData = [
    { day: '1 Apr', earnings: 1200 },
    { day: '5 Apr', earnings: 2500 },
    { day: '10 Apr', earnings: 1800 },
    { day: '15 Apr', earnings: 4200 },
    { day: '20 Apr', earnings: 3800 },
    { day: '25 Apr', earnings: 5100 },
    { day: '30 Apr', earnings: 4800 },
  ];

  const todaySchedule = [
    {
      time: '09:00 AM',
      service: 'AC Service',
      customer: 'Priya Sharma',
      location: 'Hitech City',
      status: 'Completed',
      statusColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      time: '11:30 AM',
      service: 'Washing Machine Repair',
      customer: 'Rohit Verma',
      location: 'Gachibowli',
      status: 'In Progress',
      statusColor: 'bg-[#00a86b] text-white animate-pulse',
    },
    {
      time: '02:00 PM',
      service: 'AC Repair',
      customer: 'Anita Reddy',
      location: 'Madhapur',
      status: 'Upcoming',
      statusColor: 'bg-slate-100 text-slate-700',
    },
    {
      time: '04:30 PM',
      service: 'Electrical Fix',
      customer: 'Suresh Kumar',
      location: 'Kondapur',
      status: 'Upcoming',
      statusColor: 'bg-slate-100 text-slate-700',
    },
  ];

  const activeJobsList = [
    {
      id: '#CCB18472',
      service: 'AC Repair',
      location: 'Hitech City - 2:00 PM',
      status: 'In Progress',
    },
    {
      id: '#CCB18456',
      service: 'Washing Machine Repair',
      location: 'Gachibowli - 11:30 AM',
      status: 'In Progress',
    },
  ];

  const recentReviewsList = [
    {
      name: 'Priya Sharma',
      rating: 5.0,
      time: '2 days ago',
      comment: 'Excellent service! Very professional and on time.',
    },
    {
      name: 'Rohit Verma',
      rating: 4.5,
      time: '4 days ago',
      comment: 'Good work, reasonable price.',
    },
    {
      name: 'Anita Reddy',
      rating: 5.0,
      time: '1 week ago',
      comment: 'Very skilled and polite. Highly recommended!',
    },
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar matching Screen 4 Mockup */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-xs sticky top-0 z-30">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Good morning, {user?.name ? user.name.split(' ')[0] : 'Ravi'}!</span>
              <span>👋</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Here's what's happening with your services today.</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Availability Toggle Switch */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-extrabold text-slate-700">Available for new jobs</span>
              <button
                onClick={() => {
                  setAvailableForJobs(!availableForJobs);
                  addToast(`Status updated to ${!availableForJobs ? 'Available' : 'Busy'}`, 'info');
                }}
                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase transition-all ${
                  availableForJobs ? 'bg-[#00a86b] text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                {availableForJobs ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Notifications */}
            <button className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-[#07221e] text-white font-black text-xs flex items-center justify-center">
                RK
              </div>
              <div className="hidden sm:block text-xs text-left">
                <p className="font-extrabold text-slate-900 leading-tight">Ravi Kumar</p>
                <p className="text-[10px] text-slate-400 font-bold">Provider</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] w-full">
          {/* STATS CARDS GRID (4 CARDS AS IN SCREEN 4) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Today's Jobs */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-card flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold text-slate-400 uppercase">Today's Jobs</p>
                <p className="text-3xl font-black text-slate-900 mt-1">3</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#00a86b] flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
            </div>

            {/* Card 2: Pending Requests */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-card flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold text-slate-400 uppercase">Pending Requests</p>
                <p className="text-3xl font-black text-slate-900 mt-1">5</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            {/* Card 3: Monthly Earnings */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-card flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold text-slate-400 uppercase">Monthly Earnings</p>
                <p className="text-3xl font-black text-slate-900 mt-1">₹48,750</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#00a86b] flex items-center justify-center shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            {/* Card 4: Average Rating */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-card flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold text-slate-400 uppercase">Average Rating</p>
                <p className="text-3xl font-black text-slate-900 mt-1">4.8</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <Star className="w-6 h-6 fill-amber-400" />
              </div>
            </div>
          </div>

          {/* MAIN GRID: 2 COLUMNS (SCREEN 4 MOCKUP) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* TODAY'S SCHEDULE CARD */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="font-extrabold text-slate-900 text-base">Today's Schedule</h2>
                <Link to="/provider/calendar" className="text-xs font-bold text-[#00a86b] hover:underline">
                  View all →
                </Link>
              </div>

              <div className="space-y-3">
                {todaySchedule.map((item) => (
                  <div
                    key={item.time + item.service}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-extrabold text-slate-400 text-[11px] shrink-0">{item.time}</span>
                      <div>
                        <p className="font-extrabold text-slate-900">{item.service}</p>
                        <p className="text-[10px] text-slate-500">{item.customer} • {item.location}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTIVE JOBS CARD */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="font-extrabold text-slate-900 text-base">Active Jobs</h2>
                <Link to="/provider/jobs" className="text-xs font-bold text-[#00a86b] hover:underline">
                  View all →
                </Link>
              </div>

              <div className="space-y-3">
                {activeJobsList.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono text-[10px] font-bold text-slate-400">{job.id}</span>
                      <p className="font-extrabold text-slate-900 text-sm mt-0.5">{job.service}</p>
                      <p className="text-[10px] text-slate-500">{job.location}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#00a86b] text-[10px] font-extrabold">
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* EARNINGS OVERVIEW BAR CHART */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="font-extrabold text-slate-900 text-base">Earnings Overview</h2>
                <span className="text-xs font-bold text-slate-400">This Month ▼</span>
              </div>

              <div className="h-56 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="earnings" fill="#00a86b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RECENT REVIEWS CARD */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="font-extrabold text-slate-900 text-base">Recent Reviews</h2>
                <Link to="/provider/reviews" className="text-xs font-bold text-[#00a86b] hover:underline">
                  View all →
                </Link>
              </div>

              <div className="space-y-3">
                {recentReviewsList.map((rev) => (
                  <div key={rev.name} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900">{rev.name}</span>
                        <span className="text-amber-500 font-bold">★ {rev.rating}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{rev.time}</span>
                    </div>
                    <p className="text-slate-600 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProviderDashboard;
