import React from 'react';
import { Category } from '../../types';
import { CategoryTable } from '../../components/admin/CategoryTable';

interface AdminCategoriesPageProps {
  categories: Category[];
  onSaveCategory: (cat: Category) => void;
  onDeleteCategory: (catId: string) => void;
}

export const AdminCategoriesPage: React.FC<AdminCategoriesPageProps> = ({
  categories,
  onSaveCategory,
  onDeleteCategory,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="pb-3 border-b border-stone-200/80">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono">
          TAXONOMY & CURATION
        </span>
        <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mt-0.5">
          Disciplinary Classifications
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Curate academic categories, scholarly subject taxonomy, and collection scopes.
        </p>
      </div>

      <CategoryTable
        categories={categories}
        onSaveCategory={onSaveCategory}
        onDeleteCategory={onDeleteCategory}
      />
    </div>
  );
};
