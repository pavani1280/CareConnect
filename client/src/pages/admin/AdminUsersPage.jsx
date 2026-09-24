import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, UserCheck, UserX, Search } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminUsersPage = () => {
  const { addToast } = useToast();

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 p-4 pb-24 sm:p-10 lg:pb-10 space-y-8 max-w-7xl overflow-x-hidden">
        <div>
          <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold uppercase">
            Platform User Management
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">User Directory</h1>
          <p className="text-xs text-slate-500">Manage all registered Customers, Providers, Ops Managers, Support Agents, and Admins.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl w-72">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search users by name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-xs focus:outline-none"
              />
            </div>
            <span className="text-xs font-bold text-slate-500">Total Users: {filteredUsers.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-3">User Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3 text-xs">{u.email}</td>
                    <td className="p-3 font-bold text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-brand-100 text-brand-800">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-xs">{u.phone || '9876543210'}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {u.status || 'ACTIVE'}
                      </span>
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

export default AdminUsersPage;
