'use client';

import { useState, useCallback } from 'react';
import VoiceUploader from '@/components/VoiceUploader';
import DialogueView from '@/components/DialogueView';
import JournalList from '@/components/JournalList';
import JournalDetail from '@/components/JournalDetail';

type View = 'home' | 'dialogue' | 'journals' | 'journal-detail';

export default function Home() {
  const [view, setView] = useState<View>('home');
  const [sessionId, setSessionId] = useState('');
  const [transcription, setTranscription] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedJournalId, setSelectedJournalId] = useState('');
  const [journalRefreshKey, setJournalRefreshKey] = useState(0);

  const handleUploadComplete = useCallback(
    (data: { sessionId: string; transcription: string; message: string }) => {
      setSessionId(data.sessionId);
      setTranscription(data.transcription);
      setInitialMessage(data.message);
      setError('');
      setView('dialogue');
    },
    []
  );

  const handleError = useCallback((msg: string) => {
    setError(msg);
  }, []);

  const handleDialogueCompleted = useCallback((_journalId: string) => {
    setJournalRefreshKey((k) => k + 1);
  }, []);

  const handleJournalSelect = useCallback((id: string) => {
    setSelectedJournalId(id);
    setView('journal-detail');
  }, []);

  const handleNewJournal = useCallback(() => {
    setView('home');
    setSessionId('');
    setTranscription('');
    setInitialMessage('');
    setError('');
  }, []);

  return (
    <div className="app-shell">
      {/* ヘッダー */}
      <header className="app-header">
        <h1>心情日誌</h1>
        <nav className="header-nav">
          <button
            className={`nav-btn ${view === 'home' || view === 'dialogue' ? 'active' : ''}`}
            onClick={handleNewJournal}
          >
            新規
          </button>
          <button
            className={`nav-btn ${view === 'journals' || view === 'journal-detail' ? 'active' : ''}`}
            onClick={() => setView('journals')}
          >
            記録
          </button>
        </nav>
      </header>

      {/* メインコンテンツ */}
      <main className="main-content">
        {/* エラー表示 */}
        {error && (
          <div
            className="card"
            style={{ background: '#fef2f2', color: '#991b1b', marginBottom: 16 }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>エラー</div>
            <div style={{ fontSize: '0.88rem' }}>{error}</div>
            <button
              className="progress-btn"
              onClick={() => setError('')}
              style={{ marginTop: 12 }}
            >
              閉じる
            </button>
          </div>
        )}

        {/* ホーム: 音声アップロード */}
        {view === 'home' && (
          <>
            <div style={{ textAlign: 'center', padding: '20px 0 28px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                今日の歩みを神様に捧げましょう
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--gray-500)',
                  lineHeight: 1.7,
                }}
              >
                声またはテキストで今日の振り返りを語ってください。
                <br />
                霊的な伴走者があなたと共に歩みます。
              </div>
            </div>
            <VoiceUploader
              onUploadComplete={handleUploadComplete}
              onError={handleError}
            />
          </>
        )}

        {/* 対話ビュー */}
        {view === 'dialogue' && sessionId && (
          <DialogueView
            sessionId={sessionId}
            initialTranscription={transcription}
            initialMessage={initialMessage}
            onCompleted={handleDialogueCompleted}
          />
        )}

        {/* 日誌一覧 */}
        {view === 'journals' && (
          <>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.05rem',
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              心情日誌の記録
            </div>
            <JournalList
              onSelect={handleJournalSelect}
              refreshKey={journalRefreshKey}
            />
          </>
        )}

        {/* 日誌詳細 */}
        {view === 'journal-detail' && selectedJournalId && (
          <JournalDetail
            journalId={selectedJournalId}
            onBack={() => setView('journals')}
          />
        )}
      </main>
    </div>
  );
}
