import React, { useState, useEffect } from 'react';
import { FileCheck, CheckCircle2, XCircle, AlertCircle, Eye, ExternalLink } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

const ProviderVerificationPage = () => {
  const { addToast } = useToast();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await API.get('/providers?verificationStatus=PENDING');
      if (res.success) {
        setProviders(res.data);
      }
    } catch (err) {
      console.error('Fetch providers error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAction = async (providerId, status) => {
    try {
      const res = await API.put(`/providers/${providerId}/verify`, {
        verificationStatus: status,
        verificationNotes: `Verification status set to ${status} by Platform Admin.`,
      });
      if (res.success) {
        addToast(`Provider status set to ${status}!`, 'success');
        fetchProviders();
        setSelectedProvider(null);
      }
    } catch (err) {
      addToast(err.message || 'Verification update failed.', 'error');
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 p-4 pb-24 sm:p-10 lg:pb-10 space-y-8 max-w-7xl overflow-x-hidden">
        {/* Header */}
        <div>
          <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold uppercase">
            Admin Verification Queue
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Provider Document Verification</h1>
          <p className="text-xs text-slate-500">Review government IDs, skill certifications, address proof, and experience certificates.</p>
        </div>

        {/* PROVIDER VERIFICATION QUEUE TABLE */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900">Pending Verification Queue</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-3">Applicant Name</th>
                  <th className="p-3">Title & Skills</th>
                  <th className="p-3">Experience</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Review Documents</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {providers.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-900">{p.userId?.name || 'Santosh Hegde'}</td>
                    <td className="p-3 text-xs">{p.title || 'Home Technician'}</td>
                    <td className="p-3 text-xs font-bold">{p.experienceYears || 3} Years</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {p.verificationStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedProvider(p)}
                        className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Docs</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DOCUMENT INSPECTION MODAL */}
        {selectedProvider && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Verify Applicant: {selectedProvider.userId?.name || 'Santosh Hegde'}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedProvider.title}</p>
                </div>
                <button onClick={() => setSelectedProvider(null)} className="text-slate-400 font-bold hover:text-slate-900">
                  X
                </button>
              </div>

              {/* Uploaded Documents Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block">Government ID</span>
                  <img
                    src={selectedProvider.documents?.governmentId || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'}
                    alt="Government ID"
                    className="w-full h-32 object-cover rounded-xl border"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block">Skill Certificate</span>
                  <img
                    src={selectedProvider.documents?.skillCertificate || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80'}
                    alt="Skill Certificate"
                    className="w-full h-32 object-cover rounded-xl border"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block">Address Proof</span>
                  <img
                    src={selectedProvider.documents?.addressProof || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80'}
                    alt="Address Proof"
                    className="w-full h-32 object-cover rounded-xl border"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block">Experience Certificate</span>
                  <img
                    src={selectedProvider.documents?.experienceCertificate || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80'}
                    alt="Experience Certificate"
                    className="w-full h-32 object-cover rounded-xl border"
                  />
                </div>
              </div>

              {/* Verification Decision Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => handleVerifyAction(selectedProvider._id, 'REJECTED')}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                >
                  Reject Application
                </button>
                <button
                  onClick={() => handleVerifyAction(selectedProvider._id, 'VERIFIED')}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Set Verified</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProviderVerificationPage;
