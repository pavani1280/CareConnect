import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, Users, AlertTriangle, TrendingUp, RefreshCw } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

const OperationsDashboard = () => {
  const { addToast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);

  useEffect(() => {
    fetchOperationsBookings();
  }, []);

  const fetchOperationsBookings = async () => {
    try {
      const res = await API.get('/bookings');
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error('Ops fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReassign = async (bookingId) => {
    try {
      // Reassign to demo provider Rahul Kumar or Sunil Rao
      const res = await API.put(`/bookings/${bookingId}/reassign`, {
        newProviderId: '66e600000000000000000002', // Sunil Rao
        reason: 'Reassigned by Operations Manager due to route optimization.',
      });
      if (res.success) {
        addToast('Job reassigned successfully by Operations Manager!', 'success');
        setReassignModalOpen(false);
        fetchOperationsBookings();
      }
    } catch (err) {
      addToast(err.message || 'Reassignment failed.', 'error');
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 p-4 pb-24 sm:p-10 lg:pb-10 space-y-8 max-w-7xl overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase">
              Operations Control Center
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Live Booking Operations</h1>
            <p className="text-xs text-slate-500">Monitor active field technician dispatch, delays, and reassignments.</p>
          </div>

          <button
            onClick={fetchOperationsBookings}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 shadow-sm flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Live Queue</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
            <p className="text-xs text-slate-400 font-bold uppercase">Active Field Jobs</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">12</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
            <p className="text-xs text-slate-400 font-bold uppercase">Pending Dispatch</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">3</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
            <p className="text-xs text-slate-400 font-bold uppercase">On-Time Completion Rate</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">98.4%</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
            <p className="text-xs text-slate-400 font-bold uppercase">Delayed Alerts</p>
            <p className="text-2xl font-extrabold text-rose-600 mt-1">0</p>
          </div>
        </div>

        {/* OPERATIONS MONITORING TABLE */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900">Live Booking Monitor Table</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-3">Booking</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Scheduled Time</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ops Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900 text-xs">{b.bookingNumber}</td>
                    <td className="p-3 font-bold text-slate-900">{b.customerId?.name || 'Pavani Reddy'}</td>
                    <td className="p-3">{b.serviceCategory}</td>
                    <td className="p-3 font-semibold text-slate-800">{b.providerId?.name || 'Rahul Kumar'}</td>
                    <td className="p-3 text-xs">{b.schedule?.displaySlot}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-100 text-brand-800">
                        {b.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleReassign(b._id)}
                        className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                      >
                        Reassign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OperationsDashboard;
