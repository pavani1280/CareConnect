import React, { useState, useEffect } from 'react';
import { LifeBuoy, AlertTriangle, CheckCircle2, MessageSquare, DollarSign, ShieldAlert } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

const SupportDashboard = () => {
  const { addToast } = useToast();

  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState(null);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const res = await API.get('/disputes');
      if (res.success) {
        setDisputes(res.data);
      }
    } catch (err) {
      console.error('Fetch disputes error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveDispute = async (disputeId, status, refundAmount) => {
    try {
      const res = await API.put(`/disputes/${disputeId}`, {
        status,
        resolution: `Resolved by Support Agent. Refund set to Rs. ${refundAmount}`,
        refundAmount,
        message: `Ticket updated to ${status}. Refund of Rs. ${refundAmount} processed.`,
      });
      if (res.success) {
        addToast(`Ticket updated to ${status}. Refund: Rs. ${refundAmount}`, 'success');
        fetchDisputes();
        setSelectedDispute(null);
      }
    } catch (err) {
      addToast(err.message || 'Dispute update failed.', 'error');
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 p-4 pb-24 sm:p-10 lg:pb-10 space-y-8 max-w-7xl overflow-x-hidden">
        {/* Header */}
        <div>
          <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase">
            Support & Resolution Center
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Ticket Queue & Complaints</h1>
          <p className="text-xs text-slate-500">Review customer complaints, evidence, and process refund decisions.</p>
        </div>

        {/* TICKET LIST TABLE */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900">Active Support Queue</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-3">Ticket ID</th>
                  <th className="p-3">Raised By</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Review & Resolve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {disputes.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900 text-xs">{d.ticketNumber}</td>
                    <td className="p-3 font-bold text-slate-900">{d.raisedBy?.name || 'Customer'}</td>
                    <td className="p-3 text-xs max-w-xs truncate">{d.reason}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {d.priority}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                        {d.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedDispute(d)}
                        className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                      >
                        Inspect Evidence
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DISPUTE RESOLUTION INSPECTION MODAL */}
        {selectedDispute && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <span>Inspect Dispute Ticket #{selectedDispute.ticketNumber}</span>
                </div>
                <button onClick={() => setSelectedDispute(null)} className="text-slate-400 font-bold hover:text-slate-900">
                  X
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <p>
                  <strong className="text-slate-900">Raised By:</strong> {selectedDispute.raisedBy?.name} ({selectedDispute.raisedBy?.email})
                </p>
                <p>
                  <strong className="text-slate-900">Complaint Reason:</strong> {selectedDispute.reason}
                </p>
              </div>

              {/* Resolution Action Buttons */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <p className="text-xs font-bold text-slate-900">Support Decision Action:</p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleResolveDispute(selectedDispute._id, 'RESOLVED', 548)}
                    className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    Full Refund (Rs. 548)
                  </button>
                  <button
                    onClick={() => handleResolveDispute(selectedDispute._id, 'RESOLVED', 250)}
                    className="py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                  >
                    Partial Refund (Rs. 250)
                  </button>
                  <button
                    onClick={() => handleResolveDispute(selectedDispute._id, 'REJECTED', 0)}
                    className="py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                  >
                    Reject Dispute
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SupportDashboard;
