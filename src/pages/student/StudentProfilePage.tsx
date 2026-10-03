import React from 'react';
import {
  UserCircle,
  Mail,
  Phone,
  Home,
  GraduationCap,
  BookOpen,
  Calendar,
  Shield,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const StudentProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { students } = useData();

  const studentRecord = students.find((s) => s.enrollmentNo === currentUser?.enrollmentNo);

  const name = studentRecord?.name || currentUser?.name || 'Mahi Patel';
  const email = studentRecord?.email || currentUser?.email || 'mahi.patel@college.edu';
  const phone = studentRecord?.phone || currentUser?.phone || '+91 98765 43210';
  const enrollmentNo = studentRecord?.enrollmentNo || currentUser?.enrollmentNo || '2024-CS-042';
  const department = studentRecord?.department || currentUser?.department || 'Computer Science & Engineering';
  const subDepartment = studentRecord?.subDepartment || currentUser?.subDepartment || 'Software Systems';
  const specialization = studentRecord?.specialization || currentUser?.specialization || 'Artificial Intelligence & Data';
  const year = studentRecord?.year || currentUser?.year || '3rd Year';
  const semester = studentRecord?.semester || currentUser?.semester || 'Semester 5';
  const batch = studentRecord?.batch || currentUser?.batch || '2023-2027';
  const accommodation = studentRecord?.accommodation || currentUser?.accommodation || 'Campus Residency · Block B · Room 314';
  const parentName = studentRecord?.parentName || currentUser?.parentName || 'Ramesh Patel';
  const parentContact = studentRecord?.parentContact || currentUser?.parentContact || '+91 98765 01234';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 border border-[#E2ECE7] bg-white flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-xs">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-md shrink-0">
          {name.charAt(0)}
        </div>

        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#0D3B2E]">
              {name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Active Student
            </span>
          </div>
          <p className="text-xs font-mono text-slate-500 mt-1">
            Enrollment ID: {enrollmentNo}
          </p>
          <p className="text-xs text-slate-600 mt-2 font-medium">
            {department} · {year} ({semester})
          </p>
        </div>

        <div className="self-center sm:self-start bg-[#FAFBFB] px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-500 font-mono flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-700" />
          <span>Identity Verified</span>
        </div>
      </div>

      {/* Grid: Personal & Guardian Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="glass-panel rounded-2xl p-6 border border-[#E2ECE7] bg-white shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
            <UserCircle className="w-4 h-4 text-[#0D5C46]" />
            <h3 className="text-sm font-semibold text-slate-900">Personal & Contact Info</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Full Name</span>
              <span className="text-slate-800 font-semibold">{name}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">College Email</span>
              <span className="text-slate-800 font-mono">{email}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Phone Number</span>
              <span className="text-slate-800 font-mono">{phone}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Accommodation</span>
              <span className="text-slate-800 flex items-center gap-1.5 mt-0.5">
                <Home className="w-3.5 h-3.5 text-slate-400" />
                {accommodation}
              </span>
            </div>
          </div>
        </div>

        {/* Parent / Guardian Info */}
        <div className="glass-panel rounded-2xl p-6 border border-[#E2ECE7] bg-white shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
            <Shield className="w-4 h-4 text-[#0D5C46]" />
            <h3 className="text-sm font-semibold text-slate-900">Parent / Guardian Information</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Parent/Guardian Name</span>
              <span className="text-slate-800 font-semibold">{parentName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Emergency Contact</span>
              <span className="text-slate-800 font-mono">{parentContact}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Relationship</span>
              <span className="text-slate-800 font-medium">Father / Primary Guardian</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Permanent Address Record</span>
              <span className="text-slate-800">Archived with Office of Student Affairs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="glass-panel rounded-2xl p-6 border border-[#E2ECE7] bg-white shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
          <GraduationCap className="w-4 h-4 text-[#0D5C46]" />
          <h3 className="text-sm font-semibold text-slate-900">Academic Registration Details</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#FAFBFB] border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Primary Department</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">
              {department}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFBFB] border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Sub-Department</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">
              {subDepartment}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFBFB] border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Specialization</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">
              {specialization}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFBFB] border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Academic Year & Term</span>
            <span className="font-semibold text-slate-800 mt-0.5 block font-mono">
              {year} · {semester}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFBFB] border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Batch Group</span>
            <span className="font-semibold text-slate-800 mt-0.5 block font-mono">
              {batch} (Section A)
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFBFB] border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Security & Credentials</span>
            <span className="font-semibold text-slate-600 mt-0.5 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Institutional LDAP SSO Protected</span>
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center text-xs text-slate-500">
        Student profile record is view-only for students. For corrections to name, batch, or residency data, please submit an Academic Office ticket or contact student affairs.
      </div>
    </div>
  );
};
