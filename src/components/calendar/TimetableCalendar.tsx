import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';
import { TimetableClass } from '../../types';

interface TimetableCalendarProps {
  classes: TimetableClass[];
  isAdmin?: boolean;
  onAddClass?: () => void;
  onEditClass?: (cls: TimetableClass) => void;
  onDeleteClass?: (id: string) => void;
}

const DAYS: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const TIME_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

export const TimetableCalendar: React.FC<TimetableCalendarProps> = ({
  classes,
  isAdmin = false,
  onAddClass,
  onEditClass,
  onDeleteClass,
}) => {
  const [viewMode, setViewMode] = useState<'Week' | 'Month' | 'Day'>('Week');
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0); // 0 = current week
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Monday');
  const [hoveredClassId, setHoveredClassId] = useState<string | null>(null);

  // Today is simulated as Wednesday (mid-week during semester)
  const currentDayName: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' = 'Wednesday';

  const getWeekRangeLabel = () => {
    if (currentWeekIndex === 0) return 'Current Week: 28 Sep – 03 Oct 2026';
    if (currentWeekIndex === 1) return 'Next Week: 05 Oct – 10 Oct 2026';
    if (currentWeekIndex === -1) return 'Previous Week: 21 Sep – 26 Sep 2026';
    return `Academic Week ${currentWeekIndex > 0 ? `+${currentWeekIndex}` : currentWeekIndex}`;
  };

  // Helper to calculate top and height in minutes for week view
  const calculatePosition = (startTime: string, endTime: string) => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const startMinutes = (startH - 8) * 60 + startM;
    const durationMinutes = (endH - startH) * 60 + (endM - startM);

    // Each hour slot is 70px high -> (70 / 60) px per minute
    const top = Math.max(0, (startMinutes * 70) / 60);
    const height = Math.max(48, (durationMinutes * 70) / 60 - 4);

    return { top, height };
  };

  return (
    <div className="glass-panel rounded-2xl border border-[#E2ECE7] overflow-hidden flex flex-col shadow-xs bg-white">
      {/* Calendar Header Controls */}
      <div className="p-4 md:px-6 md:py-4 border-b border-slate-200/80 bg-[#FAFCFA] flex flex-wrap items-center justify-between gap-3">
        {/* Navigation buttons: Previous, Today, Next */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs">
            <button
              onClick={() => setCurrentWeekIndex((prev) => prev - 1)}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentWeekIndex(0)}
              className="px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 border-x border-slate-200 transition-colors cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentWeekIndex((prev) => prev + 1)}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-xs font-semibold text-slate-800 ml-2">
            {getWeekRangeLabel()}
          </span>
        </div>

        {/* View toggle & Admin actions */}
        <div className="flex items-center gap-2.5">
          {/* Segmented control: Week | Month | Day */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/60">
            {(['Week', 'Month', 'Day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  viewMode === mode
                    ? 'bg-white text-[#0D5C46] shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Admin Add Class Button */}
          {isAdmin && onAddClass && (
            <button
              onClick={onAddClass}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D5C46] hover:bg-[#0B4A38] text-white text-xs font-medium rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Class</span>
            </button>
          )}
        </div>
      </div>

      {/* Mode 1: WEEK VIEW (Default Requirement) */}
      {viewMode === 'Week' && (
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Days Header */}
            <div className="grid grid-cols-[70px_repeat(6,1fr)] border-b border-slate-200 bg-[#F6FAF8]/80 text-xs font-semibold text-slate-700">
              <div className="p-3 text-center text-slate-400 font-mono text-[11px] border-r border-slate-200/70">
                Time
              </div>
              {DAYS.map((day) => {
                const isCurrent = day === currentDayName && currentWeekIndex === 0;
                return (
                  <div
                    key={day}
                    className={`p-3 text-center border-r last:border-r-0 border-slate-200/70 transition-colors ${
                      isCurrent ? 'bg-[#EBF5F0] text-[#0D5C46]' : 'text-slate-700'
                    }`}
                  >
                    <div className="font-semibold flex items-center justify-center gap-1.5">
                      <span>{day}</span>
                      {isCurrent && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" title="Today" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Timetable Grid with positioned class cards */}
            <div className="grid grid-cols-[70px_repeat(6,1fr)] relative">
              {/* Time axis column */}
              <div className="border-r border-slate-200/70 bg-[#FAFCFA]">
                {TIME_SLOTS.map((slot) => (
                  <div
                    key={slot}
                    className="h-[70px] border-b border-slate-100 flex items-start justify-center pt-2 text-[11px] font-mono tabular-nums text-slate-400"
                  >
                    {slot}
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {DAYS.map((day) => {
                const dayClasses = classes.filter((c) => c.day === day);
                const isCurrent = day === currentDayName && currentWeekIndex === 0;

                return (
                  <div
                    key={day}
                    className={`relative border-r last:border-r-0 border-slate-200/70 ${
                      isCurrent ? 'bg-emerald-50/15' : 'bg-white'
                    }`}
                  >
                    {/* Background hour grid lines */}
                    {TIME_SLOTS.map((slot) => (
                      <div key={slot} className="h-[70px] border-b border-slate-100" />
                    ))}

                    {/* Classes absolutely positioned by time */}
                    {dayClasses.map((cls) => {
                      const { top, height } = calculatePosition(cls.startTime, cls.endTime);
                      const isHovered = hoveredClassId === cls.id;

                      return (
                        <div
                          key={cls.id}
                          onMouseEnter={() => setHoveredClassId(cls.id)}
                          onMouseLeave={() => setHoveredClassId(null)}
                          style={{
                            top: `${top}px`,
                            height: `${height}px`,
                          }}
                          className={`absolute left-1 right-1 p-2 rounded-lg border text-left shadow-2xs transition-all overflow-hidden flex flex-col justify-between ${
                            cls.subject.includes('Lab')
                              ? 'bg-teal-50/90 border-teal-200/80 text-teal-950'
                              : cls.subject.includes('Database')
                              ? 'bg-emerald-50/90 border-emerald-200/80 text-emerald-950'
                              : cls.subject.includes('Operating')
                              ? 'bg-cyan-50/90 border-cyan-200/80 text-cyan-950'
                              : 'bg-slate-50 border-slate-200/90 text-slate-900'
                          } ${isHovered ? 'ring-2 ring-[#0D5C46]/40 z-20 shadow-md' : 'z-10'}`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <h5 className="font-semibold text-xs leading-tight line-clamp-1">
                                {cls.subject}
                              </h5>
                              {isAdmin && (
                                <div className="flex items-center gap-1 opacity-80 hover:opacity-100">
                                  {onEditClass && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onEditClass(cls);
                                      }}
                                      className="p-0.5 text-slate-600 hover:text-slate-900 cursor-pointer"
                                      title="Edit class"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                  )}
                                  {onDeleteClass && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteClass(cls.id);
                                      }}
                                      className="p-0.5 text-rose-500 hover:text-rose-700 cursor-pointer"
                                      title="Delete class"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-600 mt-0.5 tabular-nums">
                              <Clock className="w-3 h-3 shrink-0 text-slate-400" />
                              <span>{cls.startTime} – {cls.endTime}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 pt-1 border-t border-black/5">
                            <span className="flex items-center gap-0.5 font-medium truncate">
                              <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                              {cls.room}
                            </span>
                            <span className="truncate font-mono text-[9px] uppercase px-1 rounded bg-black/5">
                              {cls.section}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: DAY VIEW */}
      {viewMode === 'Day' && (
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  selectedDay === day
                    ? 'bg-[#0D5C46] text-white border-[#0D5C46] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {classes
              .filter((c) => c.day === selectedDay)
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((cls) => (
                <div
                  key={cls.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-colors flex items-center justify-between shadow-2xs"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 font-mono text-xs font-semibold text-center min-w-[100px]">
                      <div>{cls.startTime}</div>
                      <div className="text-[10px] text-emerald-600">to {cls.endTime}</div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{cls.subject}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {cls.room}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          {cls.faculty}
                        </span>
                        <span>·</span>
                        <span className="font-mono text-[11px] text-slate-400">{cls.courseCode}</span>
                      </div>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      {onEditClass && (
                        <button
                          onClick={() => onEditClass(cls)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      {onDeleteClass && (
                        <button
                          onClick={() => onDeleteClass(cls.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            {classes.filter((c) => c.day === selectedDay).length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                No classes scheduled for {selectedDay}.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 3: MONTH VIEW (Clean Academic Term Overview) */}
      {viewMode === 'Month' && (
        <div className="p-6">
          <div className="p-4 rounded-xl bg-[#F6FAF8] border border-[#E2ECE7] mb-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              October 2026 Academic Term Schedule
            </h4>
            <p className="text-xs text-slate-500">
              Classes run Monday through Saturday. Mid-term examination break starts on 14 October 2026.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {DAYS.map((day) => {
              const dayClasses = classes.filter((c) => c.day === day);
              return (
                <div key={day} className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <span className="text-xs font-semibold text-slate-800">{day}</span>
                    <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {dayClasses.length} lectures
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {dayClasses.map((cls) => (
                      <div key={cls.id} className="text-slate-600 truncate">
                        <span className="font-mono text-[11px] text-slate-400 mr-1.5">
                          {cls.startTime}
                        </span>
                        <span>{cls.subject}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
