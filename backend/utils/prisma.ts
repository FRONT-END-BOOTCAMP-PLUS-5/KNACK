import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info'],
});

export default prisma;
