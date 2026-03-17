require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // 0. Users
    const hashedPassword = await bcrypt.hash('password123', 12);
    const users = [
        {
            name: 'Admin User',
            email: 'admin@library.com',
            password: hashedPassword,
            role: 'ADMIN',
        },
        {
            name: 'Soressa User',
            email: 'soressa@gmail.com',
            password: hashedPassword,
            role: 'USER',
        }
    ];

    for (const user of users) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: user,
        });
    }
    console.log('✅ Users seeded.');

    // 1. Languages
    const languages = [
        { code: 'en', name: 'English', direction: 'ltr' },
        { code: 'ar', name: 'Arabic', direction: 'rtl' },
        { code: 'am', name: 'Amharic', direction: 'ltr' },
        { code: 'om', name: 'Afan Oromo', direction: 'ltr' },
    ];

    for (const lang of languages) {
        await prisma.language.upsert({
            where: { code: lang.code },
            update: {},
            create: lang,
        });
    }
    console.log('✅ Languages seeded.');

    // 2. Categories
    const categories = [
        { name: 'Spirituality', slug: 'spirituality' },
        { name: 'Theology', slug: 'theology' },
        { name: 'History', slug: 'history' },
        { name: 'Prayer', slug: 'prayer' },
        { name: 'Kids', slug: 'kids' },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
    }
    console.log('✅ Categories seeded.');

    // 3. Authors
    const authors = [
        { name: 'St. Isaac the Syrian', slug: 'st-isaac-syrian', bio: '7th-century Christian bishop and theologian.' },
        { name: 'Abune Shenouda III', slug: 'abune-shenouda-iii', bio: 'The 117th Pope of Alexandria.' },
    ];

    for (const author of authors) {
        await prisma.author.upsert({
            where: { slug: author.slug },
            update: {},
            create: author,
        });
    }
    console.log('✅ Authors seeded.');

    // 4. Books
    const dbLangs = await prisma.language.findMany();
    const langMap = dbLangs.reduce((acc, l) => ({ ...acc, [l.code]: l.id }), {});

    const dbCats = await prisma.category.findMany();
    const catMap = dbCats.reduce((acc, c) => ({ ...acc, [c.slug]: c.id }), {});

    const dbAuthors = await prisma.author.findMany();
    const authorMap = dbAuthors.reduce((acc, a) => ({ ...acc, [a.slug]: a.id }), {});

    const books = [
        {
            slug: 'the-spiritual-life',
            featured: true,
            authorId: authorMap['abune-shenouda-iii'],
            categories: ['spirituality', 'prayer'],
            translations: [
                { langCode: 'en', title: 'The Spiritual Life', description: 'A guide to deepening your connection with the Divine.' },
                { langCode: 'ar', title: 'الحياة الروحية', description: 'دليل لتعميق صلتك بالله.' },
                { langCode: 'am', title: 'መንፈሳዊ ሕይወት', description: 'ከእግዚአብሔር ጋር ያለዎትን ግንኙነት ለማጥለቅ የሚረዳ መመሪያ።' },
            ]
        },
        {
            slug: 'ascetic-homilies',
            featured: false,
            authorId: authorMap['st-isaac-syrian'],
            categories: ['theology', 'spirituality'],
            translations: [
                { langCode: 'en', title: 'Ascetic Homilies', description: 'Deep theological reflections on the ascetic life.' },
                { langCode: 'ar', title: 'ميامر نسكية', description: 'تأملات لاهوتية عميقة في الحياة النسكية.' },
            ]
        }
    ];

    for (const bookData of books) {
        const { translations, categories: bookCats, ...rest } = bookData;

        const book = await prisma.book.upsert({
            where: { slug: rest.slug },
            update: {
                featured: rest.featured,
                authorId: rest.authorId,
            },
            create: {
                ...rest,
                translations: {
                    create: translations.map(t => ({
                        languageId: langMap[t.langCode],
                        title: t.title,
                        description: t.description,
                    }))
                },
                categories: {
                    create: bookCats.map(slug => ({
                        categoryId: catMap[slug]
                    }))
                }
            }
        });
    }
    console.log('✅ Books seeded.');
    console.log('🌱 Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
