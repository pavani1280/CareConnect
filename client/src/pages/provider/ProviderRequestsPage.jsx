import React, { useState, useEffect } from 'react';
import { FileText, Send, Sparkles, CheckCircle2, Clock, MapPin } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

const ProviderRequestsPage = () => {
  const { addToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);

  const [quotePrice, setQuotePrice] = useState('499');
  const [quoteDuration, setQuoteDuration] = useState('1-2 hours');
  const [quoteMessage, setQuoteMessage] = useState('Verified professional ready to service your home with 30-day warranty.');

  useEffect(() => {
    fetchOpenRequests();
  }, []);

  const fetchOpenRequests = async () => {
    try {
      const res = await API.get('/requests');
      if (res.success) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error('Fetch open requests error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuote = async (e) => {
    e.preventDefault();
    if (!selectedReq) return;

    try {
      const res = await API.post('/quotes', {
        requestId: selectedReq._id,
        price: Number(quotePrice),
        estimatedDuration: quoteDuration,
        message: quoteMessage,
        warrantyDays: 30,
      });

      if (res.success) {
        addToast('Quote submitted successfully to customer!', 'success');
        setSelectedReq(null);
        fetchOpenRequests();
      }
    } catch (err) {
      addToast(err.message || 'Quote submission failed.', 'error');
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 p-4 pb-24 sm:p-10 lg:pb-10 space-y-8 max-w-7xl overflow-x-hidden">
        <div>
          <span className="px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase">
            Provider Job Opportunities
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Open Customer Service Requests</h1>
          <p className="text-xs text-slate-500">Review AI-matched customer requests and submit custom quotes.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900">Available Marketplace Requests</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((req) => (
              <div key={req._id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-base">{req.categoryName}</span>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold">
                    Urgency: {req.aiAnalysis?.urgency || 'Medium'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium bg-white p-3 rounded-xl border border-slate-200">
                  "{req.description}"
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-600" />
                    {req.location?.address || 'Indiranagar'}
                  </span>
                  <span>Schedule: {req.preferredDate}</span>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setSelectedReq(req)}
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Quote</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUOTE SUBMISSION MODAL */}
        {selectedReq && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">
                  Submit Quote for {selectedReq.categoryName}
                </h3>
                <button onClick={() => setSelectedReq(null)} className="text-slate-400 font-bold hover:text-slate-900">
                  X
                </button>
              </div>

              <form onSubmit={handleSendQuote} className="space-y-4 text-xs font-bold text-slate-700">
                <div className="space-y-1">
                  <label>Offered Service Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none text-sm font-extrabold"
                  />
                </div>

                <div className="space-y-1">
                  <label>Estimated Duration</label>
                  <input
                    type="text"
                    required
                    value={quoteDuration}
                    onChange={(e) => setQuoteDuration(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label>Message to Customer</label>
                  <textarea
                    rows={3}
                    value={quoteMessage}
                    onChange={(e) => setQuoteMessage(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none font-medium text-slate-900 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Quote to Customer</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProviderRequestsPage;
