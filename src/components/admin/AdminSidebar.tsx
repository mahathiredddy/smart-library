import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  Users,
  CheckCircle,
  FileBarChart,
  UserCheck,
  ArrowLeft,
  Shield,
  Plus,
  LogOut,
  Database,
} from 'lucide-react';
import { useAuth } from '../../services/authContext';
import { Modal } from '../Modal';

interface AdminSidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenAddBookModal?: () => void;
  onOpenSupabaseModal?: () => void;
  stats?: {
    totalBooks: number;
    totalCategories: number;
    totalUsers: number;
    unavailableBooks: number;
  };
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onNavigate,
  onOpenAddBookModal,
  onOpenSupabaseModal,
  stats,
}) => {
  const { currentUser, logout } = useAuth();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const navItems = [
    {
      id: 'admin-dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: 'admin-books',
      label: 'Books',
      icon: BookOpen,
      badge: stats ? stats.totalBooks : undefined,
    },
    {
      id: 'add-book-action',
      label: 'Add Book',
      icon: Plus,
      isAction: true,
      onClick: () => {
        if (onOpenAddBookModal) {
          onOpenAddBookModal();
        } else {
          onNavigate('admin-books');
        }
      },
    },
    {
      id: 'admin-categories',
      label: 'Categories',
      icon: FolderTree,
      badge: stats ? stats.totalCategories : undefined,
    },
    {
      id: 'admin-users',
      label: 'Users',
      icon: Users,
      badge: stats ? stats.totalUsers : undefined,
    },
    {
      id: 'admin-availability',
      label: 'Availability',
      icon: CheckCircle,
      badge: stats && stats.unavailableBooks > 0 ? `${stats.unavailableBooks} held` : undefined,
    },
    {
      id: 'admin-reports',
      label: 'Reports',
      icon: FileBarChart,
      badge: 'Audit',
    },
    {
      id: 'admin-profile',
      label: 'Profile',
      icon: UserCheck,
      badge: undefined,
    },
  ];

  const handleConfirmLogout = () => {
    logout();
    setLogoutModalOpen(false);
    onNavigate('home');
  };

  return (
    <>
      <aside className="w-full lg:w-72 bg-white border border-stone-200/90 rounded-2xl p-5 flex flex-col justify-between shrink-0 shadow-xs">
        <div className="space-y-6">
          {/* Admin Header with Live System Status */}
          <div className="p-3.5 bg-gradient-to-b from-[#f9f8f4] to-stone-50 rounded-xl border border-stone-200/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-stone-900 text-amber-200 flex items-center justify-center shadow-xs">
                  <Shield className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-900 font-mono">
                  CURATOR CONSOLE
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-available" />
                LIVE
              </span>
            </div>

            <p className="text-xs font-bold text-stone-900 truncate">
              {currentUser?.name || 'Administrator Elena Vance'}
            </p>
            <p className="text-[11px] text-stone-500 font-mono truncate mt-0.5">
              {currentUser?.email || 'admin@ebooklibrary.org'}
            </p>
          </div>

          {/* Navigation list */}
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono px-3 mb-2">
              ADMINISTRATION
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;

                if (item.isAction) {
                  return (
                    <button
                      key={item.id}
                      onClick={item.onClick}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-amber-950 bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/70 transition-all active:scale-[0.98] group my-1.5"
                    >
                      <div className="flex items-center gap-3">
                        <Plus className="w-4 h-4 text-amber-800 group-hover:scale-110 transition-transform" />
                        <span className="font-bold tracking-tight">{item.label}</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-amber-200/70 text-amber-950 px-1.5 py-0.5 rounded">
                        NEW
                      </span>
                    </button>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-[0.98] ${
                      isActive
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-amber-300' : 'text-stone-400'}`} />
                      <span className="tracking-tight">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                          isActive
                            ? 'bg-stone-800 text-amber-200'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Return to Public Catalog action & Logout */}
        <div className="pt-5 border-t border-stone-100 mt-6 space-y-2">
          {onOpenSupabaseModal && (
            <button
              onClick={onOpenSupabaseModal}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200/80 transition-colors shadow-2xs active:scale-[0.98]"
            >
              <Database className="w-3.5 h-3.5 text-emerald-700" />
              <span>Database & Supabase SQL</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200/90 hover:text-stone-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit to Public Catalog</span>
          </button>

          <button
            onClick={() => setLogoutModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50/70 hover:bg-rose-100 hover:text-rose-900 border border-rose-200/60 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span>Curator Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      {logoutModalOpen && (
        <Modal
          isOpen={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          title="Sign Out of Librarian Panel"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you wish to end your current curator administrative session? You will need to sign in again to modify catalog volumes or access reports.
            </p>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setLogoutModalOpen(false)}
                className="py-2 px-3.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="py-2 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-2xs"
              >
                Sign Out
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
