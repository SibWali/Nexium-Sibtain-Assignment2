import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

import { prisma } from '@/lib/prisma';        // Prisma → Supabase
import connectToMongo from '@/lib/mongodb';   // Mongoose helper
import Blog from '@/models/Blog';             // Blog schema

/* ---------- tiny helpers ---------- */
const urduDict: Record<string, string> = {
  success: 'کامیابی',
  life: 'زندگی',
  motivation: 'حوصلہ افزائی',
  dream: 'خواب',
};
const toUrdu = (txt: string) =>
  txt.split(' ').map((w) => urduDict[w.toLowerCase()] ?? w).join(' ');

function extractText(html: string) {
  const $ = cheerio.load(html);
  return $('article p').text().trim() || $('p').text().trim();
}

export async function POST(req: NextRequest) {
  try {
    /* 1️⃣  Parse body */
    const { url } = (await req.json()) as { url?: string };
    if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

    /* 2️⃣  Scrape full blog text */
    const html = (await axios.get<string>(url)).data;
    const fullText = extractText(html);
    if (!fullText) return NextResponse.json({ error: 'No text found' }, { status: 404 });

    /* 3️⃣  “AI” summary + Urdu */
    const summaryEn = fullText.slice(0, 200) + '…';
    const summaryUr = toUrdu(summaryEn);

    /* 4️⃣  Save full text in MongoDB */
    await connectToMongo();
    await Blog.findOneAndUpdate(
      { url },
      { url, content: fullText },
      { upsert: true }
    );

    /* 5️⃣  Save summary in Supabase (Postgres) */
    await prisma.summary.upsert({
      where: { url },
      update: { summary: summaryEn },
      create: { url, summary: summaryEn },
    });

    /* 6️⃣  Return both summaries */
    return NextResponse.json({
      english: summaryEn,
      urdu: summaryUr,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
