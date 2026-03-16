const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Language = sequelize.define('Language', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,   // 'en', 'ar', 'am', 'om'
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    direction: {
        type: DataTypes.STRING(10),
        defaultValue: 'ltr',
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'languages',
    timestamps: true,
});

module.exports = Language;
