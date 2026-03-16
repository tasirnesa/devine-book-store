const { success, error } = require('../utils/response');
const userService = require('../services/user.service');

// GET /api/users  [admin only]
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        return success(res, users);
    } catch (err) {
        next(err);
    }
};

// GET /api/users/:id
exports.getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) return error(res, 'User not found', 404);
        return success(res, user);
    } catch (err) {
        next(err);
    }
};

// PUT /api/users/:id  (own profile or admin)
exports.updateUser = async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        if (!user) return error(res, 'User not found', 404);
        return success(res, user, 'Profile updated');
    } catch (err) {
        next(err);
    }
};

// DELETE /api/users/:id  [admin only]
exports.deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id);
        return success(res, null, 'User deleted');
    } catch (err) {
        next(err);
    }
};
