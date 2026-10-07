export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  profileImage?: string;
  status: UserStatus;
  createdAt: string;
  bio?: string;
  favoriteGenre?: string;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  categoryId: string;
  description: string;
  coverImage?: string;
  coverColor?: string; // hex or theme for bespoke vector book cover
  ebookUrl?: string;
  publicationYear: number;
  language: string;
  pages: number;
  availability: boolean;
  rating: number;
  views: number;
  downloads: number;
  createdAt: string;
  isbn?: string;
  featured?: boolean;
  allowDownload?: boolean;
  chapters: Chapter[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  bookCount: number;
  iconName?: string;
}

export interface Favorite {
  id: string;
  userId: string;
  bookId: string;
  createdAt: string;
}

export interface ReadingHistoryItem {
  id: string;
  userId: string;
  bookId: string;
  lastReadAt: string;
  progress: number; // 0 to 100 percentage
  currentChapterIndex: number;
  currentPage?: number; // Last read physical page
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface LibraryStats {
  totalBooks: number;
  availableBooks: number;
  unavailableBooks: number;
  totalUsers: number;
  totalCategories: number;
  totalDownloads: number;
  totalViews: number;
}
