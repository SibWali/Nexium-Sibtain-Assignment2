// src/lib/prisma.ts
import { PrismaClient } from '@/generated/prisma';   // ← custom path

declare global {
   
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
