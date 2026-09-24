import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Sparkles, CheckCircle2, Clock, ArrowRight, DollarSign } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import NotificationHeader from '../../components/NotificationHeader';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

const CustomerRequestsPage = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get('/requests');
      if (res.success) {
        setRequests(res.data);
        if (res.data.length > 0) {
          inspectRequestQuotes(res.data[0]._id);
        }
      }
    } catch (err) {
      console.error('Fetch requests error:', err);
    } finally {
      setLoading(false);
    }
  };

  const inspectRequestQuotes = async (requestId) => {
    try {
      const res = await API.get(`/requests/${requestId}`);
      if (res.success) {
        setSelectedRequest(res.data.request);
        setQuotes(res.data.quotes || []);
      }
    } catch (err) {
      console.error('Fetch quotes error:', err);
    }
  };

  const handleAcceptQuote = async (quoteId) => {
    try {
      const res = await API.put(`/quotes/${quoteId}/accept`);
      if (res.success) {
        addToast('Quote accepted! Booking created successfully.', 'success');
        navigate(`/customer/track/${res.data.booking._id}`);
      }
    } catch (err) {
      addToast(err.message || 'Failed to accept quote.', 'error');
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <NotificationHeader
          title="Service Requests & Provider Quotes"
          subtitle="Track requests and compare verified provider bids in real-time"
        />

        <main className="p-4 pb-24 sm:p-10 lg:pb-10 space-y-8 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">My Service Requests & Quotes</h1>
            <p className="text-xs text-slate-500">Track your submitted requests and compare incoming quotes from verified providers.</p>
          </div>

          <Link
            to="/ai-request"
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>New AI Request</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Requests List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Your Requests</h2>

            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req._id}
                  onClick={() => inspectRequestQuotes(req._id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedRequest?._id === req._id
                      ? 'bg-brand-50/80 border-brand-500 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-sm">{req.categoryName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 text-brand-800">
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{req.description}</p>
                  <p className="text-[10px] text-slate-400 mt-2">{req.preferredDate} - {req.preferredTimeSlot}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quotes Comparison View */}
          <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Received Quotes for {selectedRequest?.categoryName || 'Request'}
                </h3>
                <p className="text-xs text-slate-500">Compare provider pricing, warranty, and match scores</p>
              </div>
            </div>

            {quotes.length > 0 ? (
              <div className="space-y-4">
                {quotes.map((q) => (
                  <div key={q._id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-extrabold text-slate-900 text-base">
                          {q.providerId?.name || 'Rahul Kumar'}
                        </span>
                        <p className="text-xs text-slate-500">{q.message}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-extrabold text-slate-900">Rs. {q.price}</p>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {q.aiMatchScore || 94}% AI Match
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                      <span>Est. Duration: {q.estimatedDuration}</span>
                      <span>Warranty: {q.warrantyDays || 30} Days</span>
                      <button
                        onClick={() => handleAcceptQuote(q._id)}
                        className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md transition-all"
                      >
                        Accept Quote & Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                No quotes submitted for this request yet. Our AI is notifying matching providers.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  </div>
);
};

export default CustomerRequestsPage;


