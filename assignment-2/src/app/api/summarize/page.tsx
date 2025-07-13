'use client';

import { useState } from 'react';
import styles from './summarise.module.css';

export default function Summarise() {
  const [url,setUrl]=useState('');
  const [data,setData]=useState<{summary:string,urdu:string}|null>(null);
  const [loading,setLoading]=useState(false);

  async function handleSubmit() {
    if(!url) return;
    setLoading(true); setData(null);
    const res = await fetch('/api/summarise',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url})});
    setData(await res.json());
    setLoading(false);
  }

  return (
    <main className={styles.container}>
      <div className={styles.formCard}>
        <input className={styles.input} value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://example.com/blog"/>
        <button className={styles.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Working…':'Summarise'}
        </button>
      </div>

      {data && (
        <section className={styles.resultGrid}>
          <div className={styles.card}><h3>English</h3><p>{data.summary}</p></div>
          <div className={styles.card}><h3>اردو</h3><p dir="rtl">{data.urdu}</p></div>
        </section>
      )}
    </main>
  );
}
