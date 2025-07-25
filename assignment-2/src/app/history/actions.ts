// src/app/history/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteAll(): Promise<void> {
  await prisma.summary.deleteMany();
  revalidatePath('/history');
}