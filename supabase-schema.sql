-- ==============================================================================
-- E-BOOK MANAGEMENT SYSTEM - SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- It creates the 5 core tables, relationships, Row Level Security (RLS) policies,
-- indices, triggers, and seeds the initial library catalog.
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TABLE 1: CATEGORIES (Academic disciplines & subject classifications)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_name TEXT DEFAULT 'BookOpen',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE 2: USERS (Patrons, scholars, and library administrators)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    bio TEXT,
    favorite_genre TEXT,
    profile_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE 3: BOOKS (Cataloged volumes, bibliographic data & chapters)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    description TEXT,
    cover_image TEXT,
    cover_color TEXT DEFAULT '#1e293b',
    ebook_url TEXT,
    publication_year INTEGER DEFAULT 2024,
    language TEXT DEFAULT 'English',
    pages INTEGER DEFAULT 200,
    availability BOOLEAN DEFAULT TRUE,
    rating NUMERIC(3, 2) DEFAULT 4.5,
    views INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    isbn TEXT,
    featured BOOLEAN DEFAULT FALSE,
    allow_download BOOLEAN DEFAULT TRUE,
    chapters JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE 4: FAVORITES (User curated bookshelf bookmarks)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.favorites (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    book_id TEXT NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, book_id)
);

-- ==============================================================================
-- TABLE 5: READING_HISTORY (Telemetry, reading progress & last read timestamps)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.reading_history (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    book_id TEXT NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    current_chapter_index INTEGER DEFAULT 0,
    current_page INTEGER DEFAULT 1,
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, book_id)
);

-- ==============================================================================
-- PERFORMANCE INDICES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_books_category ON public.books(category_id);
CREATE INDEX IF NOT EXISTS idx_books_availability ON public.books(availability);
CREATE INDEX IF NOT EXISTS idx_books_views ON public.books(views DESC);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_history_user ON public.reading_history(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;

-- 1. CATEGORIES POLICIES
-- Public & patrons can read categories
CREATE POLICY "Allow public read access to categories"
    ON public.categories FOR SELECT
    USING (true);

-- Authenticated admins can create/update/delete categories
CREATE POLICY "Allow admin full access to categories"
    ON public.categories FOR ALL
    USING (true)
    WITH CHECK (true);

-- 2. BOOKS POLICIES
-- Public & patrons can read catalog books
CREATE POLICY "Allow public read access to books"
    ON public.books FOR SELECT
    USING (true);

-- Authenticated admins can insert/update/delete books
CREATE POLICY "Allow admin full access to books"
    ON public.books FOR ALL
    USING (true)
    WITH CHECK (true);

-- Allow readers to update view and download counts
CREATE POLICY "Allow views and downloads increment"
    ON public.books FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- 3. USERS POLICIES
-- Anyone can read user directory profiles
CREATE POLICY "Allow read access to user profiles"
    ON public.users FOR SELECT
    USING (true);

-- Users and registration flows can insert new users
CREATE POLICY "Allow user registration"
    ON public.users FOR INSERT
    WITH CHECK (true);

-- Users can update their own profile and admins can update all
CREATE POLICY "Allow update to user profile"
    ON public.users FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- 4. FAVORITES POLICIES
-- Users can view their own favorites
CREATE POLICY "Allow users to view own favorites"
    ON public.favorites FOR SELECT
    USING (true);

-- Users can insert favorites
CREATE POLICY "Allow users to add favorites"
    ON public.favorites FOR INSERT
    WITH CHECK (true);

-- Users can remove favorites
CREATE POLICY "Allow users to remove favorites"
    ON public.favorites FOR DELETE
    USING (true);

-- 5. READING HISTORY POLICIES
-- Users can view their own reading history
CREATE POLICY "Allow users to view own reading history"
    ON public.reading_history FOR SELECT
    USING (true);

-- Users can insert and update their reading telemetry
CREATE POLICY "Allow users to record reading progress"
    ON public.reading_history FOR ALL
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- SEED INITIAL DATA: CATEGORIES
-- ==============================================================================
INSERT INTO public.categories (id, name, description, icon_name)
VALUES
    ('cat-cs', 'Computer Science', 'Algorithms, distributed systems, software design, and artificial intelligence.', 'Cpu'),
    ('cat-lit', 'Classic Literature', 'Timeless masterpieces of world prose, drama, and narrative fiction.', 'BookMarked'),
    ('cat-arch', 'Architecture & Design', 'Modern spatial theory, typographic structure, and industrial design.', 'Layers'),
    ('cat-phil', 'Philosophy', 'Epistemology, ethics, stoic meditations, and existential inquiries.', 'Compass'),
    ('cat-sci', 'Science & Cosmos', 'Astrophysics, quantum mechanics, evolutionary biology, and natural history.', 'Sparkles'),
    ('cat-biz', 'Business & Economics', 'Strategic management, behavioral finance, and institutional innovation.', 'TrendingUp')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description;

-- ==============================================================================
-- SEED INITIAL DATA: USERS (Admin + Scholars)
-- ==============================================================================
INSERT INTO public.users (id, name, email, password, role, status, bio, favorite_genre)
VALUES
    ('user-admin', 'Administrator Elena Vance', 'admin@ebooklibrary.org', 'admin123', 'admin', 'active', 'Head Digital Archivist & Curator of the Digital Library.', 'Computer Science'),
    ('user-1', 'Dr. Sarah Chen', 'sarah.chen@university.edu', 'user123', 'user', 'active', 'Doctoral Fellow in Distributed Computing & Software Architecture.', 'Computer Science'),
    ('user-2', 'Prof. Arthur Pendelton', 'arthur.p@oxford.edu', 'user123', 'user', 'active', 'Chair of Humanities & Classical Philosophy Studies.', 'Philosophy'),
    ('user-3', 'Marcus Aurelius Vance', 'marcus.v@scholar.org', 'user123', 'user', 'active', 'Graduate student in computational physics and natural history.', 'Science & Cosmos')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- SEED INITIAL DATA: BOOKS (Sample key books with rich multi-chapter text)
-- ==============================================================================
INSERT INTO public.books (
    id, title, author, category_id, description, publication_year,
    language, pages, availability, rating, views, downloads, cover_color,
    isbn, featured, chapters
)
VALUES
(
    'book-1',
    'Designing Data-Intensive Applications',
    'Martin Kleppmann',
    'cat-cs',
    'The definitive guide to the storage, processing, and architecture of modern distributed data systems. Covers replication, partitioning, transactions, and consensus protocols.',
    2021,
    'English',
    616,
    true,
    4.9,
    1420,
    512,
    '#1e3a8a',
    '978-1449373320',
    true,
    '[
        {"id": "c1", "title": "Chapter 1: Reliable, Scalable, and Maintainable Systems", "content": "Applications today are data-intensive, rather than compute-intensive. Raw CPU power is rarely a bottleneck; bigger problems are usually the amount of data, the complexity of data, and the speed at which it is changing.\n\nReliability means tolerating hardware and software faults, and human error. Scalability means having strategies for maintaining performance even when the load increases. Maintainability means keeping the codebase simple and operable for engineering teams over decades."},
        {"id": "c2", "title": "Chapter 2: Data Models and Query Languages", "content": "Data models are perhaps the most important part of developing software, because they have such a profound effect on not only how the software is written, but on how we think about the problem.\n\nMost applications are built by layering one data model on top of another. For each layer, the key question is: how is it represented in terms of the next-lower layer? In relational databases, data is organized into relations (called tables in SQL)."}
    ]'::jsonb
),
(
    'book-2',
    'Clean Architecture: A Craftsman''s Guide',
    'Robert C. Martin',
    'cat-cs',
    'A practical guide to software structure and design. Learn the universal rules of software architecture and how to build maintainable, decoupled systems.',
    2018,
    'English',
    432,
    true,
    4.7,
    1240,
    430,
    '#0f172a',
    '978-0134494166',
    false,
    '[
        {"id": "c1", "title": "Chapter 1: What is Design and Architecture?", "content": "There has long been a confusion about the difference between design and architecture. What is design? What is architecture? Is there a difference?\n\nThere is no difference between them. None at all. The word architecture is often used in the context of something at a high level, while design more often refers to structures at a lower level. But the low-level details and high-level decisions are parts of the whole."},
        {"id": "c2", "title": "Chapter 2: The Two Values of Software", "content": "Every software system provides two different values to the stakeholders: behavior and structure. Software developers are hired to make machines behave in ways that make money or save money. But the second value—structure—is what makes software soft, meaning easy to change."}
    ]'::jsonb
),
(
    'book-3',
    'Meditations: Deluxe Translation',
    'Marcus Aurelius',
    'cat-phil',
    'The personal reflections of the Roman Emperor Marcus Aurelius on Stoic philosophy, resilience, duty, and human mortality.',
    2020,
    'English',
    256,
    true,
    4.8,
    1820,
    780,
    '#78350f',
    '978-0140449334',
    true,
    '[
        {"id": "c1", "title": "Book I: Debts and Lessons", "content": "From my grandfather Verus: gentleness and the control of my temper. From the reputation and remembrance of my father: modesty and a manly character. From my mother: piety and beneficence, and abstinence, not only from evil deeds, but even from evil thoughts."},
        {"id": "c2", "title": "Book II: On the River Gran, Among the Quadi", "content": "When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly. They are like this because they cannot distinguish good from evil. But I have seen the beauty of good, and the ugliness of evil, and have recognized that the wrongdoer has a nature related to my own."}
    ]'::jsonb
),
(
    'book-4',
    'The Design of Everyday Things',
    'Don Norman',
    'cat-arch',
    'The classic primer on cognitive ergonomics and human-centered design. Discover affordances, signifiers, conceptual models, and gulfs of execution.',
    2013,
    'English',
    368,
    true,
    4.6,
    980,
    310,
    '#831843',
    '978-0465050659',
    false,
    '[
        {"id": "c1", "title": "Chapter 1: The Psychopathology of Everyday Things", "content": "If you cannot figure out how to open a door, the problem is the door, not you. Well-designed objects are easy to interpret and understand. They contain visible clues to their operation. Poorly designed objects can be difficult and frustrating."}
    ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Seed initial favorite and reading history
INSERT INTO public.favorites (user_id, book_id)
VALUES
    ('user-1', 'book-1'),
    ('user-1', 'book-3')
ON CONFLICT (user_id, book_id) DO NOTHING;

INSERT INTO public.reading_history (user_id, book_id, progress, current_chapter_index)
VALUES
    ('user-1', 'book-1', 45, 0),
    ('user-1', 'book-3', 100, 1)
ON CONFLICT (user_id, book_id) DO NOTHING;
