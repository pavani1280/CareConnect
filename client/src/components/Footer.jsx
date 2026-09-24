import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-14 pb-24 lg:pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xl font-extrabold text-white">CareConnect</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Trusted Care. Skilled Professionals. Connected Homes.
              <br />
              The AI-powered platform for household maintenance, repair, and professional services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Popular Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/services" className="hover:text-cyan-400 transition-colors">AC Repair & Maintenance</Link></li>
              <li><Link to="/services" className="hover:text-cyan-400 transition-colors">Plumbing & Geyser Repair</Link></li>
              <li><Link to="/services" className="hover:text-cyan-400 transition-colors">Electrical Rewiring & MCB</Link></li>
              <li><Link to="/services" className="hover:text-cyan-400 transition-colors">Deep Home Cleaning</Link></li>
              <li><Link to="/services" className="hover:text-cyan-400 transition-colors">Appliance Repair</Link></li>
            </ul>
          </div>

          {/* Platform & Roles */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">CareConnect Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</Link></li>
              <li><Link to="/become-provider" className="hover:text-cyan-400 transition-colors">Become a Verified Provider</Link></li>
              <li><Link to="/ai-request" className="hover:text-cyan-400 transition-colors">AI Problem Diagnosis</Link></li>
              <li><Link to="/login" className="hover:text-cyan-400 transition-colors">Operations & Support Portal</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">24/7 Support HQ</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>+91 1800-425-CARE (2273)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>support@careconnect.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
                <span>MG Road Tech Park, Bangalore, KA 560001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p>© 2026 CareConnect Platform Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Hackathon / Capstone Excellence.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
