import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Download, CreditCard, CheckCircle2, FileText, ArrowLeft } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

const InvoicePage = () => {
  const { id } = useParams();
  const { addToast } = useToast();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await API.get(`/invoices/${id}`);
        if (res.success) {
          setInvoice(res.data);
        }
      } catch (err) {
        addToast(err.message || 'Invoice loading failed.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const handleMockPay = async () => {
    setPaying(true);
    try {
      const res = await API.put(`/invoices/${id}/pay`, { paymentMethod: 'UPI / Card Online' });
      if (res.success) {
        setInvoice(res.data);
        addToast('Payment of Rs. ' + res.data.totalAmount + ' received successfully!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Payment failed.', 'error');
    } finally {
      setPaying(false);
    }
  };

  const handlePrintDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex bg-slate-50 min-h-screen font-sans">
        <Sidebar />
        <main className="flex-1 p-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
        </main>
      </div>
    );
  }

  if (!invoice) return null;

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 p-4 pb-24 sm:p-10 lg:pb-10 space-y-8 max-w-4xl overflow-x-hidden">
        <div className="flex items-center justify-between">
          <Link to="/customer/dashboard" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrintDownload}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 font-bold text-xs text-slate-700 shadow-sm transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Invoice</span>
            </button>

            {invoice.paymentStatus !== 'PAID' && (
              <button
                onClick={handleMockPay}
                disabled={paying}
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>{paying ? 'Processing...' : 'Pay Now (Rs. ' + invoice.totalAmount + ')'}</span>
              </button>
            )}
          </div>
        </div>

        {/* INVOICE CARD */}
        <div id="invoice-printable" className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">CareConnect</h1>
                <p className="text-xs text-slate-400">Home Services Platform Inc.</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-400">INVOICE #{invoice.invoiceNumber}</span>
              <p className="text-xs text-slate-500 mt-1">Date: {invoice.date}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-extrabold ${
                  invoice.paymentStatus === 'PAID'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                STATUS: {invoice.paymentStatus}
              </span>
            </div>
          </div>

          {/* Party Details */}
          <div className="grid grid-cols-2 gap-6 text-xs text-slate-600">
            <div>
              <p className="font-bold uppercase text-slate-400 mb-1">Billed To (Customer):</p>
              <p className="font-bold text-slate-900 text-sm">{invoice.customerId?.name || 'Pavani Reddy'}</p>
              <p>{invoice.customerId?.email}</p>
              <p>{invoice.customerId?.phone}</p>
            </div>
            <div>
              <p className="font-bold uppercase text-slate-400 mb-1">Service Provider:</p>
              <p className="font-bold text-slate-900 text-sm">{invoice.providerId?.name || 'Rahul Kumar'}</p>
              <p>Verified Professional</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 font-bold uppercase text-slate-400">
                <tr>
                  <th className="p-3">Service Item Description</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {(invoice.items || []).map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-medium">{item.description}</td>
                    <td className="p-3 text-right font-bold text-slate-900">Rs. {item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown */}
          <div className="flex justify-end pt-4">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Service Cost:</span>
                <span className="font-bold">Rs. {invoice.baseServiceCost}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Platform Fee:</span>
                <span className="font-bold">Rs. {invoice.platformFee}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxes & GST (0% Promo):</span>
                <span className="font-bold">Rs. 0</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-brand-700">Rs. {invoice.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvoicePage;
