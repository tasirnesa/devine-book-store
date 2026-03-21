const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: { email: 'admin@example.com' },
    data: { role: 'ADMIN' }
  });
  console.log('Updated', user.email, 'to', user.role);
}

main().catch(console.error).finally(() => prisma.$disconnect());
