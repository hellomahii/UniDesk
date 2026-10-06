import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: string;
  variant?: 'default' | 'mint' | 'teal' | 'sage' | 'amber' | 'neutral';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  trend,
  variant = 'default',
  onClick,
}) => {
  let cardBg = 'bg-white';
  let accentBorder = 'border-slate-200/90';
  let iconBg = 'bg-slate-100 text-slate-700';
  let shadowClass = 'shadow-soft';

  switch (variant) {
    case 'mint':
      cardBg = 'bg-[#F2FAF6]';
      accentBorder = 'border-emerald-200/80';
      iconBg = 'bg-emerald-100/80 text-emerald-800';
      shadowClass = 'shadow-mint';
      break;
    case 'teal':
      cardBg = 'bg-[#F0FDF8]';
      accentBorder = 'border-teal-200/80';
      iconBg = 'bg-teal-100/80 text-teal-800';
      shadowClass = 'shadow-teal';
      break;
    case 'sage':
      cardBg = 'bg-[#F3F7F5]';
      accentBorder = 'border-[#CFE2D8]';
      iconBg = 'bg-[#E1EFE8] text-[#0D5C46]';
      shadowClass = 'shadow-sage';
      break;
    case 'amber':
      cardBg = 'bg-[#FFFDF5]';
      accentBorder = 'border-amber-200/80';
      iconBg = 'bg-amber-100/80 text-amber-800';
      shadowClass = 'shadow-amber';
      break;
    case 'neutral':
      cardBg = 'bg-slate-50/70';
      accentBorder = 'border-slate-200';
      iconBg = 'bg-slate-100 text-slate-600';
      shadowClass = 'shadow-soft';
      break;
    default:
      cardBg = 'bg-white';
      accentBorder = 'border-slate-200/90';
      iconBg = 'bg-slate-100 text-slate-700';
      shadowClass = 'shadow-soft';
      break;
  }

  return (
    <div
      onClick={onClick}
      className={`card-3d rounded-2xl p-5 ${cardBg} ${shadowClass} border ${accentBorder} flex flex-col justify-between cursor-pointer select-none`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
          {label}
        </span>
        {icon && (
          <div className={`icon-box p-2.5 rounded-xl ${iconBg} shadow-2xs`}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-2xl lg:text-3xl font-extrabold tracking-tight text-[#0D3B2E] font-mono tabular-nums">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-semibold text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
            {trend}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-2 text-xs text-slate-500 font-medium line-clamp-1">
          {subtext}
        </p>
      )}
    </div>
  );
};
