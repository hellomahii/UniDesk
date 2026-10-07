import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  Clock,
  MapPin,
  Edit2,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ExamRecord } from '../../types';
import { Modal } from '../../components/common/Modal';
import { DeleteConfirmModal } from '../../components/common/DeleteConfirmModal';
import {
  validateExamConflicts,
  ConflictCheckResult,
} from '../../utils/conflictValidation';

export const AcademicExamsPage: React.FC = () => {
  const {
    exams,
    addExam,
    updateExam,
    deleteExam,
    setToastMessage,
  } = useData();

  const [search, setSearch] = useState('');

  const [selectedYear, setSelectedYear] = useState('2nd Year');
  const [selectedBatch, setSelectedBatch] = useState('2025–2029');
  const [selectedDept, setSelectedDept] = useState('Computer Science');
  const [selectedSubDept, setSelectedSubDept] = useState('CSE');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedSemester, setSelectedSemester] = useState('3rd Semester');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<ExamRecord | null>(null);
  const [conflictError, setConflictError] =
    useState<ConflictCheckResult | null>(null);
  const [examToDelete, setExamToDelete] =
    useState<ExamRecord | null>(null);

  const [subject, setSubject] = useState('');
  const [courseCode, setCourseCode] = useState('CSET205');
  const [examDate, setExamDate] = useState('2026-10-14');
  const [formattedDate, setFormattedDate] =
    useState('14 October 2026');
  const [day, setDay] = useState('Wednesday');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('12:00 PM');
  const [room, setRoom] = useState('Room A-204');
  const [formYear, setFormYear] = useState('2nd Year');
  const [formBatch, setFormBatch] = useState('2025–2029');
  const [formDept, setFormDept] =
    useState('Computer Science');
  const [formSubDept, setFormSubDept] = useState('CSE');
  const [formSection, setFormSection] = useState('A');
  const [formSemester, setFormSemester] =
    useState('3rd Semester');
  const [invigilator, setInvigilator] =
    useState('Dr. Sharma');

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.subject.toLowerCase().includes(search.toLowerCase()) ||
      exam.courseCode.toLowerCase().includes(search.toLowerCase()) ||
      exam.room.toLowerCase().includes(search.toLowerCase());

    const matchYear =
      selectedYear === 'All' ||
      !exam.year ||
      exam.year === selectedYear;

    const matchBatch =
      selectedBatch === 'All' ||
      !exam.batch ||
      exam.batch.includes(selectedBatch) ||
      selectedBatch.includes(exam.batch);

    const matchDept =
      selectedDept === 'All' ||
      exam.department
        .toLowerCase()
        .includes(selectedDept.toLowerCase());

    const matchSubDept =
      selectedSubDept === 'All' ||
      !exam.subDepartment ||
      exam.subDepartment
        .toLowerCase()
        .includes(selectedSubDept.toLowerCase());

    const matchSec =
      selectedSection === 'All' ||
      !exam.section ||
      exam.section.toUpperCase() ===
        selectedSection.toUpperCase();

    const matchSem =
      selectedSemester === 'All' ||
      exam.semester
        .toLowerCase()
        .includes(selectedSemester.toLowerCase()) ||
      selectedSemester
        .toLowerCase()
        .includes(exam.semester.toLowerCase());

    return (
      matchesSearch &&
      matchYear &&
      matchBatch &&
      matchDept &&
      matchSubDept &&
      matchSec &&
      matchSem
    );
  });

  const handleOpenAdd = () => {
    setEditingExam(null);
    setConflictError(null);
    setSubject('');
    setCourseCode('CSET205');
    setExamDate('2026-10-14');
    setFormattedDate('14 October 2026');
    setDay('Wednesday');
    setStartTime('10:00 AM');
    setEndTime('12:00 PM');
    setRoom('Room A-204');

    setFormYear(
      selectedYear !== 'All' ? selectedYear : '2nd Year'
    );
    setFormBatch(
      selectedBatch !== 'All'
        ? selectedBatch
        : '2025–2029'
    );
    setFormDept(
      selectedDept !== 'All'
        ? selectedDept
        : 'Computer Science'
    );
    setFormSubDept(
      selectedSubDept !== 'All'
        ? selectedSubDept
        : 'CSE'
    );
    setFormSection(
      selectedSection !== 'All'
        ? selectedSection
        : 'A'
    );
    setFormSemester(
      selectedSemester !== 'All'
        ? selectedSemester
        : '3rd Semester'
    );
    setInvigilator('Dr. Sharma');

    setIsModalOpen(true);
  };

  const handleOpenEdit = (exam: ExamRecord) => {
    setEditingExam(exam);
    setConflictError(null);
    setSubject(exam.subject);
    setCourseCode(exam.courseCode);
    setExamDate(exam.examDate);
    setFormattedDate(exam.formattedDate);
    setDay(exam.day);
    setStartTime(exam.startTime || '10:00 AM');
    setEndTime(exam.endTime || '12:00 PM');
    setRoom(exam.room);
    setFormYear(exam.year || '2nd Year');
    setFormBatch(exam.batch || '2025–2029');
    setFormDept(
      exam.department || 'Computer Science'
    );
    setFormSubDept(exam.subDepartment || 'CSE');
    setFormSection(exam.section || 'A');
    setFormSemester(
      exam.semester || '3rd Semester'
    );
    setInvigilator(exam.invigilator || '');
    setIsModalOpen(true);
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim()) return;

    const examData = {
      subject: subject.trim(),
      courseCode: courseCode.trim(),
      examDate,
      formattedDate,
      day,
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      time: `${startTime.trim()} – ${endTime.trim()}`,
      room: room.trim(),
      year: formYear,
      batch: formBatch,
      department: formDept,
      subDepartment: formSubDept,
      section: formSection,
      semester: formSemester,
      invigilator: invigilator.trim() || undefined,
      status: 'Scheduled' as const,
    };

    const conflict = validateExamConflicts(
      {
        ...examData,
        id: editingExam
          ? editingExam.id
          : undefined,
      },
      exams
    );

    if (conflict.hasConflict) {
      setConflictError(conflict);
      return;
    }

    if (editingExam) {
      updateExam(editingExam.id, examData);
    } else {
      addExam(examData);
    }

    setIsModalOpen(false);
    setConflictError(null);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 inline-block mb-1.5">
            Office of Controller of Examinations
          </span>

          <h1 className="text-2xl font-bold tracking-tight text-[#0D3B2E] flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-[#0D5C46]" />
            <span>Academic Exam Schedule Management</span>
          </h1>

          <p className="mt-1 text-xs text-slate-500 font-medium">
            Publish assessment timetables, exam halls, and prevent room & student group clashes.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-[#0D5C46] hover:bg-[#0B4A38] text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Exam</span>
        </button>
      </div>

      {/* Filters */}
      <div className="glass-panel rounded-2xl p-4 md:p-5 border border-[#E2ECE7] bg-white shadow-soft">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 text-xs font-bold text-[#0D3B2E] uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-[#0D5C46]" />
          <span>Cohort & Examination Filters</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">

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
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Sub-dept
            </label>
            <select
              value={selectedSubDept}
              onChange={(e) => setSelectedSubDept(e.target.value)}
              className="w-full p-2.5 bg-[#FAFBFB] border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0D5C46] cursor-pointer"
            >
              <option value="All">All Sub-depts</option>
              <option value="CSE">CSE</option>
              <option value="CSE-AI">CSE-AI</option>
              <option value="IT">IT</option>
            </select>
          </div>

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

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full p-2.5 bg-[#FAFBFB] border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0D5C46] cursor-pointer"
            >
              <option value="All">All Semesters</option>
              <option value="1st Semester">1st Semester</option>
              <option value="2nd Semester">2nd Semester</option>
              <option value="3rd Semester">3rd Semester</option>
              <option value="4th Semester">4th Semester</option>
              <option value="5th Semester">5th Semester</option>
            </select>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search exam subject, code, or hall..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Target Group:</span>
            <span className="font-semibold text-[#0D5C46] bg-[#EBF5F0] px-2.5 py-1 rounded-md border border-[#CDE5DB]">
              {selectedYear} · {selectedBatch} · {selectedSubDept} Sec {selectedSection} · {selectedSemester}
            </span>
          </div>
        </div>
      </div>

      {/* Exam Table */}
      <div className="glass-panel rounded-2xl border border-[#E2ECE7] bg-white overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Subject & Code</th>
                <th className="px-5 py-3.5">Date & Day</th>
                <th className="px-5 py-3.5">Time Window</th>
                <th className="px-5 py-3.5">Assigned Hall</th>
                <th className="px-5 py-3.5">Target Cohort</th>
                <th className="px-5 py-3.5">Invigilator</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredExams.map((exam) => (
                <tr
                  key={exam.id}
                  className="hover:bg-[#F9FAF9] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">
                      {exam.subject}
                    </div>
                    <div className="font-mono text-slate-400 text-[11px] mt-0.5">
                      {exam.courseCode}
                    </div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-800">
                      {exam.formattedDate}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      {exam.day}
                    </div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-mono text-slate-700 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{exam.time}</span>
                    </div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{exam.room}</span>
                    </div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[11px] text-slate-600">
                    <div>
                      {exam.year || '2nd Year'} · {exam.semester}
                    </div>
                    <div className="text-slate-400 font-mono">
                      {exam.batch} · Sec {exam.section || 'A'}
                    </div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-slate-700 font-medium">
                    {exam.invigilator || 'Faculty Board Assigned'}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">

                      <button
                        onClick={() => handleOpenEdit(exam)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Exam"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setExamToDelete(exam)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Exam"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}

              {filteredExams.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No examination records found matching this cohort filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Exam Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setConflictError(null);
          }}
          title={
            editingExam
              ? 'Edit Exam Assessment'
              : 'Schedule New Exam'
          }
          subtitle="Configure exam schedule, time duration, and examinee room."
          maxWidth="lg"
        >
          <form
            onSubmit={handleSaveExam}
            className="space-y-4 text-xs"
          >

            {conflictError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />

                  <div>
                    <h4 className="font-bold text-sm text-rose-950">
                      {conflictError.title ||
                        'Exam Conflict Detected'}
                    </h4>

                    <p className="mt-1 text-xs text-rose-800 leading-relaxed font-medium">
                      {conflictError.message}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-rose-200/80 text-[11px] text-rose-700">
                      <strong>Option to resolve:</strong>{' '}
                      Please assign a different{' '}
                      <strong>Room</strong>,{' '}
                      <strong>Exam Date</strong>, or{' '}
                      <strong>Time Slot</strong>.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Subject & Code */}
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
                    if (conflictError) {
                      setConflictError(null);
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
                    setCourseCode(e.target.value)
                  }
                  placeholder="e.g. CSET205"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>
            </div>

            {/* Date & Day */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Exam Date *
                </label>

                <input
                  type="text"
                  required
                  value={formattedDate}
                  onChange={(e) => {
                    setFormattedDate(e.target.value);
                    if (conflictError) {
                      setConflictError(null);
                    }
                  }}
                  placeholder="e.g. 14 October 2026"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Day of Week
                </label>

                <select
                  value={day}
                  onChange={(e) =>
                    setDay(e.target.value)
                  }
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
            </div>

            {/* Time & Room */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Start Time *
                </label>

                <input
                  type="text"
                  required
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    if (conflictError) {
                      setConflictError(null);
                    }
                  }}
                  placeholder="10:00 AM"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  End Time *
                </label>

                <input
                  type="text"
                  required
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    if (conflictError) {
                      setConflictError(null);
                    }
                  }}
                  placeholder="12:00 PM"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Exam Hall (Room) *
                </label>

                <input
                  type="text"
                  required
                  value={room}
                  onChange={(e) => {
                    setRoom(e.target.value);
                    if (conflictError) {
                      setConflictError(null);
                    }
                  }}
                  placeholder="e.g. Room A-204"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

            </div>

            {/* Target Cohort */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">

              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Examinee Target Cohort
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

                <div>
                  <label className="block font-medium text-slate-600 text-[11px] mb-1">
                    Year
                  </label>

                  <select
                    value={formYear}
                    onChange={(e) =>
                      setFormYear(e.target.value)
                    }
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
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
                      setFormBatch(e.target.value)
                    }
                    placeholder="2025–2029"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-600 text-[11px] mb-1">
                    Semester
                  </label>

                  <input
                    type="text"
                    value={formSemester}
                    onChange={(e) =>
                      setFormSemester(e.target.value)
                    }
                    placeholder="3rd Semester"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-600 text-[11px] mb-1">
                    Department
                  </label>

                  <input
                    type="text"
                    value={formDept}
                    onChange={(e) =>
                      setFormDept(e.target.value)
                    }
                    placeholder="Computer Science"
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
                      setFormSubDept(e.target.value)
                    }
                    placeholder="CSE"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs uppercase"
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
                      setFormSection(e.target.value)
                    }
                    placeholder="A"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs uppercase"
                  />
                </div>

              </div>
            </div>

            {/* Invigilator */}
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Faculty Invigilator (Optional)
              </label>

              <input
                type="text"
                value={invigilator}
                onChange={(e) =>
                  setInvigilator(e.target.value)
                }
                placeholder="e.g. Dr. Sharma"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
              />
            </div>

            {/* Actions */}
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
                {editingExam
                  ? 'Save Changes'
                  : 'Schedule Exam'}
              </button>

            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {examToDelete && (
        <DeleteConfirmModal
          isOpen={!!examToDelete}
          onClose={() => setExamToDelete(null)}
          onConfirm={() => {
            if (examToDelete) {
              deleteExam(examToDelete.id);
              setExamToDelete(null);
              setToastMessage(
                'Record deleted successfully.'
              );
            }
          }}
          title="Delete Exam?"
          recordName={`the exam "${examToDelete.subject} (${examToDelete.courseCode})" scheduled on ${examToDelete.formattedDate}`}
          recordType="examination schedule entry"
        />
      )}
    </div>
  );
};