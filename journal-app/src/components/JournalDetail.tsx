'use client';

import { useState, useEffect } from 'react';
import { JournalEntry } from '@/types';

interface JournalDetailProps {
  journalId: string;
  onBack: () => void;
}

export default function JournalDetail({ journalId, onBack }: JournalDetailProps) {
  const [journal, setJournal] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchJournal() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/journals?id=${journalId}`);
        if (response.ok) {
          const data = await response.json();
          setJournal(data);
        }
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    }
    fetchJournal();
  }, [journalId]);

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-dots">
          <span />
          <span />
          <span />
        </div>
        <span>日誌を読み込み中...</span>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="card">
        <p>日誌が見つかりません</p>
        <button className="progress-btn" onClick={onBack} style={{ marginTop: 16 }}>
          戻る
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        className="nav-btn"
        onClick={onBack}
        style={{ marginBottom: 16 }}
      >
        &#8592; 一覧に戻る
      </button>

      <div className="card">
        <div className="card-title">
          {formatDate(journal.date)} の心情日誌
        </div>

        <Section title="【文字起こし】" content={journal.transcription} />
        <Divider />
        <Section title="【事実】" content={journal.organized.facts} />
        <Section title="【感情】" content={journal.organized.emotions} />
        <Section title="【気づき】" content={journal.organized.insights} />
        <Divider />
        <Section
          title="【神様の視点への問いかけ】"
          content={journal.godsViewQuestion}
        />
        <Section title="【あなたの回答】" content={journal.userGodsViewAnswer} />
        <Section title="【フィードバック】" content={journal.godsFeedback} />
        <Divider />
        <Section
          title="【勝利した点】"
          content={journal.spiritualBattle.victories}
        />
        <Section
          title="【分別のポイント】"
          content={journal.spiritualBattle.discernmentPoints}
        />
        <Divider />
        <Section
          title="【今日の捧げもの】"
          content={journal.closing.offering}
        />
        <Section
          title="【明日の出陣】"
          content={journal.closing.tomorrowResolve}
        />
        <Section title="【終わりの祈り】" content={journal.closing.prayer} />
      </div>
    </div>
  );
}

function Section({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  if (!content) return null;
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--gold)',
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: '0.88rem',
          lineHeight: 1.8,
          whiteSpace: 'pre-wrap',
          color: 'var(--gray-700)',
        }}
      >
        {content}
      </div>
    </div>
  );
}

function Divider() {
  return (
    <hr
      style={{
        border: 'none',
        borderTop: '1px solid var(--gray-200)',
        margin: '20px 0',
      }}
    />
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const weekday = weekdays[date.getDay()];
  return `${year}年${month}月${day}日（${weekday}）`;
}
