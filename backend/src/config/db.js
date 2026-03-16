const { Sequelize } = require('sequelize');
const env = require('./env');
const logger = require('./logger');

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
    host: env.db.host,
    port: env.db.port,
    dialect: 'postgres',
    logging: (msg) => logger.debug(msg),
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

const prisma = require('./prisma');

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        logger.info('Sequelize: PostgreSQL connected successfully.');

        await prisma.$connect();
        logger.info('Prisma: PostgreSQL connected successfully.');
    } catch (err) {
        logger.error('Unable to connect to the database:', err.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB, prisma };
