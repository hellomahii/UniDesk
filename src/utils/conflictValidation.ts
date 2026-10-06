import { TimetableClass, ExamRecord } from '../types';

/**
 * Normalizes time string (e.g. "09:00", "09:00 AM", "14:00", "2:00 PM") to total minutes from midnight.
 */
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const str = timeStr.trim().toUpperCase();
  const isPM = str.includes('PM');
  const isAM = str.includes('AM');

  const match = str.match(/(\d{1,2}):(\d{2})/);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Checks if interval [startA, endA] strictly overlaps with [startB, endB].
 * Adjacent slots (e.g. 09:00-10:00 and 10:00-11:00) do NOT overlap.
 */
export function checkTimesOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const sA = parseTimeToMinutes(startA);
  const eA = parseTimeToMinutes(endA);
  const sB = parseTimeToMinutes(startB);
  const eB = parseTimeToMinutes(endB);

  // Both intervals must be valid
  if (eA <= sA || eB <= sB) return false;

  return Math.max(sA, sB) < Math.min(eA, eB);
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  type?: 'room' | 'faculty' | 'group' | 'exam_room' | 'exam_group';
  title?: string;
  message?: string;
  conflictingItem?: TimetableClass | ExamRecord;
}

/**
 * Validates timetable class conflicts:
 * 1. Room conflict (same room, same day/date, overlapping time)
 * 2. Faculty conflict (same faculty, same day/date, overlapping time)
 * 3. Student group conflict (same Year + Batch + Dept + SubDept + Section, same day/date, overlapping time)
 */
export function validateClassConflicts(
  target: Omit<TimetableClass, 'id'> & { id?: string },
  existingClasses: TimetableClass[]
): ConflictCheckResult {
  for (const existing of existingClasses) {
    // Ignore self when editing
    if (target.id && existing.id === target.id) continue;

    // Check if on same day or date
    const sameDay = existing.day === target.day;
    const sameDate = target.date && existing.date ? target.date === existing.date : false;

    if (!sameDay && !sameDate) continue;

    // Check time overlap
    const overlaps = checkTimesOverlap(
      target.startTime,
      target.endTime,
      existing.startTime,
      existing.endTime
    );

    if (!overlaps) continue;

    // 1. Room conflict
    if (
      existing.room.trim().toLowerCase() === target.room.trim().toLowerCase()
    ) {
      return {
        hasConflict: true,
        type: 'room',
        title: 'Schedule conflict',
        message: `${target.room} is already occupied from ${existing.startTime} to ${existing.endTime} by "${existing.subject}".`,
        conflictingItem: existing,
      };
    }

    // 2. Faculty conflict
    if (
      existing.faculty.trim().toLowerCase() === target.faculty.trim().toLowerCase()
    ) {
      return {
        hasConflict: true,
        type: 'faculty',
        title: 'Faculty schedule conflict',
        message: `${existing.faculty} is already scheduled for another class ("${existing.subject}" in ${existing.room}) during this time.`,
        conflictingItem: existing,
      };
    }

    // 3. Student group conflict
    const matchYear = !target.year || !existing.year || target.year === existing.year;
    const matchBatch = target.batch.toLowerCase() === existing.batch.toLowerCase();
    const matchDept = target.department.toLowerCase() === existing.department.toLowerCase();
    const matchSubDept = !target.subDepartment || !existing.subDepartment || target.subDepartment.toLowerCase() === existing.subDepartment.toLowerCase();
    const matchSec = target.section.toLowerCase() === existing.section.toLowerCase();

    if (matchYear && matchBatch && matchDept && matchSubDept && matchSec) {
      return {
        hasConflict: true,
        type: 'group',
        title: 'Timetable conflict',
        message: `This student group (${target.year || '2nd Year'} · ${target.batch} · ${target.subDepartment || 'CSE'} Section ${target.section}) already has a class scheduled ("${existing.subject}") during this time.`,
        conflictingItem: existing,
      };
    }
  }

  return { hasConflict: false };
}

/**
 * Validates exam schedule conflicts:
 * 1. Room conflict (same room, same date, overlapping time)
 * 2. Student group conflict (same student group, same date, overlapping time)
 */
export function validateExamConflicts(
  target: Omit<ExamRecord, 'id'> & { id?: string },
  existingExams: ExamRecord[]
): ConflictCheckResult {
  // Parse target start and end time from target.startTime/endTime or from target.time
  let targetStart = target.startTime || '';
  let targetEnd = target.endTime || '';

  if (!targetStart && target.time) {
    const parts = target.time.split('–').map((p) => p.trim());
    if (parts.length === 2) {
      targetStart = parts[0];
      targetEnd = parts[1];
    }
  }

  for (const existing of existingExams) {
    if (target.id && existing.id === target.id) continue;

    // Check same date
    const sameDate =
      (target.examDate && existing.examDate && target.examDate === existing.examDate) ||
      (target.formattedDate && existing.formattedDate && target.formattedDate === existing.formattedDate);

    if (!sameDate) continue;

    let exStart = existing.startTime || '';
    let exEnd = existing.endTime || '';
    if (!exStart && existing.time) {
      const parts = existing.time.split('–').map((p) => p.trim());
      if (parts.length === 2) {
        exStart = parts[0];
        exEnd = parts[1];
      }
    }

    const overlaps = checkTimesOverlap(targetStart, targetEnd, exStart, exEnd);
    if (!overlaps) continue;

    // 1. Room conflict
    if (existing.room.trim().toLowerCase() === target.room.trim().toLowerCase()) {
      return {
        hasConflict: true,
        type: 'exam_room',
        title: 'Exam room conflict',
        message: `${target.room} is already assigned to another exam ("${existing.subject}") during this time (${existing.time}).`,
        conflictingItem: existing,
      };
    }

    // 2. Student group conflict
    const matchYear = !target.year || !existing.year || target.year === existing.year;
    const matchBatch = target.batch.toLowerCase() === existing.batch.toLowerCase();
    const matchDept = target.department.toLowerCase() === existing.department.toLowerCase();
    const matchSubDept = !target.subDepartment || !existing.subDepartment || target.subDepartment.toLowerCase() === existing.subDepartment.toLowerCase();
    const matchSec = !target.section || !existing.section || target.section.toLowerCase() === existing.section.toLowerCase();
    const matchSem = !target.semester || !existing.semester || target.semester.toLowerCase() === existing.semester.toLowerCase();

    if (matchYear && matchBatch && matchDept && matchSubDept && matchSec && matchSem) {
      return {
        hasConflict: true,
        type: 'exam_group',
        title: 'Exam schedule conflict',
        message: `This student group already has an exam scheduled ("${existing.subject}") during this time.`,
        conflictingItem: existing,
      };
    }
  }

  return { hasConflict: false };
}
