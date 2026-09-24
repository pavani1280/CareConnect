import React, { useState } from 'react';
import { FileCheck, Upload, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

const ProviderDocumentsPage = () => {
  const { addToast } = useToast();

  const [docs, setDocs] = useState({
    governmentId: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    skillCertificate: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    addressProof: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    experienceCertificate: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
  });

  const [loading, setLoading] = useState(false);

  const handleSaveDocs = async () => {
    setLoading(true);
    try {
      const res = await API.put('/providers/profile', { documents: docs });
      if (res.success) {
        addToast('Verification documents submitted for Admin review!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Submission failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 p-4 pb-24 sm:p-10 lg:pb-10 space-y-8 max-w-6xl overflow-x-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Verification Documents</h1>
            <p className="text-xs text-slate-500">Upload official documents to earn your CareConnect Verified Professional badge.</p>
          </div>

          <button
            onClick={handleSaveDocs}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Submit for Admin Review</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900">Required Document Attachments</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-bold text-slate-900 text-xs block">1. Government Photo ID (Aadhaar / Passport / DL)</span>
              <img src={docs.governmentId} alt="Govt ID" className="w-full h-40 object-cover rounded-xl border" />
              <input
                type="text"
                value={docs.governmentId}
                onChange={(e) => setDocs({ ...docs, governmentId: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-bold text-slate-900 text-xs block">2. Skill & Trade Certificate (ITI / HVAC Cert)</span>
              <img src={docs.skillCertificate} alt="Skill Cert" className="w-full h-40 object-cover rounded-xl border" />
              <input
                type="text"
                value={docs.skillCertificate}
                onChange={(e) => setDocs({ ...docs, skillCertificate: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-bold text-slate-900 text-xs block">3. Address Proof</span>
              <img src={docs.addressProof} alt="Address Proof" className="w-full h-40 object-cover rounded-xl border" />
              <input
                type="text"
                value={docs.addressProof}
                onChange={(e) => setDocs({ ...docs, addressProof: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-bold text-slate-900 text-xs block">4. Work Experience Certificate</span>
              <img src={docs.experienceCertificate} alt="Experience Cert" className="w-full h-40 object-cover rounded-xl border" />
              <input
                type="text"
                value={docs.experienceCertificate}
                onChange={(e) => setDocs({ ...docs, experienceCertificate: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProviderDocumentsPage;
