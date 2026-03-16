const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

const prisma = new PrismaClient({
    log: [
        { level: 'query', emit: 'event' },
        { level: 'info', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
        { level: 'error', emit: 'stdout' },
    ],
});

prisma.$on('query', (e) => {
    logger.debug(`Prisma Query: ${e.query} ${e.params}`);
});

module.exports = prisma;
