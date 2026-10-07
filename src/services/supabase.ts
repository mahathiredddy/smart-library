import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Book, Category, Favorite, LibraryStats, ReadingHistoryItem, User } from '../types';
import { storage } from './storage';

// 1. Environment Variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verify if valid Supabase configuration is supplied
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id') &&
  supabaseAnonKey.length > 20
);

// 2. Initialize Supabase Client
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Helper to convert DB snake_case book to camelCase Book
function mapDbBookToModel(dbBook: any): Book {
  return {
    id: dbBook.id,
    title: dbBook.title,
    author: dbBook.author,
    categoryId: dbBook.category_id,
    description: dbBook.description || '',
    coverImage: dbBook.cover_image,
    coverColor: dbBook.cover_color || '#1e293b',
    ebookUrl: dbBook.ebook_url,
    publicationYear: dbBook.publication_year || 2024,
    language: dbBook.language || 'English',
    pages: dbBook.pages || 200,
    availability: dbBook.availability ?? true,
    rating: Number(dbBook.rating) || 4.5,
    views: dbBook.views || 0,
    downloads: dbBook.downloads || 0,
    createdAt: dbBook.created_at || new Date().toISOString(),
    isbn: dbBook.isbn,
    featured: dbBook.featured ?? false,
    allowDownload: dbBook.allow_download ?? true,
    chapters: Array.isArray(dbBook.chapters) ? dbBook.chapters : [],
  };
}

// Helper to convert Book model to DB book record
function mapModelToDbBook(b: Partial<Book>): any {
  const record: any = {};
  if (b.id !== undefined) record.id = b.id;
  if (b.title !== undefined) record.title = b.title;
  if (b.author !== undefined) record.author = b.author;
  if (b.categoryId !== undefined) record.category_id = b.categoryId;
  if (b.description !== undefined) record.description = b.description;
  if (b.coverImage !== undefined) record.cover_image = b.coverImage;
  if (b.coverColor !== undefined) record.cover_color = b.coverColor;
  if (b.ebookUrl !== undefined) record.ebook_url = b.ebookUrl;
  if (b.publicationYear !== undefined) record.publication_year = b.publicationYear;
  if (b.language !== undefined) record.language = b.language;
  if (b.pages !== undefined) record.pages = b.pages;
  if (b.availability !== undefined) record.availability = b.availability;
  if (b.rating !== undefined) record.rating = b.rating;
  if (b.views !== undefined) record.views = b.views;
  if (b.downloads !== undefined) record.downloads = b.downloads;
  if (b.isbn !== undefined) record.isbn = b.isbn;
  if (b.featured !== undefined) record.featured = b.featured;
  if (b.allowDownload !== undefined) record.allow_download = b.allowDownload;
  if (b.chapters !== undefined) record.chapters = b.chapters;
  return record;
}

// Helper to convert DB category to Category model
function mapDbCategoryToModel(c: any, bookCount = 0): Category {
  return {
    id: c.id,
    name: c.name,
    description: c.description || '',
    iconName: c.icon_name || 'BookOpen',
    bookCount,
  };
}

// 3. Supabase Service Layer
export const supabaseService = {
  /**
   * Check connection status to Supabase
   */
  async checkConnection(): Promise<{
    status: 'connected' | 'not_configured' | 'schema_missing' | 'error';
    message: string;
  }> {
    if (!isSupabaseConfigured || !supabase) {
      return {
        status: 'not_configured',
        message: 'Supabase credentials (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are not set.',
      };
    }

    try {
      const { data, error } = await supabase.from('books').select('id').limit(1);
      if (error) {
        if (error.code === '42P01') {
          return {
            status: 'schema_missing',
            message: 'Connected to Supabase, but the "books" table was not found. Please execute supabase-schema.sql in your Supabase SQL editor.',
          };
        }
        return {
          status: 'error',
          message: `Supabase query error: ${error.message}`,
        };
      }
      return {
        status: 'connected',
        message: 'Successfully connected to live Supabase database with active RLS.',
      };
    } catch (err: any) {
      return {
        status: 'error',
        message: err.message || 'Failed to connect to Supabase.',
      };
    }
  },

  // ==========================================
  // AUTHENTICATION
  // ==========================================
  async signIn(email: string, password?: string): Promise<{ success: boolean; user?: User; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      // Fallback to local storage
      const localUser = storage.getUserByEmail(email);
      if (!localUser) return { success: false, error: 'User not found.' };
      if (localUser.status === 'inactive') return { success: false, error: 'Account deactivated.' };
      if (password && localUser.password && localUser.password !== password) {
        return { success: false, error: 'Incorrect password.' };
      }
      return { success: true, user: localUser };
    }

    try {
      // Query users table in Supabase
      const { data: dbUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      if (error) throw error;
      if (!dbUser) {
        return { success: false, error: 'Patron account not found with this email.' };
      }

      if (dbUser.status === 'inactive') {
        return { success: false, error: 'This patron account is currently suspended by administration.' };
      }

      if (password && dbUser.password && dbUser.password !== password) {
        return { success: false, error: 'Invalid password credentials.' };
      }

      const user: User = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        status: dbUser.status,
        createdAt: dbUser.created_at,
        bio: dbUser.bio,
        favoriteGenre: dbUser.favorite_genre,
        profileImage: dbUser.profile_image,
      };

      return { success: true, user };
    } catch (err: any) {
      console.warn('Supabase auth fallback to local:', err.message);
      const localUser = storage.getUserByEmail(email);
      if (localUser) return { success: true, user: localUser };
      return { success: false, error: err.message || 'Sign in failed.' };
    }
  },

  async signUp(data: {
    name: string;
    email: string;
    password?: string;
    favoriteGenre?: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password || 'password123',
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
      bio: 'Enrolled Scholar Patron',
      favoriteGenre: data.favoriteGenre || 'General',
    };

    if (!isSupabaseConfigured || !supabase) {
      const existing = storage.getUserByEmail(data.email);
      if (existing) return { success: false, error: 'An account with this email already exists.' };
      storage.saveUser(newUser);
      return { success: true, user: newUser };
    }

    try {
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', newUser.email)
        .maybeSingle();

      if (existing) {
        return { success: false, error: 'An account with this email address already exists in the catalog.' };
      }

      const { error } = await supabase.from('users').insert({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        status: newUser.status,
        bio: newUser.bio,
        favorite_genre: newUser.favoriteGenre,
      });

      if (error) throw error;
      return { success: true, user: newUser };
    } catch (err: any) {
      console.warn('Supabase signup fallback to local:', err.message);
      storage.saveUser(newUser);
      return { success: true, user: newUser };
    }
  },

  // ==========================================
  // BOOKS CRUD
  // ==========================================
  async getBooks(): Promise<Book[]> {
    if (!isSupabaseConfigured || !supabase) {
      return storage.getBooks();
    }

    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) {
        // If Supabase table is empty, seed or return local
        return storage.getBooks();
      }

      return data.map(mapDbBookToModel);
    } catch (err: any) {
      console.warn('Supabase getBooks error, falling back to local storage:', err.message);
      return storage.getBooks();
    }
  },

  async saveBook(book: Book): Promise<Book> {
    // Keep local storage in sync
    storage.saveBook(book);

    if (isSupabaseConfigured && supabase) {
      try {
        const dbRecord = mapModelToDbBook(book);
        const { error } = await supabase.from('books').upsert(dbRecord);
        if (error) console.error('Supabase saveBook error:', error);
      } catch (err) {
        console.error('Supabase saveBook exception:', err);
      }
    }

    return book;
  },

  async deleteBook(bookId: string): Promise<boolean> {
    storage.deleteBook(bookId);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('books').delete().eq('id', bookId);
        if (error) console.error('Supabase deleteBook error:', error);
      } catch (err) {
        console.error('Supabase deleteBook exception:', err);
      }
    }

    return true;
  },

  async toggleBookAvailability(bookId: string): Promise<Book | undefined> {
    const updated = storage.toggleBookAvailability(bookId);

    if (isSupabaseConfigured && supabase) {
      try {
        const targetBook = storage.getBookById(bookId);
        if (targetBook) {
          await supabase
            .from('books')
            .update({ availability: targetBook.availability, updated_at: new Date().toISOString() })
            .eq('id', bookId);
        }
      } catch (err) {
        console.error('Supabase toggleBookAvailability error:', err);
      }
    }

    return updated;
  },

  async incrementBookViews(bookId: string): Promise<void> {
    storage.incrementBookViews(bookId);

    if (isSupabaseConfigured && supabase) {
      try {
        const targetBook = storage.getBookById(bookId);
        if (targetBook) {
          await supabase
            .from('books')
            .update({ views: targetBook.views })
            .eq('id', bookId);
        }
      } catch (err) {
        console.error('Supabase incrementViews error:', err);
      }
    }
  },

  async incrementBookDownloads(bookId: string): Promise<void> {
    storage.incrementBookDownloads(bookId);

    if (isSupabaseConfigured && supabase) {
      try {
        const targetBook = storage.getBookById(bookId);
        if (targetBook) {
          await supabase
            .from('books')
            .update({ downloads: targetBook.downloads })
            .eq('id', bookId);
        }
      } catch (err) {
        console.error('Supabase incrementDownloads error:', err);
      }
    }
  },

  // ==========================================
  // CATEGORIES CRUD
  // ==========================================
  async getCategories(): Promise<Category[]> {
    if (!isSupabaseConfigured || !supabase) {
      return storage.getCategories();
    }

    try {
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (catError) throw catError;
      if (!catData || catData.length === 0) {
        return storage.getCategories();
      }

      // Get book counts per category
      const { data: booksData } = await supabase.from('books').select('category_id');
      const countMap: Record<string, number> = {};
      if (booksData) {
        for (const b of booksData) {
          if (b.category_id) {
            countMap[b.category_id] = (countMap[b.category_id] || 0) + 1;
          }
        }
      }

      return catData.map((c) => mapDbCategoryToModel(c, countMap[c.id] || 0));
    } catch (err: any) {
      console.warn('Supabase getCategories error, falling back to local storage:', err.message);
      return storage.getCategories();
    }
  },

  async saveCategory(cat: Category): Promise<Category> {
    storage.saveCategory(cat);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('categories').upsert({
          id: cat.id,
          name: cat.name,
          description: cat.description,
          icon_name: cat.iconName || 'BookOpen',
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Supabase saveCategory error:', err);
      }
    }

    return cat;
  },

  async deleteCategory(catId: string): Promise<boolean> {
    storage.deleteCategory(catId);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('categories').delete().eq('id', catId);
      } catch (err) {
        console.error('Supabase deleteCategory error:', err);
      }
    }

    return true;
  },

  // ==========================================
  // USERS MANAGEMENT
  // ==========================================
  async getUsers(): Promise<User[]> {
    if (!isSupabaseConfigured || !supabase) {
      return storage.getUsers();
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) return storage.getUsers();

      return data.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
        createdAt: u.created_at,
        bio: u.bio,
        favoriteGenre: u.favorite_genre,
        profileImage: u.profile_image,
      }));
    } catch (err: any) {
      console.warn('Supabase getUsers error, falling back to local storage:', err.message);
      return storage.getUsers();
    }
  },

  async updateUser(user: User): Promise<User> {
    storage.saveUser(user);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('users').update({
          name: user.name,
          role: user.role,
          status: user.status,
          bio: user.bio,
          favorite_genre: user.favoriteGenre,
          profile_image: user.profileImage,
          updated_at: new Date().toISOString(),
        }).eq('id', user.id);
      } catch (err) {
        console.error('Supabase updateUser error:', err);
      }
    }

    return user;
  },

  async toggleUserStatus(userId: string): Promise<User | undefined> {
    const updated = storage.toggleUserStatus(userId);

    if (isSupabaseConfigured && supabase && updated) {
      try {
        await supabase
          .from('users')
          .update({ status: updated.status, updated_at: new Date().toISOString() })
          .eq('id', userId);
      } catch (err) {
        console.error('Supabase toggleUserStatus error:', err);
      }
    }

    return updated;
  },

  async deleteUser(userId: string): Promise<boolean> {
    storage.deleteUser(userId);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('users').delete().eq('id', userId);
      } catch (err) {
        console.error('Supabase deleteUser error:', err);
      }
    }

    return true;
  },

  // ==========================================
  // FAVORITES
  // ==========================================
  async getUserFavoriteIds(userId: string): Promise<string[]> {
    if (!isSupabaseConfigured || !supabase) {
      return storage.getUserFavorites(userId).map((b) => b.id);
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('book_id')
        .eq('user_id', userId);

      if (error) throw error;
      if (!data) return storage.getUserFavorites(userId).map((b) => b.id);

      return data.map((f) => f.book_id);
    } catch (err: any) {
      console.warn('Supabase getUserFavoriteIds error, falling back to local:', err.message);
      return storage.getUserFavorites(userId).map((b) => b.id);
    }
  },

  async toggleFavorite(userId: string, bookId: string): Promise<boolean> {
    const isNowFav = storage.toggleFavorite(userId, bookId);

    if (isSupabaseConfigured && supabase) {
      try {
        if (isNowFav) {
          await supabase.from('favorites').upsert({
            user_id: userId,
            book_id: bookId,
          });
        } else {
          await supabase
            .from('favorites')
            .delete()
            .match({ user_id: userId, book_id: bookId });
        }
      } catch (err) {
        console.error('Supabase toggleFavorite error:', err);
      }
    }

    return isNowFav;
  },

  // ==========================================
  // READING HISTORY
  // ==========================================
  async getUserReadingHistory(userId: string): Promise<Array<ReadingHistoryItem & { book?: Book }>> {
    if (!isSupabaseConfigured || !supabase) {
      return storage.getUserReadingHistory(userId);
    }

    try {
      const { data, error } = await supabase
        .from('reading_history')
        .select('*, books(*)')
        .eq('user_id', userId)
        .order('last_read_at', { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) return storage.getUserReadingHistory(userId);

      return data.map((item: any) => ({
        id: item.id,
        userId: item.user_id,
        bookId: item.book_id,
        lastReadAt: item.last_read_at,
        progress: item.progress,
        currentChapterIndex: item.current_chapter_index || 0,
        currentPage: item.current_page || 1,
        book: item.books ? mapDbBookToModel(item.books) : storage.getBookById(item.book_id),
      }));
    } catch (err: any) {
      console.warn('Supabase getUserReadingHistory error, falling back to local:', err.message);
      return storage.getUserReadingHistory(userId);
    }
  },

  async saveReadingProgress(
    userId: string,
    bookId: string,
    progress: number,
    currentChapterIndex = 0,
    currentPage = 1
  ): Promise<void> {
    storage.saveReadingProgress(userId, bookId, progress, currentChapterIndex, currentPage);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('reading_history').upsert({
          user_id: userId,
          book_id: bookId,
          progress,
          current_chapter_index: currentChapterIndex,
          current_page: currentPage,
          last_read_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,book_id',
        });
      } catch (err) {
        console.error('Supabase saveReadingProgress error:', err);
      }
    }
  },

  // ==========================================
  // LIBRARY STATS
  // ==========================================
  async getLibraryStats(): Promise<LibraryStats> {
    return storage.getLibraryStats();
  },
};
