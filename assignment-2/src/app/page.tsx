"use client";

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex items-center justify-center min-h-screen bg-black px-6">
      <div className="text-center max-w-3xl p-10 bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500 mb-6 leading-tight animate-fade-in-up">
          Simplify Blogs in Seconds ✍️
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-700 mb-6">
          Create, edit, and manage your blog effortlessly with AI assistance.
        </p>

        <p className="text-md text-gray-500 italic mb-10">
          — Crafted with 💖 by <span className="font-semibold text-indigo-600">Sibtain Wali</span>
        </p>

        <button
          onClick={() => router.push('/get-started')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
        >
          🚀 Get Started
        </button>
      </div>
    </main>
  );
}
