import React, { useState } from 'react';
import { Category } from '../../types';
import { Plus, Edit2, Trash2, Folder, BookOpen, Layers, Search, RotateCcw } from 'lucide-react';
import { Modal } from '../Modal';

interface CategoryTableProps {
  categories: Category[];
  onSaveCategory: (cat: Category) => void;
  onDeleteCategory: (catId: string) => void;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  onSaveCategory,
  onDeleteCategory,
}) => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const filteredCategories = categories.filter((cat) => {
    return (
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredCategories.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedCategories = filteredCategories.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setError('');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category title is required');
      return;
    }

    onSaveCategory({
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Curated digital collection archive.',
      bookCount: editingCategory ? editingCategory.bookCount : 0,
      iconName: editingCategory?.iconName || 'BookOpen',
    });

    setModalOpen(false);
  };

  const categoryToDelete = categories.find((c) => c.id === deleteConfirmId);

  return (
    <div className="space-y-4">
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
        <div>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">
            TAXONOMY & CURATION
          </span>
          <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">
            Subject Classifications
          </h3>
          <p className="text-xs text-stone-600">
            Define disciplinary branches and curate academic collection classifications.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="py-2.5 px-4 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl flex items-center gap-1.5 transition-all shadow-xs active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Discipline</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200/90 shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-stone-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search disciplines..."
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-stone-50/70 border border-stone-200/90 rounded-xl placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 font-medium text-stone-900 shadow-2xs transition-all"
          />
        </div>

        {search && (
          <button
            onClick={() => {
              setSearch('');
              setCurrentPage(1);
            }}
            className="py-1.5 px-2.5 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 rounded-lg flex items-center gap-1 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Categories Table */}
      <div className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200/80 text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono">
                <th className="py-3.5 px-5">Discipline Title</th>
                <th className="py-3.5 px-4">Archival Scope</th>
                <th className="py-3.5 px-4 text-center">Cataloged Volumes</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {paginatedCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-stone-500">
                    No disciplines found matching your search.
                  </td>
                </tr>
              ) : (
                paginatedCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-4 px-5 font-bold text-stone-900 flex items-center gap-3">
                      <div className="p-2 bg-stone-100 rounded-xl text-stone-700 shadow-2xs">
                        <Layers className="w-4 h-4" />
                      </div>
                      <span className="font-serif-display text-base">{cat.name}</span>
                    </td>

                    <td className="py-4 px-4 text-stone-600 max-w-md">
                      <p className="line-clamp-2 leading-relaxed text-xs">{cat.description}</p>
                    </td>

                    <td className="py-4 px-4 text-center font-semibold tabular-nums text-stone-800 font-mono">
                      <span className="px-2.5 py-1 bg-stone-100/90 rounded-full text-xs font-semibold">
                        {cat.bookCount} {cat.bookCount === 1 ? 'volume' : 'volumes'}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Edit category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(cat.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with Pagination */}
        <div className="py-3.5 px-5 bg-stone-50/80 border-t border-stone-200/80 text-xs text-stone-600 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-mono text-[11px] text-stone-500">
            SHOWING <strong className="text-stone-900 font-semibold">{Math.min((safeCurrentPage - 1) * pageSize + 1, filteredCategories.length)}</strong> TO{' '}
            <strong className="text-stone-900 font-semibold">{Math.min(safeCurrentPage * pageSize, filteredCategories.length)}</strong> OF{' '}
            <strong className="text-stone-900 font-semibold">{filteredCategories.length}</strong> DISCIPLINES
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

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Edit Discipline Details' : 'Create New Discipline'}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1.5">
              DISCIPLINE TITLE *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cognitive Science"
              className="w-full py-2.5 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-stone-900/5 focus:border-stone-900 font-semibold text-stone-900"
            />
            {error && <p className="text-[11px] text-rose-600 mt-1">{error}</p>}
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1.5">
              SCOPE & DESCRIPTIVE OVERVIEW
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of topics, sub-disciplines, and curricula included..."
              className="w-full py-2.5 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-stone-900/5 focus:border-stone-900 leading-relaxed font-medium"
            />
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="py-2 px-3.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs"
            >
              Save Discipline
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && categoryToDelete && (
        <Modal
          isOpen={Boolean(deleteConfirmId)}
          onClose={() => setDeleteConfirmId(null)}
          title="Delete Academic Discipline"
          maxWidth="sm"
        >
          <div className="space-y-3">
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-stone-900 font-bold">"{categoryToDelete.name}"</strong>? Existing volumes will remain safely preserved in the catalog under general classification.
            </p>
            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="py-1.5 px-3 text-xs font-semibold text-stone-600 bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteCategory(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="py-1.5 px-3 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
