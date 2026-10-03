import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  FileDown,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const ExamSchedulePage: React.FC = () => {
  const { exams } = useData();
  const [search, setSearch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [selectedBatch, setSelectedBatch] = useState('All');

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.subject.toLowerCase().includes(search.toLowerCase()) ||
      exam.courseCode.toLowerCase().includes(search.toLowerCase()) ||
      exam.room.toLowerCase().includes(search.toLowerCase());

    const matchesSem = selectedSemester === 'All' || exam.semester === selectedSemester;
    const matchesBatch = selectedBatch === 'All' || exam.batch === selectedBatch;

    return matchesSearch && matchesSem && matchesBatch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0D3B2E] flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-[#0D5C46]" />
            <span>Examination Schedule</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Mid-Semester Assessments · Autumn 2026 Academic Term
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="self-start md:self-auto flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <FileDown className="w-4 h-4 text-slate-500" />
          <span>Download Timetable (PDF)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-xl p-4 border border-[#E2ECE7] bg-white flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by subject, course code, room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
          >
            <option value="All">All Semesters</option>
            <option value="3rd Semester">3rd Semester</option>
            <option value="Semester 5">5th Semester</option>
          </select>

          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
          >
            <option value="All">All Batches</option>
            <option value="2025–2029">Batch 2025–2029</option>
            <option value="2023-2027">Batch 2023–2027</option>
          </select>
        </div>
      </div>

      {/* Exam Table */}
      <div className="glass-panel rounded-2xl border border-[#E2ECE7] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Exam Date & Day</th>
                <th className="px-5 py-3.5">Subject & Code</th>
                <th className="px-5 py-3.5">Time Slot</th>
                <th className="px-5 py-3.5">Venue</th>
                <th className="px-5 py-3.5">Semester & Batch</th>
                <th className="px-5 py-3.5">Invigilator</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExams.map((exam) => (
                <tr
                  key={exam.id}
                  className="hover:bg-[#F9FAF9] transition-colors"
                >
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900 font-mono">
                      {exam.formattedDate}
                    </div>
                    <div className="text-[11px] text-slate-400">{exam.day}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-[#0D3B2E]">{exam.subject}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{exam.courseCode}</div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap font-mono tabular-nums text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{exam.time}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {exam.room}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                    <div>{exam.semester}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{exam.batch}</div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                    {exam.invigilator || 'Faculty Assigned'}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{exam.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
              {filteredExams.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No examination records match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
