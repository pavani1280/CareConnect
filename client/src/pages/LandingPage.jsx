import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  Droplets,
  Hammer,
  MapPin,
  Paintbrush,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Tv,
  Users,
  Wind,
  Zap,
  Wrench,
  Calendar,
  Layers,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const categoryPills = [
  { name: 'Plumbing', icon: Droplets },
  { name: 'Electrical', icon: Zap },
  { name: 'Cleaning', icon: Sparkles },
  { name: 'AC Repair', icon: Wind },
  { name: 'Appliance Repair', icon: Tv },
  { name: 'Carpentry', icon: Hammer },
];

const featuredServices = [
  {
    title: 'Plumbing',
    price: 'From ₹300',
    providers: '120+ providers',
    img: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
    desc: 'Tap repair, pipe leaks, drainage blocks, geysers, and fittings.',
  },
  {
    title: 'Electrical',
    price: 'From ₹400',
    providers: '95+ providers',
    img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    desc: 'Switchboards, wiring, lighting, MCB trips, fans, and safety checks.',
  },
  {
    title: 'Cleaning',
    price: 'From ₹800',
    providers: '150+ providers',
    img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    desc: 'Deep home cleaning, sofa, carpet, kitchen, and bathroom sanitization.',
  },
  {
    title: 'AC Repair',
    price: 'From ₹500',
    providers: '85+ providers',
    img: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80',
    desc: 'Cooling issues, gas refills, leak checks, servicing, and installation.',
  },
  {
    title: 'Appliance Repair',
    price: 'From ₹400',
    providers: '110+ providers',
    img: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=600&q=80',
    desc: 'Washing machines, refrigerators, microwaves, and chimneys.',
  },
  {
    title: 'Carpentry',
    price: 'From ₹600',
    providers: '75+ providers',
    img: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80',
    desc: 'Furniture repair, door locks, shelves, hinges, and custom woodwork.',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [serviceQuery, setServiceQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('Hyderabad, Telangana');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (serviceQuery.trim()) params.set('q', serviceQuery.trim());
    if (locationQuery.trim()) params.set('location', locationQuery.trim());
    navigate(`/ai-request${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      {/* HERO SECTION (DARK TEAL BRANDING AS IN MOCKUP 1) */}
      <section className="relative overflow-hidden bg-[#07221e] pt-28 pb-16 lg:pt-36 lg:pb-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            {/* Left Column Content */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Home services,<br />
                <span className="text-[#00a86b]">made simple.</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
                Book trusted professionals for repairs, cleaning, maintenance and more — all from one place.
              </p>

              {/* Search / Booking Form Box (Uber-style) */}
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white rounded-2xl p-2.5 shadow-2xl space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2 text-slate-900 border border-emerald-900/20"
              >
                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="What service do you need? e.g. AC repair, plumbing..."
                    value={serviceQuery}
                    onChange={(e) => setServiceQuery(e.target.value)}
                    className="w-full text-xs font-bold bg-transparent outline-none placeholder-slate-400"
                  />
                </div>

                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                  <MapPin className="w-5 h-5 text-[#00a86b] shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter your location"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="w-full text-xs font-bold bg-transparent outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#00a86b] hover:bg-[#00915c] text-white font-extrabold text-xs shadow-lg shadow-[#00a86b]/30 transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a Service</span>
                </button>
              </form>

              {/* Quick Category Pills Bar */}
              <div className="pt-2 grid grid-cols-3 sm:grid-cols-6 gap-2">
                {categoryPills.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => navigate(`/ai-request?q=${encodeURIComponent(cat.name)}`)}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all text-xs font-bold text-white group"
                    >
                      <Icon className="w-4 h-4 text-[#00a86b] group-hover:scale-110 transition-transform" />
                      <span className="truncate">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column Image */}
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1000&q=80"
                  alt="Technician repairing AC unit"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07221e]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl text-slate-900 shadow-xl border border-white/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00a86b] text-white flex items-center justify-center font-black">
                      RK
                    </div>
                    <div>
                      <p className="font-extrabold text-xs">Ravi Kumar ★ 4.8</p>
                      <p className="text-[10px] text-slate-500">Verified AC Specialist • Hyderabad</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                    Available Today
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES SECTION ("What can we help you with?") */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                What can we help you with?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Choose from our most popular services or explore all categories.
              </p>
            </div>
            <Link
              to="/ai-request"
              className="text-xs font-bold text-[#00a86b] hover:underline flex items-center gap-1"
            >
              <span>View all services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Cards Grid matching Screen 1 mockup */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredServices.map((service) => (
              <div
                key={service.title}
                onClick={() => navigate(`/ai-request?q=${encodeURIComponent(service.title)}`)}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col group"
              >
                <div className="h-32 w-full overflow-hidden relative">
                  <img
                    src={service.img}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{service.title}</h3>
                    <p className="text-[11px] font-bold text-[#00a86b] mt-0.5">{service.price}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold">{service.providers}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#00a86b] text-xs font-bold uppercase tracking-wider">
              Simple Workflow
            </span>
            <h2 className="text-3xl font-black text-slate-900">How CareConnect Works</h2>
            <p className="text-xs text-slate-500">From AI problem diagnosis to live GPS tracking and payment.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              ['1', 'Describe Problem', 'Enter your issue in plain language or select a service.'],
              ['2', 'Compare Pros', 'Compare ratings, prices, distance, and verified profiles.'],
              ['3', 'Book & Schedule', 'Accept provider quotes and confirm your preferred time.'],
              ['4', 'Track Live GPS', 'Watch your provider arrive in real-time with full security.'],
            ].map(([num, title, desc]) => (
              <div key={num} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#00a86b] text-white font-black text-base flex items-center justify-center">
                  {num}
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
