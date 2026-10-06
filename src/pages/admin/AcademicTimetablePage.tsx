import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Filter,
  AlertTriangle,
  Clock,
  MapPin,
  User,
  Layers,
  ArrowRight,
  Sparkles,
  Move,
  X,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { TimetableClass } from '../../types';
import { TimetableCalendar } from '../../components/calendar/TimetableCalendar';
import { Modal } from '../../components/common/Modal';
import { DeleteConfirmModal } from '../../components/common/DeleteConfirmModal';
import { TimePicker, formatTo12Hour } from '../../components/common/TimePicker';
import {
  validateClassConflicts,
  ConflictCheckResult,
} from '../../utils/conflictValidation';

export const AcademicTimetablePage: React.FC = () => {
  const { timetable, addClass, updateClass, deleteClass, setToastMessage } = useData();

  // 1. FILTERING & ORGANIZATION (Section 2 of requirements)
  const [selectedYear, setSelectedYear] = useState('2nd Year');
  const [selectedBatch, setSelectedBatch] = useState('2025–2029');
  const [selectedDept, setSelectedDept] = useState('Computer Science');
  const [selectedSubDept, setSelectedSubDept] = useState('CSE');
  const [selectedSection, setSelectedSection] = useState('A');

  // Modals & form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<TimetableClass | null>(null);
  const [conflictError, setConflictError] = useState<ConflictCheckResult | null>(null);
  const [classToDelete, setClassToDelete] = useState<TimetableClass | null>(null);

  // View Details / Move Slot quick state
  const [selectedClassDetails, setSelectedClassDetails] = useState<TimetableClass | null>(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [moveDay, setMoveDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Monday');
  const [moveStartTime, setMoveStartTime] = useState('09:00');
  const [moveEndTime, setMoveEndTime] = useState('10:00');
  const [moveRoom, setMoveRoom] = useState('');

  // Form input fields (Section 3 of requirements)
  const [subject, setSubject] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [faculty, setFaculty] = useState('');
  const [room, setRoom] = useState('');
  const [date, setDate] = useState('14 October 2026');
  const [day, setDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Wednesday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [formYear, setFormYear] = useState('2nd Year');
  const [formBatch, setFormBatch] = useState('2025–2029');
  const [formDept, setFormDept] = useState('Computer Science');
  const [formSubDept, setFormSubDept] = useState('CSE');
  const [formSection, setFormSection] = useState('A');

  // Filtered classes according to selected Year, Batch, Dept, SubDept, Section
  const filteredClasses = timetable.filter((cls) => {
    const matchYear = selectedYear === 'All' || !cls.year || cls.year === selectedYear;
    const matchBatch = selectedBatch === 'All' || !cls.batch || cls.batch.includes(selectedBatch) || selectedBatch.includes(cls.batch);
    const matchDept = selectedDept === 'All' || cls.department.toLowerCase().includes(selectedDept.toLowerCase());
    const matchSubDept = selectedSubDept === 'All' || !cls.subDepartment || cls.subDepartment.toLowerCase().includes(selectedSubDept.toLowerCase());
    const matchSec = selectedSection === 'All' || cls.section.toUpperCase() === selectedSection.toUpperCase();

    return matchYear && matchBatch && matchDept && matchSubDept && matchSec;
  });

  const handleOpenAdd = () => {
    setEditingClass(null);
    setConflictError(null);
    setSubject('');
    setCourseCode('CSET205');
    setFaculty('Dr. Sharma');
    setRoom('Room A-204');
    setDate('14 October 2026');
    setDay('Wednesday');
    setStartTime('09:00 AM');
    setEndTime('10:00 AM');
    setFormYear(selectedYear !== 'All' ? selectedYear : '2nd Year');
    setFormBatch(selectedBatch !== 'All' ? selectedBatch : '2025–2029');
    setFormDept(selectedDept !== 'All' ? selectedDept : 'Computer Science');
    setFormSubDept(selectedSubDept !== 'All' ? selectedSubDept : 'CSE');
    setFormSection(selectedSection !== 'All' ? selectedSection : 'A');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cls: TimetableClass) => {
    setEditingClass(cls);
    setConflictError(null);
    setSubject(cls.subject);
    setCourseCode(cls.courseCode);
    setFaculty(cls.faculty);
    setRoom(cls.room);
    setDate(cls.date || '14 October 2026');
    setDay(cls.day);
    setStartTime(formatTo12Hour(cls.startTime));
    setEndTime(formatTo12Hour(cls.endTime));
    setFormYear(cls.year || '2nd Year');
    setFormBatch(cls.batch || '2025–2029');
    setFormDept(cls.department || 'Computer Science');
    setFormSubDept(cls.subDepartment || 'CSE');
    setFormSection(cls.section || 'A');
    setIsModalOpen(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    const classData = {
      subject: subject.trim(),
      courseCode: courseCode.trim(),
      faculty: faculty.trim(),
      room: room.trim(),
      date,
      day,
      startTime: formatTo12Hour(startTime.trim()),
      endTime: formatTo12Hour(endTime.trim()),
      year: formYear,
      batch: formBatch,
      department: formDept,
      subDepartment: formSubDept,
      section: formSection,
      color: '#0D5C46',
    };

    // CONFLICT PREVENTION CHECKS (Sections 4, 5, 6)
    const conflict = validateClassConflicts(
      {
        ...classData,
        id: editingClass ? editingClass.id : undefined,
      },
      timetable
    );

    if (conflict.hasConflict) {
      setConflictError(conflict);
      return;
    }

    if (editingClass) {
      updateClass(editingClass.id, classData);
    } else {
      addClass(classData);
    }

    setIsModalOpen(false);
    setConflictError(null);
  };

  // Move Class Handler (Section 2)
  const handleOpenMove = (cls: TimetableClass) => {
    setSelectedClassDetails(cls);
    setMoveDay(cls.day);
    setMoveStartTime(formatTo12Hour(cls.startTime));
    setMoveEndTime(formatTo12Hour(cls.endTime));
    setMoveRoom(cls.room);
    setConflictError(null);
    setIsMoveModalOpen(true);
  };

  const handleConfirmMove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassDetails) return;

    const normalizedStart = formatTo12Hour(moveStartTime.trim());
    const normalizedEnd = formatTo12Hour(moveEndTime.trim());

    const movedData = {
      ...selectedClassDetails,
      day: moveDay,
      startTime: normalizedStart,
      endTime: normalizedEnd,
      room: moveRoom,
    };

    // Check conflict on move
    const conflict = validateClassConflicts(movedData, timetable);
    if (conflict.hasConflict) {
      setConflictError(conflict);
      return;
    }

    updateClass(selectedClassDetails.id, {
      day: moveDay,
      startTime: normalizedStart,
      endTime: normalizedEnd,
      room: moveRoom,
    });

    setIsMoveModalOpen(false);
    setSelectedClassDetails(null);
    setConflictError(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 inline-block mb-1.5">
            Academic Operations Desk
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#0D3B2E] flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-[#0D5C46]" />
            <span>Academic Timetable Management</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Configure lecture slots, faculty assignments, and verify classroom availability with automated conflict prevention.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-[#0D5C46] hover:bg-[#0B4A38] text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Class</span>
        </button>
      </div>

      {/* 2. TIMETABLE FILTERING & ORGANIZATION (Dropdowns as specified in Prompt) */}
      <div className="glass-panel rounded-2xl p-4 md:p-5 border border-[#E2ECE7] bg-white shadow-soft">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 text-xs font-bold text-[#0D3B2E] uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-[#0D5C46]" />
          <span>Timetable Target Group Filter</span>
          <span className="text-[10px] text-slate-400 font-normal lowercase">
            (select group to view and manage specific schedule)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          {/* Year */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2.5 bg-[#FAFBFB] border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0D5C46] cursor-pointer"
            >
              <option value="All">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          {/* Batch */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Batch
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full p-2.5 bg-[#FAFBFB] border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0D5C46] cursor-pointer"
            >
              <option value="All">All Batches</option>
              <option value="2025–2029">2025–2029</option>
              <option value="2024–2028">2024–2028</option>
              <option value="2023–2027">2023–2027</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full p-2.5 bg-[#FAFBFB] border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0D5C46] cursor-pointer"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </div>

          {/* Sub-department */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Sub-department
            </label>
            <select
              value={selectedSubDept}
              onChange={(e) => setSelectedSubDept(e.target.value)}
              className="w-full p-2.5 bg-[#FAFBFB] border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0D5C46] cursor-pointer"
            >
              <option value="All">All Sub-departments</option>
              <option value="CSE">CSE</option>
              <option value="CSE-AI">CSE-AI</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full p-2.5 bg-[#FAFBFB] border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0D5C46] cursor-pointer"
            >
              <option value="All">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
        </div>

        {/* Current Active Filter Indicator */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Displaying Schedule:</span>
            <span className="font-semibold text-[#0D5C46] bg-[#EBF5F0] px-2.5 py-0.5 rounded-md border border-[#CDE5DB]">
              {selectedYear} · {selectedBatch} · {selectedDept} ({selectedSubDept}) - Sec {selectedSection}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            {filteredClasses.length} lecture slots configured
          </span>
        </div>
      </div>

      {/* REAL CALENDAR INTERFACE */}
      <TimetableCalendar
        classes={filteredClasses}
        isAdmin={true}
        onAddClass={handleOpenAdd}
        onEditClass={handleOpenEdit}
        onDeleteClass={(cls) => setClassToDelete(cls)}
      />

      {/* 3 & 4 & 5 & 6. ADD / EDIT CLASS MODAL WITH CONFLICT CHECKING */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setConflictError(null);
          }}
          title={editingClass ? 'Edit Timetable Slot' : 'Add Class'}
          subtitle="Configure weekly schedule, faculty instructor, and room allocation."
          maxWidth="lg"
        >
          <form onSubmit={handleSaveClass} className="space-y-4 text-xs">
            {/* CONFLICT WARNING BANNER (Sections 4, 5, 6) */}
            {conflictError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 animate-in fade-in duration-150">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-rose-950">
                      {conflictError.title || 'Schedule Conflict Detected'}
                    </h4>
                    <p className="mt-1 text-xs text-rose-800 leading-relaxed font-medium">
                      {conflictError.message}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-rose-200/80 text-[11px] text-rose-700">
                      <strong>Option to resolve:</strong> Please adjust the <strong>Room</strong>, <strong>Day / Date</strong>, <strong>Start Time</strong>, or <strong>End Time</strong> to avoid overlapping.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Subject & Course Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    if (conflictError) setConflictError(null);
                  }}
                  placeholder="e.g. Database Systems"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Course Code *
                </label>
                <input
                  type="text"
                  required
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g. CSET205"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>
            </div>

            {/* Faculty & Room */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Faculty Instructor *
                </label>
                <input
                  type="text"
                  required
                  value={faculty}
                  onChange={(e) => {
                    setFaculty(e.target.value);
                    if (conflictError) setConflictError(null);
                  }}
                  placeholder="e.g. Dr. Sharma"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Classroom / Venue (Room) *
                </label>
                <input
                  type="text"
                  required
                  value={room}
                  onChange={(e) => {
                    setRoom(e.target.value);
                    if (conflictError) setConflictError(null);
                  }}
                  placeholder="e.g. Room A-204"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>
            </div>

            {/* Day / Date, Start Time, End Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Day of Week
                </label>
                <select
                  value={day}
                  onChange={(e) => {
                    setDay(e.target.value as any);
                    if (conflictError) setConflictError(null);
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              </div>

              <div className="col-span-1">
                <TimePicker
                  label="Start Time"
                  value={startTime}
                  onChange={(val) => {
                    setStartTime(val);
                    if (conflictError) setConflictError(null);
                  }}
                  required
                />
              </div>

              <div className="col-span-1">
                <TimePicker
                  label="End Time"
                  value={endTime}
                  onChange={(val) => {
                    setEndTime(val);
                    if (conflictError) setConflictError(null);
                  }}
                  required
                />
              </div>
            </div>

            {/* Target Group: Year, Batch, Dept, Sub-Dept, Section */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Target Student Group Specification
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-600 text-[11px] mb-1">Year</label>
                  <select
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-600 text-[11px] mb-1">Batch</label>
                  <input
                    type="text"
                    value={formBatch}
                    onChange={(e) => setFormBatch(e.target.value)}
                    placeholder="2025–2029"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-600 text-[11px] mb-1">Section</label>
                  <input
                    type="text"
                    value={formSection}
                    onChange={(e) => setFormSection(e.target.value)}
                    placeholder="A"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs uppercase"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-600 text-[11px] mb-1">Department</label>
                  <input
                    type="text"
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    placeholder="Computer Science"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-600 text-[11px] mb-1">Sub-Department</label>
                  <input
                    type="text"
                    value={formSubDept}
                    onChange={(e) => setFormSubDept(e.target.value)}
                    placeholder="CSE"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setConflictError(null);
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0D5C46] hover:bg-[#0B4A38] text-white font-semibold rounded-xl cursor-pointer shadow-xs hover:shadow transition-all"
              >
                {editingClass ? 'Save Changes' : 'Schedule Class'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MOVE CLASS MODAL (Quick Rescheduling) */}
      {isMoveModalOpen && selectedClassDetails && (
        <Modal
          isOpen={isMoveModalOpen}
          onClose={() => {
            setIsMoveModalOpen(false);
            setConflictError(null);
          }}
          title="Move Class Slot"
          subtitle={`Reschedule "${selectedClassDetails.subject}" (${selectedClassDetails.courseCode})`}
          maxWidth="md"
        >
          <form onSubmit={handleConfirmMove} className="space-y-4 text-xs">
            {conflictError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900">
                <div className="font-bold">{conflictError.title}</div>
                <div className="text-xs mt-0.5">{conflictError.message}</div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Day
              </label>
              <select
                value={moveDay}
                onChange={(e) => setMoveDay(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TimePicker
                label="Start Time"
                value={moveStartTime}
                onChange={(val) => {
                  setMoveStartTime(val);
                  if (conflictError) setConflictError(null);
                }}
                required
              />
              <TimePicker
                label="End Time"
                value={moveEndTime}
                onChange={(val) => {
                  setMoveEndTime(val);
                  if (conflictError) setConflictError(null);
                }}
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Room
              </label>
              <input
                type="text"
                required
                value={moveRoom}
                onChange={(e) => setMoveRoom(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsMoveModalOpen(false);
                  setConflictError(null);
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0D5C46] hover:bg-[#0B4A38] text-white font-semibold rounded-xl cursor-pointer shadow-xs"
              >
                Confirm Move
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 11 & 12. CONTEXTUAL DELETE CLASS MODAL */}
      {classToDelete && (
        <DeleteConfirmModal
          isOpen={!!classToDelete}
          onClose={() => setClassToDelete(null)}
          onConfirm={() => {
            if (classToDelete) {
              deleteClass(classToDelete.id);
              setClassToDelete(null);
              setToastMessage('Record deleted successfully.');
            }
          }}
          title="Delete Class?"
          recordName={`the ${classToDelete.subject} class scheduled for ${classToDelete.date || classToDelete.day} at ${classToDelete.startTime}`}
          recordType="timetable class"
        />
      )}
    </div>
  );
};
