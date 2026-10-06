import React from 'react';
import { Calendar as CalendarIcon, Info } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { TimetableCalendar } from '../../components/calendar/TimetableCalendar';

export const StudentTimetablePage: React.FC = () => {
  const { timetable } = useData();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0D3B2E] flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-[#0D5C46]" />
            <span>Weekly Class Timetable</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Batch 2023 · Computer Science & Engineering · Semester 5 (Section A)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          <Info className="w-3.5 h-3.5 text-[#0D5C46]" />
          <span>Wednesday highlighted as current day</span>
        </div>
      </div>

      {/* Calendar Component (Default Week View) */}
      <TimetableCalendar classes={timetable} isAdmin={false} />
    </div>
  );
};
