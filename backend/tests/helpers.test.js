const { slugify } = require('../../src/utils/helpers');

describe('slugify()', () => {
    it('lowercases and replaces spaces with hyphens', () => {
        expect(slugify('Ihya Ulum al-Din')).toBe('ihya-ulum-al-din');
    });

    it('strips special characters', () => {
        expect(slugify('Book #1 (2024)!')).toBe('book-1-2024');
    });

    it('collapses multiple hyphens', () => {
        expect(slugify('Hello   World')).toBe('hello-world');
    });
});
