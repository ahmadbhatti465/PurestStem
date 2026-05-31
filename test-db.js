const { PrismaClient } = require('@prisma/client');
const { PrismaSqlite } = require('prisma-adapter-sqlite');

const adapter = new PrismaSqlite({ url: 'file:./prisma/dev.db' });
const prisma = new PrismaClient({ adapter });

async function test() {
  try {
    const count = await prisma.contactMessage.count();
    console.log('ContactMessage count:', count);
    const msg = await prisma.contactMessage.create({
      data: { name: 'Test', email: 'test@test.com', message: 'Hello' }
    });
    console.log('Created:', msg.id);
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
test();
