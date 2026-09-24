import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  FileText,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  Star,
  Bell,
  User,
  ShieldCheck,
  Briefcase,
  AlertTriangle,
  LifeBuoy,
  LogOut,
  Users,
  Settings,
  FileCheck,
  TrendingUp,
  Home,
  MessageSquare,
  Wrench,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const role = user.role;

  // Custom Sidebar Nav Items per Role
  const navItems = {
    CUSTOMER: [
      { label: 'Dashboard', path: '/customer/dashboard', icon: LayoutDashboard },
      { label: 'Find Services', path: '/ai-request', icon: Search },
      { label: 'My Requests & Quotes', path: '/customer/requests', icon: FileText },
      { label: 'Payments & Invoices', path: '/customer/invoices', icon: DollarSign },
      { label: 'Notifications', path: '/customer/notifications', icon: Bell },
      { label: 'Help & Support', path: '/customer/support', icon: LifeBuoy },
    ],
    PROVIDER: [
      { label: 'Dashboard', path: '/provider/dashboard', icon: LayoutDashboard },
      { label: 'Requests', path: '/provider/requests', icon: MessageSquare, badge: '3' },
      { label: 'Quotes', path: '/provider/quotes', icon: FileText },
      { label: 'Active Jobs', path: '/provider/jobs', icon: Briefcase, badge: '2' },
      { label: 'Schedule', path: '/provider/calendar', icon: Calendar },
      { label: 'Availability', path: '/provider/availability', icon: Clock },
      { label: 'Services & Skills', path: '/provider/services', icon: Wrench },
      { label: 'Earnings', path: '/provider/earnings', icon: DollarSign },
      { label: 'Invoices', path: '/provider/invoices', icon: FileCheck },
      { label: 'Reviews', path: '/provider/reviews', icon: Star },
      { label: 'Profile', path: '/provider/profile', icon: User },
      { label: 'Settings', path: '/provider/settings', icon: Settings },
    ],
    OPERATIONS_MANAGER: [
      { label: 'Operations Dashboard', path: '/ops/dashboard', icon: LayoutDashboard },
      { label: 'Live Booking Monitor', path: '/ops/bookings', icon: Clock },
      { label: 'Provider Assignments', path: '/ops/assignments', icon: Users },
      { label: 'Escalated Jobs', path: '/ops/escalations', icon: AlertTriangle },
      { label: 'Quality Analytics', path: '/ops/analytics', icon: TrendingUp },
    ],
    SUPPORT_AGENT: [
      { label: 'Support Queue', path: '/support/dashboard', icon: LayoutDashboard },
      { label: 'Ticket Management', path: '/support/tickets', icon: LifeBuoy },
      { label: 'Disputes & Refunds', path: '/support/disputes', icon: AlertTriangle },
    ],
    ADMIN: [
      { label: 'Platform Analytics', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Provider Verification', path: '/admin/verification', icon: FileCheck },
      { label: 'User Directory', path: '/admin/users', icon: Users },
      { label: 'Service Categories', path: '/admin/services', icon: Briefcase },
      { label: 'Disputes Overview', path: '/admin/disputes', icon: AlertTriangle },
      { label: 'Audit Logs', path: '/admin/audit-logs', icon: ShieldCheck },
    ],
  };

  const currentItems = navItems[role] || navItems.CUSTOMER;

  return (
    <>
      <aside className="hidden lg:flex w-64 bg-[#07221e] text-slate-200 min-h-screen flex-col justify-between p-4 sticky top-0 h-screen border-r border-emerald-950/80 shrink-0 shadow-2xl">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-emerald-900/60">
            <div className="w-8 h-8 rounded-xl bg-[#00a86b] flex items-center justify-center text-white font-bold shadow-md shadow-[#00a86b]/20">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-extrabold text-white text-base leading-tight tracking-tight">CareConnect</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                {role.replace('_', ' ')} Portal
              </span>
            </div>
          </div>

          {/* User Info Badge */}
          <div className="px-3 py-2.5 mb-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00a86b] text-white font-black flex items-center justify-center text-xs shrink-0">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-emerald-300/70 truncate">{user.email}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {currentItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#00a86b] text-white shadow-md shadow-[#00a86b]/30'
                        : 'text-slate-300 hover:text-white hover:bg-emerald-900/40'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="pt-3 border-t border-emerald-900/60">
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-emerald-900/60 bg-[#07221e]/95 backdrop-blur-md px-2 py-2 text-white shadow-2xl">
        <div className="grid grid-cols-4 gap-1">
          {currentItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-bold transition ${
                    isActive ? 'bg-[#00a86b] text-white' : 'text-slate-300 hover:bg-emerald-900/40'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span className="max-w-full truncate">{item.label.split('&')[0]}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
