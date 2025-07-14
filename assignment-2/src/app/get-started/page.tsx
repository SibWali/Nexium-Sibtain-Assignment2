'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function GetStartedPage() {
  const [url, setUrl] = useState('');
  const [summaryEn, setSummaryEn] = useState('');
  const [summaryUr, setSummaryUr] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedLang, setCopiedLang] = useState<'en' | 'ur' | null>(null);

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
      setSummaryEn(data.english ?? data.summary ?? 'No summary');
      setSummaryUr(data.urdu ?? '');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, lang: 'en' | 'ur') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLang(lang);
      setTimeout(() => setCopiedLang(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
          Simplify Your Blog Instantly ✨
        </h1>
        <h2>
        <p className="text-gray-400">Paste a blog URL below to get a quick summary in English and Urdu.</p>
        </h2>
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center space-y-4">
        <input
          type="text"
          placeholder="https://example.com/blog-post"
          className="w-full px-5 py-3 rounded-xl bg-white/10 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder:text-gray-400"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          onClick={handleSummarize}
          disabled={loading || !url}
          className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳ Summarizing…' : '🧠 Simplify Blog'}
        </button>
      </div>

      {error && (
        <div className="bg-red-600/10 text-red-400 border border-red-800 px-4 py-3 rounded-md max-w-xl text-center">
          {error}
        </div>
      )}

      {summaryEn && (
        <div className="w-full max-w-3xl bg-white/5 p-6 rounded-2xl shadow-inner backdrop-blur-md border border-gray-800 space-y-4 relative">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-pink-400">📝 Summary (English)</h2>
            <button
              onClick={() => handleCopy(summaryEn, 'en')}
              className="text-sm px-3 py-1 rounded-md bg-pink-500 hover:bg-pink-600 text-white transition"
            >
              {copiedLang === 'en' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-gray-200 whitespace-pre-line">{summaryEn}</p>
        </div>
      )}

      {summaryUr && (
        <div className="w-full max-w-3xl bg-white/5 p-6 rounded-2xl shadow-inner backdrop-blur-md border border-gray-800 space-y-4 relative">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-purple-400">📝 خلاصہ (Urdu)</h2>
            <button
              onClick={() => handleCopy(summaryUr, 'ur')}
              className="text-sm px-3 py-1 rounded-md bg-purple-500 hover:bg-purple-600 text-white transition"
            >
              {copiedLang === 'ur' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p dir="rtl" className="text-gray-200 whitespace-pre-line">{summaryUr}</p>
        </div>
      )}

      <Link
        href="/history"
        className="mt-6 text-pink-400 hover:text-pink-300 underline underline-offset-4 transition"
      >
        📜 View summary history →
      </Link>
    </div>
  );
}
