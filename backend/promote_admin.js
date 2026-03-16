const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'admin@email.com';
    const updatedUser = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' }
    });
    console.log(`Promoted user: ${updatedUser.name} (${updatedUser.email}) to role: ${updatedUser.role}`);
    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
