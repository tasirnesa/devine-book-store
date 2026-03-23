const { success, error, paginated } = require('../utils/response');
const bookService = require('../services/book.service');

// GET /api/books
exports.getAllBooks = async (req, res, next) => {
    try {
        const {
            page = 1,
            pageSize = 20,
            language,
            category,
            search,
            featured,
            sort
        } = req.query;

        const result = await bookService.getAllBooks({
            page: +page,
            pageSize: +pageSize,
            language,
            category,
            search,
            featured,
            sort
        });

        return paginated(res, result.books, result.total, +page, +pageSize);
    } catch (err) {
        next(err);
    }
};

// GET /api/books/:slug
exports.getBookBySlug = async (req, res, next) => {
    try {
        const book = await bookService.getBookBySlug(req.params.slug, req.query.lang || 'en');
        if (!book) return error(res, 'Book not found', 404);

        // Increment view count (fire-and-forget)
        bookService.incrementViews(book.id);

        return success(res, book);
    } catch (err) {
        next(err);
    }
};

// POST /api/books  [admin only]
exports.createBook = async (req, res, next) => {
    try {
        const cover = req.files?.cover?.[0];
        const file = req.files?.file?.[0];
        const book = await bookService.createBook(req.body, cover, file);
        return success(res, book, 'Book created successfully', 201);
    } catch (err) {
        next(err);
    }
};

// PUT /api/books/:id  [admin only]
exports.updateBook = async (req, res, next) => {
    try {
        const cover = req.files?.cover?.[0];
        const file = req.files?.file?.[0];
        const book = await bookService.updateBook(req.params.id, req.body, cover, file);
        if (!book) return error(res, 'Book not found', 404);
        return success(res, book, 'Book updated successfully');
    } catch (err) {
        next(err);
    }
};

// DELETE /api/books/:id  [admin only]
exports.deleteBook = async (req, res, next) => {
    try {
        await bookService.deleteBook(req.params.id);
        return success(res, null, 'Book deleted successfully');
    } catch (err) {
        next(err);
    }
};
