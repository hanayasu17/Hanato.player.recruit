'use client';

import { useState, useEffect } from 'react';

interface JournalSummary {
  id: string;
  date: string;
  createdAt: string;
  preview: string;
}

interface JournalListProps {
  onSelect: (id: string) => void;
  refreshKey?: number;
}

export default function JournalList({ onSelect, refreshKey }: JournalListProps) {
  const [journals, setJournals] = useState<JournalSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchJournals() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/journals');
        if (response.ok) {
          const data = await response.json();
          setJournals(data.journals || []);
        }
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    }
    fetchJournals();
  }, [refreshKey]);

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

  if (journals.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">&#128214;</div>
        <div className="empty-state-text">まだ日誌がありません</div>
        <div className="empty-state-hint">
          音声をアップロードして最初の心情日誌を作成しましょう
        </div>
      </div>
    );
  }

  return (
    <div className="journal-list">
      {journals.map((journal) => (
        <div
          key={journal.id}
          className="journal-item"
          onClick={() => onSelect(journal.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onSelect(journal.id)}
        >
          <div className="journal-date">{formatDate(journal.date)}</div>
          <div className="journal-preview">{journal.preview}</div>
        </div>
      ))}
    </div>
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
