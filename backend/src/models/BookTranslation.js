const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

/*
  BookTranslation stores locale-specific content for each book.
  One Book can have many BookTranslations (one per language).
  This is the proper i18n data model for a multilingual library.
*/
const BookTranslation = sequelize.define('BookTranslation', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'books', key: 'id' },
        onDelete: 'CASCADE',
    },
    languageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'languages', key: 'id' },
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    authorName: {
        type: DataTypes.STRING,   // Transliterated author name in this language
        allowNull: true,
    },
}, {
    tableName: 'book_translations',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['bookId', 'languageId'],  // One translation per language per book
        },
    ],
});

module.exports = BookTranslation;
