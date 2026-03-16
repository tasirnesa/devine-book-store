require('dotenv').config();

module.exports = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 5000,
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        name: process.env.DB_NAME || 'book_library',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'fallback_secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    upload: {
        dir: process.env.UPLOAD_DIR || 'uploads',
        maxSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 20,
    },
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};
