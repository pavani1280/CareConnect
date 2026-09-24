import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  Phone,
  CheckCircle2,
  Clock,
  Layers,
  RefreshCw,
  ShieldCheck,
  Zap,
  User,
  Radio,
  Maximize2,
} from 'lucide-react';

const LiveTrackingMap = ({ booking }) => {
  const [mapType, setMapType] = useState('street'); // 'street' | 'satellite' | 'radar'
  const [proProgress, setProProgress] = useState(45); // 0 to 100% along the path
  const [etaMinutes, setEtaMinutes] = useState(14);
  const [isLiveRefreshing, setIsLiveRefreshing] = useState(false);

  const providerName = booking?.providerId?.name || 'Rahul Kumar';
  const providerPhone = booking?.providerId?.phone || '9876543210';
  const serviceCategory = booking?.serviceCategory || 'AC Repair & Servicing';
  const status = booking?.status || 'ON_THE_WAY';

  // Simulate live provider movement along route
  useEffect(() => {
    const interval = setInterval(() => {
      setProProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + 1;
      });
      setEtaMinutes((prev) => (prev > 2 ? Math.max(2, prev - 1) : 2));
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsLiveRefreshing(true);
    setTimeout(() => {
      setIsLiveRefreshing(false);
    }, 800);
  };

  // Calculate provider position coordinates on SVG canvas path
  // Start: (120, 260), End: (520, 110)
  const startX = 120;
  const startY = 260;
  const endX = 520;
  const endY = 110;

  const currentX = startX + (endX - startX) * (proProgress / 100);
  const currentY = startY + (endY - startY) * (proProgress / 100);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden space-y-0">
      {/* Map Header Controls */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Radio className="w-5 h-5 animate-pulse text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base text-white tracking-tight">Live GPS Radar Tracking</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live 5G Feed
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time technician tracking & route navigation
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* Map Layer Switcher */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setMapType('street')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mapType === 'street' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Street
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mapType === 'satellite' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapType('radar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mapType === 'radar' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Radar
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className={`p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all ${
              isLiveRefreshing ? 'animate-spin text-cyan-400' : ''
            }`}
            title="Refresh GPS"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Map View Canvas */}
      <div className={`relative h-[340px] sm:h-[400px] w-full overflow-hidden transition-all ${
        mapType === 'satellite'
          ? 'bg-slate-950'
          : mapType === 'radar'
          ? 'bg-slate-900'
          : 'bg-slate-100'
      }`}>
        {/* Interactive Simulated Map Vector Surface */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 640 400">
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={mapType === 'street' ? '#e2e8f0' : mapType === 'radar' ? '#1e293b' : '#0f172a'}
                strokeWidth="1"
              />
            </pattern>

            {/* Pulsing Signal Effect */}
            <radialGradient id="radarPulse" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Road Network Vectors */}
          {mapType === 'street' && (
            <g stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" fill="none">
              <path d="M 0 180 Q 200 120 400 220 T 640 180" />
              <path d="M 120 400 L 120 0" />
              <path d="M 520 400 L 520 0" />
              <path d="M 0 260 L 640 110" stroke="#94a3b8" strokeWidth="12" />
            </g>
          )}

          {mapType === 'satellite' && (
            <g stroke="#334155" strokeWidth="10" strokeLinecap="round" fill="none">
              <path d="M 0 260 L 640 110" stroke="#475569" strokeWidth="14" />
              <path d="M 220 0 Q 300 200 450 400" stroke="#1e293b" strokeWidth="20" />
            </g>
          )}

          {mapType === 'radar' && (
            <g>
              <circle cx="320" cy="200" r="160" fill="url(#radarPulse)" />
              <circle cx="320" cy="200" r="120" stroke="#0284c7" strokeWidth="1" fill="none" strokeDasharray="4,4" />
              <circle cx="320" cy="200" r="60" stroke="#0284c7" strokeWidth="1" fill="none" />
            </g>
          )}

          {/* Active Navigation Route Line (Provider -> Customer Home) */}
          <path
            d={`M ${startX} ${startY} Q 280 280 ${endX} ${endY}`}
            fill="none"
            stroke="#2563eb"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="8 6"
            className="animate-pulse"
          />

          {/* Traversed Route Line */}
          <path
            d={`M ${startX} ${startY} Q 280 280 ${currentX} ${currentY}`}
            fill="none"
            stroke="#10b981"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Destination Marker (Customer Home) */}
          <g transform={`translate(${endX - 20}, ${endY - 45})`}>
            <circle cx="20" cy="20" r="22" fill="#10b981" opacity="0.2" className="animate-ping" />
            <path
              d="M20 0C11.163 0 4 7.163 4 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16zm0 21c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z"
              fill="#059669"
            />
          </g>

          {/* Live Provider Moving Marker */}
          <g transform={`translate(${currentX - 24}, ${currentY - 24})`}>
            <circle cx="24" cy="24" r="30" fill="#0284c7" opacity="0.25" className="animate-ping" />
            <circle cx="24" cy="24" r="18" fill="#0284c7" stroke="#ffffff" strokeWidth="3" shadow-lg="true" />
            <path
              d="M24 14 L29 28 L24 25 L19 28 Z"
              fill="#ffffff"
            />
          </g>
        </svg>

        {/* Overlay: Customer Address Badge (Top Right) */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-slate-200 text-xs flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <p className="font-extrabold text-slate-900 leading-tight">Customer Location</p>
            <p className="text-[10px] text-slate-500 truncate max-w-[160px]">
              {booking?.address || 'Indiranagar, Bangalore'}
            </p>
          </div>
        </div>

        {/* Overlay: Provider Tracking Card (Bottom Left) */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-200 text-xs space-y-3">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md">
                {providerName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-slate-900 text-sm">{providerName}</h4>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-[11px] text-slate-500">Verified {serviceCategory} Technician</p>
              </div>
            </div>

            <a
              href={`tel:${providerPhone}`}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Pro</span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-0.5 text-slate-700">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-brand-600 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">ETA Arrival</span>
                <span className="font-extrabold text-slate-900 text-xs">{etaMinutes} Mins</span>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2.5">
              <Navigation className="w-4 h-4 text-cyan-600 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Distance</span>
                <span className="font-extrabold text-slate-900 text-xs">
                  {((100 - proProgress) * 0.035).toFixed(1)} km away
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingMap;
