import React, { useState, useRef, useEffect } from 'react';
import { Clock, Check } from 'lucide-react';
import { parseTimeToMinutes } from '../../utils/conflictValidation';

interface TimePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}

/**
 * Normalizes any string (e.g. "09:00", "14:30", "9:00 am") into standard "09:00 AM" format.
 */
export function formatTo12Hour(timeStr: string): string {
  if (!timeStr) return '09:00 AM';
  const clean = timeStr.trim().toUpperCase();

  // If already in 12-hour format e.g. "09:00 AM" or "9:00 AM"
  const twelveHourMatch = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (twelveHourMatch) {
    const h = parseInt(twelveHourMatch[1], 10);
    const m = twelveHourMatch[2];
    const period = twelveHourMatch[3];
    return `${h.toString().padStart(2, '0')}:${m} ${period}`;
  }

  // Parse total minutes (handles 24h e.g. "14:30" or "09:00")
  const totalMinutes = parseTimeToMinutes(clean);
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';

  let displayHours = hours % 12;
  if (displayHours === 0) displayHours = 12;

  return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
}

const HOURS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MINUTES = ['00', '15', '30', '45'];
const QUICK_PRESETS = [
  '08:30 AM',
  '09:00 AM',
  '10:00 AM',
  '10:30 AM',
  '11:30 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '05:00 PM',
];

export const TimePicker: React.FC<TimePickerProps> = ({
  label,
  value,
  onChange,
  required = false,
  placeholder = '09:00 AM',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize initial value
  const formattedValue = formatTo12Hour(value || placeholder);

  // Parse current hour, minute, period
  const match = formattedValue.match(/^(\d{2}):(\d{2})\s*(AM|PM)$/) || ['09:00 AM', '09', '00', 'AM'];
  const currentHour = match[1];
  const currentMinute = match[2];
  const currentPeriod = match[3] as 'AM' | 'PM';

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const updateTime = (hour: string, minute: string, period: 'AM' | 'PM') => {
    const result = `${hour}:${minute} ${period}`;
    onChange(result);
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Input container with compact mini clock picker button */}
      <div className="relative flex items-center group">
        <input
          type="text"
          readOnly
          required={required}
          value={formattedValue}
          onClick={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-3.5 pr-11 py-2.5 bg-white border border-slate-200 group-hover:border-emerald-300 rounded-xl text-slate-900 font-mono text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/20 focus:border-[#0D5C46] transition-all cursor-pointer shadow-2xs select-none"
        />

        {/* Compact mini clock button right next to the time input */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`absolute right-1.5 px-2 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
            isOpen
              ? 'bg-[#0D5C46] text-white shadow-xs'
              : 'text-slate-400 group-hover:text-[#0D5C46] hover:bg-emerald-50'
          }`}
          title="Open time picker (12-hour clock)"
        >
          <Clock className="w-4 h-4" />
        </button>
      </div>

      {/* Mini Clock / Time Picker Popover */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 left-0 w-80 p-4 bg-white border border-[#CBDDD4] rounded-2xl shadow-soft-lg text-xs space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
          {/* Header Display: Selected Time Preview in 12-Hour format */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Selected Time (12-Hour)
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Standard university lecture slot</span>
            </div>
            <div className="text-sm font-mono font-bold text-[#0D5C46] bg-[#EBF5F0] px-3 py-1 rounded-lg border border-[#CDE5DB] shadow-2xs tabular-nums">
              {formattedValue}
            </div>
          </div>

          {/* AM / PM Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Period</span>
              <span className="text-[10px] text-slate-400 font-medium">AM (Morning) / PM (Afternoon)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              {(['AM', 'PM'] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => updateTime(currentHour, currentMinute, period)}
                  className={`py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    currentPeriod === period
                      ? 'bg-[#0D5C46] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <span>{period}</span>
                  {currentPeriod === period && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Hour Selector (1 - 12) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Hour</span>
              <span className="text-[10px] text-slate-400 font-mono font-semibold">1 to 12</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {HOURS.map((hour) => (
                <button
                  key={hour}
                  type="button"
                  onClick={() => updateTime(hour, currentMinute, currentPeriod)}
                  className={`py-1.5 text-xs font-mono rounded-lg font-bold transition-all cursor-pointer ${
                    currentHour === hour
                      ? 'bg-[#0D5C46] text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-emerald-50 hover:text-[#0D5C46] text-slate-700 border border-slate-150'
                  }`}
                >
                  {hour}
                </button>
              ))}
            </div>
          </div>

          {/* Minute Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Minutes</span>
              <span className="text-[10px] text-slate-400 font-mono font-semibold">Quarter-hour increments</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {MINUTES.map((min) => (
                <button
                  key={min}
                  type="button"
                  onClick={() => updateTime(currentHour, min, currentPeriod)}
                  className={`py-1.5 text-xs font-mono rounded-lg font-bold transition-all cursor-pointer ${
                    currentMinute === min
                      ? 'bg-[#0D5C46] text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-emerald-50 hover:text-[#0D5C46] text-slate-700 border border-slate-150'
                  }`}
                >
                  :{min}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Academic Presets */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Academic Slot Presets
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {QUICK_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    onChange(preset);
                    setIsOpen(false);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                    formattedValue === preset
                      ? 'bg-[#0D5C46] text-white font-bold shadow-2xs'
                      : 'bg-slate-100 hover:bg-[#EBF5F0] text-slate-700 hover:text-[#0D5C46] border border-slate-200/60'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">
              {currentHour}:{currentMinute} {currentPeriod}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3.5 py-1.5 bg-[#0D5C46] hover:bg-[#084232] text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Done</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
