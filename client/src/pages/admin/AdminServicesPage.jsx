import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit, CheckCircle2, Wrench, Droplets, Zap, Sparkles } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminServicesPage = () => {
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('499');
  const [skills, setSkills] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/services');
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Fetch categories error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = skills.split(',').map((s) => s.trim());
      const res = await API.post('/services', {
        name,
        description,
        basePrice: Number(basePrice),
        skillsRequired: skillsArray,
        popular: true,
      });

      if (res.success) {
        addToast(`Category "${name}" created successfully!`, 'success');
        setModalOpen(false);
        setName('');
        setDescription('');
        fetchCategories();
      }
    } catch (err) {
      addToast(err.message || 'Category creation failed.', 'error');
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 p-4 pb-24 sm:p-10 lg:pb-10 space-y-8 max-w-7xl overflow-x-hidden">
        <div className="flex items-center justify-between">
          <div>
            <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold uppercase">
              Category & Pricing Rules
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Service Categories Catalog</h1>
            <p className="text-xs text-slate-500">Add, edit, or configure base pricing for home services offered on CareConnect.</p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900">Active Service Categories</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat._id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-base">{cat.name}</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Base: Rs. {cat.basePrice}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">{cat.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(cat.skillsRequired || []).map((sk) => (
                    <span key={sk} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-semibold text-slate-600">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ADD CATEGORY MODAL */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">Create Service Category</h3>
                <button onClick={() => setModalOpen(false)} className="text-slate-400 font-bold hover:text-slate-900">
                  X
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-4 text-xs font-bold text-slate-700">
                <div className="space-y-1">
                  <label>Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Solar Panel Maintenance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label>Base Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label>Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Service scope description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none font-medium text-slate-900 resize-none"
                  ></textarea>
                </div>

                <div className="space-y-1">
                  <label>Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Solar Technician, Electrical Check"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md transition-all"
                >
                  Create Category
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminServicesPage;
