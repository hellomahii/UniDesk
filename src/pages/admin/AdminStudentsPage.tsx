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
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StudentInfoRecord } from '../../types';
import { Drawer } from '../../components/common/Drawer';
import { Modal } from '../../components/common/Modal';

export const AdminStudentsPage: React.FC = () => {
  const { students, updateStudent } = useData();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [batchFilter, setBatchFilter] = useState('All');
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

  // Subtle success message
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.enrollmentNo.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());

    const matchesDept = deptFilter === 'All' || s.department.includes(deptFilter);
    const matchesBatch = batchFilter === 'All' || s.batch === batchFilter;

    return matchesSearch && matchesDept && matchesBatch;
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
    setSuccessMessage(null);
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

    // Sync selected student in view drawer if open
    if (selectedStudent && selectedStudent.id === editingStudent.id) {
      setSelectedStudent({
        ...selectedStudent,
        ...updatedData,
      });
    }

    setEditingStudent(null);
    setSuccessMessage('Student information updated successfully.');

    // Auto dismiss toast after 4s
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0D3B2E] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#0D5C46]" />
            <span>Student Directory</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            View student information and account details. Administrators can view and edit records.
          </p>
        </div>
      </div>

      {/* Subtle Success Message Toast */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between shadow-2xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="p-1 text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-xl p-4 border border-[#E2ECE7] bg-white flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search students by enrollment number, name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electronics">Electronics</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Electrical">Electrical</option>
          </select>

          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
          >
            <option value="All">All Batches</option>
            <option value="2023-2027">Batch 2023-2027</option>
            <option value="2022-2026">Batch 2022-2026</option>
          </select>
        </div>
      </div>

      {/* Student Table with View & Edit actions */}
      <div className="glass-panel rounded-2xl border border-[#E2ECE7] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Enrollment Number</th>
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Year / Sem</th>
                <th className="px-5 py-3.5">Batch</th>
                <th className="px-5 py-3.5">Accommodation</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  className="hover:bg-[#F9FAF9] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-4 whitespace-nowrap font-mono font-semibold text-slate-800">
                    {s.enrollmentNo}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap font-semibold text-slate-900">
                    {s.name}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap font-mono text-slate-600">
                    {s.email}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap font-mono text-slate-500">
                    {s.phone}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-slate-700">
                    {s.department}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-slate-600 font-mono">
                    {s.year} ({s.semester})
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap font-mono text-slate-500">
                    {s.batch}
                  </td>
                  <td className="px-5 py-4 text-slate-600 max-w-xs">
                    <span className="line-clamp-1">{s.accommodation}</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedStudent(s)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                        title="View Student"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={(e) => handleOpenEdit(s, e)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#0D5C46] hover:text-[#093E2F] bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                        title="Edit Student Information"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                    No student records found matching the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 49. STUDENT DETAIL DRAWER FOR ADMIN */}
      {selectedStudent && (
        <Drawer
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={`Student Record · ${selectedStudent.name}`}
          subtitle={`Enrollment: ${selectedStudent.enrollmentNo}`}
          width="xl"
        >
          <div className="space-y-6 text-xs">
            {/* Header summary with Edit button */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAFBFB] border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#0D5C46] text-white flex items-center justify-center font-bold text-xl shrink-0">
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

              <button
                onClick={() => handleOpenEdit(selectedStudent)}
                className="px-3 py-1.5 bg-[#0D5C46] hover:bg-[#0B4A38] text-white font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Student</span>
              </button>
            </div>

            {/* Personal Information */}
            <div>
              <span className="font-semibold uppercase tracking-wider text-slate-400 block text-[11px] mb-2">
                Personal & Guardian Information
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
                  <span className="text-slate-400 block text-[11px]">Guardian Phone Contact</span>
                  <span className="font-semibold text-slate-900 font-mono">{selectedStudent.parentContact}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Accommodation Record</span>
                  <span className="font-medium text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Home className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {selectedStudent.accommodation}
                  </span>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <span className="font-semibold uppercase tracking-wider text-slate-400 block text-[11px] mb-2">
                Academic Registration Record
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
                  <span className="text-slate-400 block text-[11px]">Term & Year</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    {selectedStudent.year} · {selectedStudent.semester}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Batch Group</span>
                  <span className="font-semibold text-slate-900 font-mono">{selectedStudent.batch}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Curriculum Cohort</span>
                  <span className="font-semibold text-slate-900">Autonomous B.Tech 2023 Regulation</span>
                </div>
              </div>
            </div>

            {/* 50. PASSWORD SECURITY POLICY COMPLIANCE */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 block text-[11px]">
                  Institutional Security Policy Notice
                </span>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Plaintext credentials and raw passwords are cryptographically shielded and never displayed in the administrative interface.
                </p>
              </div>
            </div>
          </div>
        </Drawer>
      )}

      {/* 8 & 9. EDIT STUDENT INFORMATION MODAL */}
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
                  Student Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  College Email
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
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
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Parent / Guardian Contact
                </label>
                <input
                  type="text"
                  required
                  value={editParentContact}
                  onChange={(e) => setEditParentContact(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Department
                </label>
                <input
                  type="text"
                  required
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
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
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
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
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  required
                  value={editYear}
                  onChange={(e) => setEditYear(e.target.value)}
                  placeholder="e.g. 2nd Year or 3rd Year"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Semester
                </label>
                <input
                  type="text"
                  required
                  value={editSemester}
                  onChange={(e) => setEditSemester(e.target.value)}
                  placeholder="e.g. Semester 3 or Semester 5"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Batch Group
                </label>
                <input
                  type="text"
                  required
                  value={editBatch}
                  onChange={(e) => setEditBatch(e.target.value)}
                  placeholder="e.g. 2023-2027"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Accommodation
                </label>
                <input
                  type="text"
                  required
                  value={editAccommodation}
                  onChange={(e) => setEditAccommodation(e.target.value)}
                  placeholder="Campus Residency · Block B · Room 314"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
                />
              </div>
            </div>

            {/* Security note: no passwords */}
            <p className="text-[11px] text-slate-400">
              Note: Cryptographic credentials remain shielded. Changes are logged under administrator audit log.
            </p>

            {/* Buttons: Cancel & Save Changes */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0D5C46] hover:bg-[#0B4A38] text-white font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
