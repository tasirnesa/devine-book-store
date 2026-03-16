const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { success, error } = require('../utils/response');
const authService = require('../services/auth.service');

// POST /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        const token = authService.signToken(user.id);
        return success(res, { user, token }, 'Registration successful', 201);
    } catch (err) {
        next(err);
    }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.login(email, password);
        return success(res, { user, token }, 'Login successful');
    } catch (err) {
        next(err);
    }
};

// GET /api/auth/me  [protected]
exports.getMe = async (req, res, next) => {
    try {
        return success(res, req.user);
    } catch (err) {
        next(err);
    }
};

// POST /api/auth/logout
exports.logout = async (req, res) => {
    // JWT is stateless — client should discard the token
    return success(res, null, 'Logged out successfully');
};
