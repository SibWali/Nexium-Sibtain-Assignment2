// src/app/history/page.tsx
import { prisma } from '@/lib/prisma';
import HistoryList from './HistoryList';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic'; // always fresh builds

/* ── server‑side  Delete‑All  action ──────────────────── */
export async function deleteAll(): Promise<void> {
  'use server';
  await prisma.summary.deleteMany();
  // make sure /history is re‑validated after deletion
  revalidatePath('/history');
}

/* ── page component ───────────────────────────────────── */
export default async function HistoryPage() {
  const summaries = await prisma.summary.findMany({
    orderBy: { createdAT: 'desc' },
  });

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center py-12 px-6">
      <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow mb-8">
        📜 Summary History
      </h1>

      {/* Search bar + Delete‑All */}
      {summaries.length > 0 && (
        <div className="w-full max-w-3xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <input
            id="hist-search"
            className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-pink-500"
            placeholder="Search summaries…"
          />

          <form action={deleteAll}>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg shadow font-semibold"
            >
              🗑️ Delete All
            </button>
          </form>
        </div>
      )}

      {/* History list with copy / search (client component) */}
      <HistoryList
        initialData={summaries.map((s) => ({
          ...s,
          createdAT: s.createdAT.toISOString(), // convert Date → string
        }))}
      />
    </main>
  );
}
