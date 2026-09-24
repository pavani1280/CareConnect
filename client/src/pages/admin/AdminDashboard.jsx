import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  DollarSign,
  Briefcase,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Award,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 10,
    totalProviders: 15,
    pendingVerifications: 3,
    totalBookings: 24,
    openDisputes: 1,
    totalRevenue: 34850,
  });

  const [categoryBreakdown, setCategoryBreakdown] = useState([
    { name: 'AC Repair', bookingsCount: 8, revenue: 3992 },
    { name: 'Plumbing', bookingsCount: 6, revenue: 2094 },
    { name: 'Electrical', bookingsCount: 5, revenue: 1995 },
    { name: 'Cleaning', bookingsCount: 3, revenue: 2997 },
    { name: 'Appliance', bookingsCount: 2, revenue: 898 },
  ]);

  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await API.get('/admin/analytics');
        if (res.success) {
          setStats(res.stats);
          setCategoryBreakdown(res.categoryBreakdown || categoryBreakdown);
          setAuditLogs(res.recentAuditLogs || []);
        }
      } catch (err) {
        console.error('Admin fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 p-4 pb-24 sm:p-10 lg:pb-10 space-y-8 max-w-7xl overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold uppercase">
              Platform Admin Control
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">CareConnect Enterprise Analytics</h1>
            <p className="text-xs text-slate-500">Platform performance, provider verification queue, and audit logs.</p>
          </div>

          <Link
            to="/admin/verification"
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <FileCheck className="w-4 h-4" />
            <span>Verification Queue ({stats.pendingVerifications})</span>
          </Link>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Total Customers</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Active Providers</p>
            <p className="text-2xl font-extrabold text-brand-600 mt-1">{stats.totalProviders}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Pending Verification</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">{stats.pendingVerifications}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Total Bookings</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalBookings}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Total Revenue</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">Rs. {stats.totalRevenue}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Open Disputes</p>
            <p className="text-2xl font-extrabold text-rose-600 mt-1">{stats.openDisputes}</p>
          </div>
        </div>

        {/* RECHARTS CATEGORY DISTRIBUTION BAR CHART */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Service Category Revenue Breakdown</h2>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBreakdown}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#0369a1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT SYSTEM AUDIT LOGS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
          <h2 className="text-lg font-bold text-slate-900">System Audit Trail</h2>

          <div className="space-y-2">
            {auditLogs.length > 0 ? (
              auditLogs.map((log) => (
                <div key={log._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-brand-100 text-brand-800 font-mono font-bold">
                      {log.action}
                    </span>
                    <span className="text-slate-700 font-semibold">{log.entity} #{log.entityId}</span>
                  </div>
                  <span className="text-slate-400">{new Date(log.createdAt || Date.now()).toLocaleTimeString()}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No audit logs logged yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
