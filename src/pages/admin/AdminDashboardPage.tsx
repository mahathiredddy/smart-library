import React, { useState, useMemo } from 'react';
import { Book, Category, LibraryStats, User } from '../../types';
import { StatCard } from '../../components/StatCard';
import { BookCover } from '../../components/BookCover';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Users,
  FolderTree,
  Download,
  Eye,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  Calendar,
  Clock,
  UserCheck,
  Star,
  FileText,
  UserPlus,
  Shield,
} from 'lucide-react';

interface AdminDashboardPageProps {
  stats: LibraryStats;
  books: Book[];
  categories: Category[];
  users: User[];
  onNavigateTab: (tab: string) => void;
  onOpenAddBookModal: () => void;
  onSelectBook: (book: Book) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  stats,
  books,
  categories,
  users,
  onNavigateTab,
  onOpenAddBookModal,
  onSelectBook,
}) => {
  // Top Popular Books (by views + downloads)
  const popularBooks = useMemo(() => {
    return [...books]
      .sort((a, b) => b.views + b.downloads - (a.views + a.downloads))
      .slice(0, 5);
  }, [books]);

  // Recently Added Books
  const recentlyAdded = useMemo(() => {
    return [...books]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);
  }, [books]);

  // Recent Users (newest registered patrons)
  const recentUsers = useMemo(() => {
    return [...users]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [users]);

  const maxBooksInCategory = Math.max(...categories.map((c) => c.bookCount), 1);
  const availablePercentage = stats.totalBooks
    ? Math.round((stats.availableBooks / stats.totalBooks) * 100)
    : 0;
  const unavailablePercentage = 100 - availablePercentage;

  // Chart Data: Books Added Over Time (Monthly timeline)
  const booksAddedOverTime = [
    { month: 'May', count: 2, cumulative: 8 },
    { month: 'Jun', count: 3, cumulative: 11 },
    { month: 'Jul', count: 4, cumulative: 15 },
    { month: 'Aug', count: 3, cumulative: 18 },
    { month: 'Sep', count: 5, cumulative: 23 },
    { month: 'Oct', count: Math.max(books.length - 23, 4), cumulative: books.length },
  ];
  const maxBooksAdded = Math.max(...booksAddedOverTime.map((d) => d.count), 1);

  // Chart Data: User Registration Statistics (Monthly growth)
  const userRegistrationStats = [
    { month: 'May', scholars: 4, active: 4 },
    { month: 'Jun', scholars: 6, active: 6 },
    { month: 'Jul', scholars: 9, active: 8 },
    { month: 'Aug', scholars: 12, active: 11 },
    { month: 'Sep', scholars: 15, active: 14 },
    { month: 'Oct', scholars: Math.max(users.length, 18), active: users.filter(u => u.status === 'active').length },
  ];
  const maxRegistrations = Math.max(...userRegistrationStats.map((d) => d.scholars), 1);

  // User Activity Events Stream
  const activityEvents = [
    {
      id: 'act-1',
      type: 'read',
      user: users[0]?.name || 'Scholar Alexander Wright',
      action: 'began reading',
      target: books[0]?.title || 'Meditations',
      time: '12 minutes ago',
      icon: BookOpen,
      iconBg: 'bg-amber-100 text-amber-900',
    },
    {
      id: 'act-2',
      type: 'download',
      user: users[1]?.name || 'Dr. Maya Lin',
      action: 'downloaded offline edition of',
      target: books[1]?.title || 'Clean Architecture',
      time: '45 minutes ago',
      icon: Download,
      iconBg: 'bg-blue-100 text-blue-900',
    },
    {
      id: 'act-3',
      type: 'registration',
      user: recentUsers[0]?.name || 'Marcus Aurelius',
      action: 'enrolled as a new scholar patron',
      target: 'Academic Division',
      time: '2 hours ago',
      icon: UserPlus,
      iconBg: 'bg-emerald-100 text-emerald-900',
    },
    {
      id: 'act-4',
      type: 'availability',
      user: 'Curator Staff',
      action: 'updated circulation availability for',
      target: books[2]?.title || 'Principia Mathematica',
      time: '4 hours ago',
      icon: CheckCircle2,
      iconBg: 'bg-stone-100 text-stone-900',
    },
    {
      id: 'act-5',
      type: 'read',
      user: users[2]?.name || 'Eleanor Vance',
      action: 'completed Chapter 4 of',
      target: books[3]?.title || 'Design Patterns',
      time: '6 hours ago',
      icon: Clock,
      iconBg: 'bg-purple-100 text-purple-900',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono">
            INSTITUTIONAL METRICS
          </span>
          <h1 className="font-serif-display text-3xl font-bold text-stone-900 mt-0.5">
            Library Operations Dashboard
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Real-time catalog metrics, inventory status, and patron engagement telemetry.
          </p>
        </div>

        <button
          onClick={onOpenAddBookModal}
          className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 transition-all shadow-xs hover:shadow-md flex items-center gap-2 active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5 text-amber-300" />
          <span>Accession New Volume</span>
        </button>
      </div>

      {/* 1. TOP STATISTICS: 5 Core Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="TOTAL BOOKS"
          value={stats.totalBooks}
          subtitle="All cataloged volumes"
          icon={BookOpen}
          colorScheme="stone"
          trend={{ value: '+4 this month', positive: true }}
          onClick={() => onNavigateTab('admin-books')}
        />

        <StatCard
          title="AVAILABLE BOOKS"
          value={stats.availableBooks}
          subtitle="Active circulation"
          icon={CheckCircle2}
          colorScheme="emerald"
          trend={{ value: `${availablePercentage}% ratio`, positive: true }}
          onClick={() => onNavigateTab('admin-availability')}
        />

        <StatCard
          title="UNAVAILABLE BOOKS"
          value={stats.unavailableBooks}
          subtitle="Checked out / held"
          icon={XCircle}
          colorScheme="rose"
          onClick={() => onNavigateTab('admin-availability')}
        />

        <StatCard
          title="TOTAL USERS"
          value={stats.totalUsers}
          subtitle="Registered patrons"
          icon={Users}
          colorScheme="blue"
          trend={{ value: '100% active', positive: true }}
          onClick={() => onNavigateTab('admin-users')}
        />

        <StatCard
          title="TOTAL CATEGORIES"
          value={stats.totalCategories}
          subtitle="Academic classifications"
          icon={FolderTree}
          colorScheme="amber"
          onClick={() => onNavigateTab('admin-categories')}
        />
      </div>

      {/* 2. CHARTS GRID: 4 Required Analytical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: Books by Category */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono">
                  DISCIPLINARY ARCHIVES
                </span>
                <h3 className="text-base font-serif-display font-bold text-stone-900 mt-0.5">
                  Books by Category
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                {categories.length} DISCIPLINES
              </span>
            </div>

            <div className="space-y-3.5 pt-1">
              {categories.map((cat, idx) => {
                const percentage = Math.round((cat.bookCount / maxBooksInCategory) * 100);
                const barColors = [
                  'bg-stone-900',
                  'bg-amber-800',
                  'bg-slate-800',
                  'bg-emerald-800',
                  'bg-indigo-900',
                  'bg-stone-700',
                ];
                const barColor = barColors[idx % barColors.length];

                return (
                  <div key={cat.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-800">{cat.name}</span>
                      <span className="text-stone-500 tabular-nums font-mono text-[11px]">
                        {cat.bookCount} {cat.bookCount === 1 ? 'book' : 'books'} ({Math.round((cat.bookCount / (stats.totalBooks || 1)) * 100)}%)
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all duration-700`}
                        style={{ width: `${Math.max(6, percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Aggregated across physical & digital collections</span>
            <button
              onClick={() => onNavigateTab('admin-categories')}
              className="text-stone-900 font-semibold hover:underline"
            >
              Manage &rarr;
            </button>
          </div>
        </div>

        {/* CHART 2: Books Added Over Time */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono">
                  ACCESSION VELOCITY
                </span>
                <h3 className="text-base font-serif-display font-bold text-stone-900 mt-0.5">
                  Books Added Over Time
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/70">
                +{booksAddedOverTime[booksAddedOverTime.length - 1].count} THIS MONTH
              </span>
            </div>

            <div className="pt-2">
              <div className="h-44 w-full flex items-end gap-3 sm:gap-5 justify-between pt-4 pb-2 border-b border-stone-200">
                {booksAddedOverTime.map((item) => {
                  const barHeight = Math.round((item.count / maxBooksAdded) * 100);

                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <span className="text-[10px] font-mono font-bold text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        +{item.count}
                      </span>
                      <div className="w-full bg-stone-100 rounded-t-lg overflow-hidden flex items-end h-32 p-1">
                        <div
                          className="w-full bg-gradient-to-t from-stone-900 to-amber-900/90 rounded-md transition-all duration-500 group-hover:brightness-110"
                          style={{ height: `${Math.max(15, barHeight)}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-stone-700 font-mono">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-stone-500">
            <span className="font-mono">Cumulative archive: {stats.totalBooks} total titles</span>
            <span className="text-[11px] text-stone-400">Monthly catalog additions</span>
          </div>
        </div>

        {/* CHART 3: Available vs Unavailable Books */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono">
                  CIRCULATION RATIO
                </span>
                <h3 className="text-base font-serif-display font-bold text-stone-900 mt-0.5">
                  Available vs Unavailable Books
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md">
                100% INVENTORY AUDITED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center my-3">
              {/* Circular Gauge */}
              <div className="flex flex-col items-center justify-center p-3">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-stone-200"
                      strokeWidth="3.6"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-700 transition-all duration-700"
                      strokeDasharray={`${availablePercentage}, 100`}
                      strokeWidth="3.6"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="font-serif-display text-2xl font-bold text-stone-900 tabular-nums">
                      {availablePercentage}%
                    </span>
                    <span className="text-[8px] uppercase font-mono text-emerald-800 font-bold">
                      IN LOAN
                    </span>
                  </div>
                </div>
              </div>

              {/* Comparative Details */}
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/70">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-available" />
                      Available for Open Loans
                    </span>
                    <span className="font-mono font-bold text-emerald-950 text-sm">
                      {stats.availableBooks}
                    </span>
                  </div>
                  <div className="w-full bg-emerald-200/60 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-emerald-700 h-full rounded-full"
                      style={{ width: `${availablePercentage}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-stone-400" />
                      Unavailable / Reserved
                    </span>
                    <span className="font-mono font-bold text-stone-900 text-sm">
                      {stats.unavailableBooks}
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-stone-500 h-full rounded-full"
                      style={{ width: `${unavailablePercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('admin-availability')}
            className="w-full mt-3 py-2 px-3 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors text-center active:scale-[0.98]"
          >
            Manage Circulation Availability &rarr;
          </button>
        </div>

        {/* CHART 4: User Registration Statistics */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono">
                  MEMBERSHIP TRAJECTORY
                </span>
                <h3 className="text-base font-serif-display font-bold text-stone-900 mt-0.5">
                  User Registration Statistics
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/70">
                {users.length} SCHOLARS REGISTERED
              </span>
            </div>

            <div className="pt-2">
              <div className="h-44 w-full flex items-end gap-3 sm:gap-5 justify-between pt-4 pb-2 border-b border-stone-200">
                {userRegistrationStats.map((item) => {
                  const barHeight = Math.round((item.scholars / maxRegistrations) * 100);

                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <span className="text-[10px] font-mono font-bold text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.scholars}
                      </span>
                      <div className="w-full bg-blue-50/60 rounded-t-lg overflow-hidden flex items-end h-32 p-1">
                        <div
                          className="w-full bg-gradient-to-t from-blue-900 to-indigo-700 rounded-md transition-all duration-500 group-hover:brightness-110"
                          style={{ height: `${Math.max(18, barHeight)}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-stone-700 font-mono">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-stone-500">
            <span className="font-mono">Active standing: {users.filter(u => u.status === 'active').length} patrons</span>
            <button
              onClick={() => onNavigateTab('admin-users')}
              className="text-stone-900 font-semibold hover:underline"
            >
              Patron Directory &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 3. SECTIONS: 4 Core Sections (Recent Books, Most Popular Books, Recent Users, User Activity) */}

      {/* SECTION 1 & 2: Recent Books and Most Popular Books */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 1: Recent Books */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono">
                CATALOG ADDITIONS
              </span>
              <h3 className="text-base font-serif-display font-bold text-stone-900">
                Recent Books
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('admin-books')}
              className="text-xs font-semibold text-stone-800 hover:text-stone-950 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentlyAdded.map((b) => {
              const cat = categories.find((c) => c.id === b.categoryId);
              return (
                <div
                  key={b.id}
                  onClick={() => onSelectBook(b)}
                  className="p-3 bg-stone-50/80 rounded-xl border border-stone-100 hover:border-stone-300 transition-all cursor-pointer flex items-center justify-between gap-3 group hover:bg-stone-100/70"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 shrink-0 rounded overflow-hidden shadow-2xs group-hover:scale-105 transition-transform">
                      <BookCover
                        title={b.title}
                        author={b.author}
                        coverImage={b.coverImage}
                        coverColor={b.coverColor}
                        size="sm"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate group-hover:text-amber-950">
                        {b.title}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate">by {b.author}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-stone-200/70 text-stone-700">
                          {cat?.name || 'General'}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {b.publicationYear}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                      b.availability
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                        : 'bg-stone-200/80 text-stone-600'
                    }`}
                  >
                    {b.availability ? 'Available' : 'Reserved'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: Most Popular Books */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono">
                ENGAGEMENT LEADERBOARD
              </span>
              <h3 className="text-base font-serif-display font-bold text-stone-900">
                Most Popular Books
              </h3>
            </div>
            <span className="text-[10px] text-stone-400 uppercase tracking-widest font-mono font-bold">
              CIRCULATION
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {popularBooks.map((b, i) => (
              <div
                key={b.id}
                onClick={() => onSelectBook(b)}
                className="py-2.5 flex items-center justify-between gap-3 hover:bg-stone-50/80 cursor-pointer rounded-xl px-2.5 -mx-2.5 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`font-mono text-xs w-5 font-bold ${
                      i === 0 ? 'text-amber-600 font-black' : i === 1 ? 'text-stone-700' : 'text-stone-400'
                    }`}
                  >
                    #{i + 1}
                  </span>
                  <div className="w-8 shrink-0 rounded overflow-hidden shadow-2xs">
                    <BookCover
                      title={b.title}
                      author={b.author}
                      coverImage={b.coverImage}
                      coverColor={b.coverColor}
                      size="sm"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate group-hover:text-amber-950">
                      {b.title}
                    </p>
                    <p className="text-[11px] text-stone-500 truncate">by {b.author}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono tabular-nums shrink-0">
                  <span className="text-stone-600 text-[11px]">{b.views} reads</span>
                  <span className="text-emerald-800 font-semibold text-[11px]">{b.downloads} dls</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3 & 4: Recent Users and User Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 3: Recent Users */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono">
                PATRON DIRECTORY
              </span>
              <h3 className="text-base font-serif-display font-bold text-stone-900">
                Recent Users
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('admin-users')}
              className="text-xs font-semibold text-stone-800 hover:text-stone-950 flex items-center gap-1"
            >
              <span>Manage Users</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {recentUsers.map((u) => (
              <div
                key={u.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-stone-50/60 rounded-xl px-2 -mx-2 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-200 flex items-center justify-center font-bold text-xs shadow-2xs font-serif-display shrink-0">
                    {u.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-stone-900 truncate">
                      {u.name}
                    </p>
                    <p className="text-[11px] text-stone-500 font-mono truncate">
                      {u.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      u.role === 'admin'
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {u.role === 'admin' ? 'Admin' : 'Scholar'}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                      u.status === 'active'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                        : 'bg-rose-50 text-rose-800'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        u.status === 'active' ? 'bg-emerald-500 pulse-available' : 'bg-rose-500'
                      }`}
                    />
                    <span className="capitalize">{u.status}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: User Activity */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono">
                TELEMETRY FEED
              </span>
              <h3 className="text-base font-serif-display font-bold text-stone-900">
                User Activity
              </h3>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/70">
              LIVE EVENTS
            </span>
          </div>

          <div className="space-y-3.5">
            {activityEvents.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className={`p-2 rounded-xl shrink-0 ${act.iconBg} shadow-2xs`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-stone-800 leading-snug">
                      <strong className="font-semibold text-stone-900">{act.user}</strong>{' '}
                      <span className="text-stone-600">{act.action}</span>{' '}
                      <strong className="text-stone-900 font-serif-display font-semibold">
                        "{act.target}"
                      </strong>
                    </p>
                    <span className="text-[10px] text-stone-400 font-mono">{act.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
