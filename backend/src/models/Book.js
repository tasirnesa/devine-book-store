const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Book = sequelize.define('Book', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    coverUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fileUrl: {
        type: DataTypes.STRING,
        allowNull: true,           // Path to uploaded PDF/ebook
    },
    externalUrl: {
        type: DataTypes.STRING,
        allowNull: true,           // External link if hosted elsewhere
    },
    featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    publishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'books',
    timestamps: true,
});

module.exports = Book;
