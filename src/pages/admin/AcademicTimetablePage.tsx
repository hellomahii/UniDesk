import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Filter,
  AlertTriangle,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { TimetableClass } from '../../types';
import { TimetableCalendar } from '../../components/calendar/TimetableCalendar';
import { Modal } from '../../components/common/Modal';
import { DeleteConfirmModal } from '../../components/common/DeleteConfirmModal';
import {
  TimePicker,
  formatTo12Hour,
} from '../../components/common/TimePicker';
import {
  validateClassConflicts,
  ConflictCheckResult,
} from '../../utils/conflictValidation';

export const AcademicTimetablePage: React.FC = () => {
  const {
    timetable,
    addClass,
    updateClass,
    deleteClass,
    setToastMessage,
  } = useData();

  const [selectedYear, setSelectedYear] = useState('2');
  const [selectedBatch, setSelectedBatch] =
    useState('2024-2028');
  const [selectedDept, setSelectedDept] =
    useState('btech');
  const [selectedSubDept, setSelectedSubDept] =
    useState('computer science');
  const [selectedSection, setSelectedSection] =
    useState('A');

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingClass, setEditingClass] =
    useState<TimetableClass | null>(null);

  const [conflictError, setConflictError] =
    useState<ConflictCheckResult | null>(null);

  const [classToDelete, setClassToDelete] =
    useState<TimetableClass | null>(null);

  const [
    selectedClassDetails,
    setSelectedClassDetails,
  ] = useState<TimetableClass | null>(null);

  const [isMoveModalOpen, setIsMoveModalOpen] =
    useState(false);

  const [moveDay, setMoveDay] = useState<
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
  >('Monday');

  const [moveStartTime, setMoveStartTime] =
    useState('09:00 AM');

  const [moveEndTime, setMoveEndTime] =
    useState('10:00 AM');

  const [moveRoom, setMoveRoom] =
    useState('');

  const [subject, setSubject] =
    useState('');

  const [courseCode, setCourseCode] =
    useState('');

  const [faculty, setFaculty] =
    useState('');

  const [room, setRoom] =
    useState('');

  const [date, setDate] =
    useState('14 October 2026');

  const [day, setDay] = useState<
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
  >('Wednesday');

  const [startTime, setStartTime] =
    useState('09:00 AM');

  const [endTime, setEndTime] =
    useState('10:00 AM');

  const [formYear, setFormYear] =
    useState('2');

  const [formBatch, setFormBatch] =
    useState('2024-2028');

  const [formDept, setFormDept] =
    useState('btech');

  const [formSubDept, setFormSubDept] =
    useState('computer science');

  const [formSection, setFormSection] =
    useState('A');

  const normalize = (value: unknown) =>
    String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/[–—]/g, '-');

  const yearLabel = (value: string) => {
    if (value === '1') return '1st Year';
    if (value === '2') return '2nd Year';
    if (value === '3') return '3rd Year';
    if (value === '4') return '4th Year';
    return value;
  };

  const batchLabel = (value: string) =>
    value.replace(/-/g, '–');

  const deptLabel = (value: string) => {
    if (value === 'btech') return 'B.Tech';
    if (value === 'design') return 'Design';
    return value;
  };

  const subDeptLabel = (value: string) => {
    if (value === 'computer science') {
      return 'Computer Science';
    }

    if (value === 'design') {
      return 'Design';
    }

    return value;
  };

  const filteredClasses = timetable.filter(
    (cls) => {
      const matchYear =
        selectedYear === 'All' ||
        normalize(cls.year) ===
          normalize(selectedYear);

      const matchBatch =
        selectedBatch === 'All' ||
        normalize(cls.batch) ===
          normalize(selectedBatch);

      const matchDept =
        selectedDept === 'All' ||
        normalize(cls.department) ===
          normalize(selectedDept);

      const matchSubDept =
        selectedSubDept === 'All' ||
        normalize(cls.subDepartment) ===
          normalize(selectedSubDept);

      const matchSec =
        selectedSection === 'All' ||
        normalize(cls.section) ===
          normalize(selectedSection);

      return (
        matchYear &&
        matchBatch &&
        matchDept &&
        matchSubDept &&
        matchSec
      );
    }
  );

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

    setFormYear(
      selectedYear !== 'All'
        ? selectedYear
        : '2'
    );

    setFormBatch(
      selectedBatch !== 'All'
        ? selectedBatch
        : '2024-2028'
    );

    setFormDept(
      selectedDept !== 'All'
        ? selectedDept
        : 'btech'
    );

    setFormSubDept(
      selectedSubDept !== 'All'
        ? selectedSubDept
        : 'computer science'
    );

    setFormSection(
      selectedSection !== 'All'
        ? selectedSection
        : 'A'
    );

    setIsModalOpen(true);
  };

  const handleOpenEdit = (
    cls: TimetableClass
  ) => {
    setEditingClass(cls);
    setConflictError(null);

    setSubject(cls.subject);
    setCourseCode(cls.courseCode);
    setFaculty(cls.faculty);
    setRoom(cls.room);
    setDate(
      cls.date || '14 October 2026'
    );
    setDay(cls.day);

    setStartTime(
      formatTo12Hour(cls.startTime)
    );

    setEndTime(
      formatTo12Hour(cls.endTime)
    );

    setFormYear(
      cls.year || '2'
    );

    setFormBatch(
      cls.batch || '2024-2028'
    );

    setFormDept(
      cls.department || 'btech'
    );

    setFormSubDept(
      cls.subDepartment ||
        'computer science'
    );

    setFormSection(
      cls.section || 'A'
    );

    setIsModalOpen(true);
  };

  const handleSaveClass = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!subject.trim()) {
      return;
    }

    const classData: Omit<
      TimetableClass,
      'id'
    > = {
      subject: subject.trim(),

      courseCode:
        courseCode.trim(),

      faculty:
        faculty.trim(),

      room:
        room.trim(),

      date,

      day,

      startTime:
        formatTo12Hour(
          startTime.trim()
        ),

      endTime:
        formatTo12Hour(
          endTime.trim()
        ),

      year:
        formYear,

      batch:
        formBatch,

      department:
        formDept,

      subDepartment:
        formSubDept,

      section:
        formSection,

      color:
        '#0D5C46',
    };

    const conflict =
      validateClassConflicts(
        {
          ...classData,
          id: editingClass
            ? editingClass.id
            : undefined,
        },
        timetable
      );

    if (conflict.hasConflict) {
      setConflictError(conflict);
      return;
    }

    if (editingClass) {
      updateClass(
        editingClass.id,
        classData
      );
    } else {
      addClass(classData);
    }

    setIsModalOpen(false);
    setConflictError(null);
  };

  const handleOpenMove = (
    cls: TimetableClass
  ) => {
    setSelectedClassDetails(cls);

    setMoveDay(cls.day);

    setMoveStartTime(
      formatTo12Hour(
        cls.startTime
      )
    );

    setMoveEndTime(
      formatTo12Hour(
        cls.endTime
      )
    );

    setMoveRoom(cls.room);

    setConflictError(null);
    setIsMoveModalOpen(true);
  };

  const handleConfirmMove = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!selectedClassDetails) {
      return;
    }

    const normalizedStart =
      formatTo12Hour(
        moveStartTime.trim()
      );

    const normalizedEnd =
      formatTo12Hour(
        moveEndTime.trim()
      );

    const movedData = {
      ...selectedClassDetails,

      day:
        moveDay,

      startTime:
        normalizedStart,

      endTime:
        normalizedEnd,

      room:
        moveRoom.trim(),
    };

    const conflict =
      validateClassConflicts(
        movedData,
        timetable
      );

    if (conflict.hasConflict) {
      setConflictError(conflict);
      return;
    }

    updateClass(
      selectedClassDetails.id,
      {
        day: moveDay,

        startTime:
          normalizedStart,

        endTime:
          normalizedEnd,

        room:
          moveRoom.trim(),
      }
    );

    setIsMoveModalOpen(false);
    setSelectedClassDetails(null);
    setConflictError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 inline-block mb-1.5">
            Academic Operations Desk
          </span>

          <h1 className="text-2xl font-bold tracking-tight text-[#0D3B2E] flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-[#0D5C46]" />

            <span>
              Academic Timetable Management
            </span>
          </h1>

          <p className="mt-1 text-xs text-slate-500 font-medium">
            Configure lecture slots, faculty
            assignments, and verify classroom
            availability with automated conflict
            prevention.
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

      <div className="glass-panel rounded-2xl p-4 md:p-5 border border-[#E2ECE7] bg-white shadow-soft">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 text-xs font-bold text-[#0D3B2E] uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-[#0D5C46]" />

          <span>
            Timetable Target Group Filter
          </span>

          <span className="text-[10px] text-slate-400 font-normal lowercase">
            (select group to view and manage
            specific schedule)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Year
            </label>

            <select
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(
                  e.target.value
                )
              }
              className="w-full p-2.5 bg-[#FAFBFB] border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0D5C46] cursor-pointer"
            >
              <option value="All">
                All Years
              </option>

              <option value="1">
                1st Year
              </option>

              <option value="2">
                2nd Year
              </option>

              <option value="3">
                3rd Year
              </option>

              <option value="4">
                4th Year
              </option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Batch
            </label>

            <select
              value={selectedBatch}
              onChange={(e) =>
                setSelectedBatch(
                  e.target.value
                )
              }
              className="w-full p-2.5 bg-[#FAFBFB] border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0D5C46] cursor-pointer"
            >
              <option value="All">
                All Batches
              </option>

              <option value="2025-2029">
                2025–2029
              </option>

              <option value="2024-2028">
                2024–2028
              </option>

              <option value="2023-2027">
                2023–2027
              </option>

              <option value="2022-2026">
                2022–2026
              </option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Department
            </label>

            <select
              value={selectedDept}
              onChange={(e) =>
                setSelectedDept(
                  e.target.value
                )
              }
              className="w-full p-2.5 bg-[#FAFBFB] border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0D5C46] cursor-pointer"
            >
              <option value="All">
                All Departments
              </option>

              <option value="btech">
                B.Tech
              </option>

              <option value="design">
                Design
              </option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Sub-department
            </label>

            <select
              value={selectedSubDept}
              onChange={(e) =>
                setSelectedSubDept(
                  e.target.value
                )
              }
              className="w-full p-2.5 bg-[#FAFBFB] border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0D5C46] cursor-pointer"
            >
              <option value="All">
                All Sub-departments
              </option>

              <option value="computer science">
                Computer Science
              </option>

              <option value="design">
                Design
              </option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Section
            </label>

            <select
              value={selectedSection}
              onChange={(e) =>
                setSelectedSection(
                  e.target.value
                )
              }
              className="w-full p-2.5 bg-[#FAFBFB] border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0D5C46] cursor-pointer"
            >
              <option value="All">
                All Sections
              </option>

              <option value="A">
                Section A
              </option>

              <option value="B">
                Section B
              </option>

              <option value="C">
                Section C
              </option>
            </select>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">
              Displaying Schedule:
            </span>

            <span className="font-semibold text-[#0D5C46] bg-[#EBF5F0] px-2.5 py-0.5 rounded-md border border-[#CDE5DB]">
              {selectedYear === 'All'
                ? 'All Years'
                : yearLabel(
                    selectedYear
                  )}{' '}
              ·{' '}
              {selectedBatch === 'All'
                ? 'All Batches'
                : batchLabel(
                    selectedBatch
                  )}{' '}
              ·{' '}
              {selectedDept === 'All'
                ? 'All Departments'
                : deptLabel(
                    selectedDept
                  )}{' '}
              (
              {selectedSubDept ===
              'All'
                ? 'All Sub-departments'
                : subDeptLabel(
                    selectedSubDept
                  )}
              ){' '}
              - Sec {selectedSection}
            </span>
          </div>

          <span className="text-[11px] font-mono text-slate-500">
            {filteredClasses.length} lecture
            slots configured
          </span>
        </div>
      </div>

      <TimetableCalendar
        {...({
          classes:
            filteredClasses,

          isAdmin: true,

          onAddClass:
            handleOpenAdd,

          onEditClass:
            handleOpenEdit,

          onDeleteClass: (
            cls: TimetableClass
          ) =>
            setClassToDelete(cls),

          onMoveClass:
            handleOpenMove,
        } as any)}
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setConflictError(null);
          }}
          title={
            editingClass
              ? 'Edit Timetable Slot'
              : 'Add Class'
          }
          subtitle="Configure weekly schedule, faculty instructor, and room allocation."
          maxWidth="lg"
        >
          <form
            onSubmit={handleSaveClass}
            className="space-y-4 text-xs"
          >
            {conflictError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />

                  <div>
                    <h4 className="font-bold text-sm text-rose-950">
                      {conflictError.title ||
                        'Schedule Conflict Detected'}
                    </h4>

                    <p className="mt-1 text-xs text-rose-800 leading-relaxed font-medium">
                      {conflictError.message}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-rose-200/80 text-[11px] text-rose-700">
                      <strong>
                        Option to resolve:
                      </strong>{' '}
                      Please adjust the{' '}
                      <strong>
                        Room
                      </strong>
                      ,{' '}
                      <strong>
                        Day / Date
                      </strong>
                      ,{' '}
                      <strong>
                        Start Time
                      </strong>
                      , or{' '}
                      <strong>
                        End Time
                      </strong>
                      .
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                    setSubject(
                      e.target.value
                    );

                    if (conflictError) {
                      setConflictError(
                        null
                      );
                    }
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
                  onChange={(e) =>
                    setCourseCode(
                      e.target.value
                    )
                  }
                  placeholder="e.g. CSET205"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>
            </div>

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
                    setFaculty(
                      e.target.value
                    );

                    if (conflictError) {
                      setConflictError(
                        null
                      );
                    }
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
                    setRoom(
                      e.target.value
                    );

                    if (conflictError) {
                      setConflictError(
                        null
                      );
                    }
                  }}
                  placeholder="e.g. Room A-204"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Day of Week
                </label>

                <select
                  value={day}
                  onChange={(e) => {
                    setDay(
                      e.target.value as
                        | 'Monday'
                        | 'Tuesday'
                        | 'Wednesday'
                        | 'Thursday'
                        | 'Friday'
                        | 'Saturday'
                    );

                    if (conflictError) {
                      setConflictError(
                        null
                      );
                    }
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                >
                  <option value="Monday">
                    Monday
                  </option>
                  <option value="Tuesday">
                    Tuesday
                  </option>
                  <option value="Wednesday">
                    Wednesday
                  </option>
                  <option value="Thursday">
                    Thursday
                  </option>
                  <option value="Friday">
                    Friday
                  </option>
                  <option value="Saturday">
                    Saturday
                  </option>
                </select>
              </div>

              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={(val) => {
                  setStartTime(val);

                  if (conflictError) {
                    setConflictError(
                      null
                    );
                  }
                }}
                required
              />

              <TimePicker
                label="End Time"
                value={endTime}
                onChange={(val) => {
                  setEndTime(val);

                  if (conflictError) {
                    setConflictError(
                      null
                    );
                  }
                }}
                required
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Target Student Group
                Specification
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-600 text-[11px] mb-1">
                    Year
                  </label>

                  <select
                    value={formYear}
                    onChange={(e) =>
                      setFormYear(
                        e.target.value
                      )
                    }
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                  >
                    <option value="1">
                      1st Year
                    </option>

                    <option value="2">
                      2nd Year
                    </option>

                    <option value="3">
                      3rd Year
                    </option>

                    <option value="4">
                      4th Year
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-600 text-[11px] mb-1">
                    Batch
                  </label>

                  <input
                    type="text"
                    value={formBatch}
                    onChange={(e) =>
                      setFormBatch(
                        e.target.value
                      )
                    }
                    placeholder="2024-2028"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-600 text-[11px] mb-1">
                    Section
                  </label>

                  <input
                    type="text"
                    value={formSection}
                    onChange={(e) =>
                      setFormSection(
                        e.target.value
                      )
                    }
                    placeholder="A"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs uppercase"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-600 text-[11px] mb-1">
                    Department
                  </label>

                  <input
                    type="text"
                    value={formDept}
                    onChange={(e) =>
                      setFormDept(
                        e.target.value
                      )
                    }
                    placeholder="btech"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-600 text-[11px] mb-1">
                    Sub-Department
                  </label>

                  <input
                    type="text"
                    value={formSubDept}
                    onChange={(e) =>
                      setFormSubDept(
                        e.target.value
                      )
                    }
                    placeholder="computer science"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                  />
                </div>
              </div>
            </div>

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
                {editingClass
                  ? 'Save Changes'
                  : 'Schedule Class'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {isMoveModalOpen &&
        selectedClassDetails && (
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
            <form
              onSubmit={handleConfirmMove}
              className="space-y-4 text-xs"
            >
              {conflictError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900">
                  <div className="font-bold">
                    {conflictError.title}
                  </div>

                  <div className="text-xs mt-0.5">
                    {
                      conflictError.message
                    }
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Day
                </label>

                <select
                  value={moveDay}
                  onChange={(e) =>
                    setMoveDay(
                      e.target.value as
                        | 'Monday'
                        | 'Tuesday'
                        | 'Wednesday'
                        | 'Thursday'
                        | 'Friday'
                        | 'Saturday'
                    )
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                >
                  <option value="Monday">
                    Monday
                  </option>

                  <option value="Tuesday">
                    Tuesday
                  </option>

                  <option value="Wednesday">
                    Wednesday
                  </option>

                  <option value="Thursday">
                    Thursday
                  </option>

                  <option value="Friday">
                    Friday
                  </option>

                  <option value="Saturday">
                    Saturday
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <TimePicker
                  label="Start Time"
                  value={moveStartTime}
                  onChange={(val) => {
                    setMoveStartTime(val);

                    if (conflictError) {
                      setConflictError(
                        null
                      );
                    }
                  }}
                  required
                />

                <TimePicker
                  label="End Time"
                  value={moveEndTime}
                  onChange={(val) => {
                    setMoveEndTime(val);

                    if (conflictError) {
                      setConflictError(
                        null
                      );
                    }
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
                  onChange={(e) =>
                    setMoveRoom(
                      e.target.value
                    )
                  }
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

      {classToDelete && (
        <DeleteConfirmModal
          isOpen={!!classToDelete}
          onClose={() =>
            setClassToDelete(null)
          }
          onConfirm={() => {
            if (classToDelete) {
              deleteClass(
                classToDelete.id
              );

              setClassToDelete(null);

              setToastMessage(
                'Record deleted successfully.'
              );
            }
          }}
          title="Delete Class?"
          recordName={`the ${classToDelete.subject} class scheduled for ${
            classToDelete.date ||
            classToDelete.day
          } at ${classToDelete.startTime}`}
          recordType="timetable class"
        />
      )}
    </div>
  );
};