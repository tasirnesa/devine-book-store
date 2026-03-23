const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.book.findMany({
    select: { id: true, slug: true, coverUrl: true, fileUrl: true },
    orderBy: { createdAt: 'desc' },
    take: 5
}).then(r => {
    console.log(JSON.stringify(r, null, 2));
    return p.$disconnect();
});
