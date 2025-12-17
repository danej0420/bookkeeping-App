import { PrismaClient } from '@prisma/client';

// Export a single PrismaClient instance for reuse across routes
export const prisma = new PrismaClient();
