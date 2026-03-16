const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');

/**
 * Sign a JWT token for a given userId
 */
exports.signToken = (userId) => {
    return jwt.sign({ id: userId }, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
};

/**
 * Register a new user
 */
exports.register = async ({ name, email, password }) => {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
        const err = new Error('Email already in use');
        err.status = 409;
        throw err;
    }
    const user = await User.create({ name, email, password });
    return user;
};

/**
 * Login: validate credentials and return user + token
 */
exports.login = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
        const err = new Error('Invalid email or password');
        err.status = 401;
        throw err;
    }
    if (!user.isActive) {
        const err = new Error('Account is deactivated');
        err.status = 403;
        throw err;
    }
    const token = exports.signToken(user.id);
    return { user, token };
};

/**
 * Verify a JWT and return the associated user
 */
exports.verifyToken = async (token) => {
    const decoded = jwt.verify(token, env.jwt.secret);
    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive) {
        const err = new Error('User no longer exists or is inactive');
        err.status = 401;
        throw err;
    }
    return user;
};
