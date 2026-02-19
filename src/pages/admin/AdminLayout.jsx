import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Trophy, LayoutDashboard, CalendarDays, Target, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <Trophy size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-none">Prime Season</p>
              <p className="text-xs text-slate-400 mt-0.5">Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <NavLink to="/admin" end className={navLinkClass}>
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>
          <NavLink to="/admin/semanas" className={navLinkClass}>
            <CalendarDays size={16} />
            Semanas
          </NavLink>
          <NavLink to="/admin/metas" className={navLinkClass}>
            <Target size={16} />
            Metas
          </NavLink>
        </nav>

        <div className="p-3 border-t border-slate-200">
          <p className="text-xs text-slate-400 mb-2 truncate px-1">{user?.email}</p>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 w-full rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
