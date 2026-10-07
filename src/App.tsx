import React, { useState, useEffect, useCallback } from 'react';
import { Book, Category, LibraryStats, User } from './types';
import { storage } from './services/storage';
import { AuthProvider, useAuth } from './services/authContext';
import { ToastProvider, useToast } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BookFormModal } from './components/admin/BookFormModal';
import { AdminSidebar } from './components/admin/AdminSidebar';

// Pages
import { HomePage } from './pages/HomePage';
import { BrowseBooksPage } from './pages/BrowseBooksPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { BookDetailsPage } from './pages/BookDetailsPage';
import { EBookReaderPage } from './pages/EBookReaderPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ReadingHistoryPage } from './pages/ReadingHistoryPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Admin Subpages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminBooksPage } from './pages/admin/AdminBooksPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminAvailabilityPage } from './pages/admin/AdminAvailabilityPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { supabaseService, isSupabaseConfigured } from './services/supabase';
import { SupabaseSetupModal } from './components/SupabaseSetupModal';
import { Shield, Lock } from 'lucide-react';

const MainApp: React.FC = () => {
  const { currentUser, isAdmin, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // App Navigation State
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [previousTab, setPreviousTab] = useState<string>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [readingBook, setReadingBook] = useState<Book | null>(null);

  // Search/Category filtering params passed to Browse page
  const [browseSearchParam, setBrowseSearchParam] = useState<string>('');
  const [browseCategoryParam, setBrowseCategoryParam] = useState<string>('all');

  // Database State synced with Supabase / localStorage
  const [books, setBooks] = useState<Book[]>(() => storage.getBooks());
  const [categories, setCategories] = useState<Category[]>(() => storage.getCategories());
  const [users, setUsers] = useState<User[]>(() => storage.getUsers());
  const [stats, setStats] = useState<LibraryStats>(() => storage.getLibraryStats());
  const [favorites, setFavorites] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Admin Book Modal & Supabase Setup Modal State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Reload data from Supabase service layer
  const reloadData = useCallback(async () => {
    try {
      const [updatedBooks, updatedCategories, updatedUsers, updatedStats] = await Promise.all([
        supabaseService.getBooks(),
        supabaseService.getCategories(),
        supabaseService.getUsers(),
        supabaseService.getLibraryStats(),
      ]);

      setBooks(updatedBooks);
      setCategories(updatedCategories);
      setUsers(updatedUsers);
      setStats(updatedStats);
      setRefreshKey((k) => k + 1);

      if (currentUser) {
        const userFavs = await supabaseService.getUserFavoriteIds(currentUser.id);
        setFavorites(userFavs);
      } else {
        setFavorites([]);
      }
    } catch (e) {
      console.error('Data reload error, falling back to local storage:', e);
      setBooks(storage.getBooks());
      setCategories(storage.getCategories());
      setUsers(storage.getUsers());
      setStats(storage.getLibraryStats());
    }
  }, [currentUser]);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  // Navigation Handler
  const handleNavigate = (tab: string, param?: string) => {
    // If param is a category or search keyword
    if (tab === 'browse') {
      if (param && param.startsWith('category:')) {
        setBrowseCategoryParam(param.replace('category:', ''));
        setBrowseSearchParam('');
      } else if (param) {
        setBrowseSearchParam(param);
        setBrowseCategoryParam('all');
      } else {
        setBrowseSearchParam('');
        setBrowseCategoryParam('all');
      }
    }

    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Book Details
  const handleSelectBook = (book: Book) => {
    setPreviousTab(currentTab);
    setSelectedBook(book);
    setCurrentTab('book-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start E-Book Reader
  const handleReadBook = (book: Book) => {
    setPreviousTab(currentTab);
    setReadingBook(book);
    setCurrentTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Favorite
  const handleToggleFavorite = async (book: Book) => {
    if (!currentUser) {
      toast('Please log in to save books to favorites.', 'info');
      handleNavigate('login');
      return;
    }
    const added = await supabaseService.toggleFavorite(currentUser.id, book.id);
    await reloadData();
    toast(
      added
        ? `Added "${book.title}" to favorites.`
        : `Removed "${book.title}" from favorites.`,
      'success'
    );
  };

  // Admin: Book CRUD
  const handleSaveBook = async (bookData: Partial<Book>) => {
    await supabaseService.saveBook(bookData as Book);
    setIsBookModalOpen(false);
    setBookToEdit(null);
    await reloadData();
    toast(
      bookToEdit
        ? `Updated "${bookData.title}" details successfully.`
        : `Added new e-book "${bookData.title}" to library.`,
      'success'
    );
  };

  const handleDeleteBook = async (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    await supabaseService.deleteBook(bookId);
    await reloadData();
    toast(`Deleted volume "${book?.title || 'Book'}" from catalog.`, 'info');
  };

  const handleToggleAvailability = async (bookId: string) => {
    await supabaseService.toggleBookAvailability(bookId);
    await reloadData();
    const targetBook = books.find((b) => b.id === bookId);
    const newStatus = targetBook ? !targetBook.availability : true;
    toast(
      `"${targetBook?.title || 'Book'}" is now marked as ${newStatus ? 'Available' : 'Unavailable'}.`,
      'success'
    );
  };

  // Admin: Category CRUD
  const handleSaveCategory = async (cat: Category) => {
    await supabaseService.saveCategory(cat);
    await reloadData();
    toast(`Category "${cat.name}" saved successfully.`, 'success');
  };

  const handleDeleteCategory = async (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    await supabaseService.deleteCategory(catId);
    await reloadData();
    toast(`Deleted category "${cat?.name || 'Category'}".`, 'info');
  };

  // Admin: User status toggle
  const handleToggleUserStatus = async (userId: string) => {
    const updated = await supabaseService.toggleUserStatus(userId);
    await reloadData();
    if (updated) {
      toast(
        `User ${updated.name} account is now ${updated.status}.`,
        updated.status === 'active' ? 'success' : 'info'
      );
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    await supabaseService.deleteUser(userId);
    await reloadData();
    toast(`Deleted patron account for "${user?.name || 'User'}".`, 'info');
  };

  // Render Reader Fullscreen Mode
  if (currentTab === 'reader' && readingBook) {
    return (
      <EBookReaderPage
        book={readingBook}
        onBack={() => {
          reloadData();
          setCurrentTab(previousTab || (selectedBook ? 'book-details' : 'home'));
        }}
      />
    );
  }

  // Is Admin View
  const isAdminView = currentTab.startsWith('admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-stone-900 font-sans-body">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isAdminView ? (
          /* Admin Console Shell */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {!isAdmin ? (
              /* Access Protection Screen if not admin */
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-4 my-12 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="font-serif-display text-2xl font-bold text-stone-900">
                  Administrator Credentials Required
                </h2>
                <p className="text-xs text-stone-600 leading-relaxed">
                  The Library Operations Console is restricted to authenticated librarians and archival supervisors.
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => handleNavigate('login')}
                    className="py-2.5 px-4 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors"
                  >
                    Sign In as Administrator
                  </button>
                  <button
                    onClick={() => handleNavigate('home')}
                    className="py-2.5 px-4 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 rounded-xl transition-colors"
                  >
                    Return to Public Catalog
                  </button>
                </div>
              </div>
            ) : (
              /* Admin Layout with Sidebar + Active View */
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <AdminSidebar
                  currentTab={currentTab}
                  onNavigate={handleNavigate}
                  onOpenAddBookModal={() => {
                    setBookToEdit(null);
                    setIsBookModalOpen(true);
                  }}
                  onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
                  stats={{
                    totalBooks: stats.totalBooks,
                    totalCategories: stats.totalCategories,
                    totalUsers: stats.totalUsers,
                    unavailableBooks: stats.unavailableBooks,
                  }}
                />

                <div className="flex-1 w-full min-w-0">
                  {currentTab === 'admin-dashboard' && (
                    <AdminDashboardPage
                      stats={stats}
                      books={books}
                      categories={categories}
                      users={users}
                      onNavigateTab={handleNavigate}
                      onOpenAddBookModal={() => {
                        setBookToEdit(null);
                        setIsBookModalOpen(true);
                      }}
                      onSelectBook={handleSelectBook}
                    />
                  )}

                  {currentTab === 'admin-books' && (
                    <AdminBooksPage
                      books={books}
                      categories={categories}
                      onOpenAddModal={() => {
                        setBookToEdit(null);
                        setIsBookModalOpen(true);
                      }}
                      onEditBook={(b) => {
                        setBookToEdit(b);
                        setIsBookModalOpen(true);
                      }}
                      onDeleteBook={handleDeleteBook}
                      onToggleAvailability={handleToggleAvailability}
                      onPreviewBook={handleSelectBook}
                    />
                  )}

                  {currentTab === 'admin-categories' && (
                    <AdminCategoriesPage
                      categories={categories}
                      onSaveCategory={handleSaveCategory}
                      onDeleteCategory={handleDeleteCategory}
                    />
                  )}

                  {currentTab === 'admin-users' && (
                    <AdminUsersPage
                      users={users}
                      onToggleStatus={handleToggleUserStatus}
                      onDeleteUser={handleDeleteUser}
                    />
                  )}

                  {currentTab === 'admin-availability' && (
                    <AdminAvailabilityPage
                      books={books}
                      categories={categories}
                      onToggleAvailability={handleToggleAvailability}
                      onPreviewBook={handleSelectBook}
                    />
                  )}

                  {currentTab === 'admin-reports' && (
                    <AdminReportsPage
                      books={books}
                      categories={categories}
                      users={users}
                      stats={stats}
                    />
                  )}

                  {currentTab === 'admin-profile' && (
                    <AdminProfilePage onDataReset={reloadData} />
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Public & Reader User Shell */
          <>
            {currentTab === 'home' && (
              <HomePage
                books={books}
                categories={categories}
                stats={stats}
                onNavigate={handleNavigate}
                onSelectBook={handleSelectBook}
                onRead={handleReadBook}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
              />
            )}

            {currentTab === 'browse' && (
              <BrowseBooksPage
                books={books}
                categories={categories}
                initialSearch={browseSearchParam}
                initialCategory={browseCategoryParam}
                onSelectBook={handleSelectBook}
                onRead={handleReadBook}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
              />
            )}

            {currentTab === 'categories' && (
              <CategoriesPage
                categories={categories}
                books={books}
                onSelectCategory={(catId) => handleNavigate('browse', `category:${catId}`)}
                onSelectBook={handleSelectBook}
                onRead={handleReadBook}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
              />
            )}

            {currentTab === 'book-details' && selectedBook && (
              <BookDetailsPage
                book={selectedBook}
                categories={categories}
                allBooks={books}
                onBack={() => handleNavigate(previousTab || 'browse')}
                onRead={handleReadBook}
                onSelectBook={handleSelectBook}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
              />
            )}

            {currentTab === 'favorites' && (
              <FavoritesPage
                books={books}
                categories={categories}
                favoriteIds={favorites}
                onSelectBook={handleSelectBook}
                onRead={handleReadBook}
                onToggleFavorite={handleToggleFavorite}
                onNavigate={handleNavigate}
              />
            )}

            {(currentTab === 'history' || currentTab === 'reading-history') && (
              <ReadingHistoryPage
                books={books}
                categories={categories}
                onRead={handleReadBook}
                onSelectBook={handleSelectBook}
                onNavigate={handleNavigate}
                refreshKey={refreshKey}
              />
            )}

            {currentTab === 'user-dashboard' && (
              <UserDashboardPage
                books={books}
                categories={categories}
                favoriteIds={favorites}
                onSelectBook={handleSelectBook}
                onRead={handleReadBook}
                onToggleFavorite={handleToggleFavorite}
                onNavigate={handleNavigate}
                refreshKey={refreshKey}
              />
            )}

            {currentTab === 'user-profile' && <UserProfilePage />}

            {currentTab === 'login' && (
              <LoginPage
                onSuccess={(role) =>
                  handleNavigate(role === 'admin' ? 'admin-dashboard' : 'user-dashboard')
                }
                onNavigateToRegister={() => handleNavigate('register')}
              />
            )}

            {currentTab === 'register' && (
              <RegisterPage
                onSuccess={() => handleNavigate('user-dashboard')}
                onNavigateToLogin={() => handleNavigate('login')}
              />
            )}
          </>
        )}
      </main>

      {/* Global Book Form Modal (For Admin Add / Edit) */}
      <BookFormModal
        isOpen={isBookModalOpen}
        onClose={() => {
          setIsBookModalOpen(false);
          setBookToEdit(null);
        }}
        onSave={handleSaveBook}
        initialBook={bookToEdit}
        categories={categories}
      />

      {/* Supabase Database Architecture & Connection Modal */}
      <SupabaseSetupModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      {/* Footer */}
      {!isAdminView && <Footer onNavigate={handleNavigate} />}
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}
