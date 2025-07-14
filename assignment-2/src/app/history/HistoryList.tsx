// src/app/history/HistoryList.tsx  (client component)
'use client';

import { useEffect, useState } from 'react';

interface Summary {
  id: string;
  url: string;
  summary: string;
  createdAT: string;
}

export default function HistoryList({ initialData }: { initialData: Summary[] }) {
  /* search query (reads the input in layout via DOM) */
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  /* tiny listener to external search box */
  useEffect(() => {
    const input = document.getElementById('hist-search') as HTMLInputElement | null;
    if (!input) return;
    const handler = () => setQuery(input.value.toLowerCase());
    input.addEventListener('input', handler);
    return () => input.removeEventListener('input', handler);
  }, []);

  const filtered = initialData.filter(
    (s) =>
      s.url.toLowerCase().includes(query) ||
      s.summary.toLowerCase().includes(query)
  );

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('copy failed', err);
    }
  };

  if (filtered.length === 0)
    return <p className="text-gray-400">No matches found.</p>;

  return (
    <ul className="w-full max-w-3xl space-y-6">
      {filtered.map((s) => (
        <li
          key={s.id}
          className="bg-white/5 border border-gray-800 rounded-2xl p-6 shadow backdrop-blur-md"
        >
          <div className="flex justify-between items-start gap-4">
            <p className="text-sm sm:text-base text-indigo-400 underline break-all flex-1">
              🔗 {s.url}
            </p>
            <button
              onClick={() => handleCopy(s.summary, s.id)}
              className="text-xs bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-md text-white shrink-0"
            >
              {copiedId === s.id ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <p className="mt-3 text-gray-200 whitespace-pre-line leading-relaxed">
            📝 {s.summary}
          </p>

          <p className="mt-4 text-xs text-gray-500">
            ⏱️ {new Date(s.createdAT).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  );
}
