import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/authContext';
import {
  BookOpen,
  User as UserIcon,
  LogOut,
  Shield,
  Menu,
  X,
  Heart,
  Clock,
  Search,
  ChevronDown,
  Sparkles,
  Bookmark,
  LayoutDashboard,
  Compass,
  Database,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
  onOpenSupabaseModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenSupabaseModal,
}) => {
  const { currentUser, isAuthenticated, isAdmin, logout, quickDemoLogin } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#user-nav-dropdown')) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [userDropdownOpen]);

  const handleNav = (tab: string, param?: string) => {
    onNavigate(tab, param);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'browse', label: 'Browse Catalog' },
    { id: 'categories', label: 'Disciplines' },
    ...(isAuthenticated
      ? [
          { id: 'user-dashboard', label: 'My Library' },
          { id: 'favorites', label: 'Favorites' },
          { id: 'reading-history', label: 'History' },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand title wordmark */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 text-left group shrink-0 focus-visible:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-amber-200 flex items-center justify-center font-serif-display font-bold text-base group-hover:bg-amber-950 transition-colors shadow-xs">
              <BookOpen className="w-4.5 h-4.5 text-amber-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-display text-xl font-bold tracking-tight text-stone-900 group-hover:text-amber-950 transition-colors whitespace-nowrap">
                E-Book Library
              </span>
              <span className="hidden sm:block text-[9px] font-mono tracking-widest uppercase text-stone-600 -mt-0.5">
                Scholarly Repository
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-xs font-semibold tracking-wide text-stone-600">
            {navLinks.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`relative py-1.5 px-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'text-stone-950 font-bold bg-stone-100'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-stone-900 rounded-full" />
                  )}
                </button>
              );
            })}

            {isAdmin && (
              <button
                onClick={() => handleNav('admin-dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  currentTab.startsWith('admin')
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/90'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>Admin Console</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Fast Search & User Profile actions */}
          <div className="flex items-center gap-2.5">
            {/* Supabase Database Config & SQL Trigger */}
            {onOpenSupabaseModal && (
              <button
                onClick={onOpenSupabaseModal}
                className="hidden sm:flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl border border-stone-200/90 bg-stone-50 hover:bg-stone-100/90 text-stone-700 hover:text-stone-900 transition-all text-xs font-semibold shadow-2xs active:scale-[0.98]"
                title="Supabase Database Configuration & SQL Schema"
              >
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-mono text-[11px]">Database</span>
              </button>
            )}

            {/* Quick search button */}
            <button
              onClick={() => handleNav('browse')}
              className="hidden sm:flex items-center gap-2 py-1.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200/80 text-xs text-stone-600 hover:text-stone-900 transition-all shadow-2xs"
              title="Search catalog"
            >
              <Search className="w-3.5 h-3.5 text-stone-600" />
              <span className="font-medium">Search catalog...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white rounded border border-stone-200 text-stone-600 shadow-2xs">
                /
              </kbd>
            </button>

            {isAuthenticated ? (
              <div className="relative" id="user-nav-dropdown">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2.5 pr-2 rounded-full border border-stone-200/90 bg-white hover:border-stone-400 hover:shadow-xs transition-all text-stone-800 text-xs font-semibold"
                  aria-expanded={userDropdownOpen}
                >
                  <span className="truncate max-w-[110px] hidden sm:inline">{currentUser?.name}</span>
                  <div className="relative w-7 h-7 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center font-bold text-xs shadow-xs">
                    {currentUser?.name?.charAt(0) || 'U'}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3 border-b border-stone-100 bg-stone-50/70 rounded-t-2xl">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {currentUser?.name}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate font-mono mt-0.5">
                        {currentUser?.email}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded font-mono ${
                            isAdmin
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {isAdmin ? 'Librarian Admin' : 'Scholar Patron'}
                        </span>
                      </div>
                    </div>

                    <div className="py-1 text-xs text-stone-700">
                      <button
                        onClick={() => handleNav('user-dashboard')}
                        className="w-full text-left px-4 py-2 hover:bg-stone-100 flex items-center gap-2.5 font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4 text-stone-400" />
                        <span>My Reading Dashboard</span>
                      </button>

                      <button
                        onClick={() => handleNav('favorites')}
                        className="w-full text-left px-4 py-2 hover:bg-stone-100 flex items-center gap-2.5 font-medium"
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>Saved Favorites</span>
                      </button>

                      <button
                        onClick={() => handleNav('reading-history')}
                        className="w-full text-left px-4 py-2 hover:bg-stone-100 flex items-center gap-2.5 font-medium"
                      >
                        <Clock className="w-4 h-4 text-stone-400" />
                        <span>Reading History</span>
                      </button>

                      <button
                        onClick={() => handleNav('user-profile')}
                        className="w-full text-left px-4 py-2 hover:bg-stone-100 flex items-center gap-2.5 font-medium"
                      >
                        <UserIcon className="w-4 h-4 text-stone-400" />
                        <span>Patron Profile</span>
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => handleNav('admin-dashboard')}
                          className="w-full text-left px-4 py-2 hover:bg-amber-50 text-amber-950 flex items-center gap-2.5 font-bold border-t border-b border-stone-100 my-1"
                        >
                          <Shield className="w-4 h-4 text-amber-700" />
                          <span>Librarian Admin Console</span>
                        </button>
                      )}
                    </div>

                    {/* Quick Demo Switcher */}
                    <div className="px-3 py-2 bg-stone-50 border-t border-stone-100 mt-1">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold mb-1.5">
                        DEMO ROLE SWITCHER
                      </p>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            quickDemoLogin('admin');
                            setUserDropdownOpen(false);
                            handleNav('admin-dashboard');
                          }}
                          className={`flex-1 py-1 text-[11px] rounded font-semibold transition-all ${
                            isAdmin
                              ? 'bg-amber-900 text-white'
                              : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          Admin (Elena)
                        </button>
                        <button
                          onClick={() => {
                            quickDemoLogin('user');
                            setUserDropdownOpen(false);
                            handleNav('user-dashboard');
                          }}
                          className={`flex-1 py-1 text-[11px] rounded font-semibold transition-all ${
                            !isAdmin
                              ? 'bg-stone-900 text-white'
                              : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          User (Sarah)
                        </button>
                      </div>
                    </div>

                    <div className="pt-1 border-t border-stone-100">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          handleNav('home');
                        }}
                        className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-medium text-xs"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="py-1.5 px-3.5 rounded-xl text-xs font-semibold text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="py-1.5 px-3.5 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 transition-all shadow-xs"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`text-left py-2 px-3 rounded-xl text-xs font-semibold ${
                  currentTab === item.id
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {item.label}
              </button>
            ))}

            {isAdmin && (
              <button
                onClick={() => handleNav('admin-dashboard')}
                className="text-left py-2 px-3 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-amber-700" />
                <span>Admin Console</span>
              </button>
            )}

            {onOpenSupabaseModal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSupabaseModal();
                }}
                className="text-left py-2 px-3 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-2"
              >
                <Database className="w-4 h-4 text-emerald-700" />
                <span>Supabase Database & SQL</span>
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNav('login')}
                  className="flex-1 py-2 text-center text-xs font-semibold text-stone-800 border border-stone-200 rounded-xl hover:bg-stone-50"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="flex-1 py-2 text-center text-xs font-bold text-white bg-stone-900 rounded-xl hover:bg-stone-800"
                >
                  Register
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-center text-xs font-semibold text-rose-600 bg-rose-50 rounded-xl"
              >
                Sign Out ({currentUser?.name})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
