import React from 'react';
import {
  LayoutDashboard,
  MessageSquareText,
  Calendar,
  ClipboardList,
  Bell,
  Ticket as TicketIcon,
  GitFork,
  Users,
  UserCircle,
  LogOut,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { activeRole, currentPath, setCurrentPath, logout } = useAuth();

  const handleNavClick = (path: string) => {
    setCurrentPath(path);
    onCloseMobile();
  };

  // Student Nav items
  const studentNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Ask UniDesk', path: '/ask', icon: MessageSquareText },
    { label: 'Timetable', path: '/timetable', icon: Calendar },
    { label: 'Exam Schedule', path: '/exams', icon: ClipboardList },
    { label: 'Notices', path: '/notices', icon: Bell },
    { label: 'My Tickets', path: '/tickets', icon: TicketIcon },
  ];

  // IT Admin Nav items
  const itNav = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Tickets', path: '/admin/tickets', icon: TicketIcon },
    { label: 'Intent Routing', path: '/admin/routing', icon: GitFork },
    { label: 'User / Student Info', path: '/admin/students', icon: Users },
    { label: 'Notice+', path: '/admin/notices', icon: Bell },
  ];

  // 4. Finance Admin Nav items: Students Info section
  const financeNav = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Tickets', path: '/admin/tickets', icon: TicketIcon },
    { label: 'Intent Routing', path: '/admin/routing', icon: GitFork },
    { label: 'Students Info', path: '/admin/students', icon: Users },
    { label: 'Notice+', path: '/admin/notices', icon: Bell },
  ];

  // Academic Admin Nav items
  const academicNav = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Tickets', path: '/admin/tickets', icon: TicketIcon },
    { label: 'Intent Routing', path: '/admin/routing', icon: GitFork },
    { label: 'User / Student Info', path: '/admin/students', icon: Users },
    { label: 'Timetable', path: '/admin/timetable', icon: Calendar },
    { label: 'Exam Schedule', path: '/admin/exams', icon: ClipboardList },
    { label: 'Notice+', path: '/admin/notices', icon: Bell },
  ];

  let currentNavItems = studentNav;
  if (activeRole === 'it_admin') currentNavItems = itNav;
  else if (activeRole === 'finance_admin') currentNavItems = financeNav;
  else if (activeRole === 'academic_admin') currentNavItems = academicNav;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#F8FAF9] border-r border-[#E2ECE7] flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-5 border-b border-[#E2ECE7] bg-[#F2F8F5]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0D5C46] to-[#0F766E] flex items-center justify-center text-white shadow-xs border border-emerald-600/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#0D3B2E]">UniDesk</span>
                <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-100/90 text-[#0D5C46] border border-emerald-300/70">
                  Campus
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold leading-none mt-0.5">
                One Front Door for Everything
              </p>
            </div>
          </div>
        </div>

        {/* Role Identity Tag in Sidebar */}
        <div className="px-5 py-2.5 border-b border-[#E2ECE7]/70 bg-[#EBF4F0]/60">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Workspace
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0D5C46]">
              {activeRole === 'student' && 'Student Portal'}
              {activeRole === 'it_admin' && 'IT Admin Desk'}
              {activeRole === 'finance_admin' && 'Finance Office'}
              {activeRole === 'academic_admin' && 'Academic Registrar'}
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all text-left cursor-pointer group ${
                  isActive
                    ? 'bg-[#E3F2EB] text-[#064E3B] shadow-2xs font-bold border-l-3 border-[#0D5C46]'
                    : 'text-slate-600 hover:text-[#0D3B2E] hover:bg-[#EEF7F2] font-medium'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-[#0D5C46]' : 'text-slate-400 group-hover:text-[#0D5C46]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-[#0D5C46]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Profile & Logout Section (Single View Profile action) */}
        <div className="p-3 border-t border-[#E2ECE7] bg-white space-y-1">
          <button
            onClick={() => handleNavClick(activeRole === 'student' ? '/profile' : '/admin/profile')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all text-left cursor-pointer group ${
              currentPath === '/profile' || currentPath === '/admin/profile'
                ? 'bg-[#E3F2EB] text-[#064E3B] font-bold shadow-2xs'
                : 'text-slate-700 hover:text-[#0D3B2E] hover:bg-[#EEF7F2] font-semibold'
            }`}
          >
            <UserCircle className="w-4 h-4 text-[#0D5C46] group-hover:scale-110 transition-transform" />
            <span>View Profile</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
