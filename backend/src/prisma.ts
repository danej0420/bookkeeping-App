import { PrismaClient } from "@prisma/client";

// Export a single Prisma client instance so it can be reused across the app.
export const prisma = new PrismaClient();
