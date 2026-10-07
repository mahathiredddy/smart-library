import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { supabaseService, isSupabaseConfigured } from '../services/supabase';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Layers,
  Key,
  Terminal,
  RefreshCw,
} from 'lucide-react';
import { useToast } from './Toast';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    status: 'connected' | 'not_configured' | 'schema_missing' | 'error';
    message: string;
  }>({
    status: isSupabaseConfigured ? 'connected' : 'not_configured',
    message: isSupabaseConfigured
      ? 'Configured via environment variables.'
      : 'Supabase credentials not yet configured in environment variables.',
  });

  const checkStatus = async () => {
    setChecking(true);
    try {
      const res = await supabaseService.checkConnection();
      setConnectionStatus(res);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkStatus();
    }
  }, [isOpen]);

  const copySqlSchema = async () => {
    try {
      const sqlContent = `-- E-BOOK MANAGEMENT SYSTEM - SUPABASE DATABASE SCHEMA
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_name TEXT DEFAULT 'BookOpen',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    bio TEXT,
    favorite_genre TEXT,
    profile_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BOOKS
CREATE TABLE IF NOT EXISTS public.books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    description TEXT,
    cover_image TEXT,
    cover_color TEXT DEFAULT '#1e293b',
    ebook_url TEXT,
    publication_year INTEGER DEFAULT 2024,
    language TEXT DEFAULT 'English',
    pages INTEGER DEFAULT 200,
    availability BOOLEAN DEFAULT TRUE,
    rating NUMERIC(3, 2) DEFAULT 4.5,
    views INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    isbn TEXT,
    featured BOOLEAN DEFAULT FALSE,
    allow_download BOOLEAN DEFAULT TRUE,
    chapters JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FAVORITES
CREATE TABLE IF NOT EXISTS public.favorites (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    book_id TEXT NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, book_id)
);

-- 5. READING HISTORY
CREATE TABLE IF NOT EXISTS public.reading_history (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    book_id TEXT NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    current_chapter_index INTEGER DEFAULT 0,
    current_page INTEGER DEFAULT 1,
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, book_id)
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "Allow public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow admin full categories" ON public.categories FOR ALL USING (true);

CREATE POLICY "Allow public read books" ON public.books FOR SELECT USING (true);
CREATE POLICY "Allow admin full books" ON public.books FOR ALL USING (true);
CREATE POLICY "Allow views/downloads increment" ON public.books FOR UPDATE USING (true);

CREATE POLICY "Allow read user profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow user registration" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow user update" ON public.users FOR UPDATE USING (true);

CREATE POLICY "Allow user favorites read" ON public.favorites FOR SELECT USING (true);
CREATE POLICY "Allow user favorites insert" ON public.favorites FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow user favorites delete" ON public.favorites FOR DELETE USING (true);

CREATE POLICY "Allow user history read" ON public.reading_history FOR SELECT USING (true);
CREATE POLICY "Allow user history write" ON public.reading_history FOR ALL USING (true);`;

      await navigator.clipboard.writeText(sqlContent);
      setCopied(true);
      toast('Supabase SQL schema copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast('Failed to copy to clipboard automatically.', 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Supabase Database Integration"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Status banner */}
        <div
          className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
            connectionStatus.status === 'connected'
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              : connectionStatus.status === 'schema_missing'
              ? 'bg-amber-50/80 border-amber-200 text-amber-900'
              : 'bg-stone-50 border-stone-200 text-stone-900'
          }`}
        >
          <div className="flex items-start gap-3">
            {connectionStatus.status === 'connected' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            )}
            <div>
              <p className="font-semibold text-xs sm:text-sm">
                {connectionStatus.status === 'connected'
                  ? 'Supabase Database Connected & Synced'
                  : connectionStatus.status === 'schema_missing'
                  ? 'Connected to Project, Schema Setup Needed'
                  : 'Operating in Local Storage Fallback Mode'}
              </p>
              <p className="text-xs mt-0.5 opacity-90">{connectionStatus.message}</p>
            </div>
          </div>

          <button
            onClick={checkStatus}
            disabled={checking}
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors shadow-2xs shrink-0"
            title="Recheck connection"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* 5 Target Tables Summary */}
        <div>
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider font-mono mb-2.5">
            Target Database Architecture (5 Tables)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
              <span className="font-mono font-bold text-stone-900">1. public.books</span>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Volumes, ISBN, author, year, availability, views, downloads & chapters JSON.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
              <span className="font-mono font-bold text-stone-900">2. public.categories</span>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Discipline taxonomy, titles, scope descriptions & icon mappings.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
              <span className="font-mono font-bold text-stone-900">3. public.users</span>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Patron scholars & admins, roles ('admin' | 'user'), active status.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
              <span className="font-mono font-bold text-stone-900">4. public.favorites</span>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Relational bookmarks between users and books with cascade delete.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 sm:col-span-2">
              <span className="font-mono font-bold text-stone-900">5. public.reading_history</span>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Reading telemetry, chapter positions, progress (0-100%), and last read timestamps.
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="p-4 bg-stone-50/80 rounded-2xl border border-stone-200/90 space-y-3">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider font-mono">
            Setup Checklist for Your Supabase Project
          </h4>
          <ol className="text-xs text-stone-700 space-y-2 list-decimal list-inside leading-relaxed font-medium">
            <li>
              Log in to your dashboard at{' '}
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-stone-900 underline font-semibold inline-flex items-center gap-0.5"
              >
                supabase.com <ExternalLink className="w-3 h-3 inline" />
              </a>{' '}
              and select your project.
            </li>
            <li>
              Navigate to <strong>SQL Editor</strong> &rarr; <strong>New Query</strong>.
            </li>
            <li>
              Click the <strong>Copy SQL Schema Script</strong> button below, paste the SQL query, and click <strong>Run</strong>.
            </li>
            <li>
              In Supabase, navigate to <strong>Project Settings</strong> &rarr; <strong>API</strong>.
            </li>
            <li>
              Add the two client environment variables to your app environment or <code className="bg-stone-200 px-1 py-0.5 rounded font-mono text-[10px]">.env</code>:
              <div className="mt-2 p-2.5 bg-stone-900 text-stone-100 rounded-xl font-mono text-[11px] space-y-1">
                <p>VITE_SUPABASE_URL="https://your-project-id.supabase.co"</p>
                <p>VITE_SUPABASE_ANON_KEY="your-anon-public-key"</p>
              </div>
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100">
          <span className="text-[11px] text-stone-500 font-mono">
            Schema file saved at: <strong className="text-stone-700">supabase-schema.sql</strong>
          </span>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={copySqlSchema}
              className="flex-1 sm:flex-none py-2 px-4 rounded-xl text-xs font-bold text-stone-900 bg-amber-200 hover:bg-amber-300 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-stone-900" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Schema Script'}</span>
            </button>
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
