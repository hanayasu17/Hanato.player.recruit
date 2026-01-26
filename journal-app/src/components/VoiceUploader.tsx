'use client';

import { useState, useRef, useCallback } from 'react';

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
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setUploadProgress('音声をアップロードしています...');

      try {
        const formData = new FormData();
        formData.append('audio', file);

        setUploadProgress('文字起こし中... しばらくお待ちください');

        const response = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'アップロードに失敗しました');
        }

        const data = await response.json();
        onUploadComplete({
          sessionId: data.sessionId,
          transcription: data.transcription,
          message: data.message,
        });
      } catch (err) {
        onError(
          err instanceof Error ? err.message : 'エラーが発生しました'
        );
      } finally {
        setIsUploading(false);
        setUploadProgress('');
      }
    },
    [onUploadComplete, onError]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  if (isUploading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="loading-dots">
            <span />
            <span />
            <span />
          </div>
          <span>{uploadProgress}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-title">今日の振り返りを録音から始めましょう</div>
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      >
        <div className="upload-icon">&#127908;</div>
        <div className="upload-text">
          ボイスメモをタップしてアップロード
        </div>
        <div className="upload-hint">
          MP3 / M4A / WAV / WebM に対応
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.m4a,.wav,.webm,.ogg,.mp4"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
