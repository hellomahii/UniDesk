import React from 'react';
import { TicketStatus } from '../../types';

interface StatusBadgeProps {
  status:
    | TicketStatus
    | 'Paid'
    | 'Partially Paid'
    | 'Scheduled'
    | 'Published'
    | 'Draft'
    | 'Resolved'
    | 'Archived'
    | 'Active'
    | 'Postponed'
    | 'Error'
    | 'Failed'
    | 'Rejected';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let badgeStyles = 'bg-slate-50 text-slate-700 border-slate-200';
  let dotStyles = 'bg-slate-400';

  switch (status) {
    case 'Pending':
      // Soft amber/muted yellow (Section 17)
      badgeStyles = 'bg-amber-50 text-amber-800 border-amber-200/80';
      dotStyles = 'bg-amber-500';
      break;

    case 'In Progress':
      // Soft teal/blue-green (Section 17)
      badgeStyles = 'bg-teal-50 text-teal-800 border-teal-200/80';
      dotStyles = 'bg-teal-600';
      break;

    case 'Resolved':
    case 'Paid':
    case 'Published':
    case 'Active':
      // Soft green (Section 17)
      badgeStyles = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      dotStyles = 'bg-emerald-600';
      break;

    case 'Partially Paid':
    case 'Draft':
    case 'Scheduled':
      // Calm sky/slate accent
      badgeStyles = 'bg-sky-50 text-sky-800 border-sky-200/80';
      dotStyles = 'bg-sky-600';
      break;

    case 'Postponed':
    case 'Error':
    case 'Failed':
    case 'Rejected':
      // Muted red (Section 17)
      badgeStyles = 'bg-rose-50 text-rose-800 border-rose-200/80';
      dotStyles = 'bg-rose-500';
      break;

    case 'Archived':
      badgeStyles = 'bg-slate-100 text-slate-600 border-slate-300';
      dotStyles = 'bg-slate-400';
      break;

    default:
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-md border ${badgeStyles}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles}`} />
      <span>{status}</span>
    </span>
  );
};
