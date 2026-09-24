import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Search,
  MapPin,
  CheckCircle2,
  Clock,
  Star,
  ShieldCheck,
  ArrowRight,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const AIRequestPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [category, setCategory] = useState(searchParams.get('q') || 'AC Repair');
  const [location, setLocation] = useState('Hyderabad, Telangana');
  const [priceMax, setPriceMax] = useState(2500);
  const [minRating, setMinRating] = useState('4');
  const [experience, setExperience] = useState('Any Experience');
  const [availability, setAvailability] = useState('Any Time');
  const [distance, setDistance] = useState('Within 10 km');
  const [selectedSort, setSelectedSort] = useState('Recommended');

  const providersData = [
    {
      id: 'p1',
      name: 'Ravi Kumar',
      verified: true,
      rating: 4.8,
      reviews: 246,
      experience: '6 years experience',
      jobs: '320+ jobs',
      tags: ['AC Service', 'AC Repair', 'Gas Filling'],
      distance: '2.3 km away',
      price: '₹500 - ₹1,200',
      available: 'Available today',
      availableColor: 'bg-emerald-100 text-emerald-800',
      lat: 17.44,
      lng: 78.38,
      locationName: 'Madhapur',
    },
    {
      id: 'p2',
      name: 'Suresh Aircon Services',
      verified: true,
      rating: 4.6,
      reviews: 189,
      experience: '5 years experience',
      jobs: '280+ jobs',
      tags: ['AC Repair', 'AC Installation', 'Maintenance'],
      distance: '3.1 km away',
      price: '₹600 - ₹1,500',
      available: 'Available tomorrow',
      availableColor: 'bg-blue-100 text-blue-800',
      lat: 17.43,
      lng: 78.4,
      locationName: 'Jubilee Hills',
    },
    {
      id: 'p3',
      name: 'Imran Khan',
      verified: true,
      rating: 4.7,
      reviews: 162,
      experience: '4 years experience',
      jobs: '190+ jobs',
      tags: ['AC Service', 'AC Repair', 'Cleaning'],
      distance: '4.5 km away',
      price: '₹450 - ₹1,100',
      available: 'Available today',
      availableColor: 'bg-emerald-100 text-emerald-800',
      lat: 17.45,
      lng: 78.37,
      locationName: 'Hitech City',
    },
  ];

  const handleRequestQuote = (providerName) => {
    if (!user) {
      addToast('Please login as a Customer to request quotes.', 'info');
      navigate('/login');
      return;
    }
    addToast(`Quote request sent to ${providerName}!`, 'success');
    navigate('/customer/requests');
  };

  const handleResetFilters = () => {
    setCategory('AC Repair');
    setLocation('Hyderabad, Telangana');
    setPriceMax(2500);
    setMinRating('4');
    setExperience('Any Experience');
    setAvailability('Any Time');
    setDistance('Within 10 km');
    addToast('Filters reset to default.', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 w-full max-w-[1600px] mx-auto space-y-4">
        {/* Main 3-Column Split Interface matching Screen 2 Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_420px] gap-6 items-start">
          {/* LEFT PANEL: FILTERS */}
          <aside className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-5 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Filters</h3>
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#00a86b] font-bold hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold text-slate-700">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-400">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-900 focus:outline-none"
                >
                  <option>AC Repair</option>
                  <option>Plumbing</option>
                  <option>Electrical</option>
                  <option>Cleaning</option>
                  <option>Appliance Repair</option>
                  <option>Carpentry</option>
                </select>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-400">Location</label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-300 bg-white">
                  <MapPin className="w-4 h-4 text-[#00a86b] shrink-0" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className="uppercase text-slate-400">Price Range</span>
                  <span className="text-[#00a86b]">₹300 - ₹{priceMax}</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="2500"
                  step="100"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#00a86b]"
                />
              </div>

              {/* Rating */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-400">Rating</label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-900 focus:outline-none"
                >
                  <option value="4">⭐⭐⭐⭐ 4+ Star</option>
                  <option value="4.5">⭐⭐⭐⭐⭐ 4.5+ Star</option>
                  <option value="3">⭐⭐⭐ 3+ Star</option>
                </select>
              </div>

              {/* Experience */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-400">Experience</label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-900 focus:outline-none"
                >
                  <option>Any Experience</option>
                  <option>3+ Years</option>
                  <option>5+ Years</option>
                </select>
              </div>

              {/* Availability */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-400">Availability</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-900 focus:outline-none"
                >
                  <option>Any Time</option>
                  <option>Available Today</option>
                  <option>Available Tomorrow</option>
                </select>
              </div>

              {/* Distance */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-400">Distance</label>
                <select
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-900 focus:outline-none"
                >
                  <option>Within 10 km</option>
                  <option>Within 5 km</option>
                  <option>Within 20 km</option>
                </select>
              </div>
            </div>
          </aside>

          {/* CENTER PANEL: PROVIDERS LIST */}
          <section className="space-y-4">
            {/* Results Header Bar */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <h2 className="text-base font-extrabold text-slate-900">
                12 providers found
              </h2>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <span>Sort by:</span>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 font-bold focus:outline-none"
                >
                  <option>Recommended</option>
                  <option>Rating: High to Low</option>
                  <option>Price: Low to High</option>
                  <option>Distance</option>
                </select>
              </div>
            </div>

            {/* Provider Cards List */}
            <div className="space-y-4">
              {providersData.map((pro) => (
                <div
                  key={pro.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card hover:shadow-xl transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-14 h-14 rounded-2xl bg-[#07221e] text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md">
                        {pro.name.slice(0, 2).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-slate-900 text-base">{pro.name}</h3>
                          {pro.verified && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#00a86b] text-[10px] font-extrabold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-[#00a86b]" />
                              Verified
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                          <span className="flex items-center gap-1 text-amber-500 font-bold">
                            ★ {pro.rating}
                          </span>
                          <span>({pro.reviews} reviews)</span>
                        </div>

                        <p className="text-xs text-slate-500 font-medium">
                          {pro.experience} • {pro.jobs}
                        </p>

                        {/* Skill Tags */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {pro.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Side Pricing & Distance */}
                    <div className="text-left sm:text-right space-y-1 shrink-0">
                      <p className="text-xs font-bold text-slate-400 flex items-center sm:justify-end gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#00a86b]" />
                        <span>{pro.distance}</span>
                      </p>
                      <p className="text-base font-black text-slate-900">{pro.price}</p>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${pro.availableColor}`}>
                        {pro.available}
                      </span>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      onClick={() => addToast(`Viewing profile for ${pro.name}`, 'info')}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleRequestQuote(pro.name)}
                      className="px-5 py-2 rounded-xl bg-[#00a86b] hover:bg-[#00915c] text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1"
                    >
                      <span>Request Quote</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT PANEL: INTERACTIVE MAP (SCREEN 2 MOCKUP) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden sticky top-24 h-[680px] flex flex-col justify-between">
            {/* Simulated Interactive Vector Map of Hyderabad */}
            <div className="relative w-full h-full bg-slate-100 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 420 680" preserveAspectRatio="none">
                <defs>
                  <pattern id="gridMap" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                  </pattern>
                </defs>

                <rect width="100%" height="100%" fill="#f1f5f9" />
                <rect width="100%" height="100%" fill="url(#gridMap)" />

                {/* River / Water Feature */}
                <path d="M 0 340 Q 150 300 280 400 T 420 360" fill="none" stroke="#bae6fd" strokeWidth="24" />

                {/* Road Lines */}
                <g stroke="#cbd5e1" strokeWidth="6" fill="none">
                  <path d="M 60 0 L 60 680" />
                  <path d="M 320 0 L 320 680" />
                  <path d="M 0 160 L 420 160" />
                  <path d="M 0 480 L 420 480" stroke="#94a3b8" strokeWidth="10" />
                </g>

                {/* Locality Label Texts */}
                <text x="70" y="240" fill="#94a3b8" fontSize="11" fontWeight="bold">JUBILEE HILLS</text>
                <text x="210" y="210" fill="#94a3b8" fontSize="11" fontWeight="bold">BEGUMPET</text>
                <text x="260" y="280" fill="#94a3b8" fontSize="11" fontWeight="bold">SECUNDERABAD</text>
                <text x="80" y="420" fill="#94a3b8" fontSize="11" fontWeight="bold">HITEC CITY</text>

                {/* Provider Pins */}
                {/* Pin 1: Ravi Kumar */}
                <g transform="translate(180, 220)">
                  <circle cx="20" cy="20" r="18" fill="#00a86b" opacity="0.2" className="animate-ping" />
                  <circle cx="20" cy="20" r="10" fill="#00a86b" stroke="#ffffff" strokeWidth="2" />
                  <rect x="-30" y="-22" width="100" height="20" rx="10" fill="#ffffff" stroke="#00a86b" strokeWidth="1.5" />
                  <text x="20" y="-8" fill="#0f172a" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Ravi Kumar ★ 4.8 · 2.3 km
                  </text>
                </g>

                {/* Pin 2: Suresh Aircon */}
                <g transform="translate(90, 320)">
                  <circle cx="20" cy="20" r="8" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                </g>

                {/* Pin 3: Imran Khan */}
                <g transform="translate(260, 410)">
                  <circle cx="20" cy="20" r="8" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                </g>
              </svg>

              {/* Your Location Bottom Floating Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#00a86b] shrink-0" />
                  <div>
                    <p className="font-extrabold text-slate-900 text-xs">Your location</p>
                    <p className="text-[10px] text-slate-500">Hyderabad, Telangana</p>
                  </div>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                  ✏️
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AIRequestPage;
