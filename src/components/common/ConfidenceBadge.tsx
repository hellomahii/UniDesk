import React from 'react';

interface ConfidenceBadgeProps {
  score: number; // 0 - 100
  label?: string;
  showScore?: boolean;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ score, label, showScore = true }) => {
  let colorStyles = '';
  let dotColor = '';
  let defaultLabel = '';

  if (score >= 75) {
    colorStyles = 'text-emerald-800 bg-emerald-50/80 border-emerald-200/80';
    dotColor = 'bg-emerald-600';
    defaultLabel = 'High Confidence';
  } else if (score >= 40) {
    colorStyles = 'text-amber-800 bg-amber-50/80 border-amber-200/80';
    dotColor = 'bg-amber-600';
    defaultLabel = 'Clarification Required';
  } else {
    colorStyles = 'text-rose-800 bg-rose-50/80 border-rose-200/80';
    dotColor = 'bg-rose-600';
    defaultLabel = 'Human Support';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border ${colorStyles}`}
      title={`Confidence Score: ${score}%`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      {showScore && <span className="font-mono tabular-nums font-semibold">{score}%</span>}
      <span className="text-slate-600 font-normal">·</span>
      <span>{label || defaultLabel}</span>
    </span>
  );
};
