const User = require('../models/User');

exports.getAllUsers = async () => {
    return User.findAll({ order: [['createdAt', 'DESC']] });
};

exports.getUserById = async (id) => {
    return User.findByPk(id);
};

exports.updateUser = async (id, data) => {
    const user = await User.findByPk(id);
    if (!user) return null;
    // Disallow role escalation from this endpoint
    const { role, ...safeData } = data;
    return user.update(safeData);
};

exports.deleteUser = async (id) => {
    await User.destroy({ where: { id } });
};
