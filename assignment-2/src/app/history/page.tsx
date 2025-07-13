import { prisma } from '@/lib/prisma';

export default async function HistoryPage() {
  // server component can fetch directly
  const summaries = await prisma.summary.findMany({ orderBy: { createdAT: 'desc' } });

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">📜 History</h1>

      {summaries.length === 0 && <p>No summaries yet.</p>}

      <ul className="space-y-4">
        {summaries.map((s) => (
          <li key={s.id} className="bg-white shadow rounded-lg p-4">
            <p className="text-indigo-600 underline break-all">{s.url}</p>
            <p className="mt-2 text-gray-700">{s.summary}</p>
            <p className="mt-1 text-xs text-gray-500">
              {new Date(s.createdAT).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
