import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

import { prisma } from '@/lib/prisma';
import connectToMongo from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { toUrdu } from '@/lib/urdu'; // ✅ Imported from your helper

function extractText(html: string) {
  const $ = cheerio.load(html);
  return $('article p').text().trim() || $('p').text().trim();
}

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Parse request body
    const { url } = (await req.json()) as { url?: string };
    if (!url) {
      return NextResponse.json({ error: 'URL required' }, { status: 400 });
    }

    // 2️⃣ Scrape full blog text with user-agent
    const html = (
      await axios.get<string>(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Blog Summariser)' },
        timeout: 15000,
      })
    ).data;

    const fullText = extractText(html);
    if (!fullText) {
      return NextResponse.json({ error: 'No text found' }, { status: 404 });
    }

    // 3️⃣ Simulated summaries
    const summaryEn = fullText.slice(0, 200) + '…';
    const summaryUr = toUrdu(summaryEn);

    // 4️⃣ Save full text to MongoDB
    await connectToMongo();
    await Blog.findOneAndUpdate(
      { url },
      { url, content: fullText },
      { upsert: true }
    );

    // 5️⃣ Save English summary in Supabase/Postgres
    await prisma.summary.upsert({
      where: { url },
      update: { summary: summaryEn },
      create: { url, summary: summaryEn },
    });

    // 6️⃣ Return both summaries
    return NextResponse.json({
      english: summaryEn,
      urdu: summaryUr,
    });
  } catch (err: unknown) {
    console.error('⛔ summarize API error:', err);
    const message =
      err instanceof Error ? err.message : 'Internal error (unknown)';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
