import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Mail, Phone, Lock, ArrowRight, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('CUSTOMER');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: 'Indiranagar',
    city: 'Bangalore',
    title: 'Home Specialist',
    skills: 'Plumbing, HVAC, Electrical',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skillsArray = formData.skills.split(',').map((s) => s.trim());
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role,
        profile: {
          title: formData.title,
          skills: skillsArray,
          location: { address: formData.address, city: formData.city },
        },
      };

      const user = await register(payload);
      addToast(`Account created successfully! Welcome, ${user.name}`, 'success');

      if (user.role === 'PROVIDER') navigate('/provider/dashboard');
      else navigate('/customer/dashboard');
    } catch (err) {
      addToast(err.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900">CareConnect</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900">Create a New Account</h2>
          <p className="text-xs text-slate-500">Join CareConnect as a Customer or Service Provider.</p>
        </div>

        {/* Role Picker Switch */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('CUSTOMER')}
            className={`py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              role === 'CUSTOMER' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Book Services (Customer)</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('PROVIDER')}
            className={`py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              role === 'PROVIDER' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4 text-brand-600" />
            <span>Provide Services (Pro)</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-300 text-sm">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  required
                  placeholder="Rahul Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Phone Number</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-300 text-sm">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  required
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-300 text-sm">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-300 text-sm">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full focus:outline-none"
              />
            </div>
          </div>

          {role === 'PROVIDER' && (
            <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Professional Title</label>
                <input
                  type="text"
                  placeholder="e.g., Certified HVAC & Electrical Technician"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Primary Skills (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="HVAC, AC Repair, Electrical, Leak Repair"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
