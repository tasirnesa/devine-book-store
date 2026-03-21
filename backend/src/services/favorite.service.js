const prisma = require('../config/prisma');

/**
 * Toggle favorite status for a book
 * @param {number} userId 
 * @param {number} bookId 
 * @returns {Promise<{isFavorited: boolean}>}
 */
const toggleFavorite = async (userId, bookId) => {
    const existing = await prisma.favorite.findUnique({
        where: {
            userId_bookId: {
                userId,
                bookId
            }
        }
    });

    if (existing) {
        await prisma.favorite.delete({
            where: {
                userId_bookId: {
                    userId,
                    bookId
                }
            }
        });
        return { isFavorited: false };
    } else {
        await prisma.favorite.create({
            data: {
                userId,
                bookId
            }
        });
        return { isFavorited: true };
    }
};

/**
 * Get all favorited books for a user
 * @param {number} userId 
 * @param {string} lang 
 * @returns {Promise<Array>}
 */
const getUserFavorites = async (userId, lang = 'en') => {
    const favorites = await prisma.favorite.findMany({
        where: { userId },
        include: {
            book: {
                include: {
                    translations: {
                        where: {
                            language: { code: lang }
                        }
                    },
                    author: true,
                    categories: {
                        include: {
                            category: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return favorites.map(f => {
        const book = f.book;
        const translation = book.translations[0] || {};
        return {
            ...book,
            activeTranslation: translation,
            categories: book.categories.map(c => c.category)
        };
    });
};

/**
 * Check if a book is favorited by a user
 * @param {number} userId 
 * @param {number} bookId 
 * @returns {Promise<boolean>}
 */
const isFavorited = async (userId, bookId) => {
    if (!userId) return false;
    const favorite = await prisma.favorite.findUnique({
        where: {
            userId_bookId: {
                userId,
                bookId
            }
        }
    });
    return !!favorite;
};

module.exports = {
    toggleFavorite,
    getUserFavorites,
    isFavorited
};
