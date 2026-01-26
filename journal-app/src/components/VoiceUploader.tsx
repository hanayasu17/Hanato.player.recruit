'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface VoiceUploaderProps {
  onUploadComplete: (data: {
    sessionId: string;
    transcription: string;
    message: string;
  }) => void;
  onError: (error: string) => void;
}

export default function VoiceUploader({
  onUploadComplete,
  onError,
}: VoiceUploaderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Web Speech API の対応チェック
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  const startRecording = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError('このブラウザは音声認識に対応していません。Chrome をお使いください。');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalTranscript = '';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      setTranscript(finalTranscript + interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'not-allowed') {
        onError('マイクの使用が許可されていません。ブラウザの設定を確認してください。');
      } else if (event.error !== 'aborted') {
        onError(`音声認識エラー: ${event.error}`);
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setTranscript('');
  }, [onError]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    // 録音停止後、編集モードへ
    setIsEditing(true);
  }, []);

  // テキストを送信してAI処理を開始
  const handleSubmit = useCallback(async () => {
    const text = transcript.trim();
    if (!text) {
      onError('テキストが空です。音声で語るか、テキストを入力してください。');
      return;
    }

    setIsProcessing(true);
    setProcessProgress('心情を整理しています...');

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || '処理に失敗しました');
      }

      const data = await response.json();
      onUploadComplete({
        sessionId: data.sessionId,
        transcription: data.transcription,
        message: data.message,
      });
    } catch (err) {
      onError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setIsProcessing(false);
      setProcessProgress('');
    }
  }, [transcript, onUploadComplete, onError]);

  // 処理中の表示
  if (isProcessing) {
    return (
      <div className="card">
        <div className="loading">
          <div className="loading-dots">
            <span />
            <span />
            <span />
          </div>
          <span>{processProgress}</span>
        </div>
      </div>
    );
  }

  // 編集モード（録音後 or テキスト入力）
  if (isEditing || !speechSupported) {
    return (
      <div className="card">
        <div className="card-title">
          {speechSupported ? '内容を確認して送信' : '今日の振り返りを書いてください'}
        </div>

        <textarea
          ref={textareaRef}
          className="transcript-editor"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="今日あったこと、感じたこと、気づいたことを自由に書いてください..."
          rows={8}
        />

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {speechSupported && (
            <button
              className="progress-btn"
              onClick={() => {
                setIsEditing(false);
                setTranscript('');
              }}
            >
              録り直す
            </button>
          )}
          <button
            className="progress-btn sakura"
            onClick={handleSubmit}
            disabled={!transcript.trim()}
            style={{ flex: 1 }}
          >
            霊的な伴走者に託す
          </button>
        </div>
      </div>
    );
  }

  // 録音中の表示
  if (isRecording) {
    return (
      <div className="card">
        <div className="card-title">聞いています...</div>
        <div className="recording-indicator">
          <div className="recording-pulse" />
          <span>話し終わったらボタンを押してください</span>
        </div>

        {transcript && (
          <div className="live-transcript">
            {transcript}
          </div>
        )}

        <button
          className="progress-btn sakura"
          onClick={stopRecording}
          style={{ marginTop: 16 }}
        >
          話し終わりました
        </button>
      </div>
    );
  }

  // 初期表示: 録音開始ボタン
  return (
    <div className="card">
      <div className="card-title">今日の振り返りを声で語りましょう</div>

      <button
        className="record-btn"
        onClick={startRecording}
        aria-label="録音を開始"
      >
        <div className="record-icon" />
        <div className="record-label">タップして話す</div>
      </button>

      <div className="upload-hint" style={{ marginTop: 16 }}>
        マイクへのアクセスを許可してください
      </div>

      <div className="divider-text">
        <span>または</span>
      </div>

      <button
        className="progress-btn"
        onClick={() => setIsEditing(true)}
        style={{ width: '100%' }}
      >
        テキストで入力する
      </button>
    </div>
  );
}
