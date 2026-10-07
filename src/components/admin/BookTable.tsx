import React, { useState } from 'react';
import { Book, Category } from '../../types';
import { BookCover } from '../BookCover';
import {
  Edit2,
  Trash2,
  Eye,
  Search,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Filter,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { Modal } from '../Modal';

interface BookTableProps {
  books: Book[];
  categories: Category[];
  onEdit: (book: Book) => void;
  onDelete: (bookId: string) => void;
  onToggleAvailability: (bookId: string) => void;
  onPreview: (book: Book) => void;
}

export const BookTable: React.FC<BookTableProps> = ({
  books,
  categories,
  onEdit,
  onDelete,
  onToggleAvailability,
  onPreview,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'title' | 'year' | 'views' | 'downloads'>('title');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === id)?.name || 'General';
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.publicationYear.toString().includes(search);

    const matchesCategory =
      categoryFilter === 'all' || book.categoryId === categoryFilter;

    const matchesAvailability =
      availabilityFilter === 'all' ||
      (availabilityFilter === 'available' && book.availability) ||
      (availabilityFilter === 'unavailable' && !book.availability);

    return matchesSearch && matchesCategory && matchesAvailability;
  }).sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'year') return b.publicationYear - a.publicationYear;
    if (sortBy === 'views') return b.views - a.views;
    if (sortBy === 'downloads') return b.downloads - a.downloads;
    return 0;
  });

  const totalPages = Math.ceil(filteredBooks.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedBooks = filteredBooks.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  const bookToDelete = books.find((b) => b.id === deleteConfirmId);

  const resetFilters = () => {
    setSearch('');
    setCategoryFilter('all');
    setAvailabilityFilter('all');
    setSortBy('title');
    setCurrentPage(1);
  };

  const isFiltered = search !== '' || categoryFilter !== 'all' || availabilityFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Table Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-stone-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search catalog by title, author, year..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-stone-50/70 border border-stone-200/90 rounded-xl placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 shadow-2xs transition-all font-medium text-stone-900"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs py-2 px-3 bg-stone-50 border border-stone-200/90 rounded-xl text-stone-700 font-semibold focus:outline-none focus:border-stone-900 shadow-2xs"
          >
            <option value="all">All Disciplines ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={availabilityFilter}
            onChange={(e) => {
              setAvailabilityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs py-2 px-3 bg-stone-50 border border-stone-200/90 rounded-xl text-stone-700 font-semibold focus:outline-none focus:border-stone-900 shadow-2xs"
          >
            <option value="all">All Circulation</option>
            <option value="available">Available Only</option>
            <option value="unavailable">Reserved Only</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs py-2 px-3 bg-stone-50 border border-stone-200/90 rounded-xl text-stone-700 font-semibold focus:outline-none focus:border-stone-900 shadow-2xs"
          >
            <option value="title">Sort by Title (A-Z)</option>
            <option value="year">Sort by Year (Newest)</option>
            <option value="views">Sort by Views</option>
            <option value="downloads">Sort by Downloads</option>
          </select>

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="py-2 px-2.5 text-xs text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/70 rounded-xl transition-colors flex items-center gap-1 font-medium"
              title="Reset search and filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/90 border-b border-stone-200/80 text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono">
                <th className="py-3.5 px-5">Volume & Author</th>
                <th className="py-3.5 px-4">Discipline</th>
                <th className="py-3.5 px-4">Year</th>
                <th className="py-3.5 px-4">Circulation Status</th>
                <th className="py-3.5 px-4 text-right">Metrics</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {paginatedBooks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center">
                    <div className="max-w-xs mx-auto space-y-2">
                      <BookOpen className="w-8 h-8 text-stone-300 mx-auto" />
                      <p className="text-stone-700 font-semibold">No catalog volumes found</p>
                      <p className="text-[11px] text-stone-400">
                        Try modifying your query or clearing the active discipline filter.
                      </p>
                      {isFiltered && (
                        <button
                          onClick={resetFilters}
                          className="mt-2 py-1.5 px-3 text-xs font-semibold text-stone-800 bg-stone-100 rounded-lg hover:bg-stone-200"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-amber-50/30 transition-colors">
                    {/* Book & Author */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 shrink-0 shadow-2xs rounded overflow-hidden">
                          <BookCover
                            title={book.title}
                            author={book.author}
                            coverImage={book.coverImage}
                            coverColor={book.coverColor}
                            size="sm"
                          />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <p
                            onClick={() => onPreview(book)}
                            className="font-serif-display font-bold text-stone-900 text-sm truncate hover:text-amber-950 cursor-pointer"
                            title={book.title}
                          >
                            {book.title}
                          </p>
                          <p className="text-[11px] text-stone-600 truncate">
                            by {book.author}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Discipline */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] font-bold text-amber-950 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">
                        {getCategoryName(book.categoryId)}
                      </span>
                    </td>

                    {/* Year */}
                    <td className="py-3.5 px-4 text-stone-600 font-mono tabular-nums font-medium">
                      {book.publicationYear}
                    </td>

                    {/* Circulation status toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onToggleAvailability(book.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                          book.availability
                            ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80'
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200/80 border border-stone-200'
                        }`}
                        title="Click to toggle lending availability"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            book.availability ? 'bg-emerald-500 pulse-available' : 'bg-stone-400'
                          }`}
                        />
                        <span>{book.availability ? 'Available' : 'Reserved'}</span>
                      </button>
                    </td>

                    {/* Metrics */}
                    <td className="py-3.5 px-4 text-right font-mono text-[11px] text-stone-500">
                      <div className="flex items-center justify-end gap-2.5">
                        <span title="Total reads" className="tabular-nums">
                          {book.views} views
                        </span>
                        <span aria-hidden="true" className="text-stone-200">·</span>
                        <span title="Total downloads" className="tabular-nums">
                          {book.downloads} dls
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPreview(book)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                          title="Preview Volume"
                          aria-label={`Preview ${book.title}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(book)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                          title="Edit Bibliographic Record"
                          aria-label={`Edit ${book.title}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(book.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Volume"
                          aria-label={`Delete ${book.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar with Pagination */}
        <div className="px-5 py-3.5 bg-stone-50/80 border-t border-stone-200/80 text-xs text-stone-600 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-mono text-[11px] text-stone-500">
            SHOWING <strong className="text-stone-900 font-semibold">{Math.min((safeCurrentPage - 1) * pageSize + 1, filteredBooks.length)}</strong> TO{' '}
            <strong className="text-stone-900 font-semibold">{Math.min(safeCurrentPage * pageSize, filteredBooks.length)}</strong> OF{' '}
            <strong className="text-stone-900 font-semibold">{filteredBooks.length}</strong> VOLUMES
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5 font-mono">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage === 1}
                className="px-2.5 py-1 text-xs rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-7 h-7 text-xs rounded-lg font-semibold transition-all ${
                    safeCurrentPage === num
                      ? 'bg-stone-900 text-white shadow-2xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage === totalPages}
                className="px-2.5 py-1 text-xs rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && bookToDelete && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteConfirmId(null)}
          title="Deaccession Volume Confirmation"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you wish to remove{' '}
              <strong className="text-stone-900 font-semibold font-serif-display text-sm">
                "{bookToDelete.title}"
              </strong>{' '}
              by {bookToDelete.author} from the institutional digital catalog? This action will archive all associated reading history.
            </p>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-800 text-xs">
              <p className="font-semibold">Destructive Action</p>
              <p className="text-[11px] text-rose-700 mt-0.5">
                This volume will no longer be visible or readable by enrolled scholars.
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="py-2 px-3.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(bookToDelete.id);
                  setDeleteConfirmId(null);
                }}
                className="py-2 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-2xs"
              >
                Confirm Deaccession
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
