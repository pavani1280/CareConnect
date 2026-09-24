import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, Clock, AlertTriangle, ChevronDown, LogOut, Sparkles, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const NotificationHeader = ({ title = 'Dashboard', subtitle = 'Manage your services and live status' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      if (res.success && res.data) {
        setNotifications(res.data);
        const unread = res.data.filter((n) => !n.read).length;
        setUnreadCount(unread > 0 ? unread : res.data.length);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-xs sticky top-0 z-30">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Quick AI Book Button */}
        <Link
          to="/ai-request"
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 font-bold text-xs hover:bg-brand-100 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-brand-600" />
          <span>Book Service</span>
        </Link>

        {/* NOTIFICATION BELL WITH DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setOpenNotifications(!openNotifications)}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors relative"
            aria-label="View Notifications"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center animate-pulse border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {openNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-brand-600" />
                  <span className="font-extrabold text-slate-900 text-sm">Notifications</span>
                  <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold">
                    {unreadCount} New
                  </span>
                </div>
                <button
                  onClick={() => setOpenNotifications(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => {
                        handleMarkAsRead(n._id);
                        if (n.link) {
                          setOpenNotifications(false);
                          navigate(n.link);
                        }
                      }}
                      className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${
                        !n.read ? 'bg-brand-50/40' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-brand-600" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-extrabold text-slate-900 text-xs truncate">{n.title}</p>
                        <p className="text-xs text-slate-600 leading-snug mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {new Date(n.createdAt || Date.now()).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400">No new notifications.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* USER PROFILE BADGE */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-800 text-white font-extrabold text-xs flex items-center justify-center">
                {user.name ? user.name.slice(0, 2).toUpperCase() : 'CC'}
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-3 w-52 rounded-2xl bg-white shadow-2xl border border-slate-200 py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="font-extrabold text-slate-900 truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setUserMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full text-left px-4 py-2.5 text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default NotificationHeader;
