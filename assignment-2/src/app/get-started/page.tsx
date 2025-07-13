'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function GetStartedPage() {
  const [url, setUrl] = useState('');
  const [summaryEn, setSummaryEn] = useState('');
  const [summaryUr, setSummaryUr] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    setSummaryEn('');
    setSummaryUr('');

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`API ${res.status}: ${txt.slice(0, 80)}`);
      }

      const data = await res.json();
      // data.english & data.urdu come from the route
      setSummaryEn(data.english ?? data.summary ?? 'No summary');
      setSummaryUr(data.urdu ?? '');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 space-y-8">
      <h1 className="text-4xl font-bold text-indigo-700">Enter Blog URL</h1>

      <input
        type="text"
        placeholder="https://example.com/blog-post"
        className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button
        onClick={handleSummarize}
        disabled={loading || !url}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Summarizing…' : 'Simplify Blog'}
      </button>

      {error && (
        <p className="text-red-600 max-w-lg text-center whitespace-pre-line">
          {error}
        </p>
      )}

      {summaryEn && (
        <div className="max-w-2xl bg-gray-50 p-6 rounded-lg shadow space-y-2 w-full">
          <h2 className="text-xl font-semibold text-gray-800">
            📝 Summary (English)
          </h2>
          <p className="text-gray-700 whitespace-pre-line">{summaryEn}</p>
        </div>
      )}

      {summaryUr && (
        <div className="max-w-2xl bg-gray-50 p-6 rounded-lg shadow space-y-2 w-full">
          <h2 className="text-xl font-semibold text-gray-800">
            📝 خلاصہ (Urdu)
          </h2>
          <p
            dir="rtl"
            className="text-gray-700 whitespace-pre-line"
          >
            {summaryUr}
          </p>
        </div>
      )}

      <Link
        href="/history"
        className="text-indigo-600 hover:underline underline-offset-4"
      >
        View summary history →
      </Link>
    </div>
  );
}
