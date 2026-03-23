const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const admins = await prisma.user.findMany({
            where: { role: 'ADMIN' },
            select: { email: true, role: true }
        });
        console.log('Admin users:', JSON.stringify(admins, null, 2));
    } catch (error) {
        console.error('Error fetching admins:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
