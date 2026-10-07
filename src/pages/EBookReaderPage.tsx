import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Book, Chapter } from '../types';
import { storage } from '../services/storage';
import { supabaseService } from '../services/supabase';
import { useAuth } from '../services/authContext';
import { useToast } from '../components/Toast';
import {
  ArrowLeft,
  Sun,
  Moon,
  Coffee,
  Type,
  Bookmark,
  Download,
  List,
  ChevronLeft,
  ChevronRight,
  ChevronFirst,
  ChevronLast,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  BookOpen,
  FileText,
  Sparkles,
  Layers,
  ScrollText,
  ExternalLink,
  Sliders,
  Check,
  AlertCircle,
} from 'lucide-react';

interface EBookReaderPageProps {
  book: Book;
  onBack: () => void;
}

type ReaderTheme = 'light' | 'sepia' | 'dark';
type ReaderFontFamily = 'serif' | 'sans';
type ReaderViewMode = 'paginated' | 'scroll' | 'pdf';

export const EBookReaderPage: React.FC<EBookReaderPageProps> = ({ book, onBack }) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Reader Settings
  const [theme, setTheme] = useState<ReaderTheme>('sepia');
  const [fontFamily, setFontFamily] = useState<ReaderFontFamily>('serif');
  const [fontSize, setFontSize] = useState<number>(18);
  const [zoomLevel, setZoomLevel] = useState<number>(100); // 70% to 180%
  const [viewMode, setViewMode] = useState<ReaderViewMode>(() =>
    book.ebookUrl && book.ebookUrl.endsWith('.pdf') ? 'pdf' : 'paginated'
  );
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showToc, setShowToc] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [pdfCustomUrl, setPdfCustomUrl] = useState<string>(book.ebookUrl || '');
  const [showPdfUrlModal, setShowPdfUrlModal] = useState<boolean>(false);

  // Position and Telemetry State
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageJumpInput, setPageJumpInput] = useState<string>('1');
  const [progress, setProgress] = useState<number>(0);
  const [resumeNotice, setResumeNotice] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Normalize chapters or provide rich fallback
  const chapters: Chapter[] = useMemo(() => {
    if (book.chapters && book.chapters.length > 0) {
      return book.chapters;
    }
    return [
      {
        id: 'c1',
        title: 'Opening Exposition & Bibliographic Prologue',
        content: `${book.description}\n\nThis academic volume titled "${book.title}" by ${book.author} is curated within the digital archives.\n\nAll subsequent chapters and critical annotations are preserved for scholarly study and research reference.`,
      },
    ];
  }, [book]);

  const currentChapter = chapters[currentChapterIndex] || chapters[0];

  // Calculate physical pages for entire book
  const totalPages = Math.max(book.pages || 120, chapters.length * 15);
  const pagesPerChapter = Math.max(1, Math.round(totalPages / chapters.length));

  // Download permission:
  // Must be available for circulation and allowDownload must not be explicitly false
  const isDownloadPermitted = book.allowDownload !== false && book.availability === true;

  // 1. Initial Load: Check reading_history and restore last-read position
  useEffect(() => {
    let restoredPage = 1;
    let restoredChapter = 0;
    let restoredProgress = 0;

    if (currentUser) {
      const historyItems = storage.getReadingHistory();
      const existing = historyItems.find(
        (h) => h.userId === currentUser.id && h.bookId === book.id
      );

      if (existing) {
        restoredProgress = existing.progress || 0;
        if (
          existing.currentChapterIndex !== undefined &&
          existing.currentChapterIndex < chapters.length
        ) {
          restoredChapter = existing.currentChapterIndex;
        }
        if (existing.currentPage && existing.currentPage <= totalPages) {
          restoredPage = existing.currentPage;
        } else {
          restoredPage = Math.max(1, Math.round((restoredProgress / 100) * totalPages));
        }

        setCurrentChapterIndex(restoredChapter);
        setCurrentPage(restoredPage);
        setPageJumpInput(restoredPage.toString());
        setProgress(restoredProgress);
        setResumeNotice(
          `Resumed reading session at Page ${restoredPage} (${restoredProgress}%)`
        );
        const timer = setTimeout(() => setResumeNotice(null), 4500);
        return () => clearTimeout(timer);
      } else {
        // Initial accession into reading history at 5%
        storage.saveReadingProgress(currentUser.id, book.id, 5, 0, 1);
        supabaseService.saveReadingProgress(currentUser.id, book.id, 5, 0, 1);
        setProgress(5);
      }
    }

    supabaseService.incrementBookViews(book.id);
  }, [book.id, currentUser, chapters.length, totalPages]);

  // 2. Persist Reading Progress whenever page or chapter changes
  const saveProgressDebounced = (page: number, chapterIdx: number) => {
    const calcProgress = Math.min(100, Math.max(1, Math.round((page / totalPages) * 100)));
    setProgress(calcProgress);

    if (currentUser) {
      storage.saveReadingProgress(currentUser.id, book.id, calcProgress, chapterIdx, page);
      supabaseService.saveReadingProgress(currentUser.id, book.id, calcProgress, chapterIdx, page);
    }
  };

  // Page Navigation Handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      setPageJumpInput(nextPage.toString());

      const estimatedChapter = Math.min(
        chapters.length - 1,
        Math.floor((nextPage - 1) / pagesPerChapter)
      );
      if (estimatedChapter !== currentChapterIndex) {
        setCurrentChapterIndex(estimatedChapter);
      }

      saveProgressDebounced(nextPage, estimatedChapter);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      setPageJumpInput(prevPage.toString());

      const estimatedChapter = Math.min(
        chapters.length - 1,
        Math.floor((prevPage - 1) / pagesPerChapter)
      );
      if (estimatedChapter !== currentChapterIndex) {
        setCurrentChapterIndex(estimatedChapter);
      }

      saveProgressDebounced(prevPage, estimatedChapter);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }
  };

  const handleJumpToPage = (target: number) => {
    const safeTarget = Math.max(1, Math.min(totalPages, target));
    setCurrentPage(safeTarget);
    setPageJumpInput(safeTarget.toString());

    const estimatedChapter = Math.min(
      chapters.length - 1,
      Math.floor((safeTarget - 1) / pagesPerChapter)
    );
    setCurrentChapterIndex(estimatedChapter);
    saveProgressDebounced(safeTarget, estimatedChapter);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const handleSelectChapter = (idx: number) => {
    setCurrentChapterIndex(idx);
    setShowToc(false);
    const chapterStartPage = Math.min(totalPages, idx * pagesPerChapter + 1);
    setCurrentPage(chapterStartPage);
    setPageJumpInput(chapterStartPage.toString());
    saveProgressDebounced(chapterStartPage, idx);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  // Zoom Controls
  const handleZoomIn = () => {
    setZoomLevel((z) => Math.min(180, z + 15));
  };

  const handleZoomOut = () => {
    setZoomLevel((z) => Math.max(70, z - 15));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  // Fullscreen Mode Toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === 'Home') {
        e.preventDefault();
        handleJumpToPage(1);
      } else if (e.key === 'End') {
        e.preventDefault();
        handleJumpToPage(totalPages);
      } else if (e.key === 'Escape') {
        if (showToc) setShowToc(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Download Handler (Only available when permitted)
  const handleDownload = () => {
    if (!isDownloadPermitted) {
      toast('Archival download is currently restricted for this volume.', 'info');
      return;
    }

    supabaseService.incrementBookDownloads(book.id);

    // If PDF url is provided, offer downloading the PDF or textual edition
    if (pdfCustomUrl && pdfCustomUrl.startsWith('http')) {
      const a = document.createElement('a');
      a.href = pdfCustomUrl;
      a.target = '_blank';
      a.download = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}_Document.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast(`Initiated download for "${book.title}" document!`, 'success');
      return;
    }

    const contentToDownload = `================================================
${book.title.toUpperCase()}
by ${book.author}
ISBN: ${book.isbn || 'N/A'} | Year: ${book.publicationYear} | Pages: ${book.pages}
================================================\n\nSYNOPSIS:\n${book.description}\n\n` +
      chapters
        .map(
          (c, i) =>
            `------------------------------------------------\nCHAPTER ${i + 1}: ${c.title}\n------------------------------------------------\n\n${c.content}\n\n`
        )
        .join('\n');

    const blob = new Blob([contentToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}_Library_Edition.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast(`Downloaded archival reading edition for "${book.title}"!`, 'success');
  };

  return (
    <div
      ref={containerRef}
      className={`min-h-screen flex flex-col transition-colors duration-200 select-text relative ${
        theme === 'dark'
          ? 'bg-[#111215] text-[#e2e4e9]'
          : theme === 'sepia'
          ? 'bg-[#f8f3e8] text-[#342718]'
          : 'bg-[#fafaf8] text-stone-900'
      }`}
    >
      {/* 1. TOP READER NAVIGATION BAR */}
      <header
        className={`sticky top-0 z-30 px-3 sm:px-6 py-2.5 border-b flex items-center justify-between gap-2 sm:gap-4 backdrop-blur-md transition-colors ${
          theme === 'dark'
            ? 'bg-[#181a1f]/95 border-stone-800 text-stone-200'
            : theme === 'sepia'
            ? 'bg-[#f4ece0]/95 border-[#e4d7c3] text-[#382d1f]'
            : 'bg-white/95 border-stone-200 text-stone-900'
        }`}
      >
        {/* Left: Back & Table of Contents Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold border border-inherit hover:opacity-80 transition-all active:scale-[0.98]"
            title="Return to library"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <button
            onClick={() => setShowToc(!showToc)}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold border border-inherit transition-all active:scale-[0.98] ${
              showToc ? 'opacity-100 ring-2 ring-amber-600/50' : 'opacity-85 hover:opacity-100'
            }`}
            title="Toggle Table of Contents"
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Chapters ({chapters.length})</span>
          </button>

          {/* View Mode Switcher */}
          <div className="flex items-center border border-inherit rounded-xl p-0.5 text-xs font-medium">
            <button
              onClick={() => setViewMode('paginated')}
              className={`py-1 px-1.5 sm:px-2.5 rounded-lg flex items-center gap-1 transition-colors ${
                viewMode === 'paginated'
                  ? 'bg-black/10 dark:bg-white/10 font-bold'
                  : 'opacity-70 hover:opacity-100'
              }`}
              title="Paginated Book View"
            >
              <BookOpen className="w-3 h-3" />
              <span className="hidden md:inline">Pages</span>
            </button>
            <button
              onClick={() => setViewMode('scroll')}
              className={`py-1 px-1.5 sm:px-2.5 rounded-lg flex items-center gap-1 transition-colors ${
                viewMode === 'scroll'
                  ? 'bg-black/10 dark:bg-white/10 font-bold'
                  : 'opacity-70 hover:opacity-100'
              }`}
              title="Continuous Scroll View"
            >
              <ScrollText className="w-3 h-3" />
              <span className="hidden md:inline">Scroll</span>
            </button>
            <button
              onClick={() => setViewMode('pdf')}
              className={`py-1 px-1.5 sm:px-2.5 rounded-lg flex items-center gap-1 transition-colors ${
                viewMode === 'pdf'
                  ? 'bg-black/10 dark:bg-white/10 font-bold text-amber-700 dark:text-amber-400'
                  : 'opacity-70 hover:opacity-100'
              }`}
              title="PDF Document View"
            >
              <FileText className="w-3 h-3" />
              <span className="hidden md:inline">PDF</span>
            </button>
          </div>
        </div>

        {/* Center: Book Title & Author Metadata */}
        <div className="flex flex-col items-center max-w-[120px] xs:max-w-xs sm:max-w-md text-center min-w-0">
          <h1 className="font-serif-display text-xs sm:text-sm font-bold truncate max-w-full tracking-tight">
            {book.title}
          </h1>
          <p className="text-[10px] sm:text-[11px] opacity-75 truncate max-w-full">
            by <span className="font-semibold">{book.author}</span>
          </p>
        </div>

        {/* Right: Controls (Zoom, Theme, Fullscreen, Bookmark, Download) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Zoom Controls */}
          <div className="flex items-center border border-inherit rounded-xl p-0.5 text-xs">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 70}
              className="p-1 rounded-lg hover:opacity-75 disabled:opacity-30 transition-opacity"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-1 sm:px-1.5 font-mono text-[10px] tabular-nums font-semibold hover:opacity-80"
              title="Reset Zoom to 100%"
            >
              {zoomLevel}%
            </button>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 180}
              className="p-1 rounded-lg hover:opacity-75 disabled:opacity-30 transition-opacity"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Theme switcher */}
          <div className="flex items-center border border-inherit rounded-xl p-0.5">
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                theme === 'light' ? 'bg-black/10 font-bold' : 'opacity-60 hover:opacity-100'
              }`}
              title="Light Paper Theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('sepia')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                theme === 'sepia' ? 'bg-black/10 font-bold' : 'opacity-60 hover:opacity-100'
              }`}
              title="Sepia Archival Theme"
            >
              <Coffee className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                theme === 'dark' ? 'bg-white/10 font-bold' : 'opacity-60 hover:opacity-100'
              }`}
              title="Night Reading Theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Typography switch (Serif / Sans) */}
          <button
            onClick={() => setFontFamily(fontFamily === 'serif' ? 'sans' : 'serif')}
            className="hidden md:inline-flex py-1 px-2.5 border border-inherit rounded-xl text-[11px] font-semibold opacity-85 hover:opacity-100 transition-opacity"
            title="Toggle Serif / Sans Font"
          >
            {fontFamily === 'serif' ? 'Serif' : 'Sans'}
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => {
              setIsBookmarked(!isBookmarked);
              toast(
                !isBookmarked
                  ? `Page ${currentPage} bookmarked successfully.`
                  : 'Bookmark cleared.',
                'info'
              );
            }}
            className={`p-1.5 border border-inherit rounded-xl transition-colors ${
              isBookmarked ? 'text-amber-500 fill-amber-500' : 'opacity-80 hover:opacity-100'
            }`}
            title="Bookmark Current Page"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Download Button (Only when downloading is permitted) */}
          {isDownloadPermitted && (
            <button
              onClick={handleDownload}
              className="p-1.5 border border-inherit rounded-xl opacity-85 hover:opacity-100 transition-colors"
              title="Download Archival Edition"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Fullscreen Mode Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 border border-inherit rounded-xl opacity-85 hover:opacity-100 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Mode'}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* 2. RESUME READING NOTIFICATION BANNER */}
      {resumeNotice && (
        <div className="sticky top-12 z-20 mx-auto max-w-md w-full px-4 pt-2 animate-in fade-in slide-in-from-top-2">
          <div className="bg-amber-900/90 text-amber-100 px-4 py-2 rounded-xl text-xs flex items-center justify-between gap-3 shadow-md backdrop-blur-md border border-amber-700/60 font-medium">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>{resumeNotice}</span>
            </div>
            <button
              onClick={() => setResumeNotice(null)}
              className="text-[10px] text-amber-200 hover:text-white underline font-semibold"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN READER BODY */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full relative">
        {/* Table of Contents Drawer */}
        {showToc && (
          <aside
            className={`w-80 shrink-0 border-r p-6 fixed md:sticky top-12 bottom-0 z-20 overflow-y-auto transition-all shadow-xl md:shadow-none ${
              theme === 'dark'
                ? 'bg-[#181a1f] border-stone-800'
                : theme === 'sepia'
                ? 'bg-[#f4ece0] border-[#e2d5bf]'
                : 'bg-stone-50 border-stone-200'
            }`}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono opacity-80">
                Table of Contents
              </h3>
              <button
                onClick={() => setShowToc(false)}
                className="text-xs font-semibold opacity-60 hover:opacity-100"
              >
                Close
              </button>
            </div>
            <ul className="space-y-1.5 text-xs">
              {chapters.map((ch, idx) => (
                <li key={ch.id}>
                  <button
                    onClick={() => handleSelectChapter(idx)}
                    className={`w-full text-left p-3 rounded-xl transition-colors ${
                      idx === currentChapterIndex
                        ? 'font-bold bg-black/10 dark:bg-white/10 ring-1 ring-amber-600/30'
                        : 'opacity-70 hover:opacity-100 hover:bg-black/5'
                    }`}
                  >
                    <span className="font-mono text-[10px] block opacity-60 mb-0.5">
                      CHAPTER {idx + 1} &middot; Approx. Page {idx * pagesPerChapter + 1}
                    </span>
                    <p className="line-clamp-2">{ch.title}</p>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* VIEW MODE 1 & 2: TEXT & PAGINATED READER */}
        {viewMode !== 'pdf' && (
          <main
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 flex flex-col items-center"
          >
            {/* Zoom Scaling Wrapper */}
            <div
              className="w-full max-w-3xl transition-transform duration-150 origin-top"
              style={{
                transform: `scale(${zoomLevel / 100})`,
              }}
            >
              {viewMode === 'paginated' ? (
                /* Paginated Paper Card */
                <div
                  className={`rounded-2xl border p-6 sm:p-12 sm:min-h-[750px] shadow-sm relative flex flex-col justify-between ${
                    theme === 'dark'
                      ? 'bg-[#16181d] border-stone-800/90 text-[#e4e6ea]'
                      : theme === 'sepia'
                      ? 'bg-[#fbf7ee] border-[#e5d8c3] text-[#342718]'
                      : 'bg-white border-stone-200 text-stone-900'
                  }`}
                >
                  {/* Top Running Header */}
                  <div className="flex items-center justify-between border-b border-inherit/25 pb-3 text-[11px] font-mono opacity-70">
                    <span className="truncate max-w-[200px]">{book.title}</span>
                    <span className="uppercase tracking-widest font-semibold">
                      Page {currentPage} of {totalPages}
                    </span>
                    <span className="hidden sm:inline truncate max-w-[150px]">{book.author}</span>
                  </div>

                  {/* Main Chapter Content */}
                  <div className="my-8 flex-1">
                    <div className="mb-8 text-center">
                      <span className="text-[11px] font-mono tracking-widest uppercase opacity-60 block mb-2 font-bold">
                        Chapter {currentChapterIndex + 1} of {chapters.length}
                      </span>
                      <h2
                        className={`text-2xl sm:text-3xl font-bold tracking-tight leading-snug ${
                          fontFamily === 'serif' ? 'font-serif-display' : 'font-sans-body'
                        }`}
                      >
                        {currentChapter.title}
                      </h2>
                    </div>

                    <article
                      className={`prose max-w-none leading-relaxed whitespace-pre-line text-justify ${
                        fontFamily === 'serif' ? 'font-serif-display' : 'font-sans-body'
                      }`}
                      style={{
                        fontSize: `${fontSize}px`,
                        lineHeight: 1.85,
                      }}
                    >
                      {currentChapter.content}
                    </article>
                  </div>

                  {/* Bottom Running Footer */}
                  <div className="border-t border-inherit/25 pt-4 flex items-center justify-between text-[11px] opacity-70 font-mono">
                    <span>Reading Progress: {progress}%</span>
                    <span className="font-bold">— {currentPage} —</span>
                    <span className="hidden sm:inline">
                      {isDownloadPermitted ? 'Permitted Archival Edition' : 'In-Library Restricted'}
                    </span>
                  </div>
                </div>
              ) : (
                /* Continuous Scroll View */
                <div
                  className={`rounded-2xl border p-6 sm:p-12 shadow-sm space-y-12 ${
                    theme === 'dark'
                      ? 'bg-[#16181d] border-stone-800/90 text-[#e4e6ea]'
                      : theme === 'sepia'
                      ? 'bg-[#fbf7ee] border-[#e5d8c3] text-[#342718]'
                      : 'bg-white border-stone-200 text-stone-900'
                  }`}
                >
                  <div className="border-b border-inherit/25 pb-6 text-center">
                    <span className="text-xs font-mono uppercase tracking-widest opacity-60">
                      CONTINUOUS READING STREAM
                    </span>
                    <h1 className="font-serif-display text-3xl font-bold mt-2">{book.title}</h1>
                    <p className="text-sm opacity-75 mt-1">by {book.author}</p>
                  </div>

                  {chapters.map((ch, idx) => (
                    <section key={ch.id} className="pt-6 border-b border-inherit/15 pb-10">
                      <span className="text-[11px] font-mono tracking-widest uppercase opacity-60 block mb-2 font-bold">
                        CHAPTER {idx + 1}
                      </span>
                      <h2
                        className={`text-2xl font-bold mb-6 ${
                          fontFamily === 'serif' ? 'font-serif-display' : 'font-sans-body'
                        }`}
                      >
                        {ch.title}
                      </h2>
                      <article
                        className={`prose max-w-none leading-relaxed whitespace-pre-line text-justify ${
                          fontFamily === 'serif' ? 'font-serif-display' : 'font-sans-body'
                        }`}
                        style={{
                          fontSize: `${fontSize}px`,
                          lineHeight: 1.85,
                        }}
                      >
                        {ch.content}
                      </article>
                    </section>
                  ))}
                </div>
              )}
            </div>
          </main>
        )}

        {/* VIEW MODE 3: EMBEDDED PDF DOCUMENT VIEWER */}
        {viewMode === 'pdf' && (
          <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8">
            <div className="bg-white rounded-2xl border border-stone-300/80 shadow-md flex-1 flex flex-col overflow-hidden min-h-[700px]">
              {/* PDF Toolbar */}
              <div className="p-3 bg-stone-100 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] uppercase">
                    PDF Document Stream
                  </span>
                  <span className="font-semibold truncate max-w-xs">{book.title}.pdf</span>
                </div>

                <div className="flex items-center gap-2">
                  {pdfCustomUrl && (
                    <a
                      href={pdfCustomUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 font-semibold text-stone-800 transition-colors"
                      title="Open in new window"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Pop Out</span>
                    </a>
                  )}

                  <button
                    onClick={() => setViewMode('paginated')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-900 text-white hover:bg-stone-800 font-semibold transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Switch to Text Pages</span>
                  </button>
                </div>
              </div>

              {/* PDF Display Container */}
              {pdfCustomUrl ? (
                <div className="flex-1 relative bg-stone-800 flex items-center justify-center min-h-[600px]">
                  <iframe
                    src={pdfCustomUrl}
                    title={`${book.title} PDF Document`}
                    className="w-full h-full min-h-[650px] border-0 bg-white"
                    style={{
                      transform: `scale(${zoomLevel / 100})`,
                      transformOrigin: 'top center',
                    }}
                  />
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-xs">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-display text-lg font-bold text-stone-900">
                    PDF Source File Not Specified
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    This volume is currently available in the rich typographic formatted reader. You can switch to the Pages tab or provide an external PDF link below.
                  </p>
                  <div className="w-full space-y-2 pt-2">
                    <input
                      type="url"
                      placeholder="https://example.com/volume.pdf"
                      value={pdfCustomUrl}
                      onChange={(e) => setPdfCustomUrl(e.target.value)}
                      className="w-full py-2 px-3 text-xs border border-stone-300 rounded-xl font-mono focus:outline-none focus:border-stone-900"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setPdfCustomUrl(
                            'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
                          )
                        }
                        className="flex-1 py-2 px-3 text-xs bg-stone-100 hover:bg-stone-200 rounded-xl font-medium text-stone-700 transition-colors"
                      >
                        Load Sample Academic Paper
                      </button>
                      <button
                        onClick={() => setViewMode('paginated')}
                        className="flex-1 py-2 px-3 text-xs bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold transition-colors"
                      >
                        Read Text Pages
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        )}
      </div>

      {/* 4. BOTTOM FLOATING CONTROLS & PAGE NAVIGATION BAR */}
      <footer
        className={`sticky bottom-0 z-30 px-3 sm:px-6 py-2.5 border-t backdrop-blur-md transition-colors ${
          theme === 'dark'
            ? 'bg-[#181a1f]/95 border-stone-800 text-stone-200'
            : theme === 'sepia'
            ? 'bg-[#f4ece0]/95 border-[#e4d7c3] text-[#382d1f]'
            : 'bg-white/95 border-stone-200 text-stone-900'
        }`}
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: Quick Page Turn Controls */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => handleJumpToPage(1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-xl border border-inherit hover:opacity-80 disabled:opacity-30 transition-opacity"
              title="First Page (Home)"
            >
              <ChevronFirst className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="py-1.5 px-3 rounded-xl border border-inherit flex items-center gap-1 text-xs font-semibold hover:opacity-80 disabled:opacity-30 transition-all active:scale-[0.98]"
              title="Previous Page (ArrowLeft)"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            {/* Jump to Page Input */}
            <div className="flex items-center gap-1 text-xs font-mono">
              <span className="opacity-70">Page</span>
              <input
                type="text"
                value={pageJumpInput}
                onChange={(e) => setPageJumpInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const parsed = parseInt(pageJumpInput, 10);
                    if (!isNaN(parsed)) handleJumpToPage(parsed);
                  }
                }}
                className="w-12 text-center py-1 px-1 rounded-lg border border-inherit bg-transparent font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <span className="opacity-70">of {totalPages}</span>
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="py-1.5 px-3 rounded-xl border border-inherit flex items-center gap-1 text-xs font-semibold hover:opacity-80 disabled:opacity-30 transition-all active:scale-[0.98]"
              title="Next Page (ArrowRight)"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleJumpToPage(totalPages)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-xl border border-inherit hover:opacity-80 disabled:opacity-30 transition-opacity"
              title="Last Page (End)"
            >
              <ChevronLast className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Progress Slider & Percentage */}
          <div className="flex items-center gap-3 w-full sm:w-64">
            <input
              type="range"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => handleJumpToPage(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-black/15 dark:bg-white/15 rounded-lg appearance-none cursor-pointer accent-amber-600"
              title="Scrub page slider"
            />
            <span className="text-xs font-mono font-bold tabular-nums w-12 text-right">
              {progress}%
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
