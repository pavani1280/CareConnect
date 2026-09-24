import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Layers, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const demoRoles = [
  ['CUSTOMER', 'Customer'],
  ['PROVIDER', 'Provider'],
  ['OPERATIONS_MANAGER', 'Operations'],
  ['SUPPORT_AGENT', 'Support'],
];

const LoginPage = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectUserByRole = (role) => {
    const routes = {
      CUSTOMER: '/customer/dashboard',
      PROVIDER: '/provider/dashboard',
      OPERATIONS_MANAGER: '/ops/dashboard',
      SUPPORT_AGENT: '/support/dashboard',
      ADMIN: '/admin/dashboard',
    };
    navigate(routes[role] || '/');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      addToast(`Welcome back, ${user.name}!`, 'success');
      redirectUserByRole(user.role);
    } catch (err) {
      addToast(err.message || 'Login failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrefillDemo = (role) => {
    const demoEmails = {
      CUSTOMER: 'customer@careconnect.com',
      PROVIDER: 'rahul.provider@careconnect.com',
      OPERATIONS_MANAGER: 'ops@careconnect.com',
      SUPPORT_AGENT: 'support@careconnect.com',
      ADMIN: 'admin@careconnect.com',
    };
    setEmail(demoEmails[role] || demoEmails.CUSTOMER);
    setPassword('password123');
    addToast(`Credentials filled for ${role.replace(/_/g, ' ')}. Click Sign In below.`, 'info');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="text-2xl font-extrabold">CareConnect</span>
          </Link>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-cyan-300">Service operations</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight">
              Sign in to manage bookings, quotes, support, and provider workflows.
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Demo accounts are available for every role so the complete platform can be reviewed quickly.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mb-8 text-center lg:text-left">
            <Link to="/" className="inline-flex items-center gap-2 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <span className="text-2xl font-extrabold text-slate-900">CareConnect</span>
            </Link>
            <h2 className="mt-4 text-2xl font-extrabold text-slate-950 lg:mt-0">Sign in to your account</h2>
            <p className="mt-1 text-sm text-slate-500">Access your dashboard, requests, and platform operations.</p>
          </div>

          <div className="mb-6 rounded-2xl border border-brand-200 bg-brand-50 p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-extrabold text-brand-900">
              <Layers className="h-4 w-4 text-brand-600" />
              <span>Pre-fill demo credentials</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {demoRoles.map(([role, label]) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handlePrefillDemo(role)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left font-bold text-slate-700 transition hover:bg-brand-600 hover:text-white"
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handlePrefillDemo('ADMIN')}
              className="mt-2 w-full rounded-xl bg-slate-950 px-3 py-2.5 text-center text-xs font-bold text-white transition hover:bg-slate-800"
            >
              Platform Admin
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <label className="block space-y-1">
              <span className="text-xs font-bold text-slate-700">Email Address</span>
              <span className="flex items-center gap-2 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus-within:border-brand-600 focus-within:ring-1 focus-within:ring-brand-600">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-slate-900 outline-none"
                />
              </span>
            </label>

            <label className="block space-y-1">
              <span className="text-xs font-bold text-slate-700">Password</span>
              <span className="flex items-center gap-2 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus-within:border-brand-600 focus-within:ring-1 focus-within:ring-brand-600">
                <Lock className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-slate-900 outline-none"
                />
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:underline">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
