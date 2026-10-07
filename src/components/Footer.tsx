import React from 'react';
import { BookOpen, Shield, Library } from 'lucide-react';
import { useAuth } from '../services/authContext';

interface FooterProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { quickDemoLogin } = useAuth();

  return (
    <footer className="bg-[#121316] text-stone-300 mt-24 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-stone-800 text-amber-300 flex items-center justify-center shadow-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-serif-display text-xl font-bold text-white tracking-wide">
                E-Book Library
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-normal">
              A scholarly digital repository and bibliographic management system designed for universities, academic institutions, and inquiring minds.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest font-mono mb-4">
              COLLECTION ACCESS
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('browse')}
                  className="hover:text-white transition-colors"
                >
                  All Catalog Volumes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('categories')}
                  className="hover:text-white transition-colors"
                >
                  Academic Disciplines
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('favorites')}
                  className="hover:text-white transition-colors"
                >
                  Saved Bookshelf
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('history')}
                  className="hover:text-white transition-colors"
                >
                  Reading Chronology
                </button>
              </li>
            </ul>
          </div>

          {/* Catalog Categories */}
          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest font-mono mb-4">
              RESEARCH FIELDS
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('browse', 'category:cat-cs')}
                  className="hover:text-white transition-colors"
                >
                  Computer Science & AI
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('browse', 'category:cat-lit')}
                  className="hover:text-white transition-colors"
                >
                  Classical World Prose
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('browse', 'category:cat-arch')}
                  className="hover:text-white transition-colors"
                >
                  Design & Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('browse', 'category:cat-phil')}
                  className="hover:text-white transition-colors"
                >
                  Stoic & Moral Philosophy
                </button>
              </li>
            </ul>
          </div>

          {/* System Control Demos */}
          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest font-mono mb-4">
              CONSOLE ACCESS
            </h4>
            <p className="text-xs text-stone-400 mb-4 leading-relaxed">
              Curator-level management console for librarians and system catalogers.
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  quickDemoLogin('admin');
                  onNavigate('admin-dashboard');
                }}
                className="w-full py-2.5 px-3.5 text-xs font-semibold text-amber-200 bg-stone-800/90 hover:bg-stone-800 border border-stone-700 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Switch to Admin Mode</span>
              </button>
              <button
                onClick={() => {
                  quickDemoLogin('user');
                  onNavigate('user-dashboard');
                }}
                className="w-full py-2.5 px-3.5 text-xs font-semibold text-stone-300 bg-stone-800/90 hover:bg-stone-800 border border-stone-700 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Library className="w-3.5 h-3.5 text-stone-400" />
                <span>Switch to Reader Mode</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400 font-mono">
          <p>&copy; {new Date().getFullYear()} E-Book Library Management System.</p>
          <div className="flex items-center gap-3">
            <span>Archival Edition 2026</span>
            <span aria-hidden="true">·</span>
            <span>Digital Repository Standard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
