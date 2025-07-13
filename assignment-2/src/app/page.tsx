// src/app/page.tsx (or your home screen component)

"use client";

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6 leading-tight drop-shadow-sm">
          Simplify Blogs in Seconds ✍️
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Create, edit, and manage your blog with ease using AI.
        </p>
        <button
          onClick={() => router.push('/get-started')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-lg font-medium shadow-lg hover:bg-indigo-700 transition"
        >
          Get Started 🚀
        </button>
      </div>
    </main>
  );
}
