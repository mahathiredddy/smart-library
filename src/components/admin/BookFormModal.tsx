import React, { useState, useEffect } from 'react';
import { Book, Category } from '../../types';
import { Modal } from '../Modal';
import { BookCover } from '../BookCover';
import { Sparkles, Image as ImageIcon, BookOpen, Layers } from 'lucide-react';

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookData: Partial<Book>) => void;
  initialBook?: Book | null;
  categories: Category[];
}

const COLOR_PALETTES = [
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Warm Amber', hex: '#78350f' },
  { name: 'Deep Teal', hex: '#0f766e' },
  { name: 'Slate Gray', hex: '#334155' },
  { name: 'Crimson', hex: '#450a0a' },
  { name: 'Midnight', hex: '#1e293b' },
  { name: 'Raw Umber', hex: '#854d0e' },
  { name: 'Dark Emerald', hex: '#064e3b' },
  { name: 'Deep Indigo', hex: '#312e81' },
  { name: 'Espresso', hex: '#291811' },
];

export const BookFormModal: React.FC<BookFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialBook,
  categories,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [publicationYear, setPublicationYear] = useState<number>(new Date().getFullYear());
  const [language, setLanguage] = useState('English');
  const [pages, setPages] = useState<number>(250);
  const [availability, setAvailability] = useState(true);
  const [coverImage, setCoverImage] = useState('');
  const [coverColor, setCoverColor] = useState('#1e3a8a');
  const [sampleContent, setSampleContent] = useState('');
  const [ebookUrl, setEbookUrl] = useState('');
  const [allowDownload, setAllowDownload] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialBook) {
      setTitle(initialBook.title);
      setAuthor(initialBook.author);
      setCategoryId(initialBook.categoryId);
      setDescription(initialBook.description);
      setPublicationYear(initialBook.publicationYear);
      setLanguage(initialBook.language);
      setPages(initialBook.pages);
      setAvailability(initialBook.availability);
      setCoverImage(initialBook.coverImage || '');
      setCoverColor(initialBook.coverColor || '#1e3a8a');
      setEbookUrl(initialBook.ebookUrl || '');
      setAllowDownload(initialBook.allowDownload !== false);
      setFeatured(Boolean(initialBook.featured));
      setSampleContent(
        initialBook.chapters && initialBook.chapters[0]
          ? initialBook.chapters[0].content
          : ''
      );
    } else {
      setTitle('');
      setAuthor('');
      setCategoryId(categories[0]?.id || '');
      setDescription('');
      setPublicationYear(new Date().getFullYear());
      setLanguage('English');
      setPages(280);
      setAvailability(true);
      setCoverImage('');
      setCoverColor('#1e3a8a');
      setEbookUrl('');
      setAllowDownload(true);
      setFeatured(false);
      setSampleContent('');
    }
    setErrors({});
  }, [initialBook, isOpen, categories]);

  const validate = () => {
    const err: Record<string, string> = {};
    if (!title.trim()) err.title = 'Title is required';
    if (!author.trim()) err.author = 'Author name is required';
    if (!categoryId) err.categoryId = 'Please select a category';
    if (!description.trim()) err.description = 'Description is required';
    if (publicationYear < 1000 || publicationYear > 2099)
      err.publicationYear = 'Enter a valid year';
    if (pages <= 0) err.pages = 'Page count must be greater than 0';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const chapters = initialBook?.chapters || [
      {
        id: `c-${Date.now()}-1`,
        title: 'Chapter 1: Opening Discourse',
        content:
          sampleContent.trim() ||
          `This digital e-book entry has been cataloged into the library archives.\n\nAuthor: ${author}.\nTitle: ${title}.\nPublished: ${publicationYear}.\n\n"Knowledge preserved in digital form is an inheritance for all scholarly inquiries."`,
      },
    ];

    if (initialBook && chapters.length > 0 && sampleContent) {
      chapters[0].content = sampleContent;
    }

    onSave({
      id: initialBook ? initialBook.id : `book-${Date.now()}`,
      title: title.trim(),
      author: author.trim(),
      categoryId,
      description: description.trim(),
      publicationYear: Number(publicationYear),
      language: language.trim() || 'English',
      pages: Number(pages),
      availability,
      coverImage: coverImage.trim() || undefined,
      coverColor,
      ebookUrl: ebookUrl.trim() || undefined,
      allowDownload,
      featured,
      chapters,
      rating: initialBook ? initialBook.rating : 4.8,
      views: initialBook ? initialBook.views : 0,
      downloads: initialBook ? initialBook.downloads : 0,
      createdAt: initialBook ? initialBook.createdAt : new Date().toISOString(),
    });
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialBook ? 'Edit Catalog Volume' : 'Accession New Volume to Library'}
      description="Update bibliographic metadata, classification taxonomy, and digital reading text."
      maxWidth="4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Live Visual Preview Column */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono mb-2.5 self-start">
              LIVE COVER PREVIEW
            </label>
            <div className="w-48 shadow-lg transition-transform hover:scale-102">
              <BookCover
                title={title || 'Untiltled Volume'}
                author={author || 'Scholarly Author'}
                categoryName={selectedCategory?.name || 'Discipline'}
                coverImage={coverImage}
                coverColor={coverColor}
                size="md"
              />
            </div>

            {/* Binding tone selector */}
            <div className="mt-5 w-full">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono mb-2 block">
                LEATHER / CLOTH BINDING TONE
              </label>
              <div className="grid grid-cols-5 gap-2">
                {COLOR_PALETTES.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setCoverColor(c.hex)}
                    className={`h-7 rounded-lg border transition-all ${
                      coverColor === c.hex
                        ? 'ring-2 ring-stone-900 ring-offset-1 scale-110 shadow-xs'
                        : 'border-stone-200/90 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Cover image URL */}
            <div className="mt-4 w-full">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1">
                COVER IMAGE URL (OPTIONAL)
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs py-2 px-3 pl-8 bg-stone-50 border border-stone-200/90 rounded-xl placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all font-mono"
                />
                <ImageIcon className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              </div>
              <p className="text-[10px] text-stone-400 mt-1">
                Leave empty for automatic luxury embossed hardcover binding.
              </p>
            </div>
          </div>

          {/* Right: Form fields */}
          <div className="lg:col-span-8 space-y-4">
            {/* Title */}
            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1">
                VOLUME TITLE *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Principia Mathematica"
                className={`w-full py-2.5 px-3.5 text-sm bg-stone-50 border rounded-xl focus:outline-none focus:ring-4 focus:ring-stone-900/5 focus:border-stone-900 font-medium ${
                  errors.title ? 'border-rose-400' : 'border-stone-200/90'
                }`}
              />
              {errors.title && <p className="text-[11px] text-rose-600 mt-1">{errors.title}</p>}
            </div>

            {/* Author & Discipline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1">
                  AUTHOR / SCHOLAR *
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Isaac Newton"
                  className={`w-full py-2.5 px-3.5 text-sm bg-stone-50 border rounded-xl focus:outline-none focus:ring-4 focus:ring-stone-900/5 focus:border-stone-900 font-medium ${
                    errors.author ? 'border-rose-400' : 'border-stone-200/90'
                  }`}
                />
                {errors.author && <p className="text-[11px] text-rose-600 mt-1">{errors.author}</p>}
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1">
                  ACADEMIC DISCIPLINE *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className={`w-full py-2.5 px-3.5 text-sm bg-stone-50 border rounded-xl focus:outline-none focus:ring-4 focus:ring-stone-900/5 focus:border-stone-900 font-medium ${
                    errors.categoryId ? 'border-rose-400' : 'border-stone-200/90'
                  }`}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.categoryId}</p>
                )}
              </div>
            </div>

            {/* Year, Pages, Language */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1">
                  YEAR
                </label>
                <input
                  type="number"
                  value={publicationYear}
                  onChange={(e) => setPublicationYear(Number(e.target.value))}
                  className="w-full py-2.5 px-3 text-sm bg-stone-50 border border-stone-200/90 rounded-xl font-mono focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1">
                  PAGES
                </label>
                <input
                  type="number"
                  value={pages}
                  onChange={(e) => setPages(Number(e.target.value))}
                  className="w-full py-2.5 px-3 text-sm bg-stone-50 border border-stone-200/90 rounded-xl font-mono focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1">
                  LANGUAGE
                </label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full py-2.5 px-3 text-sm bg-stone-50 border border-stone-200/90 rounded-xl focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            {/* Synopsis */}
            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1">
                SYNOPSIS / ABSTRACT *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Exposition of the treatise's core thesis, methodologies, and contributions..."
                className={`w-full py-2.5 px-3.5 text-xs bg-stone-50 border rounded-xl focus:outline-none focus:ring-4 focus:ring-stone-900/5 focus:border-stone-900 leading-relaxed ${
                  errors.description ? 'border-rose-400' : 'border-stone-200/90'
                }`}
              />
              {errors.description && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.description}</p>
              )}
            </div>

            {/* Reading sample content */}
            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1">
                DIGITAL TEXT EXCERPT (READER CONTENT)
              </label>
              <textarea
                rows={3}
                value={sampleContent}
                onChange={(e) => setSampleContent(e.target.value)}
                placeholder="Enter opening chapter prose for in-browser scholarly e-reader..."
                className="w-full py-2.5 px-3.5 text-xs font-mono bg-stone-50 border border-stone-200/90 rounded-xl focus:outline-none focus:border-stone-900 leading-relaxed text-stone-800"
              />
            </div>

            {/* E-Book / PDF URL */}
            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1">
                E-BOOK / PDF SOURCE URL (OPTIONAL)
              </label>
              <input
                type="url"
                value={ebookUrl}
                onChange={(e) => setEbookUrl(e.target.value)}
                placeholder="https://.../volume.pdf"
                className="w-full py-2.5 px-3.5 text-xs font-mono bg-stone-50 border border-stone-200/90 rounded-xl focus:outline-none focus:border-stone-900"
              />
              <p className="text-[10px] text-stone-500 mt-1">
                Direct URL to an e-book or PDF file to enable embedded PDF rendering in the reader.
              </p>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
                <input
                  type="checkbox"
                  checked={availability}
                  onChange={(e) => setAvailability(e.target.checked)}
                  className="rounded border-stone-300 text-stone-900 focus:ring-stone-900 w-4 h-4 cursor-pointer"
                />
                <span>Active Circulation (Available)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
                <input
                  type="checkbox"
                  checked={allowDownload}
                  onChange={(e) => setAllowDownload(e.target.checked)}
                  className="rounded border-stone-300 text-stone-900 focus:ring-stone-900 w-4 h-4 cursor-pointer"
                />
                <span>Allow Archival Download</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-amber-950">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-600 w-4 h-4 cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Curator's Spotlight Feature</span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-5 border-t border-stone-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2.5 px-6 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all shadow-xs hover:shadow-md active:scale-[0.98]"
          >
            {initialBook ? 'Save Bibliographic Changes' : 'Accession Volume'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
