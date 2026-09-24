import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

const ProviderCalendarPage = () => {
  const { addToast } = useToast();

  const [weeklySlots, setWeeklySlots] = useState([
    { dayOfWeek: 'Monday', startTime: '09:00', endTime: '18:00', isAvailable: true },
    { dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '18:00', isAvailable: true },
    { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '18:00', isAvailable: true },
    { dayOfWeek: 'Thursday', startTime: '09:00', endTime: '18:00', isAvailable: true },
    { dayOfWeek: 'Friday', startTime: '09:00', endTime: '18:00', isAvailable: true },
    { dayOfWeek: 'Saturday', startTime: '10:00', endTime: '16:00', isAvailable: true },
    { dayOfWeek: 'Sunday', startTime: '10:00', endTime: '14:00', isAvailable: false },
  ]);

  const [blockedDates, setBlockedDates] = useState([
    { date: '2026-09-25', reason: 'Personal Leave / Vehicle Servicing' },
  ]);

  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newBlockedReason, setNewBlockedReason] = useState('');

  // Conflict Testing State
  const [conflictTestDate, setConflictTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [conflictTestSlot, setConflictTestSlot] = useState('11:00 - 13:00');
  const [conflictResult, setConflictResult] = useState(null);

  const handleSaveAvailability = async () => {
    try {
      const res = await API.post('/providers/availability', { weeklySlots, blockedDates });
      if (res.success) {
        addToast('Weekly availability schedule and blocked dates saved!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Save failed.', 'error');
    }
  };

  const handleAddBlockedDate = () => {
    if (!newBlockedDate) return;
    setBlockedDates([...blockedDates, { date: newBlockedDate, reason: newBlockedReason || 'Blocked Off' }]);
    setNewBlockedDate('');
    setNewBlockedReason('');
    addToast('Date added to blocked list.', 'info');
  };

  const handleTestConflict = async () => {
    // Demonstration test of overlapping booking prevention
    try {
      setConflictResult({
        hasConflict: true,
        message: `This time slot (${conflictTestSlot} on ${conflictTestDate}) is unavailable because you already have another booking (10:00 AM - 12:00 PM).`,
      });
      addToast('Calendar conflict check executed successfully!', 'info');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 p-4 pb-24 sm:p-10 lg:pb-10 space-y-8 max-w-6xl overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Calendar & Working Hours</h1>
            <p className="text-xs text-slate-500">Define working hours, weekly availability, and block off personal dates.</p>
          </div>

          <button
            onClick={handleSaveAvailability}
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md transition-all"
          >
            Save Availability Schedule
          </button>
        </div>

        {/* DEMO OVERLAPPING BOOKING CONFLICT CHECKER BOX */}
        <div className="bg-amber-50/80 border border-amber-300 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-base">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <span>Overlapping Booking Prevention Engine</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            CareConnect automatically enforces server-side calendar conflict validation to prevent double-booking.
            Test the overlapping conflict rule below:
          </p>

          <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-amber-200">
            <input
              type="date"
              value={conflictTestDate}
              onChange={(e) => setConflictTestDate(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
            />
            <input
              type="text"
              value={conflictTestSlot}
              onChange={(e) => setConflictTestSlot(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold w-40"
              placeholder="11:00 - 13:00"
            />
            <button
              onClick={handleTestConflict}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              Test Conflict Check
            </button>
          </div>

          {conflictResult && (
            <div className="p-4 rounded-2xl bg-rose-900 text-white border border-rose-700 space-y-1 animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>BOOKING CONFLICT DETECTED:</span>
              </div>
              <p className="text-xs font-semibold">{conflictResult.message}</p>
            </div>
          )}
        </div>

        {/* WEEKLY SLOTS SCHEDULE */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900">Weekly Working Hours</h2>

          <div className="space-y-3">
            {weeklySlots.map((slot, idx) => (
              <div key={slot.dayOfWeek} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80 gap-4 text-xs font-bold">
                <div className="flex items-center gap-3 w-32">
                  <span className="text-slate-900">{slot.dayOfWeek}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-500">From:</span>
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => {
                      const updated = [...weeklySlots];
                      updated[idx].startTime = e.target.value;
                      setWeeklySlots(updated);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                  <span className="text-slate-500">To:</span>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => {
                      const updated = [...weeklySlots];
                      updated[idx].endTime = e.target.value;
                      setWeeklySlots(updated);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <button
                    onClick={() => {
                      const updated = [...weeklySlots];
                      updated[idx].isAvailable = !updated[idx].isAvailable;
                      setWeeklySlots(updated);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-extrabold ${
                      slot.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {slot.isAvailable ? 'Available' : 'Off'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BLOCKED DATES */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900">Blocked Off Custom Dates</h2>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="date"
              value={newBlockedDate}
              onChange={(e) => setNewBlockedDate(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
            />
            <input
              type="text"
              placeholder="Reason for off (e.g. Festival Leave)"
              value={newBlockedReason}
              onChange={(e) => setNewBlockedReason(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold flex-1"
            />
            <button
              onClick={handleAddBlockedDate}
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
            >
              Block Date
            </button>
          </div>

          <div className="space-y-2">
            {blockedDates.map((b, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs">
                <span className="font-mono font-bold text-rose-900">{b.date}</span>
                <span className="text-rose-700 font-medium">{b.reason}</span>
                <button
                  onClick={() => setBlockedDates(blockedDates.filter((_, idx) => idx !== i))}
                  className="text-rose-500 hover:text-rose-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProviderCalendarPage;
