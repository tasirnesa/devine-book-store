const prisma = require('../config/prisma');
const slugify = require('slugify');

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
                ...(language ? { language: { code: { startsWith: language.split('-')[0] } } } : {}),
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
    try {
        await prisma.book.update({
            where: { id: parseInt(id) },
            data: { views: { increment: 1 } }
        });
    } catch (err) {
        const logger = require('../config/logger');
        logger.error(`Error incrementing views for book ${id}: ${err.message}`);
    }
};

/**
 * Create a book
 * Handles both flat fields (title, description, authorName, languageId)
 * sent from FormData and a nested translations array.
 */
exports.createBook = async (data, cover, file) => {
    // Destructure ALL non-Book-model fields to prevent them leaking into ...rest
    const { translations, categories, title, description, authorName, languageId, ...rest } = data;

    // Generate slug if not provided — suffix with timestamp to ensure uniqueness
    const baseSlug = rest.slug
        ? slugify(rest.slug, { lower: true, strict: true })
        : slugify(title || (translations && translations[0]?.title) || 'book', { lower: true, strict: true });

    // Check if slug already exists and append timestamp if needed
    const existingSlug = await prisma.book.findUnique({ where: { slug: baseSlug } });
    const finalSlug = existingSlug ? `${baseSlug}-${Date.now()}` : baseSlug;

    // Build translations: prefer explicit array, fall back to flat fields
    let finalTranslations = translations || [];
    if (finalTranslations.length === 0 && (title || description || authorName)) {
        finalTranslations = [{
            languageId: parseInt(languageId) || 1,
            title: title || '',
            description: description || '',
            authorName: authorName || ''
        }];
    }

    const book = await prisma.book.create({
        data: {
            ...rest,
            slug: finalSlug,
            coverUrl: cover ? `/uploads/covers/${cover.filename}` : (rest.coverUrl || null),
            fileUrl: file ? `/uploads/manuscripts/${file.filename}` : (rest.fileUrl || null),
            translations: {
                create: finalTranslations.map(t => ({
                    languageId: t.languageId,
                    title: t.title,
                    description: t.description,
                    authorName: t.authorName
                }))
            },
            categories: {
                create: (categories || []).map(catId => ({
                    categoryId: catId
                }))
            }
        },
        include: {
            translations: true,
            categories: true
        }
    });

    // Re-fetch formatted for frontend
    const formattedBook = await prisma.book.findUnique({
        where: { id: book.id },
        include: {
            translations: {
                where: { language: { code: 'en' } },
                take: 1
            },
            categories: {
                include: { category: true }
            }
        }
    });

    if (formattedBook) {
        formattedBook.activeTranslation = formattedBook.translations[0] || book.translations[0];
        formattedBook.categories = formattedBook.categories.map(c => c.category);
    }

    return formattedBook || book;
};

/**
 * Update a book
 */
exports.updateBook = async (id, data, cover, file) => {
    // Destructure ALL non-Book-model fields to prevent them leaking into ...rest
    const { translations, categories, title, description, authorName, languageId, ...rest } = data;
    const bookId = parseInt(id);

    // Update base fields
    await prisma.book.update({
        where: { id: bookId },
        data: {
            ...rest,
            ...(cover ? { coverUrl: `/uploads/covers/${cover.filename}` } : {}),
            ...(file ? { fileUrl: `/uploads/manuscripts/${file.filename}` } : {}),
            publishedAt: rest.publishedAt ? new Date(rest.publishedAt) : undefined,
        }
    });

    // Build translations: prefer explicit array, fall back to flat fields
    let finalTranslations = translations || [];
    if (finalTranslations.length === 0 && (title || description || authorName)) {
        finalTranslations = [{
            languageId: parseInt(languageId) || 1,
            title: title || '',
            description: description || '',
            authorName: authorName || ''
        }];
    }

    // Upsert translations
    if (finalTranslations.length > 0) {
        for (const t of finalTranslations) {
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

    // Overwrite categories if provided
    if (categories) {
        await prisma.categoryOnBook.deleteMany({ where: { bookId } });
        await prisma.categoryOnBook.createMany({
            data: (categories || []).map(catId => ({
                bookId,
                categoryId: catId
            }))
        });
    }

    // Return updated, formatted book
    const updatedBook = await prisma.book.findUnique({
        where: { id: bookId },
        include: {
            translations: {
                where: { language: { code: 'en' } },
                take: 1
            },
            categories: {
                include: { category: true }
            }
        }
    });

    if (updatedBook) {
        updatedBook.activeTranslation = updatedBook.translations[0];
        updatedBook.categories = updatedBook.categories.map(c => c.category);
    }

    return updatedBook;
};

/**
 * Delete a book
 */
exports.deleteBook = async (id) => {
    await prisma.book.delete({
        where: { id: parseInt(id) }
    });
};
