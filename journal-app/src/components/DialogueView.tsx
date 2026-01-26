'use client';

import { useState, useRef, useEffect } from 'react';
import { DialogueStep } from '@/types';
import StepIndicator from './StepIndicator';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface DialogueViewProps {
  sessionId: string;
  initialTranscription: string;
  initialMessage: string;
  onCompleted: (journalId: string) => void;
}

export default function DialogueView({
  sessionId,
  initialTranscription,
  initialMessage,
  onCompleted,
}: DialogueViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'transcription',
      role: 'assistant',
      content: `【あなたの言葉（文字起こし）】\n\n${initialTranscription}`,
    },
    {
      id: 'organized',
      role: 'assistant',
      content: initialMessage,
    },
  ]);
  const [currentStep, setCurrentStep] = useState<DialogueStep>(
    'awaiting_gods_perspective'
  );
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自動スクロール
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // テキストエリア自動リサイズ
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputText]);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        role,
        content,
      },
    ]);
  };

  // ステップ2: 神様の視点への回答を送信
  const handleSendGodsView = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    addMessage('user', userMessage);
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          action: 'gods_view_answer',
          userMessage,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'エラーが発生しました');
      }

      const data = await response.json();
      addMessage('assistant', data.message);
      setCurrentStep(data.step);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // ステップ4: 結びの祈りを生成
  const handleGenerateClosing = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          action: 'generate_closing',
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'エラーが発生しました');
      }

      const data = await response.json();
      addMessage('assistant', data.message);
      setCurrentStep('completed');

      if (data.journalId) {
        onCompleted(data.journalId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentStep === 'awaiting_gods_perspective') {
        handleSendGodsView();
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StepIndicator currentStep={currentStep} />

      <div
        ref={scrollRef}
        className="dialogue-container"
        style={{ flex: 1, overflowY: 'auto', paddingBottom: '16px' }}
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            <div className="message-bubble">{msg.content}</div>
          </div>
        ))}

        {isLoading && (
          <div className="message assistant">
            <div className="message-bubble">
              <div className="loading-dots">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="card" style={{ background: '#fef2f2', color: '#991b1b' }}>
            {error}
          </div>
        )}

        {/* ステップ3→4 の遷移ボタン */}
        {currentStep === 'spiritual_battle' && !isLoading && (
          <div style={{ padding: '8px 0' }}>
            <div className="section-divider">対話の結びへ</div>
            <button
              className="progress-btn sakura"
              onClick={handleGenerateClosing}
            >
              感謝と祈りで今日を締めくくる
            </button>
          </div>
        )}

        {/* 完了表示 */}
        {currentStep === 'completed' && (
          <div className="completed-banner">
            <div className="completed-banner-icon">&#10052;</div>
            <div className="completed-banner-text">
              今日の心情日誌が完成しました
            </div>
            <div className="completed-banner-sub">
              すべての記録が保存されています
            </div>
          </div>
        )}
      </div>

      {/* 入力エリア（ステップ2: 神様の視点への回答時のみ表示） */}
      {currentStep === 'awaiting_gods_perspective' && !isLoading && (
        <div className="input-area">
          <div className="input-row">
            <textarea
              ref={textareaRef}
              className="input-textarea"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="神様はどう感じておられると思いますか..."
              rows={1}
            />
            <button
              className="send-btn"
              onClick={handleSendGodsView}
              disabled={!inputText.trim()}
              aria-label="送信"
            >
              &#9654;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
