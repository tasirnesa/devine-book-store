const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const user = await prisma.user.upsert({
            where: { email: 'superadmin@example.com' },
            update: { role: 'ADMIN', password: hashedPassword },
            create: {
                name: 'Super Admin',
                email: 'superadmin@example.com',
                password: hashedPassword,
                role: 'ADMIN'
            }
        });
        console.log('Super Admin created/updated:', user.email);
    } catch (error) {
        console.error('Error creating superadmin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
