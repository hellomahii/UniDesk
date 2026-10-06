import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Shield,
  Phone,
  Mail,
  Home,
  GraduationCap,
  ChevronRight,
  Lock,
  Edit2,
  Eye,
  CheckCircle2,
  Save,
  X,
  CreditCard,
  DollarSign,
  TrendingUp,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StudentInfoRecord, StudentFeeRecord } from '../../types';
import { Drawer } from '../../components/common/Drawer';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DeleteConfirmModal } from '../../components/common/DeleteConfirmModal';

export const AdminStudentsPage: React.FC = () => {
  const { activeRole } = useAuth();
  const { students, fees, updateStudent, deleteStudent, updateFeeStatus, setToastMessage } = useData();

  const isFinanceAdmin = activeRole === 'finance_admin';

  // Search & Filters (Requirements 7 & 8)
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [batchFilter, setBatchFilter] = useState('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');

  const [selectedStudent, setSelectedStudent] = useState<StudentInfoRecord | null>(null);

  // Edit student modal states
  const [editingStudent, setEditingStudent] = useState<StudentInfoRecord | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editParentName, setEditParentName] = useState('');
  const [editParentContact, setEditParentContact] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editSubDepartment, setEditSubDepartment] = useState('');
  const [editSpecialization, setEditSpecialization] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editSemester, setEditSemester] = useState('');
  const [editBatch, setEditBatch] = useState('');
  const [editAccommodation, setEditAccommodation] = useState('');

  // Fee settlement modal state
  const [settlingFeeStudent, setSettlingFeeStudent] = useState<StudentInfoRecord | null>(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState('');

  // Delete modal state
  const [studentToDelete, setStudentToDelete] = useState<StudentInfoRecord | null>(null);

  // Helper to get student fee
  const getStudentFee = (student: StudentInfoRecord): StudentFeeRecord => {
    const existing = fees.find((f) => f.studentId === student.id || f.enrollmentNo === student.enrollmentNo);
    if (existing) return existing;
    return {
      id: `fee-${student.id}`,
      studentId: student.id,
      studentName: student.name,
      enrollmentNo: student.enrollmentNo,
      department: student.department,
      semester: student.semester,
      batch: student.batch,
      totalFee: 120000,
      paid: 90000,
      pending: 30000,
      paymentStatus: 'Partially Paid',
      dueDate: '15 October 2026',
      lastPaymentDate: '30 September 2026',
      transactionRef: 'TXN-99120-UNI',
    };
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.enrollmentNo.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());

    const matchesDept = deptFilter === 'All' || s.department.toLowerCase().includes(deptFilter.toLowerCase());
    const matchesYear = yearFilter === 'All' || s.year.toLowerCase().includes(yearFilter.toLowerCase());
    const matchesSem = semesterFilter === 'All' || s.semester.toLowerCase().includes(semesterFilter.toLowerCase());
    const matchesBatch = batchFilter === 'All' || s.batch === batchFilter;

    const studentFee = getStudentFee(s);
    const matchesPaymentStatus = paymentStatusFilter === 'All' || studentFee.paymentStatus === paymentStatusFilter;

    return matchesSearch && matchesDept && matchesYear && matchesSem && matchesBatch && matchesPaymentStatus;
  });

  const handleOpenEdit = (student: StudentInfoRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingStudent(student);
    setEditName(student.name);
    setEditEmail(student.email);
    setEditPhone(student.phone);
    setEditParentName(student.parentName);
    setEditParentContact(student.parentContact);
    setEditDepartment(student.department);
    setEditSubDepartment(student.subDepartment);
    setEditSpecialization(student.specialization);
    setEditYear(student.year);
    setEditSemester(student.semester);
    setEditBatch(student.batch);
    setEditAccommodation(student.accommodation);
  };

  const handleSaveStudentChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const updatedData: Partial<StudentInfoRecord> = {
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      parentName: editParentName.trim(),
      parentContact: editParentContact.trim(),
      department: editDepartment.trim(),
      subDepartment: editSubDepartment.trim(),
      specialization: editSpecialization.trim(),
      year: editYear.trim(),
      semester: editSemester.trim(),
      batch: editBatch.trim(),
      accommodation: editAccommodation.trim(),
    };

    updateStudent(editingStudent.id, updatedData);

    if (selectedStudent && selectedStudent.id === editingStudent.id) {
      setSelectedStudent({
        ...selectedStudent,
        ...updatedData,
      });
    }

    setEditingStudent(null);
    setToastMessage('Student information updated successfully.');
  };

  const handleOpenFeeSettlement = (student: StudentInfoRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSettlingFeeStudent(student);
    setPaymentAmountInput('');
  };

  const handlePostPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settlingFeeStudent) return;
    const fee = getStudentFee(settlingFeeStudent);
    const amount = Number(paymentAmountInput);
    if (isNaN(amount) || amount <= 0) return;

    const newPaid = fee.paid + amount;
    const newStatus = newPaid >= fee.totalFee ? 'Paid' : newPaid > 0 ? 'Partially Paid' : 'Pending';

    updateFeeStatus(fee.id, newPaid, newStatus);
    setSettlingFeeStudent(null);
    setPaymentAmountInput('');
    setToastMessage('Fee payment recorded successfully.');
  };

  const handleDeleteConfirm = () => {
    if (!studentToDelete) return;
    deleteStudent(studentToDelete.id);
    if (selectedStudent?.id === studentToDelete.id) {
      setSelectedStudent(null);
    }
    setStudentToDelete(null);
    setToastMessage('Record deleted successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0D3B2E] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#0D5C46]" />
            <span>{isFinanceAdmin ? 'Students Info' : 'Student Registry'}</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {isFinanceAdmin
              ? 'Consolidated student registry and bursar fee accounts. Track academic details alongside tuition status.'
              : 'Institutional student registry, enrollment profiles, and departmental allocations.'}
          </p>
        </div>
      </div>

      {/* Finance Summary Cards (when Finance Admin) */}
      {isFinanceAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Total Fee Inflow
            </span>
            <div className="mt-1.5 text-2xl font-bold font-mono text-[#0D3B2E] tabular-nums">
              ₹{fees.reduce((acc, f) => acc + f.paid, 0).toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Current Term Reconciled</span>
            </span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Outstanding Tuition Dues
            </span>
            <div className="mt-1.5 text-2xl font-bold font-mono text-amber-700 tabular-nums">
              ₹{fees.reduce((acc, f) => acc + f.pending, 0).toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Due by 15 October 2026</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Registry Count
            </span>
            <div className="mt-1.5 text-2xl font-bold font-mono text-slate-800 tabular-nums">
              {students.length} Enrolled
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Integrated Student & Fee Records</span>
          </div>
        </div>
      )}

      {/* 8. SEARCH & COMPREHENSIVE FILTERS */}
      <div className="glass-panel rounded-2xl p-4 border border-[#E2ECE7] bg-white shadow-soft space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, enrollment ID, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Year */}
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
            >
              <option value="All">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>

            {/* Batch */}
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
            >
              <option value="All">All Batches</option>
              <option value="2025–2029">2025–2029</option>
              <option value="2024–2028">2024–2028</option>
              <option value="2023-2027">2023-2027</option>
            </select>

            {/* Department */}
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
            </select>

            {/* Semester */}
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
            >
              <option value="All">All Semesters</option>
              <option value="Semester 3">Semester 3</option>
              <option value="Semester 5">Semester 5</option>
            </select>

            {/* Payment Status (Always useful, required for Finance) */}
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
            >
              <option value="All">All Fee Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* 7. COMBINED STUDENT & FEE INFORMATION TABLE */}
      <div className="glass-panel rounded-2xl border border-[#E2ECE7] bg-white overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Student / Enrollment</th>
                <th className="px-5 py-3.5">Department & Batch</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Accommodation</th>
                <th className="px-5 py-3.5">Total Fee</th>
                <th className="px-5 py-3.5">Paid / Pending</th>
                <th className="px-5 py-3.5">Payment Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => {
                const fee = getStudentFee(s);

                return (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedStudent(s)}
                    className="hover:bg-[#F9FAF9] transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900 group-hover:text-[#0D5C46] transition-colors">
                        {s.name}
                      </div>
                      <div className="font-mono text-[11px] text-slate-500 mt-0.5 font-semibold">
                        {s.enrollmentNo}
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-slate-800 font-medium">{s.department}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {s.year} ({s.semester}) · {s.batch}
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-slate-700 font-mono text-[11px]">{s.email}</div>
                      <div className="text-slate-500 font-mono text-[11px]">{s.phone}</div>
                    </td>

                    <td className="px-5 py-4 text-slate-600 max-w-xs">
                      <span className="line-clamp-1">{s.accommodation}</span>
                    </td>

                    {/* Fee Information Columns */}
                    <td className="px-5 py-4 whitespace-nowrap font-mono font-semibold text-slate-900 tabular-nums">
                      ₹{fee.totalFee.toLocaleString()}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap font-mono tabular-nums">
                      <div className="text-emerald-800 font-medium">₹{fee.paid.toLocaleString()} paid</div>
                      <div className="text-amber-700 font-semibold text-[11px]">
                        ₹{fee.pending.toLocaleString()} due
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={fee.paymentStatus} />
                    </td>

                    {/* Action buttons */}
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setSelectedStudent(s)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="View Profile"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>

                        {isFinanceAdmin && fee.pending > 0 && (
                          <button
                            onClick={(e) => handleOpenFeeSettlement(s, e)}
                            className="px-2.5 py-1 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            title="Reconcile / Record Fee Settlement"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Payment</span>
                          </button>
                        )}

                        <button
                          onClick={(e) => handleOpenEdit(s, e)}
                          className="px-2.5 py-1 text-xs font-semibold text-[#0D5C46] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="Edit Student Information"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        {/* 10. DELETE RECORD ACTION */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setStudentToDelete(s);
                          }}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    No student records found matching the specified filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 9. FINANCE STUDENT DETAIL DRAWER: Organized into Personal, Academic, Accommodation, and Fee Information */}
      {selectedStudent && (
        <Drawer
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={`Student Record · ${selectedStudent.name}`}
          subtitle={`Enrollment: ${selectedStudent.enrollmentNo}`}
          width="xl"
        >
          {(() => {
            const fee = getStudentFee(selectedStudent);

            return (
              <div className="space-y-6 text-xs">
                {/* Header Profile card */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#FAFBFB] to-[#F2F8F5] border border-slate-200">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0D5C46] to-[#0F766E] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
                      {selectedStudent.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{selectedStudent.name}</h3>
                      <div className="text-slate-500 font-mono mt-0.5">
                        {selectedStudent.enrollmentNo} · {selectedStudent.email}
                      </div>
                      <div className="text-emerald-800 font-medium text-[11px] mt-1">
                        Status: {selectedStudent.status} (Enrolled {selectedStudent.admissionDate})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(selectedStudent)}
                      className="px-3 py-1.5 bg-[#0D5C46] hover:bg-[#0B4A38] text-white font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setStudentToDelete(selectedStudent)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                      title="Delete Student"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 1. Personal Information */}
                <div>
                  <span className="font-semibold uppercase tracking-wider text-slate-400 block text-[11px] mb-2">
                    1. Personal Information
                  </span>
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-white border border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Primary Contact</span>
                      <span className="font-semibold text-slate-900 font-mono">{selectedStudent.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">College Email</span>
                      <span className="font-semibold text-slate-900 font-mono">{selectedStudent.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Parent / Guardian Name</span>
                      <span className="font-semibold text-slate-900">{selectedStudent.parentName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Guardian Contact</span>
                      <span className="font-semibold text-slate-900 font-mono">{selectedStudent.parentContact}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Academic Information */}
                <div>
                  <span className="font-semibold uppercase tracking-wider text-slate-400 block text-[11px] mb-2">
                    2. Academic Information
                  </span>
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-white border border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Department</span>
                      <span className="font-semibold text-slate-900">{selectedStudent.department}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Sub-Department</span>
                      <span className="font-semibold text-slate-900">{selectedStudent.subDepartment}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Specialization</span>
                      <span className="font-semibold text-slate-900">{selectedStudent.specialization}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Year & Semester</span>
                      <span className="font-semibold text-slate-900 font-mono">
                        {selectedStudent.year} · {selectedStudent.semester}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Batch Cohort</span>
                      <span className="font-semibold text-slate-900 font-mono">{selectedStudent.batch}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Curriculum Cohort</span>
                      <span className="font-semibold text-slate-900">Autonomous B.Tech Regulation</span>
                    </div>
                  </div>
                </div>

                {/* 3. Accommodation */}
                <div>
                  <span className="font-semibold uppercase tracking-wider text-slate-400 block text-[11px] mb-2">
                    3. Accommodation
                  </span>
                  <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5">
                    <Home className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[11px]">Campus Housing Record</span>
                      <span className="font-medium text-slate-800">{selectedStudent.accommodation}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Fee Information (University Finance Style) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold uppercase tracking-wider text-slate-400 block text-[11px]">
                      4. Fee Information
                    </span>
                    <StatusBadge status={fee.paymentStatus} />
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAFBFB] border border-slate-200 space-y-3">
                    <div className="grid grid-cols-3 gap-3 pb-3 border-b border-slate-200">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Total Fee</span>
                        <span className="font-bold text-slate-900 font-mono text-sm">
                          ₹{fee.totalFee.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Paid Amount</span>
                        <span className="font-bold text-emerald-800 font-mono text-sm">
                          ₹{fee.paid.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Pending Amount</span>
                        <span className="font-bold text-amber-700 font-mono text-sm">
                          ₹{fee.pending.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Due Date</span>
                        <span className="text-slate-700 font-mono">{fee.dueDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Last Payment Recorded</span>
                        <span className="text-slate-700 font-mono">
                          {fee.lastPaymentDate || 'No settlement recorded'}
                        </span>
                      </div>
                      {fee.transactionRef && (
                        <div className="col-span-2 pt-1 border-t border-slate-100">
                          <span className="text-slate-400 block text-[11px]">Last Transaction Reference</span>
                          <span className="text-slate-600 font-mono text-[11px]">{fee.transactionRef}</span>
                        </div>
                      )}
                    </div>

                    {fee.pending > 0 && (
                      <div className="pt-2">
                        <button
                          onClick={() => handleOpenFeeSettlement(selectedStudent)}
                          className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-[#0D5C46] font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Record / Settle Inward Tuition Payment</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Security Note */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block text-[11px]">
                      Institutional Security Notice
                    </span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Plaintext credentials and banking secret keys remain shielded per institutional data protection rules.
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </Drawer>
      )}

      {/* EDIT STUDENT INFORMATION MODAL */}
      {editingStudent && (
        <Modal
          isOpen={!!editingStudent}
          onClose={() => setEditingStudent(null)}
          title="Edit Student Information"
          subtitle={`Enrollment: ${editingStudent.enrollmentNo}`}
          maxWidth="xl"
        >
          <form onSubmit={handleSaveStudentChanges} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  College Email *
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Parent / Guardian Name
                </label>
                <input
                  type="text"
                  required
                  value={editParentName}
                  onChange={(e) => setEditParentName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Guardian Phone Contact
                </label>
                <input
                  type="text"
                  required
                  value={editParentContact}
                  onChange={(e) => setEditParentContact(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Department *
                </label>
                <input
                  type="text"
                  required
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Sub-Department
                </label>
                <input
                  type="text"
                  value={editSubDepartment}
                  onChange={(e) => setEditSubDepartment(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  value={editSpecialization}
                  onChange={(e) => setEditSpecialization(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Academic Year *
                </label>
                <input
                  type="text"
                  required
                  value={editYear}
                  onChange={(e) => setEditYear(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Semester *
                </label>
                <input
                  type="text"
                  required
                  value={editSemester}
                  onChange={(e) => setEditSemester(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Batch Group *
                </label>
                <input
                  type="text"
                  required
                  value={editBatch}
                  onChange={(e) => setEditBatch(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Accommodation *
                </label>
                <input
                  type="text"
                  required
                  value={editAccommodation}
                  onChange={(e) => setEditAccommodation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0D5C46] hover:bg-[#0B4A38] text-white font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* RECORD FEE SETTLEMENT MODAL */}
      {settlingFeeStudent && (
        <Modal
          isOpen={!!settlingFeeStudent}
          onClose={() => setSettlingFeeStudent(null)}
          title={`Record Fee Payment · ${settlingFeeStudent.name}`}
          subtitle={`Enrollment: ${settlingFeeStudent.enrollmentNo}`}
          maxWidth="md"
        >
          {(() => {
            const fee = getStudentFee(settlingFeeStudent);

            return (
              <form onSubmit={handlePostPayment} className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#FAFBFB] border border-slate-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Course Fee:</span>
                    <span className="font-mono font-bold text-slate-900">
                      ₹{fee.totalFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Already Settled:</span>
                    <span className="font-mono font-bold text-emerald-800">
                      ₹{fee.paid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Outstanding Balance:</span>
                    <span className="font-mono font-bold text-amber-700">
                      ₹{fee.pending.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Record Payment Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={fee.pending}
                    value={paymentAmountInput}
                    onChange={(e) => setPaymentAmountInput(e.target.value)}
                    placeholder={`Enter settlement amount up to ₹${fee.pending.toLocaleString()}`}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSettlingFeeStudent(null)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0D5C46] hover:bg-[#0B4A38] text-white font-semibold rounded-xl cursor-pointer shadow-xs"
                  >
                    Post Settlement
                  </button>
                </div>
              </form>
            );
          })()}
        </Modal>
      )}

      {/* 11 & 12. CONTEXTUAL DELETE CONFIRMATION MODAL */}
      {studentToDelete && (
        <DeleteConfirmModal
          isOpen={!!studentToDelete}
          onClose={() => setStudentToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Student Record?"
          recordName={`${studentToDelete.name} (${studentToDelete.enrollmentNo})`}
          recordType="student profile"
        />
      )}
    </div>
  );
};
