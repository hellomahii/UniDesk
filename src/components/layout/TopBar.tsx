import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TopBarProps {
  onOpenMobile: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobile }) => {
  const { currentUser, activeRole, logout, currentPath } = useAuth();

  // Derive readable breadcrumb from currentPath
  const getBreadcrumbs = () => {
    switch (currentPath) {
      case '/dashboard':
        return 'Student Portal / Overview';
      case '/ask':
        return 'Student Services / Ask UniDesk';
      case '/timetable':
        return 'Academic Schedule / Weekly Timetable';
      case '/exams':
        return 'Academic Affairs / Exam Schedule';
      case '/notices':
        return 'Campus Communication / University Notices';
      case '/tickets':
        return 'Support Helpdesk / My Tickets';
      case '/profile':
        return 'Student Information / Profile';
      case '/admin/dashboard':
        return `Department Administration / ${
          activeRole === 'it_admin'
            ? 'IT Services'
            : activeRole === 'finance_admin'
            ? 'Finance Office'
            : 'Academic Affairs'
        } Dashboard`;
      case '/admin/tickets':
        return 'Department Operations / Service Tickets';
      case '/admin/routing':
        return 'Intelligence & Routing / Intent Routing Engine';
      case '/admin/students':
        return 'Student Registry / Student Directory';
      case '/admin/fees':
        return 'Bursar Operations / Fee Management';
      case '/admin/timetable':
        return 'Academic Planning / Class Scheduling';
      case '/admin/exams':
        return 'Examination Controller / Exam Timetables';
      case '/admin/notices':
        return 'Campus Communications / Notice+ Management';
      case '/admin/profile':
        return 'Administration / Admin Profile';
      default:
        return 'UniDesk / Central Desk';
    }
  };

  return (
    <header className="h-16 px-4 md:px-8 border-b border-[#E2ECE7] bg-white/85 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
      {/* Left zone: Mobile toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 md:hidden cursor-pointer transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5 text-slate-700" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>{getBreadcrumbs()}</span>
        </div>
      </div>

      {/* Right zone: Pure Identity / Status Area (Section 2: Name + Enrollment/ID only) */}
      {currentUser && (
        <div className="flex items-center gap-3">
          {/* Identity display (Non-clickable, no "View Profile" link) */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#FAFBFB] border border-slate-200/90 shadow-2xs select-none">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0D5C46] to-[#0F766E] border border-emerald-300/60 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-2xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#0D3B2E] leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-slate-500 font-mono tabular-nums leading-none mt-0.5">
                {currentUser.enrollmentNo || currentUser.employeeId || 'Staff Member'}
              </div>
            </div>
          </div>

          {/* Quick Logout button */}
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};
