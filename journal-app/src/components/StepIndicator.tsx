'use client';

import { DialogueStep } from '@/types';

const STEPS: Array<{ key: DialogueStep; label: string }> = [
  { key: 'transcribing', label: '文字起こし' },
  { key: 'organizing', label: '整理' },
  { key: 'awaiting_gods_perspective', label: '神様の視点' },
  { key: 'spiritual_battle', label: '霊的分別' },
  { key: 'closing_prayer', label: '祈り' },
];

const STEP_ORDER: DialogueStep[] = [
  'idle',
  'uploading',
  'transcribing',
  'organizing',
  'awaiting_gods_perspective',
  'gods_feedback',
  'spiritual_battle',
  'closing_prayer',
  'completed',
];

function getStepIndex(step: DialogueStep): number {
  return STEP_ORDER.indexOf(step);
}

interface StepIndicatorProps {
  currentStep: DialogueStep;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="step-indicator">
      {STEPS.map((s, i) => {
        const stepIndex = getStepIndex(s.key);
        const isActive = currentIndex >= stepIndex && currentIndex < getStepIndex(STEPS[i + 1]?.key || 'completed');
        const isCompleted = currentIndex > stepIndex;

        let className = 'step-dot';
        if (isActive) className += ' active';
        else if (isCompleted) className += ' completed';

        return <div key={s.key} className={className} title={s.label} />;
      })}
    </div>
  );
}
