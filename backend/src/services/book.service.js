const prisma = require('../config/prisma');

/**
 * Get all books with filtering and pagination
 */
exports.getAllBooks = async ({ page = 1, pageSize = 20, language, category, search, featured, sort = 'newest' }) => {
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where = {};

    if (featured !== undefined) {
        where.featured = featured === 'true' || featured === true;
    }

    if (category) {
        where.categories = {
            some: {
                category: {
                    slug: category
                }
            }
        };
    }

    if (search || language) {
        where.translations = {
            some: {
                ...(language ? { language: { code: language } } : {}),
                ...(search ? {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                        { authorName: { contains: search, mode: 'insensitive' } },
                    ]
                } : {})
            }
        };
    }

    // Build order
    let orderBy = { createdAt: 'desc' };
    if (sort === 'popular') orderBy = { views: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };

    const [books, total] = await Promise.all([
        prisma.book.findMany({
            where,
            include: {
                author: true,
                categories: {
                    include: {
                        category: true
                    }
                },
                translations: {
                    include: {
                        language: true
                    },
                    ...(language ? { where: { language: { code: language } } } : {})
                }
            },
            skip,
            take: pageSize,
            orderBy,
        }),
        prisma.book.count({ where }),
    ]);

    return {
        books: books.map(book => ({
            ...book,
            activeTranslation: book.translations[0] || null,
            categories: book.categories.map(c => c.category)
        })),
        total
    };
};

/**
 * Get a single book by slug
 */
exports.getBookBySlug = async (slug, lang = 'en') => {
    const book = await prisma.book.findUnique({
        where: { slug },
        include: {
            author: true,
            categories: {
                include: {
                    category: true
                }
            },
            translations: {
                include: {
                    language: true
                }
            }
        },
    });

    if (!book) return null;

    // Select the best translation
    const activeTranslation = book.translations.find(t => t.language.code === lang)
        || book.translations.find(t => t.language.code === 'en')
        || book.translations[0];

    return {
        ...book,
        activeTranslation,
        categories: book.categories.map(c => c.category)
    };
};

/**
 * Increment view count
 */
exports.incrementViews = async (id) => {
    await prisma.book.update({
        where: { id: parseInt(id) },
        data: { views: { increment: 1 } }
    });
};

/**
 * Create a book
 */
exports.createBook = async (data, file) => {
    const { translations, categories, ...rest } = data;

    const book = await prisma.book.create({
        data: {
            ...rest,
            coverUrl: file ? `/uploads/covers/${file.filename}` : rest.coverUrl,
            translations: {
                create: translations.map(t => ({
                    languageId: t.languageId,
                    title: t.title,
                    description: t.description,
                    authorName: t.authorName
                }))
            },
            categories: {
                create: categories.map(catId => ({
                    categoryId: catId
                }))
            }
        },
        include: {
            translations: true,
            categories: true
        }
    });

    return book;
};

/**
 * Update a book
 */
exports.updateBook = async (id, data, file) => {
    const { translations, categories, ...rest } = data;
    const bookId = parseInt(id);

    // Update base fields
    await prisma.book.update({
        where: { id: bookId },
        data: {
            ...rest,
            ...(file ? { coverUrl: `/uploads/covers/${file.filename}` } : {}),
            publishedAt: rest.publishedAt ? new Date(rest.publishedAt) : undefined,
        }
    });

    // Update translations
    if (translations) {
        for (const t of translations) {
            await prisma.bookTranslation.upsert({
                where: {
                    bookId_languageId: {
                        bookId: bookId,
                        languageId: t.languageId
                    }
                },
                update: {
                    title: t.title,
                    description: t.description,
                    authorName: t.authorName
                },
                create: {
                    bookId: bookId,
                    languageId: t.languageId,
                    title: t.title,
                    description: t.description,
                    authorName: t.authorName
                }
            });
        }
    }

    // Update categories (simple overwrite for now)
    if (categories) {
        await prisma.categoryOnBook.deleteMany({ where: { bookId } });
        await prisma.categoryOnBook.createMany({
            data: categories.map(catId => ({
                bookId,
                categoryId: catId
            }))
        });
    }

    return exports.getBookBySlug(rest.slug || '', 'en');
};

/**
 * Delete a book
 */
exports.deleteBook = async (id) => {
    await prisma.book.delete({
        where: { id: parseInt(id) }
    });
};
