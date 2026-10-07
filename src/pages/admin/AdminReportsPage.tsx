import React, { useState, useMemo } from 'react';
import { Book, Category, User, LibraryStats } from '../../types';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Printer,
  TrendingUp,
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  Share2,
} from 'lucide-react';
import { useToast } from '../../components/Toast';

interface AdminReportsPageProps {
  books: Book[];
  categories: Category[];
  users: User[];
  stats: LibraryStats;
}

export const AdminReportsPage: React.FC<AdminReportsPageProps> = ({
  books,
  categories,
  users,
  stats,
}) => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<'30days' | '90days' | 'ytd' | 'all'>('30days');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');

  // Filtered books based on category
  const filteredBooks = useMemo(() => {
    if (selectedDiscipline === 'all') return books;
    return books.filter((b) => b.categoryId === selectedDiscipline);
  }, [books, selectedDiscipline]);

  // Aggregate stats
  const totalViews = useMemo(() => books.reduce((acc, b) => acc + b.views, 0), [books]);
  const totalDownloads = useMemo(() => books.reduce((acc, b) => acc + b.downloads, 0), [books]);
  const availableCount = stats.availableBooks;
  const unavailableCount = stats.unavailableBooks;
  const circulationRate = stats.totalBooks
    ? Math.round((availableCount / stats.totalBooks) * 100)
    : 0;

  // Most read discipline
  const disciplineStats = useMemo(() => {
    return categories
      .map((cat) => {
        const catBooks = books.filter((b) => b.categoryId === cat.id);
        const views = catBooks.reduce((acc, b) => acc + b.views, 0);
        const downloads = catBooks.reduce((acc, b) => acc + b.downloads, 0);
        return {
          id: cat.id,
          name: cat.name,
          count: catBooks.length,
          views,
          downloads,
        };
      })
      .sort((a, b) => b.views - a.views);
  }, [categories, books]);

  // Generate and download CSV Catalog Report
  const exportCatalogCSV = () => {
    const headers = [
      'ID',
      'Title',
      'Author',
      'Category',
      'Year',
      'Pages',
      'Availability',
      'Views',
      'Downloads',
      'Rating',
    ];
    const rows = filteredBooks.map((b) => {
      const cat = categories.find((c) => c.id === b.categoryId)?.name || 'General';
      return [
        b.id,
        `"${b.title.replace(/"/g, '""')}"`,
        `"${b.author.replace(/"/g, '""')}"`,
        `"${cat}"`,
        b.publicationYear,
        b.pages,
        b.availability ? 'Available' : 'Reserved',
        b.views,
        b.downloads,
        b.rating,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `library-catalog-report-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast('Catalog CSV Report downloaded successfully.', 'success');
  };

  // Generate and download JSON Audit Log
  const exportAuditJSON = () => {
    const reportData = {
      institution: 'E-Book Management System & Digital Archives',
      generatedAt: new Date().toISOString(),
      reportFilter: { timeRange, selectedDiscipline },
      summary: {
        totalBooks: stats.totalBooks,
        availableBooks: availableCount,
        unavailableBooks: unavailableCount,
        circulationRate: `${circulationRate}%`,
        totalPatrons: users.length,
        activePatrons: users.filter((u) => u.status === 'active').length,
        totalCatalogViews: totalViews,
        totalDownloads: totalDownloads,
      },
      disciplines: disciplineStats,
      catalogSnapshot: filteredBooks.map((b) => ({
        id: b.id,
        title: b.title,
        author: b.author,
        year: b.publicationYear,
        availability: b.availability,
        views: b.views,
        downloads: b.downloads,
      })),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `archival-audit-report-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast('Full Archival Audit JSON exported.', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header with Title and Export Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono">
            ARCHIVAL AUDIT & TELEMETRY
          </span>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mt-0.5">
            Institutional Circulation Reports
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Official metrics on library catalog utilization, patron throughput, and collection health.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handlePrint}
            className="py-2 px-3 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Print or Save PDF report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
          <button
            onClick={exportAuditJSON}
            className="py-2 px-3 text-xs font-semibold text-stone-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Export JSON audit report"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-700" />
            <span>Audit JSON</span>
          </button>
          <button
            onClick={exportCatalogCSV}
            className="py-2 px-3.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all shadow-xs hover:shadow-md flex items-center gap-2 active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Date Range Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-2xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-stone-400" />
          <span className="text-xs font-semibold text-stone-700">Audit Period:</span>
          <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setTimeRange('30days')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                timeRange === '30days'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Past 30 Days
            </button>
            <button
              onClick={() => setTimeRange('90days')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                timeRange === '90days'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Quarterly
            </button>
            <button
              onClick={() => setTimeRange('ytd')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                timeRange === 'ytd'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              YTD
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                timeRange === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={selectedDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value)}
            className="text-xs py-1.5 px-3 bg-stone-50 border border-stone-200/90 rounded-xl text-stone-700 font-semibold focus:outline-none focus:border-stone-900 shadow-2xs"
          >
            <option value="all">All Disciplines ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs library-card">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[10px] font-bold font-mono tracking-wider uppercase">
              CIRCULATION EFFICIENCY
            </span>
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif-display font-bold text-stone-900 tabular-nums">
            {circulationRate}%
          </p>
          <p className="text-xs text-stone-500 mt-1">
            {availableCount} of {stats.totalBooks} available for loans
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs library-card">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[10px] font-bold font-mono tracking-wider uppercase">
              TOTAL VIEWS
            </span>
            <div className="p-1.5 bg-amber-50 rounded-lg text-amber-700">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif-display font-bold text-stone-900 tabular-nums">
            {totalViews}
          </p>
          <p className="text-xs text-stone-500 mt-1">Cumulative chapter reads</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs library-card">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[10px] font-bold font-mono tracking-wider uppercase">
              DOWNLOADS
            </span>
            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-700">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif-display font-bold text-stone-900 tabular-nums">
            {totalDownloads}
          </p>
          <p className="text-xs text-stone-500 mt-1">Offline scholarly copies</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs library-card">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[10px] font-bold font-mono tracking-wider uppercase">
              PATRON BASE
            </span>
            <div className="p-1.5 bg-stone-100 rounded-lg text-stone-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif-display font-bold text-stone-900 tabular-nums">
            {users.length}
          </p>
          <p className="text-xs text-emerald-700 font-medium mt-1">
            {users.filter((u) => u.status === 'active').length} in active standing
          </p>
        </div>
      </div>

      {/* Disciplinary Performance Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif-display text-lg font-bold text-stone-900">
              Disciplinary Archival Activity Audit
            </h3>
            <p className="text-xs text-stone-500">
              Breakdown of student & faculty engagement per subject division.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md">
            {categories.length} DISCIPLINES
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200/80 text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono">
                <th className="py-3 px-5">Discipline</th>
                <th className="py-3 px-4 text-center">Collection Size</th>
                <th className="py-3 px-4 text-center">Circulation Views</th>
                <th className="py-3 px-4 text-center">Downloads</th>
                <th className="py-3 px-4 text-right">Engagement Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {disciplineStats.map((item) => {
                const totalEngagement = totalViews + totalDownloads || 1;
                const itemEngagement = item.views + item.downloads;
                const share = Math.round((itemEngagement / totalEngagement) * 100);

                return (
                  <tr key={item.id} className="hover:bg-amber-50/20 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-stone-900">
                      {item.name}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums text-stone-700">
                      {item.count} volumes
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums text-stone-700 font-semibold">
                      {item.views}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums text-emerald-800 font-semibold">
                      {item.downloads}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-stone-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-stone-900 h-full rounded-full"
                            style={{ width: `${Math.max(5, share)}%` }}
                          />
                        </div>
                        <span className="font-bold text-stone-800 w-8">{share}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
