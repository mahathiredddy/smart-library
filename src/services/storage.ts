import { Book, Category, Favorite, LibraryStats, ReadingHistoryItem, User } from '../types';

const STORAGE_KEYS = {
  BOOKS: 'ebook_library_books_v1',
  CATEGORIES: 'ebook_library_categories_v1',
  USERS: 'ebook_library_users_v1',
  FAVORITES: 'ebook_library_favorites_v1',
  HISTORY: 'ebook_library_history_v1',
  CURRENT_USER: 'ebook_library_current_user_v1',
};

// Initial Categories
export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-cs',
    name: 'Computer Science',
    description: 'Algorithms, distributed systems, software design, and artificial intelligence.',
    bookCount: 3,
    iconName: 'Cpu',
  },
  {
    id: 'cat-lit',
    name: 'Classic Literature',
    description: 'Timeless masterpieces of world prose, drama, and narrative fiction.',
    bookCount: 2,
    iconName: 'BookMarked',
  },
  {
    id: 'cat-arch',
    name: 'Architecture & Design',
    description: 'Modern spatial theory, typographic structure, and industrial design.',
    bookCount: 2,
    iconName: 'Layers',
  },
  {
    id: 'cat-phil',
    name: 'Philosophy',
    description: 'Epistemology, ethics, stoic meditations, and existential inquiries.',
    bookCount: 2,
    iconName: 'Compass',
  },
  {
    id: 'cat-sci',
    name: 'Science & Cosmos',
    description: 'Astrophysics, quantum mechanics, evolutionary biology, and natural history.',
    bookCount: 2,
    iconName: 'Sparkles',
  },
  {
    id: 'cat-biz',
    name: 'Business & Economics',
    description: 'Strategic management, behavioral finance, and institutional innovation.',
    bookCount: 1,
    iconName: 'TrendingUp',
  },
];

// Initial Books with full multi-chapter reader contents
export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    categoryId: 'cat-cs',
    description: 'The definitive guide to the storage, processing, and architecture of modern distributed data systems. Covers replication, partitioning, transactions, and consensus protocols in deep analytical detail.',
    publicationYear: 2021,
    language: 'English',
    pages: 616,
    availability: true,
    rating: 4.9,
    views: 1420,
    downloads: 512,
    coverColor: '#1e3a8a', // Deep navy
    createdAt: '2024-01-15T09:00:00Z',
    isbn: '978-1449373320',
    featured: true,
    allowDownload: true,
    ebookUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    chapters: [
      {
        id: 'c1',
        title: 'Chapter 1: Reliable, Scalable, and Maintainable Systems',
        content: `Many applications today are data-intensive, as opposed to compute-intensive. Raw CPU power is rarely a limiting factor for these systems—bigger problems are usually the amount of data, the complexity of data, and the speed at which it is changing.\n\nA data-intensive application is typically built from standard building blocks that provide commonly needed functionality. For example, databases store data so that they, or another application, can find it again later. Caches remember the result of an expensive operation to speed up reads.\n\nWe focus on three concerns that are important in most software systems:\n1. Reliability: The system should continue to work correctly (performing the correct function at the desired level of performance) even in the face of adversity (hardware or software faults, and human error).\n2. Scalability: As the system grows in data volume, traffic volume, or complexity, there should be reasonable ways of dealing with that growth.\n3. Maintainability: Over time, many different people will work on the system (both engineering and operations, both maintaining current behavior and adapting the system to new use cases), and they should all be able to work on it productively.`
      },
      {
        id: 'c2',
        title: 'Chapter 2: Data Models and Query Languages',
        content: `Data models are perhaps the most important part of developing software, because they have such a profound effect: not only on how the software is written, but also on how we think about the problem that we are solving.\n\nMost applications are built by layering one data model on top of another. For each layer, the key question is: how is it represented in terms of the next-lower layer?\n\nRelational databases, popularized by Edgar Codd in 1970, represented data as collections of relations (tables), where each relation is an unordered collection of tuples (rows). For decades, this model seemed universal, until the NoSQL movement re-introduced document and graph models to suit specific access patterns.`
      },
      {
        id: 'c3',
        title: 'Chapter 3: Storage and Retrieval',
        content: `On the most fundamental level, a database needs to do two things: when you give it some data, it must store the data; and when you ask for the data later, it must give the data back to you.\n\nConsider the world's simplest database implemented as two Bash functions: db_set() and db_get(). By simply appending a key-value pair to the end of a file, we achieve remarkably high write throughput. However, reads require an O(n) linear scan through the entire log. To make reads efficient, we introduce indexes: secondary data structures such as Hash Indexes, SSTables, and B-Trees.`
      }
    ]
  },
  {
    id: 'book-2',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    categoryId: 'cat-phil',
    description: 'Private spiritual notes and practical reflections written by the Roman Emperor between 161 and 180 AD. A foundational pillar of Stoic philosophy on self-discipline, resilience, duty, and human perception.',
    publicationYear: 2018,
    language: 'English (Gregory Hays Translation)',
    pages: 254,
    availability: true,
    rating: 4.8,
    views: 2150,
    downloads: 980,
    coverColor: '#78350f', // Warm amber / bronze
    createdAt: '2024-02-10T11:30:00Z',
    isbn: '978-0812968255',
    featured: true,
    chapters: [
      {
        id: 'c1',
        title: 'Book 1: Debts and Lessons',
        content: `From my grandfather Verus: character and self-control.\nFrom what I heard and remember of my father: integrity and manliness.\nFrom my mother: piety and generosity, and to refrain not only from doing evil, but even from the very thought of it; and further, simplicity in my way of living, far removed from the habits of the rich.\nFrom Rusticus: the recognition that my character required improvement and discipline; not to be led astray into enthusiastic pursuits of sophistic theorizing or writing speculative treatises.`
      },
      {
        id: 'c2',
        title: 'Book 2: On the River Gran, Among the Quadi',
        content: `When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly. They are like this because they cannot distinguish good from evil. But I have seen the beauty of good, and the ugliness of evil, and have recognized that the wrongdoer has a nature related to my own—not of the same blood or birth, but the same mind, and possessing a share of the divine.\n\nNone of them can hurt me. No one can implicate me in ugliness. Nor can I feel angry at my relative, or hate him. We were made to work together like feet, like hands, like the rows of the upper and lower teeth.`
      }
    ]
  },
  {
    id: 'book-3',
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    categoryId: 'cat-arch',
    description: 'A brilliant exploration of why some products satisfy while others baffle. Norman analyzes cognitive psychology, discoverability, feedback, affordances, and human-centered design in physical and digital realms.',
    publicationYear: 2013,
    language: 'English',
    pages: 368,
    availability: true,
    rating: 4.7,
    views: 1890,
    downloads: 640,
    coverColor: '#0f766e', // Deep teal
    createdAt: '2024-02-18T14:15:00Z',
    isbn: '978-0465050659',
    featured: true,
    chapters: [
      {
        id: 'c1',
        title: 'Chapter 1: The Psychopathology of Everyday Things',
        content: `If I were placed in the cockpit of a modern jet airliner, my inability to perform well would be neither surprising nor disgraceful. But why, when I face a simple household door, do I have to stand there puzzled? Why can't I figure out whether to push or pull?\n\nTwo of the most important characteristics of good design are discoverability and understanding. Discoverability: Is it possible to even figure out what actions are possible and where and how to perform them? Understanding: What does it all mean? How is the product supposed to be used? What do all the different controls and settings signify?`
      },
      {
        id: 'c2',
        title: 'Chapter 2: The Seven Fundamental Design Principles',
        content: `Great designers produce pleasurable experiences. To achieve this, seven foundational principles guide human-centered design:\n1. Discoverability\n2. Feedback\n3. Conceptual model\n4. Affordances\n5. Signifiers\n6. Mappings\n7. Constraints.\nWhen a device is easy to understand, these seven principles are seamlessly united.`
      }
    ]
  },
  {
    id: 'book-4',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    categoryId: 'cat-cs',
    description: 'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees. Master naming conventions, function decomposition, formatting, error handling, and unit testing.',
    publicationYear: 2019,
    language: 'English',
    pages: 464,
    availability: true,
    rating: 4.6,
    views: 3120,
    downloads: 1240,
    coverColor: '#334155', // Slate
    createdAt: '2024-03-01T10:00:00Z',
    isbn: '978-0132350884',
    featured: false,
    chapters: [
      {
        id: 'c1',
        title: 'Chapter 1: Clean Code',
        content: `You are reading this book for two reasons. First, you are a programmer. Second, you want to be a better programmer. Good. We need better programmers.\n\nThere will always be code. Some claim that code will soon disappear, that specifications will automatically compile into running systems. Nonsense! Specifications themselves are code when made sufficiently precise.\n\nBjarne Stroustrup, inventor of C++, states: 'I like my code to be elegant and efficient. The logic should be straightforward to make it hard for bugs to hide, the dependencies minimal to ease maintenance, error handling complete according to an articulated strategy, and performance close to optimal.'`
      },
      {
        id: 'c2',
        title: 'Chapter 2: Meaningful Names',
        content: `Names are everywhere in software. We name our variables, our functions, our arguments, classes, and packages. We name our source files and the directories that contain them.\n\nRule 1: Use intention-revealing names. The name of a variable, function, or class should answer all the big questions. It should tell you why it exists, what it does, and how it is used. If a name requires a comment, then the name does not reveal its intent.`
      }
    ]
  },
  {
    id: 'book-5',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    categoryId: 'cat-lit',
    description: 'Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway’s interactions with mysterious millionaire Jay Gatsby and Gatsby’s obsession to reunite with his former lover, Daisy Buchanan.',
    publicationYear: 1925,
    language: 'English',
    pages: 180,
    availability: true,
    rating: 4.5,
    views: 1650,
    downloads: 820,
    coverColor: '#1e293b', // Midnight navy
    createdAt: '2024-03-05T08:00:00Z',
    isbn: '978-0743273565',
    featured: false,
    chapters: [
      {
        id: 'c1',
        title: 'Chapter I',
        content: `In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.\n\n"Whenever you feel like criticizing any one," he told me, "just remember that all the people in this world haven't had the advantages that you've had."\n\nHe didn't say any more, but we've always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence, I'm inclined to reserve all judgements, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.`
      },
      {
        id: 'c2',
        title: 'Chapter II',
        content: `About half way between West Egg and New York the motor road hastily joins the railroad and runs beside it for a quarter of a mile, so as to shrink away from a certain desolate area of land. This is a valley of ashes—a fantastic farm where ashes grow like wheat into ridges and hills and grotesque gardens; where ashes take the forms of houses and chimneys and rising smoke and, finally, with a transcendent effort, of men who move dimly and already crumbling through the powdery air.`
      }
    ]
  },
  {
    id: 'book-6',
    title: 'Cosmos: A Personal Voyage',
    author: 'Carl Sagan',
    categoryId: 'cat-sci',
    description: 'A landmark journey through fifteen billion years of cosmic evolution and the development of science and civilization. Sagan celebrates human curiosity and scientific exploration with peerless eloquence.',
    publicationYear: 2013,
    language: 'English',
    pages: 396,
    availability: true,
    rating: 4.9,
    views: 2410,
    downloads: 1105,
    coverColor: '#312e81', // Indigo night
    createdAt: '2024-03-12T16:00:00Z',
    isbn: '978-0345539434',
    featured: true,
    chapters: [
      {
        id: 'c1',
        title: 'Chapter 1: The Shores of the Cosmic Ocean',
        content: `The Cosmos is all that is or ever was or ever will be. Our feeblest contemplations of the Cosmos stir us—there is a tingling in the spine, a catch in the voice, a faint sensation, as if a distant memory, of falling from a height. We know we are approaching the greatest of mysteries.\n\nThe size and age of the Cosmos are beyond ordinary human understanding. Lost somewhere between immensity and eternity is our tiny planetary home. In a cosmic perspective, most human concerns seem insignificant, even petty. And yet our species is young and curious and brave and shows much promise.`
      },
      {
        id: 'c2',
        title: 'Chapter 2: One Voice in the Cosmic Fugue',
        content: `All life on Earth is closely related. We have a common organic chemistry and a common evolutionary heritage. As a result, our biologists are profoundly limited. They study only a single kind of biology, one solitary theme in the music of life. Is this faint and fragile sound the only voice for thousands of light-years? Or is there a cosmic fugue, with themes and counterpoints, chords and variations, sounding throughout the galaxy?`
      }
    ]
  },
  {
    id: 'book-7',
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    categoryId: 'cat-lit',
    description: 'The psychological drama of Rodion Raskolnikov, an impoverished former student in Saint Petersburg who formulates a theory of extraordinary men exempt from conventional moral laws.',
    publicationYear: 2017,
    language: 'English (Pevear & Volokhonsky)',
    pages: 565,
    availability: false, // Currently reserved / checked out
    rating: 4.8,
    views: 1820,
    downloads: 430,
    coverColor: '#450a0a', // Crimson dark
    createdAt: '2024-03-15T12:00:00Z',
    isbn: '978-0143107637',
    featured: false,
    allowDownload: false,
    chapters: [
      {
        id: 'c1',
        title: 'Part I, Chapter 1',
        content: `At the beginning of July, during an extremely hot spell, toward evening, a young man left the closet he rented from tenants in S. Lane, walked out to the street, and slowly, as if indecisively, headed for the K. Bridge.\n\nHe had safely avoided meeting his landlady on the stairs. His closet was located just under the roof of a tall, five-storied house and was more like a cupboard than a room. He was so completely crushed by poverty that he had even grown used to it over the past month.`
      }
    ]
  },
  {
    id: 'book-8',
    title: 'The Elements of Typographic Style',
    author: 'Robert Bringhurst',
    categoryId: 'cat-arch',
    description: 'Renowned as the typographer’s bible, Bringhurst combines historical scholarship with practical craftsmanship, exploring proportions, rhythms, page geometry, and typeface harmony.',
    publicationYear: 2012,
    language: 'English',
    pages: 400,
    availability: true,
    rating: 4.9,
    views: 950,
    downloads: 380,
    coverColor: '#1c1917', // Neutral black
    createdAt: '2024-03-20T10:00:00Z',
    isbn: '978-0881792126',
    featured: false,
    chapters: [
      {
        id: 'c1',
        title: 'Chapter 1: The Grand Design',
        content: `Typography exists to honor content. Like oratory, music, dance, calligraphy—like everything that lends its grace to language—typography is an art that can be deliberately practiced.\n\nTypography at its best is a visual form of language linking timelessness and time. It should not be a mechanical reproduction, but a living architectural cadence across the page.`
      }
    ]
  },
  {
    id: 'book-9',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    categoryId: 'cat-biz',
    description: 'Nobel laureate Daniel Kahneman takes us on a groundbreaking tour of the mind, explaining the two systems that drive the way we think: System 1 (fast, intuitive, emotional) and System 2 (slow, deliberative, logical).',
    publicationYear: 2011,
    language: 'English',
    pages: 499,
    availability: true,
    rating: 4.7,
    views: 2900,
    downloads: 1320,
    coverColor: '#854d0e', // Raw umber
    createdAt: '2024-03-22T09:40:00Z',
    isbn: '978-0374533557',
    featured: true,
    chapters: [
      {
        id: 'c1',
        title: 'Introduction: Two Systems',
        content: `Every author, I suppose, has in mind a setting in which readers of his work could benefit from having read it. Mine is the office watercooler, where opinions are shared and gossip is exchanged.\n\nSystem 1 operates automatically and quickly, with little or no effort and no sense of voluntary control. System 2 allocates attention to the effortful mental operations that demand it, including complex computations.`
      }
    ]
  },
  {
    id: 'book-10',
    title: 'Structure and Interpretation of Computer Programs',
    author: 'Harold Abelson & Gerald Jay Sussman',
    categoryId: 'cat-cs',
    description: 'The legendary MIT text exploring computation as intellectual mastery over complexity. Employs Lisp/Scheme to build abstractions, meta-linguistic interpreters, and concurrent systems.',
    publicationYear: 1996,
    language: 'English',
    pages: 657,
    availability: false, // In maintenance / updated revision
    rating: 4.9,
    views: 1540,
    downloads: 710,
    coverColor: '#431407', // Dark rust
    createdAt: '2024-03-25T15:00:00Z',
    isbn: '978-0262510875',
    featured: false,
    chapters: [
      {
        id: 'c1',
        title: 'Chapter 1: Building Abstractions with Procedures',
        content: `The acts of the mind, wherein it exerts its power over simple ideas, are chiefly these three: 1. Combining several simple ideas into one compound one; 2. Bringing two ideas together to set them by one another; 3. Separating them from all other ideas that accompany them in their real existence: this is called abstraction.\n\nComputational processes are abstract beings that inhabit computers. As they evolve, processes manipulate other abstract things called data.`
      }
    ]
  },
  {
    id: 'book-11',
    title: 'Beyond Good and Evil',
    author: 'Friedrich Nietzsche',
    categoryId: 'cat-phil',
    description: 'A sharp critique of past philosophers who blindly accepted dogmatic premises in their search for morality. Nietzsche explores the will to power, perspectivism, and intellectual courage.',
    publicationYear: 2002,
    language: 'English (Walter Kaufmann Translation)',
    pages: 288,
    availability: true,
    rating: 4.6,
    views: 1120,
    downloads: 490,
    coverColor: '#064e3b', // Dark emerald
    createdAt: '2024-03-28T13:20:00Z',
    isbn: '978-0679724650',
    featured: false,
    chapters: [
      {
        id: 'c1',
        title: 'Part One: On the Prejudices of Philosophers',
        content: `The Will to Truth, which is to tempt us to many a hazardous enterprise, the famous Truthfulness of which all philosophers have hitherto spoken with respect, what questions has this Will to Truth not laid before us!\n\nWhat strange, perplexing, questionable questions! Is it any wonder if we at last grow distrustful, lose patience, and turn impatiently away? That this Sphinx teaches us at last to ask questions ourselves? Who is it really that puts questions to us here? What in us really wants "truth"?`
      }
    ]
  },
  {
    id: 'book-12',
    title: 'Astrophysics for People in a Hurry',
    author: 'Neil deGrasse Tyson',
    categoryId: 'cat-sci',
    description: 'A quick, mind-expanding guide to the cosmos. From the Big Bang to black holes, quantum mechanics to the search for life in the universe, clear and witty explanations of universal laws.',
    publicationYear: 2017,
    language: 'English',
    pages: 224,
    availability: true,
    rating: 4.7,
    views: 2230,
    downloads: 940,
    coverColor: '#082f49', // Deep cyan
    createdAt: '2024-04-01T08:15:00Z',
    isbn: '978-0393609394',
    featured: false,
    chapters: [
      {
        id: 'c1',
        title: 'Chapter 1: The Greatest Story Ever Told',
        content: `In the beginning, nearly fourteen billion years ago, all the space and all the matter and all the energy of the known universe was contained in a volume less than one-trillionth the size of the period that ends this sentence.\n\nConditions were so hot, the basic forces of nature that collectively describe the universe were unified. Though still unknown how it came into existence, this sub-pinpoint cosmos could only expand. Rapidly. In what today we call the Big Bang.`
      }
    ]
  }
];

// Initial Users
export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Administrator Elena Vance',
    email: 'admin@ebooklibrary.org',
    password: 'admin123',
    role: 'admin',
    status: 'active',
    createdAt: '2023-11-01T10:00:00Z',
    bio: 'Lead Systems Librarian & Archival Curator overseeing digital collections and user access policies.',
    favoriteGenre: 'Computer Science',
  },
  {
    id: 'user-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@university.edu',
    password: 'user123',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-12T14:30:00Z',
    bio: 'Graduate student in computational linguistics. Avid reader of distributed systems and Stoic philosophy.',
    favoriteGenre: 'Computer Science',
  },
  {
    id: 'user-2',
    name: 'Marcus Vance',
    email: 'marcus.vance@reading.club',
    password: 'user123',
    role: 'user',
    status: 'inactive',
    createdAt: '2024-02-04T09:15:00Z',
    bio: 'Book club organizer and vintage typography collector.',
    favoriteGenre: 'Architecture & Design',
  },
  {
    id: 'user-3',
    name: 'Dr. James Thorne',
    email: 'j.thorne@research.ac.uk',
    password: 'user123',
    role: 'user',
    status: 'active',
    createdAt: '2024-02-28T16:45:00Z',
    bio: 'Theoretical physicist and science communicator.',
    favoriteGenre: 'Science & Cosmos',
  }
];

// Initial Favorites for user-1
export const INITIAL_FAVORITES: Favorite[] = [
  { id: 'fav-1', userId: 'user-1', bookId: 'book-1', createdAt: '2024-01-20T10:00:00Z' },
  { id: 'fav-2', userId: 'user-1', bookId: 'book-2', createdAt: '2024-02-15T12:00:00Z' },
  { id: 'fav-3', userId: 'user-1', bookId: 'book-6', createdAt: '2024-03-01T14:00:00Z' },
];

// Initial Reading History for user-1
export const INITIAL_HISTORY: ReadingHistoryItem[] = [
  { id: 'hist-1', userId: 'user-1', bookId: 'book-1', lastReadAt: '2024-04-02T16:20:00Z', progress: 65, currentChapterIndex: 1 },
  { id: 'hist-2', userId: 'user-1', bookId: 'book-2', lastReadAt: '2024-03-29T11:15:00Z', progress: 100, currentChapterIndex: 1 },
  { id: 'hist-3', userId: 'user-1', bookId: 'book-3', lastReadAt: '2024-03-21T08:45:00Z', progress: 30, currentChapterIndex: 0 },
];

class StorageService {
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn('Storage set error:', err);
    }
  }

  // Init default data if empty
  public init(): void {
    if (!localStorage.getItem(STORAGE_KEYS.BOOKS)) {
      this.setItem(STORAGE_KEYS.BOOKS, INITIAL_BOOKS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      this.setItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
      this.setItem(STORAGE_KEYS.FAVORITES, INITIAL_FAVORITES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.HISTORY)) {
      this.setItem(STORAGE_KEYS.HISTORY, INITIAL_HISTORY);
    }
  }

  // --- Books ---
  public getBooks(): Book[] {
    this.init();
    const books = this.getItem<Book[]>(STORAGE_KEYS.BOOKS, INITIAL_BOOKS);
    return books.map((b) => ({
      ...b,
      allowDownload: b.allowDownload !== undefined ? b.allowDownload : true,
    }));
  }

  public getBookById(id: string): Book | undefined {
    return this.getBooks().find((b) => b.id === id);
  }

  public saveBook(book: Book): void {
    const books = this.getBooks();
    const existingIndex = books.findIndex((b) => b.id === book.id);
    if (existingIndex >= 0) {
      books[existingIndex] = book;
    } else {
      books.unshift(book);
    }
    this.setItem(STORAGE_KEYS.BOOKS, books);
    this.syncCategoryBookCounts();
  }

  public deleteBook(id: string): boolean {
    const books = this.getBooks().filter((b) => b.id !== id);
    this.setItem(STORAGE_KEYS.BOOKS, books);
    // Also remove from favorites and history
    const favorites = this.getFavorites().filter((f) => f.bookId !== id);
    this.setItem(STORAGE_KEYS.FAVORITES, favorites);
    const history = this.getReadingHistory().filter((h) => h.bookId !== id);
    this.setItem(STORAGE_KEYS.HISTORY, history);
    this.syncCategoryBookCounts();
    return true;
  }

  public toggleBookAvailability(id: string): Book | undefined {
    const books = this.getBooks();
    const book = books.find((b) => b.id === id);
    if (book) {
      book.availability = !book.availability;
      this.setItem(STORAGE_KEYS.BOOKS, books);
      return book;
    }
    return undefined;
  }

  public incrementBookViews(id: string): void {
    const books = this.getBooks();
    const book = books.find((b) => b.id === id);
    if (book) {
      book.views = (book.views || 0) + 1;
      this.setItem(STORAGE_KEYS.BOOKS, books);
    }
  }

  public incrementBookDownloads(id: string): void {
    const books = this.getBooks();
    const book = books.find((b) => b.id === id);
    if (book) {
      book.downloads = (book.downloads || 0) + 1;
      this.setItem(STORAGE_KEYS.BOOKS, books);
    }
  }

  // --- Categories ---
  public getCategories(): Category[] {
    this.init();
    return this.getItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }

  public saveCategory(category: Category): void {
    const categories = this.getCategories();
    const existingIndex = categories.findIndex((c) => c.id === category.id);
    if (existingIndex >= 0) {
      categories[existingIndex] = category;
    } else {
      categories.push(category);
    }
    this.setItem(STORAGE_KEYS.CATEGORIES, categories);
    this.syncCategoryBookCounts();
  }

  public deleteCategory(id: string): boolean {
    const categories = this.getCategories().filter((c) => c.id !== id);
    this.setItem(STORAGE_KEYS.CATEGORIES, categories);
    return true;
  }

  public syncCategoryBookCounts(): void {
    const books = this.getBooks();
    const categories = this.getCategories();
    const updated = categories.map((cat) => {
      const count = books.filter((b) => b.categoryId === cat.id).length;
      return { ...cat, bookCount: count };
    });
    this.setItem(STORAGE_KEYS.CATEGORIES, updated);
  }

  // --- Users ---
  public getUsers(): User[] {
    this.init();
    return this.getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  public getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public saveUser(user: User): void {
    const users = this.getUsers();
    const existingIndex = users.findIndex((u) => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    this.setItem(STORAGE_KEYS.USERS, users);
  }

  public toggleUserStatus(id: string): User | undefined {
    const users = this.getUsers();
    const user = users.find((u) => u.id === id);
    if (user) {
      user.status = user.status === 'active' ? 'inactive' : 'active';
      this.setItem(STORAGE_KEYS.USERS, users);
      return user;
    }
    return undefined;
  }

  public deleteUser(id: string): boolean {
    const users = this.getUsers().filter((u) => u.id !== id);
    this.setItem(STORAGE_KEYS.USERS, users);
    return true;
  }

  // --- Favorites ---
  public getFavorites(): Favorite[] {
    this.init();
    return this.getItem<Favorite[]>(STORAGE_KEYS.FAVORITES, INITIAL_FAVORITES);
  }

  public getUserFavorites(userId: string): Book[] {
    const favorites = this.getFavorites().filter((f) => f.userId === userId);
    const books = this.getBooks();
    return favorites
      .map((f) => books.find((b) => b.id === f.bookId))
      .filter((b): b is Book => Boolean(b));
  }

  public toggleFavorite(userId: string, bookId: string): boolean {
    const favorites = this.getFavorites();
    const index = favorites.findIndex((f) => f.userId === userId && f.bookId === bookId);
    if (index >= 0) {
      favorites.splice(index, 1);
      this.setItem(STORAGE_KEYS.FAVORITES, favorites);
      return false; // now removed
    } else {
      favorites.unshift({
        id: `fav-${Date.now()}`,
        userId,
        bookId,
        createdAt: new Date().toISOString(),
      });
      this.setItem(STORAGE_KEYS.FAVORITES, favorites);
      return true; // now added
    }
  }

  public isFavorite(userId: string, bookId: string): boolean {
    return this.getFavorites().some((f) => f.userId === userId && f.bookId === bookId);
  }

  // --- Reading History ---
  public getReadingHistory(): ReadingHistoryItem[] {
    this.init();
    return this.getItem<ReadingHistoryItem[]>(STORAGE_KEYS.HISTORY, INITIAL_HISTORY);
  }

  public getUserReadingHistory(userId: string): Array<ReadingHistoryItem & { book?: Book }> {
    const history = this.getReadingHistory().filter((h) => h.userId === userId);
    const books = this.getBooks();
    return history
      .map((item) => ({
        ...item,
        book: books.find((b) => b.id === item.bookId),
      }))
      .filter((item) => Boolean(item.book))
      .sort((a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime());
  }

  public saveReadingProgress(
    userId: string,
    bookId: string,
    progress: number,
    currentChapterIndex = 0,
    currentPage = 1
  ): void {
    const history = this.getReadingHistory();
    const existingIndex = history.findIndex((h) => h.userId === userId && h.bookId === bookId);
    const safeProgress = Math.min(100, Math.max(0, Math.round(progress)));

    if (existingIndex >= 0) {
      history[existingIndex] = {
        ...history[existingIndex],
        progress: safeProgress,
        currentChapterIndex,
        currentPage,
        lastReadAt: new Date().toISOString(),
      };
    } else {
      history.unshift({
        id: `hist-${Date.now()}`,
        userId,
        bookId,
        progress: safeProgress,
        currentChapterIndex,
        currentPage,
        lastReadAt: new Date().toISOString(),
      });
    }
    this.setItem(STORAGE_KEYS.HISTORY, history);
  }

  public clearUserReadingHistory(userId: string): void {
    const remaining = this.getReadingHistory().filter((h) => h.userId !== userId);
    this.setItem(STORAGE_KEYS.HISTORY, remaining);
  }

  // --- Stats ---
  public getLibraryStats(): LibraryStats {
    const books = this.getBooks();
    const users = this.getUsers();
    const categories = this.getCategories();

    const availableBooks = books.filter((b) => b.availability).length;
    const unavailableBooks = books.length - availableBooks;
    const totalDownloads = books.reduce((acc, b) => acc + (b.downloads || 0), 0);
    const totalViews = books.reduce((acc, b) => acc + (b.views || 0), 0);

    return {
      totalBooks: books.length,
      availableBooks,
      unavailableBooks,
      totalUsers: users.length,
      totalCategories: categories.length,
      totalDownloads,
      totalViews,
    };
  }

  // Reset to default data
  public resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.BOOKS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    this.init();
  }
}

export const storage = new StorageService();
