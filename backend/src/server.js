const { connectDB } = require('./config/db');
const logger = require('./config/logger');
const env = require('./config/env');
const app = require('./app');
const { sequelize } = require('./config/db');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = ['covers', 'files'].map((d) =>
    path.join(__dirname, '..', env.upload.dir, d)
);
uploadDirs.forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const start = async () => {
    try {
        // 1. Connect to database
        await connectDB();

        // 2. Database Synchronization
        // We now use Prisma Migrations for schema changes.
        // sequelize.sync({ alter: true }) can conflict with Prisma's schema.
        logger.info('Database models initialization complete (Skipped Sequelize Sync).');

        // 3. Start HTTP server
        const server = app.listen(env.port, () => {
            logger.info(`Server running in ${env.env} mode on port ${env.port}`);
            logger.info(`API available at: http://localhost:${env.port}/api`);
        });

        // Graceful shutdown
        const shutdown = async (signal) => {
            logger.info(`${signal} received — shutting down gracefully`);
            server.close(async () => {
                await sequelize.close();
                logger.info('DB connection closed. Process exiting.');
                process.exit(0);
            });
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

    } catch (err) {
        logger.error('Failed to start server:', err.message);
        process.exit(1);
    }
};

start();
